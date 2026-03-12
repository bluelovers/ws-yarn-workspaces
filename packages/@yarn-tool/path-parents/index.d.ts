import { IOptions as IOptionsPathParents } from 'path-parents';
/**
 * 選項介面，繼承自 path-parents 的 IOptionsPathParents
 * Options interface, extending IOptionsPathParents from path-parents
 */
export interface IOptions extends IOptionsPathParents {
    /**
     * 是否忽略當前目錄
     * Whether to ignore the current directory
     */
    ignoreCurrentDirectory?: boolean;
}
/**
 * 產生從當前目錄向上搜尋至工作區根目錄的路径序列
 * Generates a sequence of paths from the current directory up to the workspace root
 *
 * @param {string} [cwd] - 起始搜尋目錄，預設為 process.cwd() / Starting directory for search, defaults to process.cwd()
 * @param {IOptions} [options] - 搜尋選項 / Search options
 * @returns {Generator<string>} 路径字串的產生器 / A generator that yields path strings
 */
export declare function pathUpToWorkspacesGenerator(cwd?: string, options?: IOptions): Generator<string, void, unknown>;
/**
 * 獲取從當前目錄向上搜尋至工作區根目錄的路徑列表
 * Gets a list of paths from the current directory up to the workspace root
 *
 * @param {string} [cwd] - 起始搜尋目錄 / Starting directory for search
 * @param {IOptions} [options] - 搜尋選項 / Search options
 * @returns {string[]} 路徑字串陣列 / An array of path strings
 */
export declare function pathUpToWorkspaces(cwd?: string, options?: IOptions): string[];
export default pathUpToWorkspaces;
