/**
 * Check and update resolutions in yarn.lock.
 * 檢查並更新 yarn.lock 中的 resolutions 版本。
 *
 * 此模組提供功能：
 * - 解析 yarn.lock 檔案（支援 v1 和 v2 格式）
 * - 檢查 resolutions 中套件的可用更新
 * - 更新 yarn.lock 中的版本資訊
 *
 * @module update/checkResolutionsUpdate
 */

import { IPackageMap, IOptionsNpmCheckUpdates, IVersionCacheMapValue } from '../types';
import { resolve } from 'bluebird';
import { keyObjectToPackageMap } from '../util';
import { lt } from 'semver';
import { filterResolutions } from '@yarn-tool/yarnlock/lib/core';
import { queryRemoteVersions } from '../remote/queryRemoteVersions';
import {
	EnumDetectYarnLock,
	IYarnLockDataRecord,
	IYarnLockDataRowV1,
	IYarnLockDataRowV2,
	IYarnLockSource,
} from '@yarn-tool/yarnlock-types';
import { _yarnLockParseCore, _yarnLockParseRaw } from '@yarn-tool/yarnlock-parse';
import { yarnLockParsedToRawJSON } from '@yarn-tool/yarnlock-parsed-to-json';
import { ITSExcludeEnumValue } from 'ts-type/lib/helper/record/enum';

/**
 * 檢查並更新 yarn.lock 中的 resolutions (Check and update resolutions in yarn.lock)
 *
 * 作法：先解析 yarn.lock（自動偵測 v1 / v2 格式），取出「每個套件當初被安裝的版本」，
 * 再向遠端查詢可更新的版本，最後依結果改寫 lock 資料：
 * - 已安裝版本低於可更新版本 → 刪除該套件的舊條目，讓它重新解析
 * - 同一套件安裝了多個版本 → 統一為單一版本（去重 dedupe）
 *
 * It parses the yarn.lock (auto-detecting v1 / v2), collects the versions each
 * package was installed at, queries updatable versions remotely, then rewrites the
 * lock data:
 * - installed version older than the resolved one → drop the package's old entries
 *   so it gets re-resolved
 * - several versions installed for one package → collapse them into one (dedupe)
 *
 * 邊界情況：輸入可為字串 / Buffer / 已解析物件；只有字串與 Buffer 需要先做格式
 * 偵測 (format detection)，物件輸入會沿用呼叫端傳入的 `verType`。
 * Edge case: the input may be a string / Buffer / an already parsed object; only
 * the first two need format detection, an object input keeps the caller's `verType`.
 *
 * @param resolutions - resolutions 的套件對應表 / The resolutions package map
 * @param yarnlock_old_obj - yarn.lock 內容或已解析物件 / yarn.lock content or an already parsed object
 * @param options - ncu 選項 / ncu options
 * @returns 新的 yarn.lock 物件、變更清單與查詢結果 / New yarn.lock object, change list and query results
 */
