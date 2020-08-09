"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCachePathAsync = exports.getCachePath = exports.defaultBase = void 0;
const getCacheRoot_1 = require("./getCacheRoot");
const normalizeName_1 = require("./normalizeName");
const upath2_1 = __importStar(require("upath2"));
const fs_extra_1 = require("fs-extra");
const bluebird_1 = __importDefault(require("bluebird"));
const tmp_1 = require("tmp");
/**
 * a base dir name at cache root
 */
exports.defaultBase = '.cache';
function getCachePath(_options, opt) {
    let options;
    if (typeof _options === 'string') {
        options = {
            ...opt,
            name: _options,
        };
    }
    options !== null && options !== void 0 ? options : (options = {});
    let root = getCacheRoot_1.getCacheRoot(options);
    let { base = exports.defaultBase } = options;
    let { name } = options;
    let tmpdir = upath2_1.join(root, base);
    //ensureDirSync(tmpdir);
    let dir;
    if (name === null || name === void 0 ? void 0 : name.length) {
        name = normalizeName_1.normalizeName(name, options.hash);
        dir = upath2_1.join(tmpdir, name);
    }
    else if (!options.randomIfNoName) {
        dir = tmpdir;
    }
    else {
        name = void 0;
        dir = tmp_1.dirSync({
            ...options,
            tmpdir,
            //keep: true,
            name,
        }).name;
    }
    if (options.create) {
        fs_extra_1.ensureDirSync(dir);
    }
    if (options.thunk) {
        // @ts-ignore
        let fn = (...args) => upath2_1.default.join(dir, ...args);
        // @ts-ignore
        fn.dir = dir;
        return fn;
    }
    return dir;
}
exports.getCachePath = getCachePath;
function getCachePathAsync(options, opt) {
    return bluebird_1.default.resolve()
        .then(async function () {
        if (typeof options === 'string') {
            options = {
                ...opt,
                name: options,
            };
        }
        options !== null && options !== void 0 ? options : (options = {});
        let root = await getCacheRoot_1.getCacheRootAsync(options);
        let { base = exports.defaultBase } = options;
        let { name } = options;
        let tmpdir = upath2_1.join(root, base);
        let dir;
        if (name === null || name === void 0 ? void 0 : name.length) {
            name = normalizeName_1.normalizeName(name, options.hash);
            dir = upath2_1.join(tmpdir, name);
        }
        else if (!options.randomIfNoName) {
            dir = tmpdir;
        }
        else {
            name = void 0;
            dir = await new bluebird_1.default((resolve, reject) => {
                tmp_1.dir({
                    ...options,
                    tmpdir,
                    //keep: true,
                    name,
                }, (err, ret) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(ret);
                    }
                });
            }).then(ret => {
                return ret;
            });
        }
        if (options.create) {
            await fs_extra_1.ensureDir(dir);
        }
        if (options.thunk) {
            // @ts-ignore
            let fn = (...args) => upath2_1.default.join(dir, ...args);
            // @ts-ignore
            fn.dir = dir;
            return fn;
        }
        return dir;
    });
}
exports.getCachePathAsync = getCachePathAsync;
//# sourceMappingURL=getCachePath.js.map