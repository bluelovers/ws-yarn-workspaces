"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTargetDir = void 0;
const validate_npm_package_name_1 = require("@yarn-tool/validate-npm-package-name");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const search_workspace_prefix_by_name_1 = __importDefault(require("@yarn-tool/search-workspace-prefix-by-name"));
function getTargetDir(options) {
    var _a;
    let targetDir;
    let targetName = options.targetName || null;
    let { inputName, cwd, hasWorkspace, workspacePrefix, workspacesConfig } = options;
    if (hasWorkspace && !((_a = workspacesConfig === null || workspacesConfig === void 0 ? void 0 : workspacesConfig.prefix) === null || _a === void 0 ? void 0 : _a.length)) {
        throw new RangeError(`can't found workspace prefix`);
    }
    if (targetName) {
        validate_npm_package_name_1.validateNpmPackageName(targetName, true);
    }
    if (inputName) {
        targetName = targetName || inputName;
        let ret = validate_npm_package_name_1.validateNpmPackageName(inputName, true);
        let name = inputName;
        let basePath;
        if (hasWorkspace) {
            const workspacePrefix = search_workspace_prefix_by_name_1.default({
                inputName,
                workspacesConfig,
            });
            basePath = path_1.join(hasWorkspace, workspacePrefix);
        }
        else {
            basePath = cwd;
        }
        if (ret.scopedPackagePattern) {
            name = name
                .replace(/[\/\\]+/g, '_')
                .replace(/^@/g, '');
            if (!fs_extra_1.pathExistsSync(path_1.join(basePath, ret.subname))) {
                name = ret.subname;
            }
        }
        targetDir = path_1.resolve(basePath, name);
    }
    else {
        targetDir = cwd;
    }
    return {
        targetDir,
        targetName,
        cwd,
    };
}
exports.getTargetDir = getTargetDir;
exports.default = getTargetDir;
//# sourceMappingURL=index.js.map