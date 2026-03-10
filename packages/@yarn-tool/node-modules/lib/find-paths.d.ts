/**
 * 尋找 Node.js 模組路徑的工具函數
 * Utility functions for finding Node.js module paths
 *
 * @author user
 * @created 2020/6/5
 */
/**
 * 核心模組路徑尋找函數
 * Core function for finding module paths
 *
 * @param cwd - 當前工作目錄 / Current working directory
 * @param dir - 自訂的 node_modules 目錄路徑，預設為 'node_modules' / Custom node_modules directory path, defaults to 'node_modules'
 * @returns 包含 cwd 和 modules 陣列的物件 / Object containing cwd and modules array
 */
export declare function findModulesPackagePathsCore(cwd: string, dir?: string): {
    /** 當前工作目錄 */
    cwd: string;
    modules: {
        name: string;
        location: string;
    }[];
};
/**
 * 尋找模組路徑的主要函數
 * Main function for finding module paths
 *
 * @param cwd - 可選的工作目錄，若未提供則使用當前工作目錄 / Optional working directory, uses current working directory if not provided
 * @param dir - 自訂的 node_modules 目錄路徑 / Custom node_modules directory path
 * @returns 包含 cwd 和 modules 陣列的物件 / Object containing cwd and modules array
 */
export declare function findModulesPackagePaths(cwd?: string, dir?: string): {
    /** 當前工作目錄 */
    cwd: string;
    modules: {
        name: string;
        location: string;
    }[];
};
export default findModulesPackagePaths;
