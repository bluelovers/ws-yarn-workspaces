"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextVersionRecommendedByWorkspacesProject = nextVersionRecommendedByWorkspacesProject;
exports.nextVersionRecommendedByWorkspacesFindUp = nextVersionRecommendedByWorkspacesFindUp;
const tslib_1 = require("tslib");
const workspaces_project_1 = tslib_1.__importDefault(require("@yarn-tool/workspaces-project"));
const nextVersionRecommended_1 = require("./nextVersionRecommended");
function nextVersionRecommendedByWorkspacesProject(oldVersion, wsProject) {
    return (0, nextVersionRecommended_1.nextVersionRecommended)(oldVersion, wsProject);
}
function nextVersionRecommendedByWorkspacesFindUp(oldVersion, options) {
    let wsProject = new workspaces_project_1.default(options === null || options === void 0 ? void 0 : options.cwd);
    return nextVersionRecommendedByWorkspacesProject(oldVersion, wsProject);
}
//# sourceMappingURL=ws.js.map