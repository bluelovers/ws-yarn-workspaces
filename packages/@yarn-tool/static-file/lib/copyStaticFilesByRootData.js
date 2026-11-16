"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCopyStaticFilesOptionsByRootData = getCopyStaticFilesOptionsByRootData;
const wsCopyStaticFiles_1 = require("./ws/wsCopyStaticFiles");
const getRootCopyStaticFiles_1 = require("./root/getRootCopyStaticFiles");
/**
 * 依 rootData 產生 copyStaticFiles 的參數
 *
 * 判定規則（對應 fix-all 與 npm-init2 的既有用法）：
 *
 * 1. 目標目錄：未覆寫 cwd 時，有 workspace 取 ws、否則取 root
 * 2. file_map：未覆寫 cwd 且有 workspace 時使用 workspace 清單 (getWsCopyStaticFiles)，
 *    其餘使用套件清單 (getRootCopyStaticFilesAuto)，旗標 hasWorkspace / isRoot 可覆寫
 * 3. ignoreFilesSnapshot 僅在提供時帶入，未提供不產生該鍵
 *
 * 本函式只產生參數，不寫入任何檔案；是否啟用複製
 * （addStaticFiles / noStaticFiles / resetStaticFiles）仍由呼叫端以 _isAddStaticFilesOrReset 決定。
 *
 * @param {ICopyStaticFilesRootData} rootData - 專案根目錄資訊
 * @param {ICopyStaticFilesByRootDataOptions} [opts] - 覆寫選項
 * @returns {ICopyStaticFilesOptions} 可直接傳給 copyStaticFiles 的參數物件
 *
 * @example
 * const options = getCopyStaticFilesOptionsByRootData(rootData, { ignoreFilesSnapshot });
 * copyStaticFiles(options);
 */
function getCopyStaticFilesOptionsByRootData(rootData, opts) {
    const { cwd, file_map, ignoreFilesSnapshot, hasWorkspace = rootData.hasWorkspace, isRoot = rootData.isRoot, isPkg = rootData.isPkg, ...rest } = opts !== null && opts !== void 0 ? opts : {};
    /**
     * 是否由呼叫端指定目標目錄；
     * true 代表複製目標是呼叫端自己的目錄（npm-init2 的 targetDir），
     * 此時不適用「複製到 workspace 根目錄」的分支
     */
    const cwdOverridden = cwd !== undefined;
    /**
     * 有 workspace 時 fix-all 已先 refind，故目標即為 ws 根目錄
     */
    const target = cwdOverridden ? cwd : (rootData.hasWorkspace ? rootData.ws : rootData.root);
    /**
     * 目標為 workspace 根目錄時才使用 workspace 清單，否則用套件清單
     */
    const map = file_map !== null && file_map !== void 0 ? file_map : (!cwdOverridden && rootData.hasWorkspace
        ? (0, wsCopyStaticFiles_1.getWsCopyStaticFiles)()
        : (0, getRootCopyStaticFiles_1.getRootCopyStaticFilesAuto)({ hasWorkspace, isRoot, isPkg }));
    const options = {
        ...rest,
        cwd: target,
        file_map: map,
        ...(ignoreFilesSnapshot ? { ignoreFilesSnapshot } : {}),
    };
    return options;
}
//# sourceMappingURL=copyStaticFilesByRootData.js.map