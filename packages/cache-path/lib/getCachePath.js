"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCachePathAsync = exports.getCachePath = exports.defaultBase = void 0;
const tslib_1 = require("tslib");
const getCacheRoot_1 = require("./getCacheRoot");
const normalizeName_1 = require("./normalizeName");
const upath2_1 = tslib_1.__importStar(require("upath2"));
const fs_extra_1 = require("fs-extra");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
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
    let root = (0, getCacheRoot_1.getCacheRoot)(options);
    let { base = exports.defaultBase } = options;
    let { name } = options;
    let tmpdir = (0, upath2_1.join)(root, base);
    //ensureDirSync(tmpdir);
    let dir;
    if (name === null || name === void 0 ? void 0 : name.length) {
        name = (0, normalizeName_1.normalizeName)(name, options.hash);
        dir = (0, upath2_1.join)(tmpdir, name);
    }
    else if (!options.randomIfNoName) {
        dir = tmpdir;
    }
    else {
        name = void 0;
        dir = (0, tmp_1.dirSync)({
            ...options,
            tmpdir,
            //keep: true,
            name,
        }).name;
    }
    if (options.create) {
        (0, fs_extra_1.ensureDirSync)(dir);
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
        let root = await (0, getCacheRoot_1.getCacheRootAsync)(options);
        let { base = exports.defaultBase } = options;
        let { name } = options;
        let tmpdir = (0, upath2_1.join)(root, base);
        let dir;
        if (name === null || name === void 0 ? void 0 : name.length) {
            name = (0, normalizeName_1.normalizeName)(name, options.hash);
            dir = (0, upath2_1.join)(tmpdir, name);
        }
        else if (!options.randomIfNoName) {
            dir = tmpdir;
        }
        else {
            name = void 0;
            dir = await new bluebird_1.default((resolve, reject) => {
                (0, tmp_1.dir)({
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
            await (0, fs_extra_1.ensureDir)(dir);
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