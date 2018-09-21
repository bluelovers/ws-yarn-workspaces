"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./lib/util");
const fs = require("fs-extra");
const hashSum = require("hash-sum");
const os = require("os");
const path = require("path");
const bluebird = require("bluebird");
/**
 * fn[] of any function return a string
 * stop when get first return
 */
exports.defaultOrder = [
    findPkgModulePath,
    findNpmCachePath,
    os.tmpdir,
];
/**
 * a base dir name at cache root
 */
exports.defaultBase = '.cache';
function getCachePath(options, opt) {
    if (typeof options === 'string') {
        options = Object.assign({}, opt, { name: options });
    }
    options = options || {};
    let root = getCacheRoot(options);
    let base = options.base || exports.defaultBase;
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
function getCachePathAsync(options, opt) {
    return bluebird.resolve()
        .then(async function () {
        if (typeof options === 'string') {
            options = Object.assign({}, opt, { name: options });
        }
        options = options || {};
        let root = await getCacheRootAsync(options);
        let base = options.base || exports.defaultBase;
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
            await fs.ensureDir(dir);
        }
        if (options.thunk) {
            // @ts-ignore
            let fn = (...args) => path.join(dir, ...args);
            // @ts-ignore
            fn.dir = dir;
            return fn;
        }
        return dir;
    });
}
exports.getCachePathAsync = getCachePathAsync;
/**
 * normalize cache name
 */
function normalizeName(name, hash) {
    if (hash) {
        if (typeof hash === 'function') {
            return hash(name);
        }
        return hashSum(name);
    }
    return name
        .trim()
        .replace(/[^\w\-\.]/g, '_')
        .replace(/\.+/g, '_')
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
    let fnOrder = options.fnOrder || exports.defaultOrder;
    if (!options.disableDefaultFailback && options.fnOrder && fnOrder != exports.defaultOrder) {
        fnOrder = fnOrder.concat(exports.defaultOrder);
    }
    let dir;
    fnOrder.some(function (fn) {
        // @ts-ignore
        dir = fn(cwd);
        let bool = !!dir;
        if (bool && typeof dir !== 'string') {
            throw new TypeError(`expect string but got '${typeof dir}', ${dir}`);
        }
        return bool;
    });
    if (!dir) {
        throw new Error(`can't found cache path`);
    }
    else if (typeof dir != 'string' || !fs.existsSync(dir)) {
        throw new Error(`path not exists '${dir}'`);
    }
    return path.resolve(dir);
}
exports.getCacheRoot = getCacheRoot;
function getCacheRootAsync(options) {
    return bluebird.resolve()
        .then(async function () {
        if (typeof options === 'string') {
            options = {
                cwd: options,
            };
        }
        options = options || {};
        let cwd = options.cwd || process.cwd();
        let fnOrder = options.fnOrder || exports.defaultOrder;
        if (!options.disableDefaultFailback && options.fnOrder && fnOrder != exports.defaultOrder) {
            fnOrder = fnOrder.concat(exports.defaultOrder);
        }
        let dir;
        for (let fn of fnOrder) {
            dir = await fn(cwd);
            if (dir) {
                if (typeof dir !== 'string') {
                    throw new TypeError(`expect string but got '${typeof dir}', ${dir}`);
                }
                break;
            }
        }
        if (!dir) {
            throw new Error(`can't found cache path`);
        }
        else if (!fs.existsSync(dir)) {
            throw new Error(`path not exists '${dir}'`);
        }
        return path.resolve(dir);
    });
}
exports.getCacheRootAsync = getCacheRootAsync;
/**
 * get os temp dir
 */
function getOSTempPath(cwd) {
    return os.tmpdir();
}
exports.getOSTempPath = getOSTempPath;
/**
 * try get a pkg/node_modules
 */
function findPkgModulePath(cwd) {
    let dir = util_1.findPkgPath(cwd);
    return path.join(dir, 'node_modules');
}
exports.findPkgModulePath = findPkgModulePath;
/**
 * try get npm global cache path
 */
function findNpmCachePath(cwd) {
    let cache = util_1.spawn_stdout('npm', [
        'config', 'get', 'cache',
    ]);
    if (!cache || !cache.length) {
        cache = util_1.spawn_stdout('yarn', [
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
exports.default = getCachePath;
// @ts-ignore
exports = util_1.ObjectFreezeAll(exports);
