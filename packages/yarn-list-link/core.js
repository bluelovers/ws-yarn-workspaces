"use strict";
/**
 * Created by user on 2020/6/5.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.yarnListLink = exports.yarnListLinkCore = exports.getYarnIntegrityPath = void 0;
const fs_extra_1 = require("fs-extra");
const upath2_1 = require("upath2");
const core_1 = __importDefault(require("find-yarn-workspace-root2/core"));
function getYarnIntegrityPath(cwd) {
    return upath2_1.join(cwd, 'node_modules', '.yarn-integrity');
}
exports.getYarnIntegrityPath = getYarnIntegrityPath;
function yarnListLinkCore(cwd) {
    const file = getYarnIntegrityPath(cwd);
    if (fs_extra_1.existsSync(file)) {
        let json = fs_extra_1.readJSONSync(file);
        let { linkedModules = [] } = json;
        return linkedModules
            .map(v => upath2_1.normalize(v));
    }
}
exports.yarnListLinkCore = yarnListLinkCore;
function yarnListLink(cwd) {
    let root = core_1.default(cwd);
    if (!root || !fs_extra_1.existsSync(root)) {
        throw new Error(`can't found current package root`);
    }
    return yarnListLinkCore(root);
}
exports.yarnListLink = yarnListLink;
yarnListLink.yarnListLink = yarnListLink;
yarnListLink.default = yarnListLink;
exports.default = yarnListLink;
//# sourceMappingURL=core.js.map