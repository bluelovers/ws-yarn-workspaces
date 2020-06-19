"use strict";
/**
 * Created by user on 2020/6/20.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortPackageJsonScripts = exports.sortPackageJsonScriptsOld = exports._core = void 0;
const handleOptions_1 = __importDefault(require("./handleOptions"));
const handleKeyOrdersCore_1 = require("./handleKeyOrdersCore");
const sort_object_keys2_1 = __importDefault(require("sort-object-keys2"));
const core_1 = require("array-hyper-unique/core");
const util_1 = require("./util");
/**
 * a better sort package.json scripts, by default is follow npm lifecycle scripts
 *
 * origin code fork from https://github.com/keithamus/sort-package-json
 */
function _core(scripts, opts) {
    const keys = handleKeyOrdersCore_1.handleKeyOrdersCore(Object.keys(scripts), opts);
    return sort_object_keys2_1.default(scripts, {
        keys,
        sort: opts.sortKeyFn,
    });
}
exports._core = _core;
function sortPackageJsonScriptsOld(scripts, opts) {
    opts = handleOptions_1.default(opts);
    return _core(scripts, opts);
}
exports.sortPackageJsonScriptsOld = sortPackageJsonScriptsOld;
function sortPackageJsonScripts(scripts, opts) {
    opts = handleOptions_1.default(opts);
    const { omitKeyFn, sortKeyFn } = opts;
    scripts = _core(scripts, opts);
    let topMap = Object.keys(scripts)
        .reduce((topMap, full) => {
        var _a;
        let { key, omitted } = omitKeyFn(full);
        topMap[key] = (_a = topMap[key]) !== null && _a !== void 0 ? _a : {};
        if (full !== key) {
            let i = full.indexOf(key);
            let sub = full.slice(i + key.length);
            let pre = full.slice(0, i);
            let subkey = util_1.trimKey(sub);
            topMap[key][subkey] = topMap[key][subkey] || {};
            topMap[key][subkey][pre] = topMap[key][subkey][pre] || {};
            topMap[key][subkey][pre][sub] = full;
        }
        return topMap;
    }, {});
    let keys = Object.entries(topMap)
        .reduce((a, [key, c]) => {
        a.push(key);
        if (Object.keys(c).length) {
            c = sort_object_keys2_1.default(c, {
                keys: handleKeyOrdersCore_1.handleKeyOrdersCore(Object.keys(c), opts),
                sort: sortKeyFn,
            });
            Object.keys(c).forEach(subkey => {
                c[subkey] = sort_object_keys2_1.default(c[subkey], {
                    keys: handleKeyOrdersCore_1.handleKeyOrdersCore(Object.keys(c[subkey]), opts),
                    sort: sortKeyFn,
                });
                Object.keys(c[subkey]).forEach(pre => {
                    c[subkey][pre] = sort_object_keys2_1.default(c[subkey][pre], {
                        keys: handleKeyOrdersCore_1.handleKeyOrdersCore(Object.keys(c[subkey][pre]), opts),
                        sort: sortKeyFn,
                    });
                    Object.keys(c[subkey][pre]).forEach(sub => {
                        a.push(c[subkey][pre][sub]);
                    });
                });
            });
        }
        return a;
    }, []);
    keys = core_1.array_unique(keys);
    return sort_object_keys2_1.default(scripts, {
        keys,
        sort: opts.sortKeyFn,
    });
}
exports.sortPackageJsonScripts = sortPackageJsonScripts;
exports.default = sortPackageJsonScripts;
//# sourceMappingURL=sortScripts.js.map