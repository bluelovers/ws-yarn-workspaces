"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextVersionRecommendedByPackageFindUp = exports.nextVersionRecommendedByPackage = exports.nextVersionRecommendedByWorkspacesProject = exports.nextVersionRecommendedByWorkspacesFindUp = exports.nextVersionRecommended = void 0;
const nextVersionRecommended_1 = require("./lib/nextVersionRecommended");
Object.defineProperty(exports, "nextVersionRecommended", { enumerable: true, get: function () { return nextVersionRecommended_1.nextVersionRecommended; } });
const ws_1 = require("./lib/ws");
Object.defineProperty(exports, "nextVersionRecommendedByWorkspacesProject", { enumerable: true, get: function () { return ws_1.nextVersionRecommendedByWorkspacesProject; } });
Object.defineProperty(exports, "nextVersionRecommendedByWorkspacesFindUp", { enumerable: true, get: function () { return ws_1.nextVersionRecommendedByWorkspacesFindUp; } });
const pkg_1 = require("./lib/pkg");
Object.defineProperty(exports, "nextVersionRecommendedByPackage", { enumerable: true, get: function () { return pkg_1.nextVersionRecommendedByPackage; } });
Object.defineProperty(exports, "nextVersionRecommendedByPackageFindUp", { enumerable: true, get: function () { return pkg_1.nextVersionRecommendedByPackageFindUp; } });
__exportStar(require("./lib/types"), exports);
exports.default = pkg_1.nextVersionRecommendedByPackageFindUp;
//# sourceMappingURL=index.js.map