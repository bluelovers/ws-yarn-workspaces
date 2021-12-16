"use strict";
/**
 * Created by user on 2020/6/15.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const git_tag_1 = require("./lib/git-tag");
tslib_1.__exportStar(require("./lib/types"), exports);
tslib_1.__exportStar(require("./lib/core"), exports);
tslib_1.__exportStar(require("./lib/git-tag"), exports);
exports.default = git_tag_1.gitPackageTag;
//# sourceMappingURL=index.js.map