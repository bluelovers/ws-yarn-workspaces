"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yarnLockStringify = yarnLockStringify;
exports._yarnLockStringifyRaw = _yarnLockStringifyRaw;
exports.yarnLockStringifyRaw = yarnLockStringifyRaw;
exports._yarnLockStringifyRawCore = _yarnLockStringifyRawCore;
const detectYarnLockVersionByObject_1 = require("@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersionByObject");
const detectYarnLockVersion_1 = require("@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersion");
const yarnlock_error_1 = require("@yarn-tool/yarnlock-error");
const yarnlock_parsed_to_json_1 = require("@yarn-tool/yarnlock-parsed-to-json");
const yarnlock_types_1 = require("@yarn-tool/yarnlock-types");
const detect_yarnlock_version_1 = require("@yarn-tool/detect-yarnlock-version");
const v1_1 = require("@yarn-tool/yarnlock-parse-raw/lib/v1");
const v2_1 = require("@yarn-tool/yarnlock-parse-raw/lib/v2");
/**
 * 將任意形式的 `yarn.lock` 資料還原成其原本版本的原始文字。
 * Restore any form of `yarn.lock` data back to the raw text of its own lockfile version.
 *
 * 刻意把三條路徑（已解析物件 → 原始 JSON 物件 → 原始文字）收斂在同一個入口，
 * 是因為呼叫端通常不確定輸入來源，統一入口可避免每一層重複實作版本偵測。
 * Collapsing the three paths (parsed object → raw JSON object → raw text) into one entry
 * point avoids duplicating version detection at every layer, since callers usually do not
 * know the exact shape of their input.
 *
 * @param yarnlock_old 已解析物件、原始 JSON 物件、字串或 Buffer / Parsed object, raw JSON object, string or Buffer
 * @returns 對應 v1/v2/v3 的 lockfile 原始文字 / Raw lockfile text matching v1/v2/v3
 * @throws 無法辨識任何版本時拋出 `YarnLockParsedVersionError` / Thrown when no lockfile version can be detected
 */
function yarnLockStringify(yarnlock_old) {
    let verType = (0, detect_yarnlock_version_1.detectYarnLockVersionByParsed)(yarnlock_old);
    /**
     * 已解析的物件帶有 `data` / `object` 等額外欄位，必須先攤平回原始 JSON 才能序列化；
     * 反之則把輸入視為候選的原始 JSON 物件，交給物件版偵測器判斷版本。
     * A parsed object carries extra `data` / `object` fields, so it must be flattened back
     * to raw JSON before serialization; otherwise the input is treated as a candidate raw
     * JSON object and handed to the object-based version detector.
     */
    if (verType) {
        yarnlock_old = (0, yarnlock_parsed_to_json_1.yarnLockParsedToRawJSON)(yarnlock_old);
    }
    else {
        verType = (0, detectYarnLockVersionByObject_1.detectYarnLockVersionByObject)(yarnlock_old);
    }
    /**
     * 此處已確定是「原始 JSON 物件」，可直接走序列化核心；
     * 需要保留完整結果（版本、序列化函式）時請改用 `_yarnLockStringifyRaw`。
     * At this point the input is known to be a raw JSON object, so it goes straight to the
     * serialization core; use `_yarnLockStringifyRaw` instead when the full result
     * (version, serializer) is needed.
     */
    if (verType) {
        return _yarnLockStringifyRawCore(verType, yarnlock_old).content;
    }
    else {
        verType = (0, detectYarnLockVersion_1.detectYarnLockVersion)(yarnlock_old);
        /**
         * 輸入本身就是可辨識的 lockfile 文字時原樣回傳，
         * 以保證 round-trip 比對時逐字元一致，不會因重新序列化而產生差異。
         * When the input is already recognizable lockfile text it is returned as-is, which
         * keeps round-trip comparison byte-exact instead of introducing drift through a
         * re-serialization.
         */
        if (verType) {
            return yarnlock_old.toString();
        }
    }
    /**
     * 三條路徑都失敗才走到這裡：寧可拋錯，也不要默默吐出格式錯誤的 lockfile。
     * Reached only when all three paths fail: throwing is safer than silently emitting a
     * malformed lockfile.
     */
    throw (0, yarnlock_error_1.newYarnLockParsedVersionError)();
}
/**
 * 進階用法：回傳完整結果物件（含版本與實際使用的序列化函式），而不只是文字。
 * Advanced form that returns the full result (version and the serializer actually used)
 * instead of only the text.
 *
 * 以下底線開頭表示屬於進階／內部 API，一般情境請改用 `yarnLockStringifyRaw`。
 * The leading underscore marks this as an advanced/internal API; prefer `yarnLockStringifyRaw`
 * in normal use.
 *
 * @param yarnlockRawJSON 已知版本的原始 JSON 物件 / Raw JSON object with a known lockfile version
 */
