"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYarnIntegrityPath = getYarnIntegrityPath;
exports.yarnListLinkCore = yarnListLinkCore;
exports.yarnListLink = yarnListLink;
const fs_extra_1 = require("fs-extra");
const upath2_1 = require("upath2");
const core_1 = require("find-yarn-workspace-root2/core");
/**
 * 取得指定目錄的 Yarn integrity 檔案路徑
 * Get the Yarn integrity file path for the given directory
 *
 * @param {string} cwd - 專案根目錄 / Project root directory
 * @returns {string} .yarn-integrity 檔案路徑 / Path to the .yarn-integrity file
 */
function getYarnIntegrityPath(cwd) {
    return (0, upath2_1.join)(cwd, 'node_modules', '.yarn-integrity');
}
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
function yarnListLinkCore(cwd) {
    const file = getYarnIntegrityPath(cwd);
    /**
     * integrity 檔案只在 Yarn 執行過後才存在；
     * 不存在時不拋錯而是回傳 undefined，讓呼叫端能自行決定是否視為「無連結」
     * The integrity file only exists after Yarn has run at least once;
     * rather than throwing when it is absent, returning undefined lets callers decide whether that means "no links"
     */
    if ((0, fs_extra_1.existsSync)(file)) {
        let json = (0, fs_extra_1.readJSONSync)(file);
        /**
         * 舊版 Yarn 的 integrity 可能沒有 linkedModules 欄位，
         * 以預設空陣列避免後續 .map 直接炸掉
         * Older Yarn versions may omit the linkedModules field;
         * defaulting to an empty array keeps the later .map from throwing
         */
        let { linkedModules = [] } = json;
        /**
         * 統一轉為 POSIX 風格路徑，讓不同平台的輸出可比較
         * Normalize to POSIX-style paths so output from different platforms stays comparable
         */
        return linkedModules
            .map(v => (0, upath2_1.normalize)(v));
    }
}
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
function yarnListLink(cwd) {
    let root = (0, core_1.findWorkspaceRoot)(cwd);
    /**
     * 找不到根目錄代表此處不是 Yarn 工作區，
     * 續跑只會得到空結果並誤導使用者，因此直接拋錯
     * A missing root means this is not a Yarn workspace;
     * continuing would only return an empty result and mislead the caller, so it throws instead
     */
    if (!root || !(0, fs_extra_1.existsSync)(root)) {
        throw new Error(`can't found current package root`);
    }
    return yarnListLinkCore(root);
}
/**
 * 同時掛上自身與 default 屬性：
 * 讓 `require('yarn-list-link')`、`.default` 與 `import { yarnListLink }`
 * 三種取用方式都能拿到同一個函式
 * Attach the function to itself and to `.default` so `require('yarn-list-link')`,
 * `.default`, and `import { yarnListLink }` all resolve to the same function
 */
yarnListLink.yarnListLink = yarnListLink;
yarnListLink.default = yarnListLink;
exports.default = yarnListLink;
//# sourceMappingURL=core.js.map