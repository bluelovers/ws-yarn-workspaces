"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextVersionRecommendedByWorkspacesProject = nextVersionRecommendedByWorkspacesProject;
exports.nextVersionRecommendedByWorkspacesFindUp = nextVersionRecommendedByWorkspacesFindUp;
const tslib_1 = require("tslib");
const workspaces_project_1 = tslib_1.__importDefault(require("@yarn-tool/workspaces-project"));
const nextVersionRecommended_1 = require("./nextVersionRecommended");
/**
 * 以既有的 WorkspacesProject 實例計算推薦版本
 *
 * 傳入實例而非 cwd，可讓呼叫端重複使用同一實例（避免反覆掃描磁碟）。
 *
 * @param oldVersion - 舊版本號
 * @param wsProject - workspaces 專案實例
 * @param options - 推薦選項
 * @returns 推薦結果
 */
function nextVersionRecommendedByWorkspacesProject(oldVersion, wsProject, options) {
    return (0, nextVersionRecommended_1.nextVersionRecommended)(oldVersion, options, wsProject);
}
/**
 * 自 cwd 向上建立 WorkspacesProject 後計算推薦版本
 *
 * 適合不知道 workspaces 根目錄在哪的呼叫端。
 *
 * @param oldVersion - 舊版本號
 * @param options - 推薦選項，cwd 決定搜尋起點
 * @returns 推薦結果
 */
function nextVersionRecommendedByWorkspacesFindUp(oldVersion, options) {
    let wsProject = new workspaces_project_1.default(options === null || options === void 0 ? void 0 : options.cwd);
    return nextVersionRecommendedByWorkspacesProject(oldVersion, wsProject, options);
}
//# sourceMappingURL=ws.js.map