export function checkResolutionsUpdate<T extends IYarnLockSource>(resolutions: IPackageMap,
	yarnlock_old_obj: IYarnLockSource | Buffer | string,
	options: Partial<IOptionsNpmCheckUpdates>,
)
{
	return resolve()
		.then(async function ()
		{
			let verType: ITSExcludeEnumValue<typeof EnumDetectYarnLock, 0>;

			/**
			 * 字串 / Buffer 才需要解析並偵測格式；已解析的物件則直接沿用，
			 * 因為它的 `verType` 必須由呼叫端指定。
			 * Only a string / Buffer is parsed and format-detected; an already parsed
			 * object is used as-is because its `verType` must come from the caller.
			 */
			if (typeof yarnlock_old_obj === 'string' || Buffer.isBuffer(yarnlock_old_obj))
			{
				({ verType, parsed: yarnlock_old_obj } = _yarnLockParseRaw(yarnlock_old_obj));
			}

			const y_old = _yarnLockParseCore({
				verType,
				parsed: yarnlock_old_obj,
			});

			/**
			 * 取得 lock 中與 resolutions 相關的分組：
			 * `max` 為每個套件的代表版本、`deps` 為其相依鍵、`installed` 為已安裝版本清單
			 * Groups the lock data relevant to resolutions: `max` holds the
			 * representative version per package, `deps` its dependency keys and
			 * `installed` the list of installed versions
			 */
			const result = filterResolutions({
				resolutions,
			}, y_old.data);

			/**
			 * 向遠端查詢可更新版本（內部會先查版本快取）
			 * Query updatable versions remotely (the version cache is consulted first)
			 */
			const deps = await queryRemoteVersions(resolutions, options);

			//console.dir(deps);

			/**
			 * 套件名稱 → 新版本，供後續 `lt()` 比較
			 * name → new version, used for the `lt()` comparison below
			 */
			const deps2 = keyObjectToPackageMap(deps, true);

			/**
			 * 套件名稱 → 完整快取值，需要 version_old 組出原始安裝鍵時使用
			 * name → full cache value, needed to rebuild the original install key
			 */
			const deps3 = Object.values(deps)
				.reduce(function (a, b)
				{
					a[b.name] = b;

					return a;
				}, {} as Record<string, IVersionCacheMapValue>)
			;

			/**
			 * 先複製一份再修改，避免直接污染解析結果
			 * Work on a copy so the parsed result is never mutated directly
			 */
			const data: IYarnLockDataRecord = {
				...y_old.data,
			};

			const update_list: string[] = [];
			let yarnlock_changed = false;

			Object.entries(result.max)
				.forEach(function ([name, data])
				{
					const _key2 = name + '@' + deps3[name].version_old;

					/**
					 * 檢查 版本範圍是否符合 與 版本是否不相同
					 * Check whether the range matches and the versions differ
					 */
//					console.dir({
//						data,
//						deps: deps2[name],
//					});
					/**
					 * 分支一：安裝版本確實舊於可更新版本，且 lock 內仍有舊條目
					 * → 刪除該套件所有版本條目，讓後續流程重新解析
					 * Branch 1: the installed version is older than the updatable one and
					 * the lock still holds the old entry → delete every entry of this
					 * package so the flow re-resolves it
					 */
					if (data.value.version != null && deps2[name] != null && lt(data.value.version, deps2[name]) && data[_key2] && data[_key2].version != data.value.version)
					{
						Object.keys(result.deps[name])
							.forEach(version =>
							{
								const key = name + '@' + version;

								delete data[key]
							})
						;

						yarnlock_changed = true;

						update_list.push(name);
					}
					else
					{
						/**
						 * 分支二：版本無須更新，但同一套件安裝了多個版本
						 * → 把所有鍵指向同一份代表資料，達成去重
						 * Branch 2: no upgrade needed, but the package is installed in
						 * several versions → point every key at the same representative
						 * data to dedupe
						 */
						if (result.installed[name].length > 1)
						{
							Object.keys(result.deps[name])
								.forEach(version =>
								{

									const key = name + '@' + version;

									data[key] = data.value;
								})
							;

							yarnlock_changed = true;
						}
					}

				})
			;

			/**
			 * 改回原始格式（v1 / v2）並回傳，讓呼叫端可直接寫檔
			 * Serialise back to the original format (v1 / v2) so the caller can write it
			 */
			const yarnlock_new_obj = yarnLockParsedToRawJSON({
				verType,
				meta: y_old.meta,
				data,
			}) as T

			return {
				verType: verType as ITSExcludeEnumValue<typeof EnumDetectYarnLock, 0>,
				yarnlock_old_obj: yarnlock_old_obj as T,
				yarnlock_new_obj,
				update_list,
				yarnlock_changed,
				deps,
				deps2,
				deps3,
			}
		})
		;
}
