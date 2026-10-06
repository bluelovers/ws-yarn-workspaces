"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * 套件入口：轉出標籤相關 API
 * Package entry: re-export the tagging API
 *
 * 預設匯出 gitPackageTag，因為此套件的多數使用情境
 * 就是「對目前套件建立標籤」單一操作。
 * The default export is gitPackageTag because the commonest use of this
 * package is the single operation "tag the current package".
 */
const git_tag_1 = require("./lib/git-tag");
tslib_1.__exportStar(require("./lib/types"), exports);
tslib_1.__exportStar(require("./lib/core"), exports);
tslib_1.__exportStar(require("./lib/git-tag"), exports);
exports.default = git_tag_1.gitPackageTag;
//# sourceMappingURL=index.js.map