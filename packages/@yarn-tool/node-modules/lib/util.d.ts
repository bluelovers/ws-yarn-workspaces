/**
 * Node.js 模組路徑工具函數
 * Node.js module path utility functions
 *
 * @author user
 * @created 2020/6/5
 */
/**
 * 取得 node_modules 目錄路徑
 * Get the node_modules directory path
 *
 * @param cwd - 當前工作目錄 / Current working directory
 * @param dir - 自訂的 node_modules 目錄路徑，若未提供則使用預設值 'node_modules' / Custom node_modules directory path, defaults to 'node_modules' if not provided
 * @returns 完整的 node_modules 目錄路徑 / Complete node_modules directory path
 */
export declare function getModulesDir(cwd: string, dir?: string): string;
