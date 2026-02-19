"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRowOfStaticFilesMapArray = getRowOfStaticFilesMapArray;
const parseStaticMap_1 = require("./parseStaticMap");
/**
 * Get a specific row from static files map array / 從靜態檔案映射陣列獲取特定行
 *
 * Retrieves a specific entry from the static files map based on the target file key.
 * 根據目標檔案鍵從靜態檔案映射中檢索特定條目。
 *
 * @template T - The static files map type / 靜態檔案映射類型
 * @template K - The target file key type / 目標檔案鍵類型
 *
 * @param file_map - The static files map (array or record format) / 靜態檔案映射（陣列或記錄格式）
 * @param key - The target file key to search for / 要搜尋的目標檔案鍵
 *
 * @returns The matching entry or undefined if not found / 匹配的條目，如果未找到則返回 undefined
 *
 * @example
 * ```typescript
 * import { getRowOfStaticFilesMapArray } from '@yarn-tool/static-file';
 * import { defaultCopyStaticFiles } from '@yarn-tool/static-file/lib/const';
 *
 * // Get the entry for .gitignore
 * // 獲取 .gitignore 的條目
 * const entry = getRowOfStaticFilesMapArray(defaultCopyStaticFiles, '.gitignore');
 * // Returns: ['.gitignore', 'file/gitignore']
 * // 返回：['.gitignore', 'file/gitignore']
 *
 * // Get the entry for tsconfig.json.tpl
 * // 獲取 tsconfig.json.tpl 的條目
 * const tsconfigEntry = getRowOfStaticFilesMapArray(defaultCopyStaticFiles, 'tsconfig.json.tpl');
 * // Returns: ['tsconfig.json.tpl', 'file/tsconfig.json.tpl', 'tsconfig.json']
 * // 返回：['tsconfig.json.tpl', 'file/tsconfig.json.tpl', 'tsconfig.json']
 * ```
 */
function getRowOfStaticFilesMapArray(file_map, key) {
    return (0, parseStaticMap_1.parseStaticMap)(file_map).find(a => a[0] === key);
}
//# sourceMappingURL=getRowOfStaticFilesMapArray.js.map