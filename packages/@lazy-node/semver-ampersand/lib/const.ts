
/** 匹配任意空白序列（含換行、tab）/ Match any run of whitespace (incl. newline, tab) */
export const reSpaces = /\s+/g;

/**
 * 匹配 ampersand 與空白的任意組合
 * Match any combination of ampersand and whitespace
 *
 * 一次吃掉 `&&`、` & `、連續空白等寫法，替換成單一空白即完成「且」語意正規化。
 * Consumes `&&`, ` & `, consecutive spaces, etc. in one shot; replacing with a
 * single space normalizes the "AND" semantics.
 */
export const reAmpersandAndSpaces = /[&\s]+/g;

/**
 * 檢查無效字元（不含 `&`）
 * Detect invalid characters (`&` not allowed)
 *
 * 用於 noAmpersand: true 的路徑，此時 ampersand 視為無效字元。
 * Used on the noAmpersand: true path, where ampersand counts as invalid.
 */
export const reInvalidCharacter = /[^\s\w.*\-><~!^|=+]/;

/**
 * 檢查無效字元（允許 `&`）
 * Detect invalid characters (`&` allowed)
 *
 * 字元清單與 reInvalidCharacter 相同，只多了 `&`，
 * 對應「預設啟用 ampersand 語法」的行為。
 * Same character list as reInvalidCharacter plus `&`, matching the default
 * behavior where ampersand syntax is enabled.
 */
export const reInvalidCharacterOrAmpersand = /[^\s\w.*\-><~!^|=+&]/;

/** 匹配 `||` 邏輯運算子（含兩側空白）/ Match the `||` operator (incl. surrounding whitespace) */
export const reDoubleVerticalBar = /\s*\|\|\s*/g;

/** `||` 的輸出分隔字串（前後各一空白）/ Output separator for `||` (one space on each side) */
export const separatorDoubleVerticalBar = ' || ' as const;

/**
 * 範圍展開時使用的特殊版本常數
 * Special version constants used during range expansion
 */
export const enum EnumSemverVersion
{
	/**
	 * nothing is allowed
	 *
	 * Null Set：不允許任何版本（`>x` / `<x` 這類無意義條件的結果）
	 * Null Set: no version is allowed (result of meaningless conditions like `>x` / `<x`)
	 */
	NULL = '<0.0.0-0',
	/**
	 * nothing is forbidden
	 *
	 * 任意版本 `*`：沒有任何限制
	 * Any version `*`: no restriction at all
	 */
	STAR = '*',
	/** 空字串，等同任意版本 / Empty string, equivalent to any version */
	ANY = '',
}
