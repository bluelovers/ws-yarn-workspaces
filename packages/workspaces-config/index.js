"use strict";
/**
 * Created by user on 2018/5/14/014.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPkg = exports.parseStaticPackagesPaths = exports.parseWorkspaces = exports.getConfig = void 0;
const tslib_1 = require("tslib");
const find_pkg_ws_1 = (0, tslib_1.__importDefault)(require("find-pkg-ws"));
exports.findPkg = find_pkg_ws_1.default;
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
function getConfig(cwd) {
    let file = (0, find_pkg_ws_1.default)(cwd);
    if (!file) {
        throw new RangeError();
    }
    let pkg = (0, fs_extra_1.readJSONSync)(file);
    return parseWorkspaces(pkg.workspaces);
}
exports.getConfig = getConfig;
function parseWorkspaces(workspaces) {
    let ws = Array.isArray(workspaces) ? {
        packages: workspaces,
    } : workspaces;
    return ws;
}
exports.parseWorkspaces = parseWorkspaces;
function parseStaticPackagesPaths(workspaces) {
    workspaces = parseWorkspaces(workspaces);
    return (workspaces.packages || [])
        .reduce(function (a, row) {
        let b = [];
        let ls = row.split(/[\\\/]/);
        ls
            .every(function (v) {
            let bool = /^@?[\w\-]+$/.test(v);
            if (bool) {
                b.push(v);
            }
            return bool;
        });
        if (b.length) {
            if (b.length != ls.length) {
                a.prefixRoot.push(b[0]);
                a.prefix.push(path_1.posix.join(...b));
                let p = path_1.posix.join(...b.slice(1));
                a.prefixSub.push(p === '.' ? '' : p);
            }
            else {
                a.static.push(path_1.posix.join(...b));
            }
        }
        a.all.push(row);
        return a;
    }, {
        static: [],
        prefixRoot: [],
        prefix: [],
        prefixSub: [],
        all: [],
    });
}
exports.parseStaticPackagesPaths = parseStaticPackagesPaths;
exports.default = getConfig;
//# sourceMappingURL=index.js.map