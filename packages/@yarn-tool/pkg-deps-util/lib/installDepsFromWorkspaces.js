"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installDepsFromWorkspaces = void 0;
const listable_1 = require("ws-pkg-list/lib/listable");
const find_root_1 = require("@yarn-tool/find-root");
const package_dts_1 = require("@ts-type/package-dts");
const path_1 = require("path");
const npm_package_arg_util_1 = __importDefault(require("@yarn-tool/npm-package-arg-util"));
const core_1 = __importDefault(require("sort-object-keys2/core"));
function installDepsFromWorkspaces(packageNames, options = {}) {
    var _a, _b, _c, _d, _e, _f;
    const cwd = (_a = options.cwd) !== null && _a !== void 0 ? _a : (options.cwd = process.cwd());
    options = {
        ...options,
        cwd,
        throwError: true,
        skipCheckWorkspace: false,
        shouldHasWorkspaces: true,
        shouldNotWorkspacesRoot: true,
    };
    const rootData = find_root_1.findRoot(options);
    find_root_1.assertHasAndNotWorkspacesRoot(rootData);
    const pkg = (_b = options.pkg) !== null && _b !== void 0 ? _b : package_dts_1.readPackageJson(path_1.join(rootData.pkg, 'package.json'));
    const record = listable_1.wsPkgListable(rootData.root)
        .reduce((a, b) => {
        a[b.name] = b;
        return a;
    }, {});
    const added = [];
    const exists = [];
    const others = packageNames
        .filter(packageName => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const result = npm_package_arg_util_1.default(packageName);
        const { name } = result;
        const row = record[name];
        if (row) {
            const semver = `^${row.version}`;
            let bool = null;
            if (options.dev) {
                if (!((_b = (_a = pkg.devDependencies) === null || _a === void 0 ? void 0 : _a[name]) === null || _b === void 0 ? void 0 : _b.length)) {
                    (_c = pkg.devDependencies) !== null && _c !== void 0 ? _c : (pkg.devDependencies = {});
                    pkg.devDependencies[name] = semver;
                    bool = false;
                }
                else {
                    bool !== null && bool !== void 0 ? bool : (bool = true);
                }
            }
            if (options.peer) {
                if (!((_e = (_d = pkg.peerDependencies) === null || _d === void 0 ? void 0 : _d[name]) === null || _e === void 0 ? void 0 : _e.length)) {
                    (_f = pkg.peerDependencies) !== null && _f !== void 0 ? _f : (pkg.peerDependencies = {});
                    pkg.peerDependencies[name] = semver;
                    bool = false;
                }
                else {
                    bool !== null && bool !== void 0 ? bool : (bool = true);
                }
            }
            if (options.optional) {
                if (!((_h = (_g = pkg.optionalDependencies) === null || _g === void 0 ? void 0 : _g[name]) === null || _h === void 0 ? void 0 : _h.length)) {
                    (_j = pkg.optionalDependencies) !== null && _j !== void 0 ? _j : (pkg.optionalDependencies = {});
                    pkg.optionalDependencies[name] = semver;
                    bool = false;
                }
                else {
                    bool !== null && bool !== void 0 ? bool : (bool = true);
                }
            }
            if (bool === null) {
                if (!((_l = (_k = pkg.dependencies) === null || _k === void 0 ? void 0 : _k[name]) === null || _l === void 0 ? void 0 : _l.length)) {
                    (_m = pkg.dependencies) !== null && _m !== void 0 ? _m : (pkg.dependencies = {});
                    pkg.dependencies[name] = semver;
                    bool = false;
                }
                else {
                    bool !== null && bool !== void 0 ? bool : (bool = true);
                }
            }
            if (bool === false) {
                added.push([name, semver]);
            }
            else {
                exists.push(name);
            }
            return false;
        }
        else {
            return true;
        }
    });
    if (others.length !== packageNames.length) {
        let opts = {
            useSource: true,
        };
        core_1.default((_c = pkg.dependencies) !== null && _c !== void 0 ? _c : {}, opts);
        core_1.default((_d = pkg.devDependencies) !== null && _d !== void 0 ? _d : {}, opts);
        core_1.default((_e = pkg.peerDependencies) !== null && _e !== void 0 ? _e : {}, opts);
        core_1.default((_f = pkg.optionalDependencies) !== null && _f !== void 0 ? _f : {}, opts);
    }
    return {
        cwd,
        rootData,
        added,
        exists,
        others,
        pkg,
    };
}
exports.installDepsFromWorkspaces = installDepsFromWorkspaces;
//# sourceMappingURL=installDepsFromWorkspaces.js.map