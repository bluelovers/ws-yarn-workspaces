/**
 * Git Changed 模組
 * Git Changed Module
 *
 * 基於 Git 暫存區變更檢測工作區中受影響的套件
 * Detects affected packages in workspace based on Git staged changes
 */

import { wsPkgListableFromPaths } from 'ws-pkg-list/lib/listable';
import { wsGitDiffStagedDir } from './git-util';
import getConfig from 'workspaces-config';
import micromatch from 'micromatch';
import globRegex from 'glob-regex';
import { array_unique_overwrite } from 'array-hyper-unique';
import { normalizeListableExtra } from 'ws-pkg-list/lib/util';
import { IListableRowExtra, IListableRow } from 'ws-pkg-list';

/**
 * 從 Git 暫存區變更中提取套件前綴
 * Extract package prefixes from Git staged changes
 *
 * @param {string} [cwd] - 工作目錄 / Working directory
 * @param {Object} [options] - 選項 / Options
 * @param {string} [options.gitBin] - Git 執行檔路徑 / Git binary path
 * @returns {Object} 包含 cwd 和套件前綴列表的物件 / Object containing cwd and package prefix list
 */
export function wsGitChangedPrefix(cwd?: string, options?: {
	gitBin?: string,
})
{
	/**
	 * 獲取暫存區變更的目錄
	 * Get staged directories
	 */
	let data = wsGitDiffStagedDir(cwd ?? process.cwd(), options)

	/**
	 * 獲取工作區設定
	 * Get workspace config
	 */
	let config = getConfig(data.cwd);

	/**
	 * 將各套件的 glob 模式轉為正規表示式並串接；
	 * 移除結尾的 `$` 錨點是為了讓「子路徑」也能命中，
	 * 例如 `packages/a` 需同時符合 `packages/a/src/index.ts`
	 * Convert each package glob to regex and join them; the trailing `$` anchor
	 * is stripped so sub-paths also match, e.g. `packages/a` must also match
	 * `packages/a/src/index.ts`
	 */
	let source = config.packages.map(p =>
	{
		let re = globRegex(p)
		let source = re.source.replace(/\$$/, '');
		return source
	}).join('|');

	/**
	 * 建立匹配套件路徑的正規表示式
	 * Create regex for matching package paths
	 */
	let re = new RegExp(`(${source})`, 'i');

	/**
	 * 對每個變更目錄試行套件路徑配對；
	 * 未落在任何工作區套件內的目錄（如根目錄的設定檔）會回傳空值，
	 * 由後續 filter 一併濾除
	 * Try to match each changed directory against a package path; directories
	 * outside every workspace package (e.g. root-level config files) yield empty
	 * values and are dropped by the following filter
	 */
	let list = data.list
		.map(p => {
		return re.exec(p)?.[0]
	})
		.filter(r => r?.length)
	;

	/**
	 * 同一變更可能觸及多個檔案而重複命中同一套件，去重後才不會重複列出
	 * One change may touch multiple files and hit the same package repeatedly;
	 * dedup prevents listing a package more than once
	 */
	array_unique_overwrite(list)

	return {
		cwd: data.cwd,
		list,
	}
}

/**
 * 獲取 Git 暫存區變更影響的套件列表
 * Get list of packages affected by Git staged changes
 *
 * @param {string} cwd - 工作目錄 / Working directory
 * @param {Object} [options] - 選項 / Options
 * @param {string} [options.gitBin] - Git 執行檔路徑 / Git binary path
 * @returns {Object} 包含 cwd 和套件列表的物件 / Object containing cwd and package list
 */
export function wsGitChanged(cwd: string, options?: {
	gitBin?: string,
})
{
	/**
	 * 獲取變更的套件前綴
	 * Get changed package prefixes
	 */
	let data = wsGitChangedPrefix(cwd, options);

	/**
	 * 根據前綴獲取完整的套件資訊
	 * Get full package info from prefixes
	 */
	let list = wsPkgListableFromPaths(data.list, data.cwd) as IListableRowExtra[]

	/**
	 * 標準化套件列表資訊
	 * Normalize package list info
	 */
	list = normalizeListableExtra(list, data.cwd)

	return {
		cwd: data.cwd,
		list,
	}
}

/**
 * 預設匯出函數
 * Default export function
 */
export default wsGitChanged
