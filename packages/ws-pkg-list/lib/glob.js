"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globFilterListable = globFilterListable;
const micromatch_1 = require("micromatch");
/**
 * 以 glob（萬用字元）模式過濾套件列清單，僅比對套件名稱。
 * Filter a list of package rows by a glob pattern, matching only the package name.
 *
 * @param list 待過濾的列清單。The list of rows to filter.
 * @param globPattern glob 模式，可為單一字串或多個模式。A glob pattern, either a single string or multiple patterns.
 * @param globOptions 傳給 micromatch 的比對選項。Comparison options forwarded to micromatch.
 * @returns 符合模式的列清單，型別與輸入一致。The matching rows, preserving the input type.
 */
function globFilterListable(list, globPattern, globOptions) {
    // 使用 isMatch 而非 micromatch()：只需判斷是否符合，避免為每列產生不必要的比對結果陣列。
    // Use `isMatch` instead of `micromatch()`: only the boolean result is needed, avoiding an unnecessary matched-results array per row.
    return list.filter(row => {
        return (0, micromatch_1.isMatch)(row.name, globPattern, globOptions);
    });
}
//# sourceMappingURL=glob.js.map