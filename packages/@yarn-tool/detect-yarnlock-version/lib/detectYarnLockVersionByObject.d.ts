import { EnumDetectYarnLock, IYarnLockMetaVersion, IYarnLockVersionSyml } from '@yarn-tool/yarnlock-types';
/**
 * 由已解析的 lockfile 物件判斷格式版本，全程不接觸原始字串。
 *
 * Detects the lockfile format from an already-parsed object without ever
 * touching the raw string.
 *
 * @param yarnLockObject 已解析的 lockfile 物件 / a parsed lockfile object
 * @returns 偵測到的版本列舉，無法判定時為 `unknown` /
 * the detected version enum, or `unknown` when undetectable
 */
export declare function detectYarnLockVersionByObject(yarnLockObject: Record<string, any>): EnumDetectYarnLock;
/**
 * 檢查單一 Berry 項目列是否具備 v2/v3 的欄位特徵。
 *
 * Checks whether a single Berry entry row carries the v2/v3 field signatures.
 *
 * @param row lockfile 中的單一項目列 / a single entry row from the lockfile
 * @returns 三個特徵欄位皆存在時為 true /
 * true when all three signature fields are present
 */
export declare function _checkV2Row(row: unknown): boolean;
/**
 * 檢查物件是否為 v2 或 v3 格式的 Berry lockfile。
 *
 * Checks whether the object is a v2 or v3 Berry lockfile.
 *
 * @param obj 已解析的 lockfile 物件 / a parsed lockfile object
 * @returns 有項目列時回傳驗證通過的版本；僅剩 `__metadata` 時回傳其推得的
 * 版本；無法判定時可能回傳 `unknown` 或 undefined /
 * the validated version when entry rows exist, the version derived from
 * `__metadata` when it is all that remains, or `unknown`/undefined when
 * undecidable
 */
export declare function checkV2(obj: any): EnumDetectYarnLock.unknown | IYarnLockVersionSyml;
/**
 * 檢查物件是否為 v1 格式的 lockfile。
 *
 * Checks whether the object is a v1-format lockfile.
 *
 * @param obj 已解析的 lockfile 物件 / a parsed lockfile object
 * @returns 特徵欄位齊全時回傳 `v1`，否則回傳 undefined /
 * `v1` when the signature fields are present, otherwise undefined
 */
export declare function checkV1(obj: any): EnumDetectYarnLock;
/**
 * 整理判斷格式所需的中繼資料 (metadata) 與項目狀態，
 * 供 checkV2 / checkExistsMeta 等上層函式共用。
 *
 * Gathers the metadata and entry state needed for format detection, shared
 * by higher-level helpers such as checkV2 and checkExistsMeta.
 *
 * @param obj 已解析的 lockfile 物件 / a parsed lockfile object
 * @returns 中繼資料版本、是否存在項目列與其鍵值等判斷素材 /
 * the raw facts for detection: metadata version, whether entry rows exist,
 * and their keys
 */
export declare function _checkExistsMetaCore(obj: unknown): {
    verType: IYarnLockVersionSyml | EnumDetectYarnLock.unknown;
    metaVersion: `${number}`;
    existsMeta: boolean;
    emptyEntries: boolean;
    existsEntries: boolean;
    onlyExistsMeta: boolean;
    meta: {
        version: IYarnLockMetaVersion;
    };
    entryKeys: string[];
};
/**
 * 型別守衛 (type guard)：確認物件僅剩 `__metadata` 且版本欄位可讀。
 *
 * Type guard: verifies the object only keeps `__metadata` with a readable
 * version field.
 *
 * @param obj 要檢查的物件 / the object to check
 * @returns 具備 `__metadata.version` 結構時為 true /
 * true when the `__metadata.version` structure is present
 */
export declare function checkExistsMeta(obj: unknown): obj is {
    __metadata: {
        version: IYarnLockMetaVersion;
    };
};
export default detectYarnLockVersionByObject;
