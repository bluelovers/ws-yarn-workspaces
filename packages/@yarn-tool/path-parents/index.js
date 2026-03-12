"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathUpToWorkspacesGenerator = pathUpToWorkspacesGenerator;
exports.pathUpToWorkspaces = pathUpToWorkspaces;
const path_parents_1 = require("path-parents");
const find_root_1 = require("@yarn-tool/find-root");
const upath2_1 = require("upath2");
const path_is_same_1 = require("path-is-same");
/**
 * 產生從當前目錄向上搜尋至工作區根目錄的路径序列
 * Generates a sequence of paths from the current directory up to the workspace root
 *
 * @param {string} [cwd] - 起始搜尋目錄，預設為 process.cwd() / Starting directory for search, defaults to process.cwd()
 * @param {IOptions} [options] - 搜尋選項 / Search options
 * @returns {Generator<string>} 路径字串的產生器 / A generator that yields path strings
 */
function* pathUpToWorkspacesGenerator(cwd, options) {
    // 解析起始路徑，若未提供則使用當前工作目錄
    // Resolve the starting path, using the current working directory if not provided
    cwd = (0, upath2_1.resolve)(cwd !== null && cwd !== void 0 ? cwd : process.cwd());
    // 尋找專案根目錄與工作區資訊
    // Find project root and workspace information
    let { root, isWorkspace, hasWorkspace, } = (0, find_root_1.findRoot)({
        cwd,
    });
    // 若未設定忽略當前目錄，則優先回傳當前目錄
    // Yield the current directory first if ignoreCurrentDirectory is not set
    if (!(options === null || options === void 0 ? void 0 : options.ignoreCurrentDirectory)) {
        yield cwd;
    }
    // 如果找到了根目錄且當前目錄不是根目錄，則開始向上遍歷父目錄
    // If a root is found and the current directory is not the root, start traversing parent directories
    if (root.length && !(0, path_is_same_1.pathIsSame)(cwd, root)) {
        for (let current of (0, path_parents_1.pathParentsGenerator)(cwd, options)) {
            if (current === null || current === void 0 ? void 0 : current.length) {
                yield current;
                // 當遍歷到根目錄時停止
                // Stop when the root directory is reached
                if ((0, path_is_same_1.pathIsSame)(current, root)) {
                    break;
                }
            }
        }
    }
}
/**
 * 獲取從當前目錄向上搜尋至工作區根目錄的路徑列表
 * Gets a list of paths from the current directory up to the workspace root
 *
 * @param {string} [cwd] - 起始搜尋目錄 / Starting directory for search
 * @param {IOptions} [options] - 搜尋選項 / Search options
 * @returns {string[]} 路徑字串陣列 / An array of path strings
 */
function pathUpToWorkspaces(cwd, options) {
    return [...pathUpToWorkspacesGenerator(cwd, options)];
}
exports.default = pathUpToWorkspaces;
//# sourceMappingURL=index.js.map