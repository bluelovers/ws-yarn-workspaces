/**
 * 修復 workspace 內的 yarn link 與套件符號連結
 * Fix yarn links and package symlinks inside a workspace
 *
 * 判定與修復流程：
 * Decision and fix flow:
 * 1. 讀取 workspace 套件列表與已註冊的 yarn link 清單
 *    Load the workspace package list and the registered yarn link list
 * 2. 找出有自行安裝 node_modules 的子套件
 *    Find sub-packages that have their own node_modules
 * 3. 對每個已連結模組比對 workspace 內的實際位置：
 *    Compare each linked module against its actual location in the workspace:
 *    - 位置不同且非符號連結 → 直接重建 symlink
 *      Different location and not a symlink → rebuild the symlink directly
 *    - 屬於已註冊 yarn link → 交給 `yarn link` 補登
 *      Registered yarn link → let `yarn link` re-register it
 *    - 無法判定位置（is_same 為 undefined）→ 標記錯誤，稍後執行 yarn install
 *    - Location undeterminable (is_same is undefined) → flag an error and run
 *      yarn install later
 * 4. 發生錯誤或指定 runYarnAfter 時，於該套件目錄執行 yarn install 復原
 *    On error or when runYarnAfter is set, run yarn install in that package
 *    directory to recover
 *
 * @param {string} [cwd] - workspace 根目錄 / Workspace root directory
 * @param {object} [options] - 修復選項 / Fix options
 * @param {string} [options.dir] - 限定檢查的子目錄 / Sub-directory to restrict the check to
 * @param {boolean} [options.verbose] - 顯示除錯與錯誤訊息 / Show debug and error messages
 * @param {boolean} [options.runYarnAfter] - 每個套件修復後執行 yarn install / Run yarn install after fixing each package
 */
export declare function fixYarnWorkspaceLinks(cwd?: string, options?: {
    dir?: string;
    verbose?: boolean;
    runYarnAfter?: boolean;
}): void;
export default fixYarnWorkspaceLinks;
