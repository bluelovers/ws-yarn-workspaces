"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isYarnLockParsed = isYarnLockParsed;
exports.assertYarnLockParsed = assertYarnLockParsed;
exports.isYarnLockParsedV1 = isYarnLockParsedV1;
exports.isYarnLockParsedV2 = isYarnLockParsedV2;
exports.assertYarnLockParsedIsSupported = assertYarnLockParsedIsSupported;
const yarnlock_error_1 = require("@yarn-tool/yarnlock-error");
const detect_yarnlock_version_1 = require("@yarn-tool/detect-yarnlock-version");
const yarnlock_types_1 = require("@yarn-tool/yarnlock-types");
/**
 * 判斷任意物件是否為可辨識版本的 yarn.lock 解析結果。
 * Check whether an arbitrary object is a yarn.lock parse result with a recognizable version.
 *
 * @remarks
 * 以 detectYarnLockVersionByParsed > 0 作為判準：
 * 回傳 0 代表無法辨識，因此不適合拿來判斷具體版本、只適合做型別守衛。
 * Uses detectYarnLockVersionByParsed > 0: 0 means unrecognized, so this is
 * only a type guard, not a way to tell the exact version.
 */
function isYarnLockParsed(parsedObject) {
    return (0, detect_yarnlock_version_1.detectYarnLockVersionByParsed)(parsedObject) > 0;
}
/**
 * 斷言輸入為有效解析結果，失敗時拋出 YarnLockParsedVersionError。
 * Assert the input is a valid parse result; throw YarnLockParsedVersionError otherwise.
 *
 * @remarks
 * 與 isYarnLockParsed 的差別在於：此函式失敗會中斷流程，
 * 讓未驗證的資料不會繼續流向下游。
 * Unlike isYarnLockParsed, failure aborts the flow so unvalidated data
 * never continues downstream.
 */
function assertYarnLockParsed(parsedObject) {
    /**
     * detect 回傳 0 表示無法辨識版本，此時必須拒絕而非放行。
     * detect returns 0 when the version is unrecognized; the input must be rejected, not passed through.
     */
    if (!(0, detect_yarnlock_version_1.detectYarnLockVersionByParsed)(parsedObject)) {
        throw (0, yarnlock_error_1.newYarnLockParsedVersionError)();
    }
}
/**
 * 型別守衛：判斷是否為 v1 格式的解析結果。
 * Type guard: check whether the parsed result uses the v1 format.
 *
 * @remarks
 * 只看 verType 欄位；輸入可能未經驗證，故以斷言轉型後再存取欄位。
 * Only inspects `verType`; the input may be unvalidated, so it is
 * asserted into shape before the field access.
 */
function isYarnLockParsedV1(data) {
    return data.verType === yarnlock_types_1.EnumDetectYarnLock.v1;
}
/**
 * 型別守衛：判斷是否為 v2 或 v3 格式的解析結果。
 * Type guard: check whether the parsed result uses the v2 or v3 format.
 *
 * @remarks
 * v2 與 v3 的 parsed 結構相同，因此兩種 verType 一併視為 v2 分支，
 * 避免呼叫端重複判斷。
 * v2 and v3 share the same parsed structure, so both verType values map to
 * the v2 branch and callers avoid a duplicate check.
 */
function isYarnLockParsedV2(data) {
    return data.verType === yarnlock_types_1.EnumDetectYarnLock.v2 || data.verType === yarnlock_types_1.EnumDetectYarnLock.v3;
}
/**
 * 斷言解析結果屬於支援的版本，可選擇以回呼 (callback) 依版本分流。
 * Assert the parsed result is a supported version, optionally branching via a callback.
 *
 * @param parsedOldPackage - 待驗證的解析結果
 *                           - the parsed result to validate
 * @param cb - 可選回呼，收到 verType 與已收窄的資料
 *             - optional callback receiving the verType and the narrowed data
 *
 * @remarks
 * v2 分支刻意回傳 EnumDetectYarnLock.v3：v2 / v3 共用同一格式，
 * 下游只需處理「v1」與「v2 格式（以 v3 表示）」兩條路徑。
 * The v2 branch deliberately reports EnumDetectYarnLock.v3: v2 / v3 share one
 * format, so downstream only handles two paths — v1 and the v2 format (as v3).
 */
function assertYarnLockParsedIsSupported(parsedOldPackage, cb) {
    /**
     * if / else-if 依序判斷：先分離 v1，其餘無法辨識者交給結尾的 throw。
     * if / else-if order: v1 is peeled off first, anything unrecognized falls to the trailing throw.
     */
    if (isYarnLockParsedV1(parsedOldPackage)) {
        return cb === null || cb === void 0 ? void 0 : cb(yarnlock_types_1.EnumDetectYarnLock.v1, parsedOldPackage);
    }
    else if (isYarnLockParsedV2(parsedOldPackage)) {
        return cb === null || cb === void 0 ? void 0 : cb(yarnlock_types_1.EnumDetectYarnLock.v3, parsedOldPackage);
    }
    /**
     * 兩種格式都不是 → 版本不受支援，以統一錯誤中斷流程。
     * Neither format matched → unsupported version, abort with the shared error.
     */
    throw (0, yarnlock_error_1.newYarnLockParsedVersionError)();
}
/**
 * default 匯出主要斷言函式，方便以 `import assert from ...` 直接使用。
 * Default-export the main assertion for `import assert from ...` convenience.
 */
exports.default = assertYarnLockParsed;
//# sourceMappingURL=index.js.map