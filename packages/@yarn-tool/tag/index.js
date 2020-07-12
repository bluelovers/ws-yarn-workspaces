"use strict";
/**
 * Created by user on 2020/6/15.
 */
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
const git_tag_1 = require("./lib/git-tag");
__exportStar(require("./lib/types"), exports);
__exportStar(require("./lib/core"), exports);
__exportStar(require("./lib/git-tag"), exports);
exports.default = git_tag_1.gitPackageTag;
//# sourceMappingURL=index.js.map