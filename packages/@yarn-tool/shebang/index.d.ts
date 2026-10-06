/**
 * 解析 shebang（`#!` 開頭行）的正規表示式 (Regular Expression)：
 * 捕獲群組依序為 1) 執行檔路徑、2) env 之後的命令、3) 其餘參數。
 * 尾端的 lookahead 只吃掉行尾而保留換行符，讓 removeShebang 後續內容不被破壞。
 *
 * Regular expression for parsing shebang (`#!`) lines. Capture groups are:
 * 1) executable path, 2) command after env, 3) remaining arguments. The trailing
 * lookahead consumes only the line ending (keeping the newline), so
 * removeShebang does not disturb the rest of the file.
 */
export declare const reShebang: RegExp;
/**
 * 取得正規化後的 shebang 命令權杖 (Normalized shebang command token)。
 *
 * 以 matchShebang 取得 script 欄位，無匹配時隱式回傳 undefined，
 * 讓呼叫方可用 truthy 判斷而無須另外處理 null。
 * (Why: keeps the common "does this line have a shebang" check ergonomic.)
 *
 * Extract the normalized shebang command token. Delegates to matchShebang and
 * implicitly returns undefined when unmatched, so callers can use a simple
 * truthy check instead of handling null.
 *
 * Examples:
 *
 *  shebang("#!/usr/bin/ruby") // "ruby"
 *
 *  shebang("#!/usr/bin/env node") // "node"
 *
 *  @param: {String}
 *  @return {String|null}
 */
export declare function shebang(line: string): IScriptName;
/**
 * 移除開頭的 shebang 行，並保留其後的換行與內容。
 * 直接以 reShebang 取代而非逐行分割，是為了讓無 shebang 的字串
 * 原封不動地回傳（replace 找不到匹配即原樣返回）。
 *
 * Remove the leading shebang line while keeping the following newline and
 * content. Uses the regex replace instead of line splitting so a string without
 * a shebang is returned untouched (replace is a no-op when nothing matches).
 *
 * @param line 待處理的完整字串 / the full content to process
 * @returns 移除 shebang 後的字串 / content without the shebang line
 */
export declare function removeShebang(line: string): string;
/**
 * shebang 直譯器 (Interpreter) 名稱的語意型別；
 * 以字面型別列出常見值，同時開放任意字串以相容第三方直譯器。
 *
 * Semantic type of the shebang interpreter name. Literal members cover the
 * common cases while the string escape hatch keeps third-party interpreters
 * representable.
 */
export type IScriptName = string | 'env' | 'node' | 'sh';
/**
 * matchShebang 的回傳結構。
 * 同時保留原始 shebang 行、執行檔路徑與解析後的直譯器，
 * 讓呼叫方既能顯示原文也能據 script 做後續處理。
 *
 * Result structure of matchShebang. It keeps the original shebang line, the
 * executable path and the parsed interpreter, so callers can render the raw
 * text yet branch on `script` afterwards.
 */
export interface IMatchShebangReturnType {
    /** 完整的 shebang 行 / the full shebang line */
    shebang: string;
    /** 執行檔路徑，如 `/usr/bin/env` / executable path, e.g. `/usr/bin/env` */
    bin: string;
    /** 執行檔名稱，如 `env` / executable name, e.g. `env` */
    name: IScriptName;
    /** 實際直譯器名稱；env 形式時為其後的命令 / resolved interpreter name; the command after env for env-style */
    script: IScriptName;
    /** 直譯器後其餘參數，無則為空字串 / remaining arguments after the interpreter, empty string if none */
    argv: string | '';
    /** 是否為 env 形式（script 由 name 轉為 env 後的命令）/ whether env-style (script resolved from the command after env) */
    isExtra: boolean;
}
/**
 * 解析 shebang 行並回傳結構化結果。
 *
 * 注意事項 (Edge cases)：
 * - 無匹配時回傳 undefined（若條件分支不成立），呼叫方需以 `?.` 或 truthy 檢查。
 * - `env` 形式（如 `#!/usr/bin/env node`）會把真正的直譯器 `node` 放入 script，
 *   並令 isExtra = true，以區分「執行檔本身即直譯器」與「經 env 轉發」兩種情況。
 * - 路徑以 `/` 切割（本模組不處理 Windows 反斜線路徑，shebang 慣例為 POSIX）。
 *
 * Parse a shebang line into a structured result.
 *
 * Edge cases:
 * - Returns undefined when the line does not match; callers should guard with
 *   `?.` or a truthy check.
 * - For env-style lines (`#!/usr/bin/env node`), the real interpreter `node`
 *   becomes `script` and `isExtra` is set to true, distinguishing "executable
 *   is the interpreter" from "forwarded via env".
 * - The path is split on `/` (POSIX-only by shebang convention; Windows-style
 *   backslash paths are intentionally not handled).
 *
 * @param line 待解析的字行 / the line to parse
 * @returns 解析結果，無匹配時為 undefined / parsed result, or undefined if unmatched
 */
export declare function matchShebang(line: string): IMatchShebangReturnType;
/**
 * 預設匯出解析函式，讓 `require('@yarn-tool/shebang')` 直接得到最常用的入口。
 *
 * Default-exports the parse function so `require('@yarn-tool/shebang')`
 * yields the most commonly used entry point directly.
 */
export default shebang;
