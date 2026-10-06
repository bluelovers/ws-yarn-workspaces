"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextVersionRecommendedByWorkspacesProject = nextVersionRecommendedByWorkspacesProject;
exports.nextVersionRecommendedByWorkspacesFindUp = nextVersionRecommendedByWorkspacesFindUp;
const tslib_1 = require("tslib");
/**
 * workspaces 專案的版本推薦入口
 * Version recommendation entry points for workspaces projects
 */
const workspaces_project_1 = tslib_1.__importDefault(require("@yarn-tool/workspaces-project"));
const nextVersionRecommended_1 = require("./nextVersionRecommended");
/**
 * 以既有的 WorkspacesProject 實例計算推薦版本
 * Recommend a version using an existing WorkspacesProject instance
 *
 * 傳入實例而非 cwd，可讓呼叫端重複使用同一實例（避免反覆掃描磁碟）。
 *
 * Accepting an instance instead of a cwd lets callers reuse it and avoid
 * re-scanning the filesystem on every call.
 *
 * @param oldVersion - 舊版本號 / Old version
 * @param wsProject - workspaces 專案實例 / Workspaces project instance
 * @param options - 推薦選項 / Recommendation options
 * @returns 推薦結果 / Recommendation result
 */
function nextVersionRecommendedByWorkspacesProject(oldVersion, wsProject, options) {
    return (0, nextVersionRecommended_1.nextVersionRecommended)(oldVersion, options, wsProject);
}
/**
 * 自 cwd 向上建立 WorkspacesProject 後計算推薦版本
 * Build a WorkspacesProject from cwd upward, then recommend a version
 *
 * 適合不知道 workspaces 根目錄在哪的呼叫端。
 *
 * Suited for callers that do not know where the workspaces root is.
 *
 * @param oldVersion - 舊版本號 / Old version
 * @param options - 推薦選項，cwd 決定搜尋起點 / Recommendation options; cwd sets the search start
 * @returns 推薦結果 / Recommendation result
 */
function nextVersionRecommendedByWorkspacesFindUp(oldVersion, options) {
    let wsProject = new workspaces_project_1.default(options === null || options === void 0 ? void 0 : options.cwd);
    return nextVersionRecommendedByWorkspacesProject(oldVersion, wsProject, options);
}
//# sourceMappingURL=ws.js.map