"use strict";
/**
 * Created by user on 2018/5/14/014.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPkg = exports.parseStaticPackagesPaths = exports.parseWorkspaces = exports.getConfig = void 0;
const find_pkg_ws_1 = __importDefault(require("find-pkg-ws"));
exports.findPkg = find_pkg_ws_1.default;
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
function getConfig(cwd) {
    let file = find_pkg_ws_1.default(cwd);
    if (!file) {
        throw new RangeError();
    }
    let pkg = fs_extra_1.readJSONSync(file);
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
            let bool = /^\w+$/.test(v);
            if (bool) {
                b.push(v);
            }
            return bool;
        });
        if (b.length) {
            if (b.length != ls.length) {
                a.prefix.push(path_1.join(...b));
            }
            else {
                a.static.push(path_1.join(...b));
            }
        }
        a.all.push(row);
        return a;
    }, {
        static: [],
        prefix: [],
        all: [],
    });
}
exports.parseStaticPackagesPaths = parseStaticPackagesPaths;
exports.default = getConfig;
//# sourceMappingURL=index.js.map