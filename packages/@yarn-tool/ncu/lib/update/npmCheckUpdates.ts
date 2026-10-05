/**
 * Core npm-check-updates wrapper function.
 * npm-check-updates 的核心封裝函數。
 *
 * 此模組提供主要功能：
 * - 檢查 package.json 中依賴套件的可用更新
 * - 比較當前版本與最新版本
 * - 支援 semver 版本範圍處理
 * - 整合版本快取機制
 *
 * @module update/npmCheckUpdates
 */

import { IOptionsNpmCheckUpdates, IDependency } from '../types';
import { npmCheckUpdatesOptions } from '../options';
import { run as _npmCheckUpdates } from 'npm-check-updates';
import Bluebird from 'bluebird';
import { IPackageJsonDependenciesField } from '@ts-type/package-dts/package-json';
import { allowUpdateVersion } from '../util';
import { queryVersionWithCache } from '@yarn-tool/pkg-version-query/lib/queryVersion';
import { mergeSimpleSemVer } from '@lazy-node/semver-simple-parse/lib/mergeSimpleSemVer';
import { parseSimpleSemVer } from '@lazy-node/semver-simple-parse/lib/parseSimpleSemVer';
import { stringifySemverFull } from '@lazy-node/semver-simple-parse/lib/stringifySimpleSemVer';
import { IWrapDedupeCache } from '@yarn-tool/yarnlock/lib/types';
import { ITSRequireAtLeastOne } from 'ts-type';
import { getCache } from '@yarn-tool/pkg-version-query';
import { toDependencyTable } from '@yarn-tool/table/lib/deps-table';
import { npa } from '@yarn-tool/npm-package-arg-util';

/**
 * 檢查並更新 package.json 中的依賴版本 (Check and update dependencies in package.json)
 *
 * 此函式是 `@yarn-tool/ncu` 的核心入口：
 * 1. 以 {@link npmCheckUpdatesOptions} 正規化選項後呼叫 ncu 取得 `list_updated`
 * 2. 逐一比對四種依賴區段，只在「版本真的不同且可安全升級」時寫入
 * 3. 對 ncu 查不到結果的範圍（如 `^1.2.0`）改以 `queryVersionWithCache` 查詢，
 *    再用 `mergeSimpleSemVer` 合併，保留原本的範圍前綴
 * 4. 最後把快取落盤、輸出更新表格並回傳完整選項物件（含結果欄位）
 *
 * This is the core entry of `@yarn-tool/ncu`:
 * 1. normalise options via {@link npmCheckUpdatesOptions}, then call ncu for `list_updated`
 * 2. walk the four dependency sections and write only when the version really
 *    changed and is safe to upgrade
 * 3. for ranges ncu cannot resolve (e.g. `^1.2.0`), query via
 *    `queryVersionWithCache` and merge with `mergeSimpleSemVer` so the original
 *    range prefix survives
 * 4. finally dump the cache, print the update table and return the full options
 *    object including the result fields
 *
 * 邊界情況：semver 合併過程抛出的錯誤會被靜默忽略（見 `catch`），因為單一
 * 套件無法解析不應中斷整批更新。
 * Edge case: errors thrown while merging semver are swallowed (see `catch`),
 * because one unparseable package must not abort the whole batch.
 *
 * @param cache - 版本快取（含 cwd，用於快取落盤） / Version cache (its `cwd` is used for the cache dump)
 * @param ncuOptions - 至少需提供 `json_old` 或 `packageData` 之一 / Requires at least one of `json_old` or `packageData`
 * @returns 帶有 `json_changed`、`list_updated`、`current` 等結果欄位的選項 / Options carrying `json_changed`, `list_updated`, `current`
 */
