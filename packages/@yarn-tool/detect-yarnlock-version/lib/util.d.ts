import { IYarnLockMetaVersion } from '@yarn-tool/yarnlock-types';
/**
 * 從解析後的 lockfile 物件取出 Berry 的 `__metadata.version` 欄位。
 *
 * Reads the Berry `__metadata.version` field from a parsed lockfile object.
 *
 * @param yarnLockObject 已解析的 lockfile 物件 / a parsed lockfile object
 * @returns 版本字串，沒有 `__metadata` 時為 undefined /
 * the version string, or undefined when `__metadata` is absent
 */
export declare function getMetadataVersion(yarnLockObject: Record<string, any>): `${number}`;
/**
 * 取得 `__metadata` 內的版本欄位。
 *
 * Extracts the version field from a `__metadata` object.
 *
 * @param __metadata Berry 鎖定檔的中繼資料物件 / the Berry lockfile metadata object
 * @returns 版本字串或 undefined / the version string or undefined
 */
export declare function _getMetadataVersionCore(__metadata: Record<string, any>): '4' | '5' | '6' | IYarnLockMetaVersion;
