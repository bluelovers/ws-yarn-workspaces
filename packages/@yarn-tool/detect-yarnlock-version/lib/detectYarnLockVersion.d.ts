import { EnumDetectYarnLock, EnumDetectYarnLockInputType } from '@yarn-tool/yarnlock-types';
/**
 * 以開頭標頭 (header) 快速判斷 lockfile 格式，只讀取前 160 bytes，
 * 讓一般情況不必付出解析整份 lockfile 的成本。
 *
 * Quickly identifies the lockfile format from its leading header using only
 * the first 160 bytes, so the common case does not pay for a full parse.
 *
 * @param buf lockfile 內容或其前綴 / lockfile content or just its prefix
 * @returns 偵測到的版本列舉，無法判定時回傳 `unknown`（其值為 0，屬 falsy） /
 * the detected version enum, or `unknown` (value 0, falsy) when undetectable
 */
export declare function _detectYarnLockVersionSimple(buf: Buffer | string): EnumDetectYarnLock;
/**
 * 兩階段 (two-stage) 偵測核心：先以標頭快速比對，失敗後再解析原始內容重試，
 * 並一併回傳判定方式 (detect type) 供除錯使用。
 *
 * Two-stage detection core: tries the fast header check first, then falls
 * back to parsing the raw content, also reporting how the result was
 * determined for debugging purposes.
 *
 * @param input lockfile 原始內容 / raw lockfile content
 * @returns 版本、判定方式與原始輸入的組合 /
 * a combination of the version, the detection method and the raw input
 */
export declare function _detectYarnLockVersionCore<T extends Buffer | string>(input: T): {
    verType: EnumDetectYarnLock.v1 | EnumDetectYarnLock.v2 | EnumDetectYarnLock.v3;
    detectType: EnumDetectYarnLockInputType.simple;
    input: T;
} | {
    verType: EnumDetectYarnLock.v2 | EnumDetectYarnLock.v3;
    detectType: EnumDetectYarnLockInputType.parse_raw;
    input: T;
} | {
    verType: EnumDetectYarnLock.unknown;
    detectType: EnumDetectYarnLockInputType.unknown;
    input: T;
};
/**
 * 由 lockfile 原始內容判斷格式版本，為本套件最常用的入口。
 *
 * Determines the lockfile format version from its raw content; this is the
 * most commonly used entry point of the package.
 *
 * @param buf lockfile 內容 / lockfile content
 * @returns 偵測到的版本列舉，無法判定時為 `unknown` /
 * the detected version enum, or `unknown` when undetectable
 */
export declare function detectYarnLockVersion(buf: Buffer | string): EnumDetectYarnLock;
/**
 * 以 parser 解析原始內容後判斷版本，且只接受 v2 與 v3。
 *
 * Parses the raw content with the parser and detects the version, accepting
 * only v2 and v3.
 *
 * @param buf lockfile 內容 / lockfile content
 * @returns v2 或 v3；解析失敗或不是 Berry 格式時為 undefined /
 * v2 or v3, or undefined when parsing fails or the format is not Berry
 */
export declare function _tryParse(buf: Buffer | string): EnumDetectYarnLock.v2 | EnumDetectYarnLock.v3;
/**
 * 判斷已解析物件的版本，但只保留 v2/v3。
 *
 * Detects the version of an already-parsed object, keeping only v2/v3.
 *
 * @param yarnLockObject 已解析的 lockfile 物件 / a parsed lockfile object
 * @returns v2 或 v3；其他結果（含 v1、unknown）一律回傳 undefined /
 * v2 or v3; anything else (including v1 and unknown) becomes undefined
 */
export declare function _tryParseObject(yarnLockObject: Record<string, any>): EnumDetectYarnLock.v2 | EnumDetectYarnLock.v3;
export default detectYarnLockVersion;
