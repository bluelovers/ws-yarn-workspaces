import { getMetadataVersion } from './util';
import { EnumDetectYarnLock } from '@yarn-tool/yarnlock-types';
/**
 * 只根據 `__metadata.version` 判斷 Berry lockfile 的格式版本。
 *
 * Determines the Berry lockfile format version from `__metadata.version`
 * alone.
 *
 * @param yarnLockObject 已解析的 lockfile 物件 / a parsed lockfile object
 * @returns 對應的版本列舉；沒有中繼資料或無法歸類時為 undefined /
 * the matching version enum, or undefined when metadata is absent or cannot
 * be classified
 */
export declare function detectYarnLockVersionWithMetadata(yarnLockObject: Record<string, any>): EnumDetectYarnLock.v2 | EnumDetectYarnLock.v3 | EnumDetectYarnLock.unknown;
/**
 * 將 Berry 的中繼資料版本字串映射為 `EnumDetectYarnLock`。
 *
 * Maps a Berry metadata version string to `EnumDetectYarnLock`.
 *
 * @param metaVersion `__metadata.version` 字串或 undefined /
 * the `__metadata.version` string, or undefined
 * @returns `4` / `5` → v2、`6` 與更新版本 → v3；版本存在卻無法歸類時為
 * `unknown`；完全沒有版本欄位時回傳 undefined /
 * `4`/`5` → v2, `6` and newer → v3; an existing but unclassifiable version
 * yields `unknown`, while a missing version field yields undefined
 */
export declare function _detectYarnLockVersionWithMetadataCore(metaVersion: string | ReturnType<typeof getMetadataVersion>): EnumDetectYarnLock.v2 | EnumDetectYarnLock.v3 | EnumDetectYarnLock.unknown;
