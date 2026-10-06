"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._yarnLockParseRawCore = _yarnLockParseRawCore;
exports._yarnLockParseRaw = _yarnLockParseRaw;
exports.yarnLockParseRaw = yarnLockParseRaw;
exports.yarnLockRawV1ToParsed = yarnLockRawV1ToParsed;
exports.yarnLockRawV2ToParsed = yarnLockRawV2ToParsed;
exports._yarnLockParseCore = _yarnLockParseCore;
exports.yarnLockParse = yarnLockParse;
const detectYarnLockVersion_1 = require("@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersion");
const yarnlock_error_1 = require("@yarn-tool/yarnlock-error");
const yarnlock_types_1 = require("@yarn-tool/yarnlock-types");
const v1_1 = require("@yarn-tool/yarnlock-parse-raw/lib/v1");
const v2_1 = require("@yarn-tool/yarnlock-parse-raw/lib/v2");
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
function _yarnLockParseRawCore(verType, yarnlock_old) {
    const source = yarnlock_old.toString();
    let parsed;
    /**
     * v2 與 v3 的原始格式相同，可共用 v1 以外的同一支解析器。
     * v2 and v3 share the same raw format, so one parser covers both.
     */
    switch (verType) {
        case yarnlock_types_1.EnumDetectYarnLock.v3:
        case yarnlock_types_1.EnumDetectYarnLock.v2:
            parsed = (0, v2_1.parseYarnLockRawV2)(source);
            break;
        case yarnlock_types_1.EnumDetectYarnLock.v1:
            parsed = (0, v1_1.parseYarnLockRawV1)(source);
            break;
        default:
            throw (0, yarnlock_error_1.newYarnLockParsedVersionError)();
    }
    return {
        verType,
        parsed,
        source,
    };
}
/**
 * 偵測版本後解析為原始 (raw) 結果，保留 v1 / v2 的底層格式差異。
 * Detect the version then parse into the raw result, preserving the v1 / v2 format differences.
 *
 * @param yarnlock_old - lock 檔原始內容，接受 Buffer 或字串
 *                       - raw lockfile content, accepts Buffer or string
 * @returns 包含 verType / parsed / source 的解析結果
 *          - the parse result containing verType / parsed / source
 */
function _yarnLockParseRaw(yarnlock_old) {
    const verType = (0, detectYarnLockVersion_1.detectYarnLockVersion)(yarnlock_old);
    return _yarnLockParseRawCore(verType, yarnlock_old);
}
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
function yarnLockParseRaw(yarnlock_old) {
    return _yarnLockParseRaw(yarnlock_old).parsed;
}
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
function yarnLockRawV1ToParsed(rawParsed) {
    let data;
    let meta;
    /**
     * v1 的套件項目集中在 object，其餘頂層欄位皆為中繼資料。
     * v1 keeps package entries under `object`; all other top-level fields are metadata.
     */
    ({ object: data, ...meta } = rawParsed);
    return {
        meta,
        data,
    };
}
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
function yarnLockRawV2ToParsed(rawParsed) {
    let data;
    let meta;
    ({ __metadata: meta, ...data } = rawParsed);
    return {
        meta,
        data,
    };
}
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
function _yarnLockParseCore(inputResult) {
    let fn;
    /**
     * v2 與 v3 共用同一支轉換函式，因為兩者的原始結構相同。
     * v2 and v3 share one converter because their raw structures are identical.
     */
    switch (inputResult.verType) {
        case yarnlock_types_1.EnumDetectYarnLock.v3:
        case yarnlock_types_1.EnumDetectYarnLock.v2:
            fn = yarnLockRawV2ToParsed;
            break;
        case yarnlock_types_1.EnumDetectYarnLock.v1:
            fn = yarnLockRawV1ToParsed;
            break;
        default:
            throw (0, yarnlock_error_1.newYarnLockParsedVersionError)();
    }
    return {
        verType: inputResult.verType,
        ...(fn(inputResult.parsed)),
    };
}
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
function yarnLockParse(yarnlock_old) {
    const verType = (0, detectYarnLockVersion_1.detectYarnLockVersion)(yarnlock_old);
    const inputResult = _yarnLockParseRawCore(verType, yarnlock_old);
    return _yarnLockParseCore(inputResult);
}
/**
 * 以 default 匯出主要 API，讓 import yarnLockParse 的用法與命名函式一致。
 * Default-export the main API so `import yarnLockParse` matches the named function.
 */
exports.default = yarnLockParse;
//# sourceMappingURL=index.js.map