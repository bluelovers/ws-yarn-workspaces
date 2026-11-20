"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextVersionRecommendedByPackageFindUp = exports.nextVersionRecommendedByPackage = exports.nextVersionRecommendedByWorkspacesProject = exports.nextVersionRecommendedByWorkspacesFindUp = exports.nextVersionRecommended = void 0;
const tslib_1 = require("tslib");
/**
 * 套件主要入口：重新匯出所有版本推薦 API
 *
 * 這裡刻意只做轉出而不含邏輯，讓 tree-shaking 與文件工具
 * 能把實作細節留在 lib/ 各模組中。
 */
const nextVersionRecommended_1 = require("./lib/nextVersionRecommended");
Object.defineProperty(exports, "nextVersionRecommended", { enumerable: true, get: function () { return nextVersionRecommended_1.nextVersionRecommended; } });
const ws_1 = require("./lib/ws");
Object.defineProperty(exports, "nextVersionRecommendedByWorkspacesProject", { enumerable: true, get: function () { return ws_1.nextVersionRecommendedByWorkspacesProject; } });
Object.defineProperty(exports, "nextVersionRecommendedByWorkspacesFindUp", { enumerable: true, get: function () { return ws_1.nextVersionRecommendedByWorkspacesFindUp; } });
const pkg_1 = require("./lib/pkg");
Object.defineProperty(exports, "nextVersionRecommendedByPackage", { enumerable: true, get: function () { return pkg_1.nextVersionRecommendedByPackage; } });
Object.defineProperty(exports, "nextVersionRecommendedByPackageFindUp", { enumerable: true, get: function () { return pkg_1.nextVersionRecommendedByPackageFindUp; } });
tslib_1.__exportStar(require("./lib/types"), exports);
/**
 * 預設匯出為「自動向上尋找 package.json」的版本，
 * 因為多數 CLI 場景不需要手動提供版本字串
 */
exports.default = pkg_1.nextVersionRecommendedByPackageFindUp;
//# sourceMappingURL=index.js.map