function _yarnLockStringifyRaw(yarnlockRawJSON) {
    const verType = (0, detectYarnLockVersionByObject_1.detectYarnLockVersionByObject)(yarnlockRawJSON);
    return _yarnLockStringifyRawCore(verType, yarnlockRawJSON);
}
/**
 * 將已知版本的原始 JSON 物件序列化為 lockfile 原始文字。
 * Serialize a raw JSON object of known lockfile version into raw lockfile text.
 *
 * @param yarnlockRawJSON 已知版本的原始 JSON 物件 / Raw JSON object with a known lockfile version
 * @returns lockfile 原始文字 / Raw lockfile text
 * @throws 版本無法辨識或不支援時拋出 / Thrown when the version is unknown or unsupported
 */
function yarnLockStringifyRaw(yarnlockRawJSON) {
    return _yarnLockStringifyRaw(yarnlockRawJSON).content;
}
/**
 * 序列化核心：只負責「挑函式 → 呼叫」，不做版本偵測。
 * Serialization core: only picks the serializer and calls it, with no version detection.
 *
 * 版本偵測集中放在上游（`yarnLockStringify` / `_yarnLockStringifyRaw`），
 * 如此這裡就能把未知版本當成程式設計錯誤直接拋錯，而不是回傳半成品。
 * Version detection stays upstream (`yarnLockStringify` / `_yarnLockStringifyRaw`) so this
 * function can treat an unknown version as a programming error and throw instead of
 * returning a partial result.
 *
 * @param verType 已判定的鎖定檔版本 / The already-determined lockfile version
 * @param yarnlockRawJSON 對應版本的原始 JSON / Raw JSON matching that version
 * @throws `verType` 不在 v1/v2/v3 之內時拋出 / Thrown when `verType` is not v1/v2/v3
 */
function _yarnLockStringifyRawCore(verType, yarnlockRawJSON) {
    let fn;
    /**
     * v2 與 v3 合併到同一個 case：兩者文字格式相同，分開處理只會產生重複分支。
     * v2 and v3 share one case because their text formats are identical; splitting them
     * would only duplicate the branch.
     *
     * `default` 必須拋錯而非回退，否則無效版本會被靜默轉成錯誤格式的 lockfile。
     * `default` must throw rather than fall back, otherwise an invalid version would be
     * silently written out in the wrong format.
     */
    switch (verType) {
        case yarnlock_types_1.EnumDetectYarnLock.v3:
        case yarnlock_types_1.EnumDetectYarnLock.v2:
            fn = v2_1.stringifyYarnLockRawV2;
            break;
        case yarnlock_types_1.EnumDetectYarnLock.v1:
            fn = v1_1.stringifyYarnLockRawV1;
            break;
        default:
            throw (0, yarnlock_error_1.newYarnLockParsedVersionError)();
    }
    /**
     * 以 `as` 斷言讓回傳型別對齊可辨別聯合：`verType` 在上方的 switch 已被收窄，
     * 但 TypeScript 無法跨區塊追蹤這層不變式。
     * The `as` assertion aligns the return type with the discriminated union: `verType` is
     * already narrowed in the switch above, but TypeScript cannot track that invariant
     * across blocks.
     */
    return {
        verType,
        fn,
        json: yarnlockRawJSON,
        content: fn(yarnlockRawJSON),
    };
}
/**
 * 預設匯出（Default Export）指向萬用入口 `yarnLockStringify`，
 * 讓 `import yarnLockStringify from '@yarn-tool/yarnlock-stringify'` 與具名匯入行為一致。
 * The default export points at the all-in-one entry `yarnLockStringify`, so
 * `import yarnLockStringify from '@yarn-tool/yarnlock-stringify'` behaves the same as the
 * named import.
 */
exports.default = yarnLockStringify;
//# sourceMappingURL=index.js.map