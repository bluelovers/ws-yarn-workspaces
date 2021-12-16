"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextVersionRecommendedByPackageFindUp = exports.nextVersionRecommendedByPackage = exports.nextVersionRecommendedByWorkspacesProject = exports.nextVersionRecommendedByWorkspacesFindUp = exports.nextVersionRecommended = void 0;
const tslib_1 = require("tslib");
const nextVersionRecommended_1 = require("./lib/nextVersionRecommended");
Object.defineProperty(exports, "nextVersionRecommended", { enumerable: true, get: function () { return nextVersionRecommended_1.nextVersionRecommended; } });
const ws_1 = require("./lib/ws");
Object.defineProperty(exports, "nextVersionRecommendedByWorkspacesProject", { enumerable: true, get: function () { return ws_1.nextVersionRecommendedByWorkspacesProject; } });
Object.defineProperty(exports, "nextVersionRecommendedByWorkspacesFindUp", { enumerable: true, get: function () { return ws_1.nextVersionRecommendedByWorkspacesFindUp; } });
const pkg_1 = require("./lib/pkg");
Object.defineProperty(exports, "nextVersionRecommendedByPackage", { enumerable: true, get: function () { return pkg_1.nextVersionRecommendedByPackage; } });
Object.defineProperty(exports, "nextVersionRecommendedByPackageFindUp", { enumerable: true, get: function () { return pkg_1.nextVersionRecommendedByPackageFindUp; } });
tslib_1.__exportStar(require("./lib/types"), exports);
exports.default = pkg_1.nextVersionRecommendedByPackageFindUp;
//# sourceMappingURL=index.js.map