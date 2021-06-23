"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextVersionRecommendedByWorkspacesFindUp = exports.nextVersionRecommendedByWorkspacesProject = void 0;
const tslib_1 = require("tslib");
const index_1 = (0, tslib_1.__importDefault)(require("@yarn-tool/workspaces-project/index"));
const nextVersionRecommended_1 = require("./nextVersionRecommended");
function nextVersionRecommendedByWorkspacesProject(oldVersion, wsProject) {
    return (0, nextVersionRecommended_1.nextVersionRecommended)(oldVersion, wsProject);
}
exports.nextVersionRecommendedByWorkspacesProject = nextVersionRecommendedByWorkspacesProject;
function nextVersionRecommendedByWorkspacesFindUp(oldVersion, options) {
    let wsProject = new index_1.default(options === null || options === void 0 ? void 0 : options.cwd);
    return nextVersionRecommendedByWorkspacesProject(oldVersion, wsProject);
}
exports.nextVersionRecommendedByWorkspacesFindUp = nextVersionRecommendedByWorkspacesFindUp;
//# sourceMappingURL=ws.js.map