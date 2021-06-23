"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkToNodeModules = exports.linkToNodeModulesCore = void 0;
const fs_extra_1 = require("fs-extra");
const upath2_1 = require("upath2");
const find_root_1 = require("@yarn-tool/find-root");
const core_1 = require("find-yarn-workspace-root2/core");
function linkToNodeModulesCore(options) {
    let resultPath = (0, upath2_1.join)(options.targetNodeModulesPath, options.name);
    (0, fs_extra_1.ensureDirSync)((0, upath2_1.dirname)(resultPath));
    (0, fs_extra_1.ensureSymlinkSync)(options.sourcePackagePath, resultPath);
    return {
        ...options,
        resultPath,
    };
}
exports.linkToNodeModulesCore = linkToNodeModulesCore;
function linkToNodeModules(options) {
    var _a, _b, _c, _d, _e;
    options !== null && options !== void 0 ? options : (options = {});
    (_a = options.cwd) !== null && _a !== void 0 ? _a : (options.cwd = process.cwd());
    if (!options.sourcePackagePath || !options.targetNodeModulesPath) {
        let rootData = (0, find_root_1.findRoot)(options);
        (_b = options.sourcePackagePath) !== null && _b !== void 0 ? _b : (options.sourcePackagePath = rootData.pkg);
        (_c = options.targetNodeModulesPath) !== null && _c !== void 0 ? _c : (options.targetNodeModulesPath = (0, upath2_1.join)(rootData.root, (_d = options.targetNodeModulesName) !== null && _d !== void 0 ? _d : 'node_modules'));
    }
    (_e = options.name) !== null && _e !== void 0 ? _e : (options.name = (0, core_1.readPackageJSON)(options.sourcePackagePath).name);
    return linkToNodeModulesCore(options);
}
exports.linkToNodeModules = linkToNodeModules;
exports.default = linkToNodeModules;
//# sourceMappingURL=index.js.map