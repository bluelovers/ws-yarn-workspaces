/**
 * @yarn-tool/fix-ws-links
 *
 * workspace 連結修復模組
 * Workspace link fixing module
 *
 * 掃描 workspace 各子套件的 node_modules，修正指向錯誤的套件連結，
 * 必要時以 yarn link 補登，失敗時退回 yarn install 復原
 * Scans node_modules of each workspace sub-package, fixes links pointing
 * at the wrong location, re-registers via yarn link when needed, and falls
 * back to yarn install on failure
 *
 * Created by user on 2020/6/5.
 */
import { wsFindPackageHasModules } from '@yarn-tool/node-modules';
import { wsPkgListable } from 'ws-pkg-list/lib/listable';
import { wsFindPackageHasModulesCore } from '@yarn-tool/node-modules/lib/ws-find-paths';
import { IListableRow } from 'ws-pkg-list';
import { yarnListLink } from 'yarn-list-link/core';
import { linkSync, realpathSync, removeSync, pathExistsSync, symlinkSync, unlinkSync } from 'fs-extra';
import crossSpawn from 'cross-spawn-extra';
import { sameRealpath, isSymbolicLink } from './lib/util';
import { default as console } from 'debug-color2/logger';
import { fsSymlinkSync } from 'fs-symlink-extra';

/**
 * 修復 workspace 內的 yarn link 與套件符號連結
 * Fix yarn links and package symlinks inside a workspace
 *
 * 判定與修復流程：
 * Decision and fix flow:
 * 1. 讀取 workspace 套件列表與已註冊的 yarn link 清單
 *    Load the workspace package list and the registered yarn link list
 * 2. 找出有自行安裝 node_modules 的子套件
 *    Find sub-packages that have their own node_modules
 * 3. 對每個已連結模組比對 workspace 內的實際位置：
 *    Compare each linked module against its actual location in the workspace:
 *    - 位置不同且非符號連結 → 直接重建 symlink
 *      Different location and not a symlink → rebuild the symlink directly
 *    - 屬於已註冊 yarn link → 交給 `yarn link` 補登
 *      Registered yarn link → let `yarn link` re-register it
 *    - 無法判定位置（is_same 為 undefined）→ 標記錯誤，稍後執行 yarn install
 *    - Location undeterminable (is_same is undefined) → flag an error and run
 *      yarn install later
 * 4. 發生錯誤或指定 runYarnAfter 時，於該套件目錄執行 yarn install 復原
 *    On error or when runYarnAfter is set, run yarn install in that package
 *    directory to recover
 *
 * @param {string} [cwd] - workspace 根目錄 / Workspace root directory
 * @param {object} [options] - 修復選項 / Fix options
 * @param {string} [options.dir] - 限定檢查的子目錄 / Sub-directory to restrict the check to
 * @param {boolean} [options.verbose] - 顯示除錯與錯誤訊息 / Show debug and error messages
 * @param {boolean} [options.runYarnAfter] - 每個套件修復後執行 yarn install / Run yarn install after fixing each package
 */
