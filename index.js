"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CrossSpawn = require("cross-spawn");
const fs = require("fs-extra");
const stripAnsi = require("strip-ansi");
const pkgDir = require("pkg-dir");
const path = require("path");
const os = require("os");
const hashSum = require("hash-sum");
const defaultOrder = [
    findPkgModulePath,
    findNpmCachePath,
    os.tmpdir,
];
const defaultBase = '.cache';
function getCachePath(options, opt) {
    if (typeof options === 'string') {
        options = Object.assign({}, opt, { name: options });
    }
    options = options || {};
    let root = getCacheRoot(options);
    let base = options.base || defaultBase;
    let name = options.name;
    let dir;
    if (name) {
        name = normalizeName(name, options.hash);
        dir = path.join(root, base, name);
    }
    else {
        dir = path.join(root, base);
    }
    if (options.create) {
        fs.ensureDirSync(dir);
    }
    if (options.thunk) {
        // @ts-ignore
        let fn = (...args) => path.join(dir, ...args);
        // @ts-ignore
        fn.dir = dir;
        return fn;
    }
    return dir;
}
exports.getCachePath = getCachePath;
function normalizeName(name, hash) {
    if (hash) {
        if (typeof hash === 'function') {
            return hash(name);
        }
        return hashSum(name);
    }
    return name
        .trim()
        .replace(/[^\w]/g, '_')
        .replace(/_+/g, '_');
}
exports.normalizeName = normalizeName;
function getCacheRoot(options) {
    if (typeof options === 'string') {
        options = {
            cwd: options,
        };
    }
    options = options || {};
    let cwd = options.cwd || process.cwd();
    let fnOrder = options.fnOrder || defaultOrder;
    let dir;
    fnOrder.some(function (fn) {
        dir = fn(cwd);
        return !!dir;
    });
    if (!dir) {
        throw new Error(`can't found cache path`);
    }
    else if (!fs.existsSync(dir)) {
        throw new Error(`path not exists '${dir}'`);
    }
    return path.resolve(dir);
}
exports.getCacheRoot = getCacheRoot;
function getOSTempPath(cwd) {
    return os.tmpdir();
}
exports.getOSTempPath = getOSTempPath;
function findPkgModulePath(cwd) {
    let dir = findPkgPath(cwd);
    return path.join(dir, 'node_modules');
}
exports.findPkgModulePath = findPkgModulePath;
function findNpmCachePath(cwd) {
    let cache = spawn_stdout('npm', [
        'config', 'get', 'cache',
    ]);
    if (!cache || !cache.length) {
        cache = spawn_stdout('yarn', [
            'config', 'get', 'cache',
        ]);
    }
    if (!cache) {
        return null;
    }
    if (!fs.existsSync(cache)) {
        throw new Error(`path not exists '${cache}'`);
    }
    return cache;
}
exports.findNpmCachePath = findNpmCachePath;
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
exports.default = getCachePath;
