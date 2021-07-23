"use strict";
/**
 * Created by user on 2018/5/13/013.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDirByPackages = exports._createYarnWorkspaces = exports.createYarnWorkspaces = void 0;
const tslib_1 = require("tslib");
const core_1 = (0, tslib_1.__importDefault)(require("find-yarn-workspace-root2/core"));
const path_1 = require("path");
const pkg_dir_1 = (0, tslib_1.__importDefault)(require("pkg-dir"));
const logger_1 = (0, tslib_1.__importDefault)(require("debug-color2/logger"));
const static_file_1 = require("@yarn-tool/static-file");
const fs_extra_1 = require("fs-extra");
const sort_package_json3_1 = (0, tslib_1.__importDefault)(require("sort-package-json3"));
const lib_1 = require("./lib");
const util_1 = require("./lib/util");
const wsCopyStaticFiles_1 = (0, tslib_1.__importDefault)(require("./lib/wsCopyStaticFiles"));
(0, tslib_1.__exportStar)(require("./lib/index"), exports);
(0, tslib_1.__exportStar)(require("./lib/util"), exports);
function createYarnWorkspaces(cwd, options = {}) {
    if (cwd && typeof cwd != 'string') {
        options = cwd;
        cwd = options.cwd;
    }
    if (!cwd) {
        cwd = process.cwd();
    }
    cwd = (0, path_1.resolve)(cwd);
    let root = pkg_dir_1.default.sync(cwd);
    let ws;
    try {
        // @FIXME 一個奇怪的BUG 不使用 try 的話 在 NPX 底下就會出現無訊息的停止
        ws = (0, core_1.default)(root);
    }
    catch (e) {
        logger_1.default.log(e.toString());
        ws = null;
    }
    let targetPath = (0, path_1.resolve)(root || cwd);
    options.debug && logger_1.default.debug({
        targetPath,
        ws,
        options,
    });
    if (!options.ignoreExistsPackage && root) {
        logger_1.default.error(`already have package at "${root}", or use ignoreExistsPackage for overwrite it`);
        return false;
    }
    else if (root) {
        logger_1.default.warn(`ignore exists package "${root}"`);
    }
    if (ws) {
        let bool = true;
        logger_1.default.warn(`detect exists workspace "${ws}"`);
        if (options.ignoreParentWorkspaces) {
            bool = (0, util_1.isSamePath)(targetPath, ws);
            if (!bool) {
                logger_1.default.warn(`ignoreParentWorkspaces = true`);
            }
            else {
                logger_1.default.error(`target path already is workspace`);
            }
        }
        if (bool) {
            return false;
        }
    }
    return _createYarnWorkspaces(targetPath);
}
exports.createYarnWorkspaces = createYarnWorkspaces;
function _createYarnWorkspaces(targetPath, options = {}) {
    logger_1.default.info(`create in target path "${targetPath}"`);
    let pkg;
    let lerna;
    {
        let file = (0, path_1.join)(targetPath, 'lerna.json');
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
    let file = (0, path_1.join)(targetPath, 'package.json');
    if (!(0, fs_extra_1.existsSync)(file)) {
        let name = (0, path_1.basename)(targetPath);
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
    }
    let s = JSON.stringify((0, sort_package_json3_1.default)(pkg), null, 2);
    (0, fs_extra_1.writeFileSync)(file, s);
    logger_1.default.success(`create workspace package.json`);
    if (lerna && (packages != lerna.packages || lerna.npmClient !== 'yarn' || lerna.useWorkspaces !== true)) {
        let file = (0, path_1.join)(targetPath, 'lerna.json');
        lerna.packages = packages;
        lerna.npmClient = 'yarn';
        lerna.useWorkspaces = true;
        let s = JSON.stringify((0, sort_package_json3_1.default)(lerna), null, 2);
        (0, fs_extra_1.writeFileSync)(file, s);
        logger_1.default.info(`update lerna.json`);
    }
    const file_map = (0, wsCopyStaticFiles_1.default)();
    (0, static_file_1.copyStaticFiles)({
        cwd: targetPath,
        file_map,
    });
    createDirByPackages(targetPath, packages);
    return true;
}
exports._createYarnWorkspaces = _createYarnWorkspaces;
function createDirByPackages(cwd, packages) {
    return packages.some(function (value) {
        let bool;
        let s = value.split(/[\/\\]/)[0];
        if (!/[!?\*{}\[\]]/.test(s)) {
            let dir = (0, path_1.join)(cwd, s);
            if (!(0, fs_extra_1.existsSync)(dir)) {
                (0, fs_extra_1.mkdirSync)(dir);
            }
            return true;
        }
        return bool;
    });
}
exports.createDirByPackages = createDirByPackages;
exports.default = createYarnWorkspaces;
//# sourceMappingURL=index.js.map