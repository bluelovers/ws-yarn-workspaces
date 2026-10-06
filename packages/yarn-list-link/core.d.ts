/**
 * yarn link 清單核心實作
 * Core implementation of the yarn link listing
 *
 * 資料來源為 Yarn 寫在 node_modules/.yarn-integrity 的 linkedModules 欄位，
 * 因此不必啟動 Yarn 也能取得已連結的模組。
 * The data comes from the linkedModules field Yarn writes into node_modules/.yarn-integrity,
 * so linked modules can be listed without spawning Yarn.
 *
 * Created by user on 2020/6/5.
 */
/**
 * 取得指定目錄的 Yarn integrity 檔案路徑
 * Get the Yarn integrity file path for the given directory
 *
 * @param {string} cwd - 專案根目錄 / Project root directory
 * @returns {string} .yarn-integrity 檔案路徑 / Path to the .yarn-integrity file
 */
export declare function getYarnIntegrityPath(cwd: string): string;
/**
 * 直接以 cwd 作為根目錄讀取連結清單
 * Read the linked module list using cwd directly as the root
 *
 * 與 yarnListLink 的差異在於不會向上尋找工作區根目錄，
 * 適合已確知根目錄位置的呼叫端。
 * Unlike yarnListLink this does not search upward for the workspace root,
 * which suits callers that already know where the root is.
 *
 * @param {string} cwd - 專案根目錄 / Project root directory
 * @returns {string[]} 已連結模組的正規化路徑；找不到 integrity 檔案時回傳 undefined
 * Normalized paths of linked modules; returns undefined when the integrity file is missing
 */
export declare function yarnListLinkCore(cwd: string): string[];
/**
 * 列出目前工作區的 yarn link 清單
 * List the yarn links of the current workspace
 *
 * 先向上尋找工作區根目錄，再讀取該根目錄的連結，
 * 因此在工作區的任何子目錄執行都會得到相同結果。
 * It first finds the workspace root and then reads that root's links,
 * so running it from any subdirectory of the workspace yields the same result.
 *
 * @param {string} cwd - 起始目錄 / Starting directory
 * @returns {string[]} 已連結模組的正規化路徑 / Normalized paths of linked modules
 * @throws {Error} 找不到工作區根目錄或根目錄不存在時 / When no workspace root is found or it does not exist
 */
export declare function yarnListLink(cwd: string): string[];
export declare namespace yarnListLink {
    export var yarnListLink: typeof import("./core").yarnListLink;
    var _a: typeof import("./core").yarnListLink;
    export { _a as default };
}
export default yarnListLink;
