"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStaticFile = getStaticFile;
const const_1 = require("./const");
const getRowOfStaticFilesMapArray_1 = require("./getRowOfStaticFilesMapArray");
/**
 * Get a static file entry by file ID / 根據檔案 ID 獲取靜態檔案條目
 *
 * Retrieves the static file entry for a given file ID from the file map.
 * 從檔案映射中根據給定的檔案 ID 檢索靜態檔案條目。
 *
 * @template K - The file ID type / 檔案 ID 類型
 *
 * @param file_id - The file ID to look up / 要查找的檔案 ID
 * @param options - Optional configuration / 可選配置
 * @param options.file_map - Custom file map (defaults to defaultCopyStaticFiles) / 自訂檔案映射（預設為 defaultCopyStaticFiles）
 *
 * @returns The static file entry or undefined if not found / 靜態檔案條目，如果未找到則返回 undefined
 *
 * @example
 * ```typescript
 * import { getStaticFile } from '@yarn-tool/static-file';
 *
 * // Get the .gitignore entry from default file map
 * // 從預設檔案映射獲取 .gitignore 條目
 * const entry = getStaticFile('.gitignore');
 * // Returns: ['.gitignore', 'file/gitignore']
 * // 返回：['.gitignore', 'file/gitignore']
 *
 * // Get entry from custom file map
 * // 從自訂檔案映射獲取條目
 * const customEntry = getStaticFile('README.md', {
 *   file_map: [
 *     ['README.md', 'file/README.md'],
 *     ['.gitignore', 'file/gitignore']
 *   ]
 * });
 * ```
 */
function getStaticFile(file_id, options) {
    return (0, getRowOfStaticFilesMapArray_1.getRowOfStaticFilesMapArray)((options === null || options === void 0 ? void 0 : options.file_map) || const_1.defaultCopyStaticFiles, file_id);
}
//# sourceMappingURL=getStaticFile.js.map