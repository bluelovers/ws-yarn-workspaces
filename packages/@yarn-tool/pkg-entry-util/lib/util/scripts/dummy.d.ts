/**
 * 產生 echo 前綴片段
 * Build the echo prefix fragment
 *
 * @param prefix - 前綴文字（可為 undefined）/ the prefix text (may be undefined)
 * @returns 形如 `echo <prefix>` 的字串，前綴為空時僅回傳 `echo`
 *          a string like `echo <prefix>`, reduced to `echo` when empty
 *
 * @note `??` 處理 undefined、`trim()` 處理空字串造成的多餘空白，
 *       兩者缺一都會在邊界情況留下尾隨空白
 *       `??` handles undefined and `trim()` removes the extra space from an
 *       empty prefix; both are needed to avoid trailing spaces at the edges
 */
export declare function _dummyEchoPrefix(prefix: string): string;
/**
 * 組合 echo 指令的前綴與內容
 * Join the prefix and text of an echo command
 *
 * @param pre - 已產生的前綴（如 `echo my-pkg`）/ the already-built prefix (e.g. `echo my-pkg`)
 * @param text - 要附加的內容 / the text to append
 * @returns 完整的 echo 指令 / the full echo command
 */
export declare function _dummyEchoTextCore(pre: string, text: string): string;
/**
 * 由 prefix 與 text 組出完整的 dummy echo 指令
 * Compose a full dummy echo command from prefix and text
 *
 * @param prefix - echo 前綴文字 / the echo prefix text
 * @param text - 要附加的內容 / the text to append
 * @returns 完整的 echo 指令 / the full echo command
 */
export declare function _dummyEchoText(prefix: string, text: string): string;
/**
 * 粗略判斷值是否可能是 dummy echo 指令
 * Roughly check whether a value may be a dummy echo command
 *
 * @param value - 要檢查的腳本命令 / the script command to check
 * @returns 可能是 dummy echo 時回傳 truthy，否則回傳 falsy
 *          truthy when it may be a dummy echo, falsy otherwise
 *
 * @note 回傳型別為 `number | boolean | undefined`（`value?.length` 可能是 0），
 *       呼叫端應只作為 truthy 判斷使用；
 *       排除 `&` 是因為真正的指令常以 `cmdA & cmdB` 串接，不該被誤認為 dummy
 *       The return type is `number | boolean | undefined` (`value?.length` can be 0),
 *       so callers must treat it as a truthy check only;
 *       `&` is excluded because real commands are often chained as `cmdA & cmdB`
 *       and must not be mistaken for a dummy
 */
export declare function isDummyEchoMaybe(value: string): boolean;
/**
 * 判斷值是否為空或可能是 dummy echo 指令
 * Check whether a value is empty or may be a dummy echo command
 *
 * @param value - 要檢查的腳本命令 / the script command to check
 * @returns 空值或可能是 dummy echo 時回傳 true / true when empty or possibly a dummy echo
 *
 * @note 與 `isDummyEchoMaybe` 互補：此版本會把空值也視為「可覆寫」，
 *       適合用於決定是否填充預設腳本
 *       Complements `isDummyEchoMaybe`: empty values count as overwritable
 *       here, which suits deciding whether to fill in a default script
 */
export declare function isDummyEchoMaybeOrEmpty(value: string): boolean;
