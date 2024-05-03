"use strict";
/**
 * Created by user on 2018/5/13/013.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createYarnWorkspaces = createYarnWorkspaces;
exports._createYarnWorkspaces = _createYarnWorkspaces;
exports.createDirByPackages = createDirByPackages;
const tslib_1 = require("tslib");
const upath2_1 = require("upath2");
const logger_1 = require("debug-color2/logger");
const static_file_1 = require("@yarn-tool/static-file");
const fs_extra_1 = require("fs-extra");
const sort_package_json3_1 = require("sort-package-json3");
const lib_1 = require("./lib");
const util_1 = require("./lib/util");
const wsCopyStaticFiles_1 = require("@yarn-tool/static-file/lib/ws/wsCopyStaticFiles");
const find_root_1 = require("@yarn-tool/find-root");
const upath2_2 = require("upath2");
tslib_1.__exportStar(require("./lib/index"), exports);
tslib_1.__exportStar(require("./lib/util"), exports);
function createYarnWorkspaces(cwd, options = {}) {
    var _a;
    if (cwd && typeof cwd != 'string') {
        options = cwd;
        cwd = options.cwd;
    }
    cwd !== null && cwd !== void 0 ? cwd : (cwd = process.cwd());
    const rootData = (0, find_root_1.findRootLazy)({
        cwd,
    });
    cwd = (0, upath2_2.normalize)((_a = rootData === null || rootData === void 0 ? void 0 : rootData.cwd) !== null && _a !== void 0 ? _a : cwd);
    let root = rootData === null || rootData === void 0 ? void 0 : rootData.pkg;
    let ws = rootData === null || rootData === void 0 ? void 0 : rootData.ws;
    let targetPath = (0, upath2_1.resolve)(root || cwd);
    options.debug && logger_1.consoleLogger.debug({
        targetPath,
        ws,
        options,
    });
    if (!options.ignoreExistsPackage && root) {
        logger_1.consoleLogger.error(`already have package at "${root}", or use ignoreExistsPackage for overwrite it`);
        return false;
    }
    else if (root) {
        logger_1.consoleLogger.warn(`ignore exists package "${root}"`);
    }
    if (ws) {
        let bool = !(0, util_1.isSamePath)(targetPath, ws);
        logger_1.consoleLogger.warn(`detect exists workspace "${ws}"`);
        if (bool) {
            if (options.ignoreParentWorkspaces) {
                logger_1.consoleLogger.warn(`ignoreParentWorkspaces = true`);
                bool = false;
            }
            else {
                logger_1.consoleLogger.error(`target path already is workspace`);
            }
        }
        if (bool) {
            return false;
        }
    }
    return _createYarnWorkspaces(targetPath);
}
function _createYarnWorkspaces(targetPath, options = {}) {
    logger_1.consoleLogger.info(`create in target path "${targetPath}"`);
    let pkg;
    let lerna;
    {
        let file = (0, upath2_1.join)(targetPath, 'lerna.json');
        if ((0, fs_extra_1.existsSync)(file)) {
            let json = JSON.parse((0, fs_extra_1.readFileSync)(file).toString());
            if (json.packages && !Object.keys(json.packages).length) {
                json.packages = undefined;
            }
            lerna = json;
        }
    }
    let packages = lerna && lerna.packages || [
        "packages/*",
    ];
    let file = (0, upath2_1.join)(targetPath, 'package.json');
    if (!(0, fs_extra_1.existsSync)(file)) {
        let name = (0, upath2_1.basename)(targetPath);
        if (!(0, fs_extra_1.existsSync)(targetPath)) {
            (0, fs_extra_1.mkdirSync)(targetPath);
        }
        pkg = Object.assign((0, lib_1.getDefaultPackageJson)(name), {
            name,
            workspaces: packages,
        });
        if (options.initPackageJson) {
            let ret = options.initPackageJson(pkg);
            if (ret) {
                pkg = ret;
            }
        }
    }
    else {
        let json = JSON.parse((0, fs_extra_1.readFileSync)(file).toString());
        let workspaces;
        if (json.workspaces && Object.keys(json.workspaces).length) {
            workspaces = json.workspaces;
            // https://yarnpkg.com/blog/2018/02/15/nohoist/
            // @ts-ignore
            packages = workspaces.packages || workspaces;
        }
        else {
            workspaces = packages;
        }
        pkg = Object.assign(json, {
            "private": true,
            "workspaces": workspaces,
        });
        pkg.resolutions = pkg.resolutions || {};
        Object.entries((0, lib_1.getDefaultPackageJson)(json.name))
            .forEach(([field, value]) => {
            var _a, _b;
            if (field === 'scripts') {
                (_a = pkg.scripts) !== null && _a !== void 0 ? _a : (pkg.scripts = {});
                pkg.scripts = {
                    ...value,
                    ...pkg.scripts,
                };
            }
            else {
                (_b = pkg[field]) !== null && _b !== void 0 ? _b : (pkg[field] = value);
            }
        });
    }
    let s = JSON.stringify((0, sort_package_json3_1.sortPackageJson)(pkg), null, 2);
    (0, fs_extra_1.writeFileSync)(file, s);
    logger_1.consoleLogger.success(`create workspace package.json`);
    if (lerna && (packages != lerna.packages || lerna.npmClient !== 'yarn' || lerna.useWorkspaces !== true)) {
        let file = (0, upath2_1.join)(targetPath, 'lerna.json');
        lerna.packages = packages;
        lerna.npmClient = 'yarn';
        lerna.useWorkspaces = true;
        let s = JSON.stringify((0, sort_package_json3_1.sortPackageJson)(lerna), null, 2);
        (0, fs_extra_1.writeFileSync)(file, s);
        logger_1.consoleLogger.info(`update lerna.json`);
    }
    const file_map = (0, wsCopyStaticFiles_1.getWsCopyStaticFiles)();
    (0, static_file_1.copyStaticFiles)({
        cwd: targetPath,
        file_map,
    });
    createDirByPackages(targetPath, packages);
    return true;
}
function createDirByPackages(cwd, packages) {
    return packages.some(function (value) {
        let bool;
        let s = value.split(/[\/\\]/)[0];
        if (!/[!?\*{}\[\]]/.test(s)) {
            let dir = (0, upath2_1.join)(cwd, s);
            if (!(0, fs_extra_1.existsSync)(dir)) {
                (0, fs_extra_1.mkdirSync)(dir);
            }
            return true;
        }
        return bool;
    });
}
exports.default = createYarnWorkspaces;
//# sourceMappingURL=index.js.map