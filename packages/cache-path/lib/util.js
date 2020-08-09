"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._check = exports._createAble = exports.handleOptions = void 0;
const finder_1 = require("./finder");
const index_1 = require("array-hyper-unique/index");
const findPkgModuleCachePath_1 = require("./finder/findPkgModuleCachePath");
const fs_1 = require("fs");
const fs_extra_1 = require("fs-extra");
const index_2 = require("@lazy-node/is-writeable-path/index");
const upath2_1 = require("upath2");
function handleOptions(options) {
    var _a;
    if (typeof options === 'string') {
        options = {
            cwd: options,
        };
    }
    options !== null && options !== void 0 ? options : (options = {});
    let { cwd = process.cwd(), fnOrder = finder_1.defaultOrder, } = options;
    if (!options.disableDefaultFailback && options.fnOrder && fnOrder !== finder_1.defaultOrder) {
        // @ts-ignore
        fnOrder = fnOrder.concat(finder_1.defaultOrder);
        index_1.array_unique_overwrite(fnOrder);
    }
    options.cwd = upath2_1.resolve(cwd);
    options.fnOrder = fnOrder;
    (_a = options.processEnv) !== null && _a !== void 0 ? _a : (options.processEnv = process.env);
    options.create = !!options.create;
    return options;
}
exports.handleOptions = handleOptions;
function _createAble(options, fn) {
    return ((options === null || options === void 0 ? void 0 : options.create) === true || fn === finder_1.findPkgModuleCachePath || fn === findPkgModuleCachePath_1.findPkgModulePath || fn === findPkgModuleCachePath_1.findPkgPath);
}
exports._createAble = _createAble;
function _check(dir, options) {
    if (!(dir === null || dir === void 0 ? void 0 : dir.length)) {
        throw new Error(`can't found cache path`);
    }
    else if (typeof dir !== 'string') {
        throw new Error(`not a path '${dir}'`);
    }
    else if (!fs_1.existsSync(dir)) {
        if (options.create) {
            fs_extra_1.ensureDirSync(dir);
        }
        else {
            throw new Error(`path not exists '${dir}'`);
        }
    }
    if (!index_2.isWritableDirectorySync(dir)) {
        throw new Error(`path is not writeable '${dir}'`);
    }
    return true;
}
exports._check = _check;
//# sourceMappingURL=util.js.map