"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromContent = fromContent;
exports.fromContentAsync = fromContentAsync;
const yarnlock_parse_1 = require("@yarn-tool/yarnlock-parse");
const handleContentObject_1 = require("./handleContentObject");
/**
 * 從 yarn.lock 內容字串（或 Buffer）解析並建立條目迭代器。
 * 版本偵測交由 yarnLockParse 處理，呼叫端不必先判斷 v1 / v2。
 *
 * Parses yarn.lock content (string or Buffer) and builds the entry iterator.
 * Version detection is delegated to yarnLockParse, so callers need not check v1 / v2
 * beforehand.
 *
 * @param yarnlock_old yarn.lock 的原始內容 / raw yarn.lock content
 */
function fromContent(yarnlock_old) {
    return (0, handleContentObject_1.handleContentObject)((0, yarnlock_parse_1.yarnLockParse)(yarnlock_old));
}
/**
 * `fromContent` 的非同步版本：
 * 以 async 函式包裝以維持與其他 Async API 一致的呼叫介面（回傳 Promise），
 * 即使目前解析本身是同步的。
 *
 * Asynchronous version of `fromContent`: wrapped in an async function to keep a Promise
 * based interface consistent with the other Async APIs, even though parsing is currently
 * synchronous.
 *
 * @param yarnlock_old yarn.lock 的原始內容 / raw yarn.lock content
 */
async function fromContentAsync(yarnlock_old) {
    return fromContent(yarnlock_old);
}
exports.default = fromContent;
//# sourceMappingURL=fromContent.js.map