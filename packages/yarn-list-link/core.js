"use strict";
/**
 * Created by user on 2020/6/5.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.yarnListLink = exports.yarnListLinkCore = exports.getYarnIntegrityPath = void 0;
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const upath2_1 = require("upath2");
const core_1 = tslib_1.__importDefault(require("find-yarn-workspace-root2/core"));
function getYarnIntegrityPath(cwd) {
    return (0, upath2_1.join)(cwd, 'node_modules', '.yarn-integrity');
}
exports.getYarnIntegrityPath = getYarnIntegrityPath;
function yarnListLinkCore(cwd) {
    const file = getYarnIntegrityPath(cwd);
    if ((0, fs_extra_1.existsSync)(file)) {
        let json = (0, fs_extra_1.readJSONSync)(file);
        let { linkedModules = [] } = json;
        return linkedModules
            .map(v => (0, upath2_1.normalize)(v));
    }
}
exports.yarnListLinkCore = yarnListLinkCore;
function yarnListLink(cwd) {
    let root = (0, core_1.default)(cwd);
    if (!root || !(0, fs_extra_1.existsSync)(root)) {
        throw new Error(`can't found current package root`);
    }
    return yarnListLinkCore(root);
}
exports.yarnListLink = yarnListLink;
yarnListLink.yarnListLink = yarnListLink;
yarnListLink.default = yarnListLink;
exports.default = yarnListLink;
//# sourceMappingURL=core.js.map