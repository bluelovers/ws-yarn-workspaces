import { EnumDetectYarnLock, IYarnLockParsedV1, IYarnLockParsedV2, IYarnLockRawSourceV1, IYarnLockRawSourceV2, IYarnLockSource } from '@yarn-tool/yarnlock-types';
/**
 * 依指定的 lock 檔版本直接解析來源，不做版本偵測。
 * Parse the source by the given lockfile version without detecting it.
 *
 * @param verType - 已偵測完成的 yarn.lock 版本（由呼叫端決定，避免重複偵測）
 *                  - the already-detected yarn.lock version (decided by the caller to avoid re-detection)
 * @param yarnlock_old - lock 檔原始內容，接受 Buffer 或字串
 *                       - raw lockfile content, accepts Buffer or string
 * @returns 包含 verType / parsed / source 的解析結果
 *          - the parse result containing verType / parsed / source
 *
 * @remarks
 * 未知版本會拋出 YarnLockParsedVersionError，而不是回傳 undefined，
 * 讓錯誤在最接近來源的位置即時暴露。
 * Unknown versions throw YarnLockParsedVersionError instead of returning
 * undefined, so failures surface as close to the source as possible.
 */
export declare function _yarnLockParseRawCore<T extends IYarnLockSource = IYarnLockSource>(verType: EnumDetectYarnLock, yarnlock_old: Buffer | string): {
    verType: EnumDetectYarnLock.v1 | EnumDetectYarnLock.v2 | EnumDetectYarnLock.v3;
    parsed: T;
    source: string;
};
/**
 * 偵測版本後解析為原始 (raw) 結果，保留 v1 / v2 的底層格式差異。
 * Detect the version then parse into the raw result, preserving the v1 / v2 format differences.
 *
 * @param yarnlock_old - lock 檔原始內容，接受 Buffer 或字串
 *                       - raw lockfile content, accepts Buffer or string
 * @returns 包含 verType / parsed / source 的解析結果
 *          - the parse result containing verType / parsed / source
 */
export declare function _yarnLockParseRaw<T extends IYarnLockSource = IYarnLockSource>(yarnlock_old: Buffer | string): {
    verType: EnumDetectYarnLock.v1 | EnumDetectYarnLock.v2 | EnumDetectYarnLock.v3;
    parsed: T;
    source: string;
};
/**
 * 解析任意版本的 yarn.lock，只回傳正規化前的原始解析物件。
 * Parse a yarn.lock of any version and return only the raw parsed object.
 *
 * @param yarnlock_old - lock 檔原始內容，接受 Buffer 或字串
 *                       - raw lockfile content, accepts Buffer or string
 * @remarks
 * v1 回傳 { object, ...meta }、v2/v3 回傳 { __metadata, ...entries }；
 * 若需要統一的 { meta, data } 格式請改用 yarnLockParse。
 * v1 returns { object, ...meta } while v2/v3 returns { __metadata, ...entries };
 * use yarnLockParse instead when the unified { meta, data } shape is required.
 */
export declare function yarnLockParseRaw<T extends IYarnLockSource = IYarnLockSource>(yarnlock_old: Buffer | string): T;
/**
 * 將 v1 的原始解析結果轉為 { meta, data } 結構（不含 verType）。
 * Convert a raw v1 parse result into the { meta, data } shape (without verType).
 *
 * @param rawParsed - 由 parseYarnLockRawV1 產生的原始結果
 *                    - the raw result produced by parseYarnLockRawV1
 * @remarks
 * 使用剩餘 (rest) 運算子把 object 拆成 data，其餘欄位全部歸入 meta，
 * 因此未來新增的中繼資料欄位不需要修改此函式。
 * The rest operator splits `object` into data and folds every other field
 * into meta, so future metadata fields do not require changes here.
 */
export declare function yarnLockRawV1ToParsed(rawParsed: IYarnLockRawSourceV1): Omit<IYarnLockParsedV1, 'verType'>;
/**
 * 將 v2 / v3 的原始解析結果轉為 { meta, data } 結構（不含 verType）。
 * Convert a raw v2 / v3 parse result into the { meta, data } shape (without verType).
 *
 * @param rawParsed - 由 parseYarnLockRawV2 產生的原始結果
 *                    - the raw result produced by parseYarnLockRawV2
 * @remarks
 * 與 v1 相反，__metadata 才是中繼資料、其餘欄位才是套件項目。
 * In contrast to v1, `__metadata` holds the metadata while the rest are entries.
 */
export declare function yarnLockRawV2ToParsed(rawParsed: IYarnLockRawSourceV2): Omit<IYarnLockParsedV2, 'verType'>;
/**
 * 依 verType 挑選對應的轉換函式，把 raw 結果正規化為統一格式並補上 verType。
 * Pick the converter by verType, normalize the raw result and re-attach verType.
 *
 * @param inputResult - 來自 _yarnLockParseRawCore 的 { verType, parsed }
 *                      - the { verType, parsed } produced by _yarnLockParseRawCore
 * @returns 統一的 { verType, meta, data } 結構
 *          - the unified { verType, meta, data } shape
 *
 * @remarks
 * 未知版本一樣拋出 YarnLockParsedVersionError，確保與解析階段的錯誤行為一致。
 * Unknown versions also throw YarnLockParsedVersionError, keeping error
 * behaviour consistent with the parsing stage.
 */
export declare function _yarnLockParseCore<T extends IYarnLockParsedV1 | IYarnLockParsedV2 = IYarnLockParsedV1 | IYarnLockParsedV2>(inputResult: Pick<ReturnType<typeof _yarnLockParseRawCore>, 'verType' | 'parsed'>): T;
/**
 * 主要 (default) 匯出：偵測版本、解析並正規化任意版本的 yarn.lock。
 * Main (default) export: detect, parse and normalize a yarn.lock of any version.
 *
 * @param yarnlock_old - lock 檔原始內容，接受 Buffer 或字串
 *                       - raw lockfile content, accepts Buffer or string
 * @returns 統一的 { verType, meta, data } 結構
 *          - the unified { verType, meta, data } shape
 *
 * @remarks
 * 先偵測版本、再解析、最後轉成統一格式；任一階段遇到未知版本
 * 都會拋出 YarnLockParsedVersionError。
 * Detects the version, parses, then normalizes; unknown versions throw
 * YarnLockParsedVersionError at any stage.
 */
export declare function yarnLockParse<T extends IYarnLockParsedV1 | IYarnLockParsedV2 = IYarnLockParsedV1 | IYarnLockParsedV2>(yarnlock_old: Buffer | string): T;
/**
 * 以 default 匯出主要 API，讓 import yarnLockParse 的用法與命名函式一致。
 * Default-export the main API so `import yarnLockParse` matches the named function.
 */
export default yarnLockParse;
