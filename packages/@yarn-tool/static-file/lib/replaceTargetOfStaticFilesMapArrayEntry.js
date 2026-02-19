"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceTargetOfStaticFilesMapArrayEntry = replaceTargetOfStaticFilesMapArrayEntry;
/**
 * Replace the target file path in a static files map entry / 替換靜態檔案映射條目中的目標檔案路徑
 *
 * Creates a new entry with the same source file but a different target file path.
 * 創建一個具有相同來源檔案但不同目標檔案路徑的新條目。
 *
 * @template K - The new target file path type / 新目標檔案路徑類型
 *
 * @param entry - The original entry / 原始條目
 * @param targetFile - The new target file path / 新目標檔案路徑
 *
 * @returns A new entry with the replaced target file path / 替換目標檔案路徑後的新條目
 *
 * @example
 * ```typescript
 * import { replaceTargetOfStaticFilesMapArrayEntry } from '@yarn-tool/static-file';
 *
 * // Replace target file path
 * // 替換目標檔案路徑
 * const original = ['tsconfig.json.tpl', 'file/tsconfig.json.tpl', 'tsconfig.json'];
 * const newEntry = replaceTargetOfStaticFilesMapArrayEntry(original, 'tsconfig.json');
 * // Returns: ['tsconfig.json', 'file/tsconfig.json.tpl', 'tsconfig.json']
 * // 返回：['tsconfig.json', 'file/tsconfig.json.tpl', 'tsconfig.json']
 * ```
 */
function replaceTargetOfStaticFilesMapArrayEntry(entry, targetFile) {
    return [targetFile, ...entry.slice(1)];
}
//# sourceMappingURL=replaceTargetOfStaticFilesMapArrayEntry.js.map