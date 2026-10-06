"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseYarnLockRawV1 = parseYarnLockRawV1;
exports.getYarnLockRawV1Root = getYarnLockRawV1Root;
exports.parseYarnLockRawV1Root = parseYarnLockRawV1Root;
exports.stringifyYarnLockRawV1 = stringifyYarnLockRawV1;
const lockfile_1 = require("@yarnpkg/lockfile");
/**
 * 解析 v1 格式的 yarn.lock，保留最原始的 { type, object } 結構。
 * Parse a v1 yarn.lock and keep the raw { type, object } structure.
 *
 * @param source - lock 檔內容，接受 Buffer 或字串
 *                 - lockfile content, accepts Buffer or string
 * @param fileLoc - 出錯時用於錯誤訊息的檔案位置
 *                  - file location used in error messages
 * @remarks
 * Buffer 在此統一轉成字串，因為底層 parse 只接受字串。
 * The Buffer is converted to string here because the underlying parse only accepts a string.
 */
function parseYarnLockRawV1(source, fileLoc) {
    return (0, lockfile_1.parse)(source === null || source === void 0 ? void 0 : source.toString(), fileLoc);
}
/**
 * 取得 v1 原始結果的 object 根節點，輸入缺少 object 鍵時拋出 TypeError。
 * Get the `object` root of a raw v1 result; throw TypeError when the key is missing.
 *
 * @remarks
 * 顯式檢查而非直接回傳 undefined，避免下游拿到靜默失敗的空值。
 * The explicit check avoids silently returning undefined to callers downstream.
 */
function getYarnLockRawV1Root(input) {
    if (!('object' in input)) {
        throw new TypeError(`'object' key not exists in input object`);
    }
    return input.object;
}
/**
 * 解析 v1 yarn.lock 並直接回傳 object 根節點。
 * Parse a v1 yarn.lock and return only the `object` root.
 *
 * @param source - lock 檔內容，接受 Buffer 或字串
 *                 - lockfile content, accepts Buffer or string
 * @param fileLoc - 出錯時用於錯誤訊息的檔案位置
 *                  - file location used in error messages
 */
function parseYarnLockRawV1Root(source, fileLoc) {
    return getYarnLockRawV1Root(parseYarnLockRawV1(source, fileLoc));
}
/**
 * 將 v1 資料寫回 yarn.lock 字串。
 * Write v1 data back into a yarn.lock string.
 *
 * @param json - 可傳入 { object } 包裹的解析結果或純 object 內容
 *               - accepts either a wrapped `{ object }` result or a plain object
 * @param noHeader - 是否省略 banner 標頭
 *                   - whether to omit the banner header
 * @remarks
 * 兼容兩種輸入形狀（包裹 / 未包裹），因為使用者手上常兩者混用。
 * Accepts both wrapped and unwrapped shapes because callers often hold either one.
 */
function stringifyYarnLockRawV1(json, noHeader) {
    var _a;
    return (0, lockfile_1.stringify)((_a = json.object) !== null && _a !== void 0 ? _a : json, noHeader);
}
//# sourceMappingURL=v1.js.map