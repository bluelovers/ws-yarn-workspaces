"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._detectYarnLockVersionSimple = _detectYarnLockVersionSimple;
exports._detectYarnLockVersionCore = _detectYarnLockVersionCore;
exports.detectYarnLockVersion = detectYarnLockVersion;
exports._tryParse = _tryParse;
exports._tryParseObject = _tryParseObject;
const detectYarnLockVersionByObject_1 = require("./detectYarnLockVersionByObject");
const yarnlock_types_1 = require("@yarn-tool/yarnlock-types");
const yarnlock_parse_raw_1 = require("@yarn-tool/yarnlock-parse-raw");
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
function _detectYarnLockVersionSimple(buf) {
    /**
     * v1 標頭與 Berry 的 `__metadata` 都位於檔案最前端，
     * 因此取前 160 bytes 並去除前後空白即可涵蓋兩種格式的判斷依據。
     *
     * Both the v1 header and the Berry `__metadata` sit at the very start of
     * the file, so the first 160 bytes, trimmed, cover both cases.
     */
    const head = buf.slice(0, 160).toString().trim();
    /**
     * 依序比對三種標頭特徵，且刻意讓明確的 `(4|5)` 分支先於萬用的
     * 單數字分支：兩者皆能匹配的版本必須判為 v2，順序顛倒會誤判成 v3。
     *
     * The three header signatures are checked in order, deliberately letting
     * the explicit `(4|5)` branch win over the generic single-digit one:
     * versions matched by both must be reported as v2, otherwise they would
     * be misdetected as v3.
     */
    if (head.includes('# yarn lockfile v1')) {
        return yarnlock_types_1.EnumDetectYarnLock.v1;
    }
    else if (/^__metadata:\s*version: (4|5)(?:\r|\n)/m.test(head)) {
        return yarnlock_types_1.EnumDetectYarnLock.v2;
    }
    else if (/^__metadata:\s*version: (\d)(?:\r|\n)/m.test(head)) {
        return yarnlock_types_1.EnumDetectYarnLock.v3;
    }
    /**
     * 標頭沒有任何特徵（例如檔案過短或非 yarn.lock）時，
     * 以 `unknown`（0）表示「尚未判定」，讓呼叫端得以繼續走解析回退 (fallback)。
     *
     * When no signature matches (e.g. a truncated or non-yarn.lock file),
     * `unknown` (0) means "not decided yet" so callers can still try the
     * parse fallback.
     */
    return yarnlock_types_1.EnumDetectYarnLock.unknown;
}
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
function _detectYarnLockVersionCore(input) {
    let verType = _detectYarnLockVersionSimple(input);
    /**
     * `unknown` 的列舉值為 0（falsy），因此此處 truthy 即代表標頭比對已成功，
     * 不需再付出解析成本。
     *
     * `unknown` is 0 (falsy), so a truthy `verType` here means the header
     * check already succeeded and the more expensive parse can be skipped.
     */
    if (verType) {
        return {
            verType,
            detectType: 1 /* EnumDetectYarnLockInputType.simple */,
            input,
        };
    }
    /**
     * 標頭比對失敗時的回退 (fallback)：賦值運算式直接作為條件，
     * 同時完成「解析」與「判斷是否成功」兩件事；
     * 解析失敗或結果非 v2/v3 時 `_tryParse` 回傳 undefined，走進最終的 unknown 分支。
     *
     * Fallback after a failed header check: the assignment doubles as the
     * condition, parsing and testing success in one step; when parsing fails
     * or yields neither v2 nor v3, `_tryParse` resolves to undefined and
     * execution falls through to the final unknown branch.
     */
    if (verType = _tryParse(input)) {
        return {
            verType,
            detectType: 2 /* EnumDetectYarnLockInputType.parse_raw */,
            input,
        };
    }
    /**
     * 兩個階段都無法判定，回報 `unknown` 讓上層得以採取寬鬆 (loose) 策略。
     *
     * Neither stage could decide, so `unknown` is reported and the caller
     * may fall back to a loose strategy.
     */
    return {
        verType: yarnlock_types_1.EnumDetectYarnLock.unknown,
        detectType: 0 /* EnumDetectYarnLockInputType.unknown */,
        input,
    };
}
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
function detectYarnLockVersion(buf) {
    return _detectYarnLockVersionCore(buf).verType;
}
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
function _tryParse(buf) {
    /**
     * 解析失敗代表「這份內容不是可解析的 Berry lockfile」，
     * 屬於正常的判定分支而非錯誤，因此吞下例外並以 undefined 表示未判定，
     * 讓呼叫端改採其他判定方式。
     *
     * A parse failure simply means "not a parseable Berry lockfile", which is
     * an expected outcome rather than an error, so the exception is swallowed
     * and undefined signals "undecided" for the caller to try elsewhere.
     */
    try {
        const yarnLockObject = (0, yarnlock_parse_raw_1.parseYarnLockRawV2)(buf.toString());
        return _tryParseObject(yarnLockObject);
    }
    catch (e) {
    }
}
/**
 * 判斷已解析物件的版本，但只保留 v2/v3。
 *
 * Detects the version of an already-parsed object, keeping only v2/v3.
 *
 * @param yarnLockObject 已解析的 lockfile 物件 / a parsed lockfile object
 * @returns v2 或 v3；其他結果（含 v1、unknown）一律回傳 undefined /
 * v2 or v3; anything else (including v1 and unknown) becomes undefined
 */
function _tryParseObject(yarnLockObject) {
    const result = (0, detectYarnLockVersionByObject_1.detectYarnLockVersionByObject)(yarnLockObject);
    /**
     * v1 與 unknown 都在這裡被刻意排除：
     * 此函式的定位是「Berry 解析回退」，回傳 v1 會讓上層誤以為已完成 Berry 判定。
     *
     * v1 and unknown are deliberately excluded here: this function exists as a
     * Berry parse fallback, and returning v1 would make callers believe the
     * Berry check had succeeded.
     */
    return (result === yarnlock_types_1.EnumDetectYarnLock.v2 || result === yarnlock_types_1.EnumDetectYarnLock.v3) ? result : void 0;
}
exports.default = detectYarnLockVersion;
//# sourceMappingURL=detectYarnLockVersion.js.map