export function fixYarnWorkspaceLinks(cwd?: string, options?: {
	dir?: string,
	verbose?: boolean,
	runYarnAfter?: boolean,
})
{
	/**
	 * workspace 內所有套件
	 * All packages inside the workspace
	 */
	let listable = wsPkgListable(cwd);
	/**
	 * 已註冊的 yarn link 名稱清單，無連結時為空陣列
	 * Registered yarn link names; empty array when none
	 */
	let links = yarnListLink(cwd) || [];

	/**
	 * 以套件名稱為鍵建立索引，
	 * 供後續 O(1) 查詢某連結名稱是否對應 workspace 內的套件
	 * Index by package name so later lookups of "does this linked name map
	 * to a workspace package" are O(1)
	 */
	let pkgs = listable
		.reduce((a, b) =>
		{

			a[b.name] = b;

			return a
		}, {} as Record<string, IListableRow>)
	;

	options = options || {};

	/**
	 * 只保留有自行安裝 node_modules 的子套件
	 * Keep only sub-packages with their own node_modules
	 */
	let sublist = wsFindPackageHasModulesCore(listable, options.dir)

	let verbose = options.verbose;

	verbose && console.debug('[linkedModules]', links);

	if (sublist.length)
	{

		sublist
			.forEach(data =>
			{
				/**
				 * 是否有錯誤發生；有錯誤時最後會以 yarn install 復原。
				 * 以 var 語意的 let 宣告於迴圈外，讓後續 add_links 判定後仍可回填
				 * Whether an error occurred; when set, yarn install runs at the
				 * end to recover. Declared outside the inner checks so the
				 * add_links paths below can still flag it
				 */
				let _error: boolean;

				verbose && console.debug(`check`, data.name, `=>`, data.location);

				/**
				 * 需以 `yarn link` 補登的套件名稱，
				 * 收集完成後批次執行以減少子行程 (subprocess) 次數
				 * Package names to re-register via `yarn link`; collected first
				 * so the subprocess runs once per package instead of per link
				 */
				let add_links = [] as string[];

				data.modules.forEach(row =>
				{

					let name = row.name;
					/**
					 * workspace 內同名套件的位置，不存在則為 undefined
					 * Location of the same-named package in the workspace, undefined if absent
					 */
					let location = pkgs[name]?.location;

					/**
					 * 是否指向 workspace 內的正確位置；undefined 代表無法判定
					 * Whether it points at the correct workspace location; undefined means undeterminable
					 */
					let is_same = sameRealpath(location, row.location)

					/**
					 * 連結目標已不存在，無需修復
					 * Target no longer exists; nothing to fix
					 */
					if (!pathExistsSync(row.location))
					{
						return;
					}

					let is_symlink = isSymbolicLink(row.location);

					/**
					 * 指向錯誤位置且不是符號連結：
					 * 已註冊的 yarn link 交給 yarn 補登，其餘直接重建 symlink
					 * Points at the wrong location and is not a symlink:
					 * registered yarn links are re-registered by yarn, others get
					 * a symlink rebuilt directly
					 */
					if (location && is_same === false && !is_symlink)
					{
						if (links.includes(name))
						{
							add_links.push(name)
						}
						else
						{
							try
							{
								/**
								 * overwrite 涵蓋檢查後到建立前的競態情境
								 * overwrite covers the race between check and creation
								 */
								fsSymlinkSync(location, row.location, {
									overwrite: true,
								});

								console.success(`create link`, row.name, `=>`, location)
							}
							catch (e)
							{
								/**
								 * symlink 建立失敗：記錄錯誤並視情況退回 yarn link
								 * Symlink creation failed: log the error and fall back to yarn link when applicable
								 */
								verbose && console.error(e.toString());
								_error = true;

								if (links.includes(name))
								{
									add_links.push(name)
								}
							}
						}
					}
					else if (!is_symlink && links.includes(name))
					{
						/**
						 * 非符號連結但屬已註冊 link，交由 yarn 重建
						 * Not a symlink but registered as a link; let yarn rebuild it
						 */
						add_links.push(name)
					}
					else if (typeof is_same === 'undefined')
					{
						/**
						 * 無法判定目標位置，視為錯誤以觸發復原流程
						 * Cannot determine the target location; treat as error to trigger recovery
						 */
						_error = true;
					}

				})
				;

				if (add_links.length)
				{
					verbose && console.debug('link', [
						...add_links,
					]);
					/**
					 * 於該套件目錄批次執行 yarn link
					 * Run yarn link in batch inside that package directory
					 */
					crossSpawn.sync('yarn', [
						`link`,
						...add_links,
					], {
						cwd: data.location,
						stdio: 'inherit',
					})
				}

				if (_error || options.runYarnAfter)
				{
					verbose && console.debug(`try use yarn install for fallback`);

					/**
					 * 以 yarn install 復原無法以 link 修復的狀態
					 * Recover states that linking alone cannot fix via yarn install
					 */
					crossSpawn.sync('yarn', [], {
						cwd: data.location,
						stdio: 'inherit',
					})
				}

			})
		;
	}
	else
	{
		verbose && console.debug(`no exists sub package has modules with sub install`);
	}
}

export default fixYarnWorkspaceLinks
