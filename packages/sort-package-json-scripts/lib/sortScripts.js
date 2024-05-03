"use strict";
/**
 * Created by user on 2020/6/20.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports._core = _core;
exports.sortPackageJsonScriptsOld = sortPackageJsonScriptsOld;
exports.sortPackageJsonScripts = sortPackageJsonScripts;
const handleOptions_1 = require("./handleOptions");
const handleKeyOrdersCore_1 = require("./handleKeyOrdersCore");
const sort_object_keys2_1 = require("sort-object-keys2");
const util_1 = require("./util");
/**
 * a better sort package.json scripts, by default is follow npm lifecycle scripts
 *
 * origin code fork from https://github.com/keithamus/sort-package-json
 */
function _core(scripts, opts) {
    const keys = (0, handleKeyOrdersCore_1.handleKeyOrdersCore)(Object.keys(scripts), opts);
    return (0, sort_object_keys2_1.sortObjectKeys)(scripts, {
        keys,
        sort: opts.sortKeyFn,
    });
}
function sortPackageJsonScriptsOld(scripts, opts) {
    opts = (0, handleOptions_1.handleOptions)(opts);
    return _core(scripts, opts);
}
function sortPackageJsonScripts(scripts, opts) {
    opts = (0, handleOptions_1.handleOptions)(opts);
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
            let subkey = (0, util_1.trimKey)(sub);
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
            c = (0, sort_object_keys2_1.sortObjectKeys)(c, {
                keys: (0, handleKeyOrdersCore_1.handleKeyOrdersCore)(Object.keys(c), opts),
                sort: sortKeyFn,
            });
            Object.keys(c).forEach(subkey => {
                c[subkey] = (0, sort_object_keys2_1.sortObjectKeys)(c[subkey], {
                    keys: (0, handleKeyOrdersCore_1.handleKeyOrdersCore)(Object.keys(c[subkey]), opts),
                    sort: sortKeyFn,
                });
                Object.keys(c[subkey]).forEach(pre => {
                    c[subkey][pre] = (0, sort_object_keys2_1.sortObjectKeys)(c[subkey][pre], {
                        keys: (0, handleKeyOrdersCore_1.handleKeyOrdersCore)(Object.keys(c[subkey][pre]), opts),
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
    //keys = array_unique(keys)
    return (0, sort_object_keys2_1.sortObjectKeys)(scripts, {
        keys,
        sort: opts.sortKeyFn,
    });
}
exports.default = sortPackageJsonScripts;
//# sourceMappingURL=sortScripts.js.map