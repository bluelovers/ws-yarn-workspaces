"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KEY_IGNORE = exports.KEY_IGNORE_SYMBOL = exports.KEY_IGNORE_LEGACY = void 0;
exports._isLibIgnore = _isLibIgnore;
exports._extractRules = _extractRules;
exports.KEY_IGNORE_LEGACY = 'node-ignore';
exports.KEY_IGNORE_SYMBOL = Symbol?.for('node-ignore');
exports.KEY_IGNORE = exports.KEY_IGNORE_SYMBOL ?? exports.KEY_IGNORE_LEGACY;
/**
 * 判斷是否為 ignore 套件實例：以 ignore 自帶的 `node-ignore` 標記認定
 *
 * 刻意回傳布林而不是標記值本身：
 * 標記不存在時原實作會直接丟出 `null` / `undefined`，
 * 呼叫端若只寫 `if (_isLibIgnore(x))` 雖仍可用，但快照與斷言會出現不一致的回傳型別。
 */
function _isLibIgnore(obj) {
    return Boolean(obj && (obj[exports.KEY_IGNORE] ?? obj[exports.KEY_IGNORE_LEGACY]));
}
/**
 * 取出 ignore 套件內部的規則陣列（`_rules._rules`）
 *
 * 規則由 ignore 套件在 `add()` 時解析：註解與空白行不會出現在回傳值中，
 * 回傳的是 `{ pattern, mark, negative }` 規則物件而非原始字串。
 * 非 ignore 實例（沒有內部 `_rules`）時回傳 `undefined`，
 * 讓呼叫端得以先用 {@link _isLibIgnore} 守衛再決定是否驗證規則。
 */
function _extractRules(obj) {
    return obj?._rules?._rules;
}
//# sourceMappingURL=core.js.map