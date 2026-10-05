/**
 * Created by user on 2020/6/12.
 */

/**
 * 版本工具函數 (Version utilities)
 * 說明：這些函數負責判斷「版本欄位能不能直接拿去比大小」，
 * 以及把快取用的鍵物件轉回套件對應表 (package map)，是更新流程的前置整理工具。
 * Why: they decide whether a version field can be compared directly, and turn
 * cache-key objects back into package maps — the preprocessing of the update flow.
 *
 * @module util
 */
import { IVersionValue, EnumVersionValue, EnumVersionValue2 } from '@ts-type/package-dts/lib/package-json/types';
import { IVersionCacheMapKey, IVersionCacheMapValue, IPackageMap } from './types';
import { inspect } from "util";

/**
 * 判斷是否為「不可直接比較」的版本值
 * 回傳 true 代表該值是策略關鍵字（major / minor / newest / latest / greatest / any）
 * 或空值 (null / undefined)，而非實際 semver；此類值必須先向遠端解析成真實版本
 * 才能進行 `lt()` 之類的比較。
 * Returns true when the value is a strategy keyword (major / minor / newest /
 * latest / greatest / any) or a nullish value rather than a real semver; such a
 * value must be resolved remotely before any `lt()`-style comparison.
 *
 * @param version - 版本欄位 / The version field
 */
export function isBadVersion(version: IVersionValue)
{
	let bool = false;
	/**
	 * 策略關鍵字：不是可解析的 semver，必須改用對應的查詢方法
	 * Strategy keywords: not parseable semver, must be resolved with the matching method
	 */
	switch (version)
	{
		case EnumVersionValue.minor:
		case EnumVersionValue.major:
		case EnumVersionValue.newest:
		case EnumVersionValue.latest:
		case EnumVersionValue.greatest:
		case EnumVersionValue2.any:
			bool = true;
			break;
		default:

			/**
			 * 空值同樣視為不可比較，避免把 undefined 傳進 semver 比較
			 * Nullish values are also treated as uncomparable so `undefined` never
			 * reaches a semver comparison
			 */
			if (version == null)
			{
				bool = true;
			}

			break;
	}

	return bool;
}

/**
 * 把快取鍵陣列還原成「套件名稱 → 版本」的對應表
 * @param obj - 快取鍵（或含 version_new 的完整快取值）陣列 / Array of cache keys (or full values with version_new)
 * @param useVarsionNew - true 時取更新後版本，否則取更新前版本 / Take the new version when true, otherwise the old one
 *
 * 注意：`useVarsionNew` 為 true 但缺少 version_new 時會直接略過該筆資料；
 * 後方的 `throw` 位於 `return` 之後，屬既有的不可達 (unreachable) 保底程式碼，
 * 此處僅記錄其存在，不改變原有行為。
 * Note: entries without version_new are silently skipped when `useVarsionNew`
 * is true; the `throw` after the `return` is existing unreachable safety code and
 * is only documented here — its behaviour is intentionally left untouched.
 */
export function keyObjectToPackageMap(obj: IVersionCacheMapKey[] | IVersionCacheMapValue[],
	useVarsionNew?: boolean,
): IPackageMap
{
	// @ts-ignore
	return obj.reduce(function (a: any, data)
	{
		if (useVarsionNew)
		{
			/**
			 * 型別縮窄：只接受已解析出新版本的資料，其餘直接略過
			 * Type narrowing: only data that already resolved a new version is accepted
			 */
			if (typeof data.version_new !== 'string')
			{
				return a;

				throw new TypeError(`not a IVersionCacheMapValue object, ${inspect(data)}`)
			}

			a[data.name] = data.version_new;
		}
		else
		{
			a[data.name] = data.version_old;
		}

		return a;
		// @ts-ignore
	}, {})
}

/**
 * 判斷版本字串是否可以安全升級
 * 條件依序排除：空字串、`any`、`latest`（這三者不是具體版本），
 * 以及以 `>` `<` 開頭或含 `&` `=` `|` 的複雜範圍（此類範圍升級後可能改變語意）。
 * Conditions exclude, in order: empty strings, `any` and `latest` (none of which
 * are concrete versions), and ranges starting with `>` `<` or containing `&` `=`
 * `|` (upgrading those could change the range's meaning).
 *
 * 注意：回傳值可能是 `number`（`version?.length` 為 0 時）或 `boolean`，
 * 呼叫端皆以 truthy 判斷使用。
 * Note: the return may be a `number` (when `version?.length` is 0) or a `boolean`;
 * callers only rely on its truthiness.
 *
 * @param version - 待檢查的版本字串 / The version string to check
 */
export function allowUpdateVersion(version: string)
{
	return version?.length && version !== EnumVersionValue2.any && version !== EnumVersionValue.latest && !/^\s*(?:[><])|&|=|\|/.test(version)
}