export function npmCheckUpdates<C extends IWrapDedupeCache>(cache: Partial<C>,
	ncuOptions: ITSRequireAtLeastOne<IOptionsNpmCheckUpdates, 'json_old' | 'packageData'>,
)
{
	//ncuOptions.silent = false;

	//ncuOptions.json = false;
	//ncuOptions.cli = true;

	//ncuOptions.args = [];

	//ncuOptions.loglevel = 'verbose';

	/**
	 * 是否有任何實際更新，僅在版本真的被改寫時才設為 true
	 * Whether any real update happened; only set once a version is actually rewritten
	 */
	let json_changed = false;

	/**
	 * 更新前的版本，供表格顯示「舊版本 → 新版本」
	 * Pre-update versions, so the table can show old → new
	 */
	const current: IDependency = {};

	/**
	 * 實際被更新的套件對照
	 * Packages that were actually updated
	 */
	const list_updated: IDependency = {};

	return Bluebird
		.resolve()
		.then(async () => {

			/**
			 * 正規化選項：取得 packageData 並要求 ncu 回傳更新後的 JSON
			 * Normalise options: build packageData and ask ncu for the upgraded JSON
			 */
			ncuOptions = npmCheckUpdatesOptions(ncuOptions);

			ncuOptions.cwd = cache.cwd;

			/**
			 * ncu 只回傳「哪些套件有新版本」，實際的 JSON 由我們自己解析後再比對
			 * ncu only reports which packages have updates; we parse the JSON ourselves
			 * and diff it afterwards
			 */
			ncuOptions.json_new = JSON.parse(ncuOptions.packageData);

			ncuOptions.list_updated = await _npmCheckUpdates(ncuOptions) as Record<string, string>;

			/**
			 * 四種依賴區段都必須檢查，缺一會讓對應區段的更新被遺漏
			 * All four dependency sections must be checked, otherwise updates in the
			 * missing one would be skipped
			 */
			return [
				'dependencies',
				'devDependencies',
				'peerDependencies',
				'optionalDependencies',
			] as IPackageJsonDependenciesField[];
		})
		.each(async (key) =>
		{
			const deps = ncuOptions.json_new[key] ?? {};

			return Bluebird
				.resolve(Object.keys(deps))
				.each(async (name) =>
				{
					const version_new = ncuOptions.list_updated[name];
					const version_old = deps[name];

					/**
					 * 分支一：ncu 已回報新版本
					 * 只有在「新舊版本不同」且舊版本可安全升級時才寫入，
					 * 避免把 `*`、複雜範圍等情況改壞。
					 * Branch 1: ncu reported a new version.
					 * Write only when old and new differ and the old version may be
					 * upgraded safely, so `*` and complex ranges are not broken.
					 */
					if (version_new?.length)
					{
						if (version_old !== version_new && allowUpdateVersion(version_old))
						{
							list_updated[name] = version_new;
							current[name] = version_old;

							deps[name] = version_new;

							json_changed = true;
						}
					}
					/**
					 * 分支二：ncu 查不到（多為 `^` / `~` 之類的範圍）
					 * 只處理不含空白與邏輯運算符的單純範圍，先用 npa 解析確認型別為
					 * `range`，再抓出前綴（`^` / `~`）自行查詢並重新組合。
					 * Branch 2: ncu returned nothing (usually a `^` / `~` range).
					 * Only plain ranges without spaces or logical operators are handled:
					 * npa confirms the type is `range`, the prefix (`^` / `~`) is extracted
					 * so the result can be queried and re-assembled with the same prefix.
					 */
					else if (!/[\s|&]/.test(version_old))
					{
						let key = `${name}@${version_old}`

						let check = npa(key);
						let prefix = /^([\^~\s]+)/.exec(version_old)?.[1];

						if (prefix?.length && check.type === 'range')
						{
							/**
							 * 查詢會失敗（例如離線），此時寧可不更新也不要寫入錯誤版本
							 * The query may fail (offline, etc.); skipping the update is better
							 * than writing a wrong version
							 */
							let version_new = await queryVersionWithCache(name, version_old)
								.then(v => prefix + v)
								.catch(e => null)
							;

							if (version_new?.length && version_new !== version_old)
							{
								try
								{
									/**
									 * 合併舊新版本：以較高者為目標，同時保留原有範圍前綴
									 * Merge old and new versions: target the higher one while keeping
									 * the original range prefix
									 */
									let { target } = mergeSimpleSemVer(parseSimpleSemVer(version_old), parseSimpleSemVer(version_new));

									let version = stringifySemverFull(target)

									if (version?.length > 0)
									{
										list_updated[name] = version;
										current[name] = version_old;

										deps[name] = version;

										json_changed = true;
									}
								}
								/**
								 * 解析失敗代表該套件版本格式特殊，跳過比整批中斷更好
								 * A parse failure means an exotic version format; skipping beats
								 * aborting the whole batch
								 */
								catch (err)
								{}
							}
						}
					}

				})
		}).then(async () => {

			/**
			 * 把 LRU 快取寫入磁碟，讓下次執行可直接命中
			 * Persist the LRU cache to disk so the next run can hit it directly
			 */
			await getCache().fsDump();

			ncuOptions.json_changed = json_changed;
			ncuOptions.list_updated = list_updated;
			ncuOptions.current = current;

			/**
			 * 表格只在有內容時輸出，避免印出空行
			 * Only print the table when it has content, to avoid blank output
			 */
			const table = toDependencyTable({
				from: ncuOptions.current,
				to: ncuOptions.list_updated,
			}).toString();

			table && console.log(`\n${table}\n`);

			return ncuOptions as IOptionsNpmCheckUpdates;
		})
	;
}
