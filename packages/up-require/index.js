"use strict";
/// <reference types="node" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModuleByID = exports.getMainModule = exports.getRequireCache = exports.getModuleByFile = exports.getModuleByExports = exports._createError = exports.requireFromParentUp = exports.requireParent = exports.requireUp = exports.upRequire = exports.requireFromModuleList = exports.getAllModule = exports.requireFromTopParent = exports.MODULE_NOT_FOUND = void 0;
exports.MODULE_NOT_FOUND = 'MODULE_NOT_FOUND';
/**
 * Require package module from highest module.
 */
function requireFromTopParent(id, startModule) {
    let ls = getAllModule(startModule);
    return requireFromModuleList(id, ls, ls[0]);
}
exports.requireFromTopParent = requireFromTopParent;
/**
 * get all module and parents by start module
 */
function getAllModule(startModule = module.parent) {
    if (!startModule || typeof startModule !== 'object') {
        throw new TypeError(`startModule is not valid`);
    }
    let pm = startModule;
    let ls = [];
    do {
        ls.push(pm);
    } while (pm = pm.parent);
    return ls;
}
exports.getAllModule = getAllModule;
/**
 * Require module from module list
 * (order is desc, from last one to first one)
 */
function requireFromModuleList(id, ls, startModule) {
    if (typeof startModule === 'undefined') {
        startModule = ls[0];
    }
    let pm;
    let err;
    let tm;
    let i = ls.length;
    while (i > 0) {
        tm = ls[--i];
        try {
            pm = tm;
            return pm.require(id);
        }
        catch (e) {
            err = e;
        }
    }
    err = _createError(err, {
        id,
        module: pm,
        startModule,
        list: ls,
    });
    throw err;
}
exports.requireFromModuleList = requireFromModuleList;
/**
 * @alias requireFromTopParent
 */
function upRequire(id, startModule) {
    return requireFromTopParent(id, startModule);
}
exports.upRequire = upRequire;
/**
 * @alias requireFromTopParent
 */
function requireUp(id, startModule) {
    return requireFromTopParent(id, startModule);
}
exports.requireUp = requireUp;
/**
 * Require package module by parent module require.
 */
function requireParent(id, startModule) {
    if (!startModule || typeof startModule !== 'object') {
        throw new TypeError(`startModule is not valid`);
    }
    return startModule.parent.require(id);
}
exports.requireParent = requireParent;
/**
 * Require package module start from parent module.
 */
function requireFromParentUp(id, startModule) {
    let ls = getAllModule(startModule);
    startModule = ls.shift();
    return requireFromModuleList(id, ls.reverse(), startModule);
}
exports.requireFromParentUp = requireFromParentUp;
/**
 * normalize Error data for debug
 */
function _createError(err, data) {
    let msg = `Cannot find module '${data.id}'`;
    if (!err) {
        err = new Error(msg);
        err.code = data.code || exports.MODULE_NOT_FOUND;
        Error.captureStackTrace(err, _createError);
    }
    else {
        //err.message = msg;
    }
    err.startModule = data.startModule;
    err.module = data.module;
    err.list = data.list;
    return err;
}
exports._createError = _createError;
/**
 * find module by exports
 */
function getModuleByExports(exportModule, req = require) {
    let ks = Object.keys(req.cache);
    let i = ks.length;
    while (--i) {
        let key = ks[i];
        let mod = req.cache[key];
        if (mod.exports === exportModule) {
            return mod;
        }
    }
    return null;
}
exports.getModuleByExports = getModuleByExports;
/**
 * find module by full file path
 */
function getModuleByFile(file, requireIfNotExists, req = require) {
    let cache = getRequireCache(req);
    let ks = Object.keys(cache);
    let i = ks.length;
    while (--i) {
        let key = ks[i];
        let mod = cache[key];
        if (mod.filename === file) {
            return mod;
        }
    }
    if (requireIfNotExists) {
        try {
            req(file);
            return getModuleByFile(file, false, req);
        }
        catch (e) {
        }
    }
    return null;
}
exports.getModuleByFile = getModuleByFile;
/**
 * return require.cache for typescript
 */
function getRequireCache(req = require) {
    return req.cache;
}
exports.getRequireCache = getRequireCache;
/**
 * get main module
 */
function getMainModule(id = '.') {
    let pm = module;
    do {
        if (pm.id === id) {
            return pm;
        }
    } while (pm = pm.parent);
    return null;
}
exports.getMainModule = getMainModule;
/**
 * get module by package id like require(id)
 */
function getModuleByID(id, requireIfNotExists, req = require) {
    if (id === '.') {
        return getMainModule(id);
    }
    return getModuleByFile(req.resolve(id), requireIfNotExists, req);
}
exports.getModuleByID = getModuleByID;
exports.default = requireFromTopParent;
//# sourceMappingURL=index.js.map