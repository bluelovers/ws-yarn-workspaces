/**
 * 工作區模組路徑尋找工具
 * Workspace module path finding utilities
 *
 * @author user
 * @created 2020/6/5
 */
import { IListableRow } from 'ws-pkg-list/lib/types';
/**
 * 工作區模組路徑尋找核心函數
 * Core function for finding workspace module paths
 *
 * @param list - 工作區套件列表 / Workspace package list
 * @param cwd - 當前工作目錄 / Current working directory
 * @param dir - 自訂的 node_modules 目錄路徑 / Custom node_modules directory path
 * @returns 包含模組資訊的工作區套件列表 / Workspace package list with module information
 */
export declare function wsFindPackageHasModulesCore(list: IListableRow[], cwd: string, dir?: string): {
    modules: {
        name: string;
        location: string;
    }[];
    manifestLocation: string;
    name: string;
    version: string;
    private: boolean;
    location: string;
}[];
/**
 * 尋找工作區中包含模組的套件
 * Find packages in workspace that contain modules
 *
 * @param cwd - 可選的工作目錄，若未提供則自動尋找工作區根目錄 / Optional working directory, automatically finds workspace root if not provided
 * @param dir - 自訂的 node_modules 目錄路徑 / Custom node_modules directory path
 * @returns 包含模組資訊的工作區套件列表 / Workspace package list with module information
 */
export declare function wsFindPackageHasModules(cwd?: string, dir?: string): {
    modules: {
        name: string;
        location: string;
    }[];
    manifestLocation: string;
    name: string;
    version: string;
    private: boolean;
    location: string;
}[];
export default wsFindPackageHasModules;
