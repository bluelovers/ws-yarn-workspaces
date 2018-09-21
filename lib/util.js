"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CrossSpawn = require("cross-spawn");
const pkgDir = require("pkg-dir");
const stripAnsi = require("strip-ansi");
function findPkgPath(cwd) {
    let dir = cwd || process.cwd();
    return pkgDir.sync(dir);
}
exports.findPkgPath = findPkgPath;
function spawn_stdout(bin, argv = [], options) {
    let stdout = CrossSpawn.sync(bin, argv, options).stdout;
    return stripAnsi(stdout.toString().replace(/^\s+|\s+$/, ''));
}
exports.spawn_stdout = spawn_stdout;
function ObjectFreezeAll(obj) {
    let ret = Object.freeze(obj);
    Object.keys(ret)
        .forEach(function (key) {
        let type = typeof ret[key];
        if (type === 'object' || type === 'function') {
            Object.freeze(ret[key]);
        }
    });
    return ret;
}
exports.ObjectFreezeAll = ObjectFreezeAll;
// @ts-ignore
const self = exports;
exports.default = self;
// @ts-ignore
exports = ObjectFreezeAll(exports);
