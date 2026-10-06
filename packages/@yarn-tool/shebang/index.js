"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reShebang = void 0;
exports.shebang = shebang;
exports.removeShebang = removeShebang;
exports.matchShebang = matchShebang;
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
exports.reShebang = /^\s*#!\s*([^\s]+)(?:\s+([^\s]+)(?:\s+([^\r\n]+))?(?=\r|\n|$))?/;
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
function shebang(line) {
    var _a;
    return (_a = matchShebang(line)) === null || _a === void 0 ? void 0 : _a.script;
}
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
function removeShebang(line) {
    return line.replace(exports.reShebang, '');
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
function matchShebang(line) {
    const matched = line.match(exports.reShebang);
    if ((matched === null || matched === void 0 ? void 0 : matched.length) > 0) {
        // 取路徑最後一段作為執行檔名稱；
        // 無法使用 basename 是因為本處只需名稱，不需處理結尾斜線等細節。
        // The last path segment is the executable name; a basename helper is
        // unnecessary here since only the name (not trailing slashes) matters.
        const paths = matched[1].split('/');
        let script = paths[paths.length - 1];
        let name = script;
        let i = 2;
        let isExtra = false;
        // env 形式：真正要執行的命令是 env 之後的參數，
        // 因此把 script 改為 matched[2]，並將擷取起點後移一位以跳過它。
        // env-style: the actual command is the argument after env, so switch
        // `script` to matched[2] and shift the take-start index past it.
        if (script === 'env' && typeof matched[2] !== 'undefined') {
            script = matched[2];
            i = 3;
            isExtra = true;
        }
        // 過濾未參與匹配的 undefined 捕獲群組，避免 argv 出現多餘空白。
        // Drop non-participating (undefined) captures so argv has no stray spaces.
        let rest = matched.slice(i).filter(v => typeof v !== 'undefined');
        return {
            shebang: matched[0],
            bin: matched[1],
            name,
            script,
            argv: rest.join(' '),
            isExtra,
        };
    }
}
/**
 * 預設匯出解析函式，讓 `require('@yarn-tool/shebang')` 直接得到最常用的入口。
 *
 * Default-exports the parse function so `require('@yarn-tool/shebang')`
 * yields the most commonly used entry point directly.
 */
exports.default = shebang;
//# sourceMappingURL=index.js.map