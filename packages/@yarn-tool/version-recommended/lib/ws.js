"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextVersionRecommendedByWorkspacesFindUp = exports.nextVersionRecommendedByWorkspacesProject = void 0;
const index_1 = __importDefault(require("@yarn-tool/workspaces-project/index"));
const nextVersionRecommended_1 = require("./nextVersionRecommended");
function nextVersionRecommendedByWorkspacesProject(oldVersion, wsProject) {
    return nextVersionRecommended_1.nextVersionRecommended(oldVersion, wsProject);
}
exports.nextVersionRecommendedByWorkspacesProject = nextVersionRecommendedByWorkspacesProject;
function nextVersionRecommendedByWorkspacesFindUp(oldVersion, options) {
    let wsProject = new index_1.default(options === null || options === void 0 ? void 0 : options.cwd);
    return nextVersionRecommendedByWorkspacesProject(oldVersion, wsProject);
}
exports.nextVersionRecommendedByWorkspacesFindUp = nextVersionRecommendedByWorkspacesFindUp;
//# sourceMappingURL=ws.js.map