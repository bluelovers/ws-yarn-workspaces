"use strict";
/**
 * Created by user on 2018/6/5/005.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsConfigPaths = exports.readPackages = exports.workspacesPackagesList = void 0;
const workspaces_config_1 = require("workspaces-config");
const core_1 = __importDefault(require("find-yarn-workspace-root2/core"));
const path_1 = require("path");
const fast_glob_1 = __importDefault(require("@bluelovers/fast-glob"));
const fs_1 = require("fs");
const array_hyper_unique_1 = require("array-hyper-unique");
function workspacesPackagesList(cwd, absolute) {
    if (typeof cwd === 'boolean') {
        // @ts-ignore
        [cwd, absolute] = [null, cwd];
    }
    cwd = cwd || process.cwd();
    let not_absolute = absolute === false;
    let root = core_1.default(cwd);
    let ps = workspaces_config_1.getConfig(root).packages.map(function (v) {
        return path_1.join(v, 'package.json');
    });
    return fast_glob_1.default.sync(ps, {
        cwd: root,
        absolute: true,
    }).map(function (v) {
        let p = path_1.dirname(v);
        if (not_absolute) {
            p = path_1.relative(cwd, p);
            if (p == '') {
                p = '.';
            }
        }
        return p;
    });
}
exports.workspacesPackagesList = workspacesPackagesList;
function readPackages(ls, cwd) {
    cwd = cwd || process.cwd();
    return ls.reduce(function (a, p) {
        let pp = path_1.resolve(cwd, p);
        let f = path_1.join(pp, 'package.json');
        let pkg = JSON.parse(fs_1.readFileSync(f).toString());
        a[pkg.name] = {
            name: pkg.name,
            path: p,
            fullpath: pp,
            config: pkg,
        };
        return a;
    }, {});
}
exports.readPackages = readPackages;
function tsConfigPaths(ls) {
    let cwd;
    if (typeof ls == 'string') {
        cwd = ls;
        ls = workspacesPackagesList(cwd);
    }
    if (typeof ls[0] == 'string') {
        ls = readPackages(ls, cwd);
    }
    return Object.values(ls).reduce(function (a, v) {
        if (v.path !== '.' && v.path !== '') {
            a[v.name + '/*'] = array_hyper_unique_1.array_unique([
                path_1.join(v.path, '*'),
                path_1.join(v.fullpath, '*'),
            ]);
        }
        return a;
    }, {});
}
exports.tsConfigPaths = tsConfigPaths;
exports.default = workspacesPackagesList;
//# sourceMappingURL=index.js.map