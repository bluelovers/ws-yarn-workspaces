"use strict";
/**
 * Created by user on 2018/11/28/028.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyStaticFiles = exports.defaultCopyStaticFiles = exports.validateNpmPackageName = exports.getTargetDir = exports.npmVersion = void 0;
const cross_spawn_extra_1 = __importDefault(require("cross-spawn-extra"));
const json5_1 = __importDefault(require("json5"));
const validate_npm_package_name_1 = __importDefault(require("validate-npm-package-name"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const static_file_1 = __importStar(require("@yarn-tool/static-file"));
Object.defineProperty(exports, "defaultCopyStaticFiles", { enumerable: true, get: function () { return static_file_1.defaultCopyStaticFiles; } });
const searchWorkspacePrefixByName_1 = __importDefault(require("./searchWorkspacePrefixByName"));
function npmVersion(npmClient, cwd) {
    let args = [
        'version',
    ];
    npmClient = npmClient || 'npm';
    if (npmClient === 'yarn') {
        args = [
            'versions',
        ];
    }
    let cp = cross_spawn_extra_1.default.sync(npmClient, args, {
        cwd,
        stripAnsi: true,
    });
    if (cp.error) {
        throw cp.error;
    }
    let output = cp.stdout.toString()
        .replace(/^yarn versions [^\n]+$/gm, '')
        .replace(/^Done in [^\n]+$/gm, '')
        .replace(/^\s+|\s+$/g, '');
    let json = json5_1.default.parse(output);
    return json;
}
exports.npmVersion = npmVersion;
function getTargetDir(options) {
    var _a;
    let targetDir;
    let targetName = options.targetName || null;
    let { inputName, cwd, hasWorkspace, workspacePrefix, workspacesConfig } = options;
    if (hasWorkspace && !((_a = workspacesConfig === null || workspacesConfig === void 0 ? void 0 : workspacesConfig.prefix) === null || _a === void 0 ? void 0 : _a.length)) {
        throw new RangeError(`can't found workspace prefix`);
    }
    if (targetName) {
        validateNpmPackageName(targetName, true);
    }
    if (inputName) {
        targetName = targetName || inputName;
        let ret = validateNpmPackageName(inputName, true);
        let name = inputName;
        let basePath;
        if (hasWorkspace) {
            const workspacePrefix = searchWorkspacePrefixByName_1.default({
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
const scopedPackagePattern = new RegExp('^(?:@([^/]+?)[/])?([^/]+?)$');
function validateNpmPackageName(name, throwErr) {
    let ret = validate_npm_package_name_1.default(name);
    ret.name = name;
    if (!ret.errors || !ret.errors.length) {
        const nameMatch = name.match(scopedPackagePattern);
        if (nameMatch) {
            ret.scopedPackagePattern = true;
            ret.user = nameMatch[1];
            ret.subname = nameMatch[2];
        }
        else {
            ret.scopedPackagePattern = false;
        }
    }
    else if (throwErr) {
        throw new RangeError(ret.errors.concat(ret.warnings || []).join(' ; '));
    }
    return ret;
}
exports.validateNpmPackageName = validateNpmPackageName;
function copyStaticFiles(file_map, options) {
    return static_file_1.default({
        ...options,
        file_map,
    });
}
exports.copyStaticFiles = copyStaticFiles;
//# sourceMappingURL=index.js.map