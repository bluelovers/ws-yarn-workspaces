import ignore from "ignore";

export const KEY_IGNORE_LEGACY = 'node-ignore';
export const KEY_IGNORE_SYMBOL = Symbol?.for('node-ignore');
export const KEY_IGNORE = KEY_IGNORE_SYMBOL ?? KEY_IGNORE_LEGACY;

/**
 * ignore 套件內部的規則物件：`pattern` 為原始模式字串、
 * `negative` 為是否為 `!` 負規則、`mark` 由 ignore 內部使用
 */
export type ILibIgnoreRule = {
	pattern: string;
	mark?: string;
	negative: boolean;
};

export type ILibIgnoreCore = {
	_rules?: ILibIgnoreRule[];
};

export type ILibIgnore<T extends Partial<ignore.Ignore> = ignore.Ignore> = T & {
	_rules?: ILibIgnoreCore;
};

/**
 * 判斷是否為 ignore 套件實例：以 ignore 自帶的 `node-ignore` 標記認定
 *
 * 刻意回傳布林而不是標記值本身：
 * 標記不存在時原實作會直接丟出 `null` / `undefined`，
 * 呼叫端若只寫 `if (_isLibIgnore(x))` 雖仍可用，但快照與斷言會出現不一致的回傳型別。
 */
export function _isLibIgnore(obj: any): obj is ILibIgnore
{
	return Boolean(obj && (obj[KEY_IGNORE] ?? obj[KEY_IGNORE_LEGACY]));
}

/**
 * 取出 ignore 套件內部的規則陣列（`_rules._rules`）
 *
 * 規則由 ignore 套件在 `add()` 時解析：註解與空白行不會出現在回傳值中，
 * 回傳的是 `{ pattern, mark, negative }` 規則物件而非原始字串。
 * 非 ignore 實例（沒有內部 `_rules`）時回傳 `undefined`，
 * 讓呼叫端得以先用 {@link _isLibIgnore} 守衛再決定是否驗證規則。
 */
export function _extractRules(obj: any): ILibIgnoreRule[] | undefined
{
	return (obj as ILibIgnore)?._rules?._rules;
}
