"use strict";
/**
 * Sort package.json scripts field / 排序 package.json scripts 欄位
 *
 * This module provides the core sorting functionality for package.json scripts.
 * By default, it follows npm lifecycle scripts order for better readability.
 *
 * 此模組提供 package.json scripts 的核心排序功能。
 * 預設遵循 npm 生命週期腳本順序，提高可讀性。
 *
 * @module sort-package-json-scripts/lib/sortScripts
 *
 * @example
 * ```typescript
 * import sortPackageJsonScripts from 'sort-package-json-scripts/lib/sortScripts';
 *
 * const scripts = {
 *   'lint': 'npx eslint *.ts',
 *   'test': 'jest --coverage',
 *   'pretest': 'npm run lint',
 * };
 *
 * const sorted = sortPackageJsonScripts(scripts);
 * // Returns: { pretest: 'npm run lint', test: 'jest --coverage', lint: 'npx eslint *.ts' }
 * ```
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
 * Core sorting function that sorts scripts by key order.
 * 核心排序函式，按鍵值順序排序腳本。
 *
 * @template T - The scripts object type / scripts 物件類型
 * @param scripts - The scripts object to sort / 要排序的 scripts 物件
 * @param opts - Sorting options / 排序選項
 * @returns The sorted scripts object / 排序後的 scripts 物件
 *
 * @internal
 */
function _core(scripts, opts) {
    const keys = (0, handleKeyOrdersCore_1.handleKeyOrdersCore)(Object.keys(scripts), opts);
    return (0, sort_object_keys2_1.sortObjectKeys)(scripts, {
        keys,
        sort: opts.sortKeyFn,
    });
}
/**
 * Legacy sorting function (simple sort without grouping).
 * 舊版排序函式（簡單排序，無分組）。
 *
 * @template T - The scripts object type / scripts 物件類型
 * @param scripts - The scripts object to sort / 要排序的 scripts 物件
 * @param opts - Sorting options / 排序選項
 * @returns The sorted scripts object / 排序後的 scripts 物件
 *
 * @deprecated Use sortPackageJsonScripts instead / 請改用 sortPackageJsonScripts
 */
function sortPackageJsonScriptsOld(scripts, opts) {
    opts = (0, handleOptions_1.handleOptions)(opts);
    return _core(scripts, opts);
}
/**
 * Sort package.json scripts field following npm lifecycle scripts order.
 * 排序 package.json scripts 欄位，遵循 npm 生命週期腳本順序。
 *
 * This function sorts scripts and groups related scripts together.
 * For example, pretest, test, and posttest will be grouped in order.
 *
 * 此函式排序腳本並將相關腳本分組在一起。
 * 例如，pretest、test 和 posttest 將按順序分組。
 *
 * @template T - The scripts object type / scripts 物件類型
 * @param scripts - The scripts object to sort / 要排序的 scripts 物件
 * @param opts - Sorting options / 排序選項
 * @returns The sorted scripts object / 排序後的 scripts 物件
 *
 * @example
 * ```typescript
 * const scripts = {
 *   'lint': 'npx eslint *.ts',
 *   'npm:publish': 'npm publish',
 *   'test': 'jest --coverage',
 *   'coverage': 'npx nyc yarn run test',
 *   'pretest': 'npm run lint',
 *   'posttest': 'echo done',
 * };
 *
 * const sorted = sortPackageJsonScripts(scripts);
 * // Scripts are sorted by npm lifecycle order with related scripts grouped
 * ```
 */
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