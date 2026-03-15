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
 * 核心排序函式 - 使用鍵值順序進行簡單排序
 * Core sorting function - simple sort using key order
 *
 * 此函式是基本的排序實現，直接使用 handleKeyOrdersCore 產生的順序來排序腳本。
 * 不會進行額外的分組處理，適合需要保持原有腳本結構的場景。
 *
 * @template T - scripts 物件類型
 * @param scripts - 要排序的 scripts 物件
 * @param opts - 排序選項
 * @returns 排序後的 scripts 物件
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
 * 排序邏輯說明：
 * 1. 首先使用 _core 函式進行基礎排序
 * 2. 建立 topMap 資料結構來追蹤腳本之間的關係：
 *    - 第一層：基礎鍵（如 'test'）
 *    - 第二層：子鍵（如 ':watch'、':coverage'）
 *    - 第三層：前綴（如 'pre'、'post'、''）
 *    - 第四層：完整尾碼（如 ':watch'、'Only'）
 * 3. 遞迴處理每個層級，確保相關腳本保持在一起
 * 4. 最後使用排序後的鍵重新排列物件
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
    /**
     * 處理選項，填充預設值
     * Handle options, fill with default values
     */
    opts = (0, handleOptions_1.handleOptions)(opts);
    const { omitKeyFn, sortKeyFn } = opts;
    /**
     * 第一步：基礎排序
     * Step 1: Basic sorting
     *
     * 先使用 _core 函式進行基礎排序，將腳本按照 npm 生命週期順序排列
     */
    scripts = _core(scripts, opts);
    /**
     * 第二步：建立分組映射表 (topMap)
     * Step 2: Build grouping map (topMap)
     *
     * topMap 用於追蹤腳本之間的層級關係：
     * - topMap[key] - 基礎腳本名稱（如 'test'）
     * - topMap[key][subkey] - 子鍵（如 ':watch'、':coverage'）
     * - topMap[key][subkey][pre] - 前綴（如 'pre'、'post'、''）
     * - topMap[key][subkey][pre][sub] - 完整腳本名稱
     *
     * 範例結構：
     * {
     *   'test': {
     *     '': {
     *       '': { '': 'test' },
     *       'pre': { 'pre': 'pretest' },
     *       'post': { 'post': 'posttest' }
     *     },
     *     ':watch': {
     *       '': { ':watch': 'test:watch' }
     *     }
     *   }
     * }
     */
    let topMap = Object.keys(scripts)
        .reduce((topMap, full) => {
        var _a;
        /**
         * 使用 omitKeyFn 提取基礎鍵和前綴資訊
         * Use omitKeyFn to extract base key and prefix info
         *
         * omitKey 返回：
         * - key: 完整名稱的第一部分（如 'pretest' -> 'test'）
         * - omitted: 去除前綴的基礎鍵（如 'pretest' -> 'test'）
         * - name: 原始名稱
         */
        let { key, omitted } = omitKeyFn(full);
        /**
         * 初始化基礎鍵的分組
         * Initialize base key's grouping
         */
        topMap[key] = (_a = topMap[key]) !== null && _a !== void 0 ? _a : {};
        /**
         * 如果原始名稱與基礎鍵不同，表示有前綴或尾碼
         * If original name differs from base key, it has prefix or suffix
         */
        if (full !== key) {
            /**
             * 解析腳本名稱的各個部分：
             * - i: key 在 full 中的起始位置
             * - sub: key 後面的部分（如 ':watch'）
             * - pre: key 前面的部分（如 'pre'）
             * - subkey: 處理後的尾碼（如 'watch'）
             */
            let i = full.indexOf(key);
            let sub = full.slice(i + key.length);
            let pre = full.slice(0, i);
            let subkey = (0, util_1.trimKey)(sub);
            /**
             * 建立嵌套結構
             * Build nested structure
             */
            topMap[key][subkey] = topMap[key][subkey] || {};
            topMap[key][subkey][pre] = topMap[key][subkey][pre] || {};
            topMap[key][subkey][pre][sub] = full;
        }
        return topMap;
    }, {});
    /**
     * 第三步：產生排序後的鍵順序
     * Step 3: Generate sorted key order
     *
     * 遞迴處理 topMap 的每個層級，確保：
     * 1. 相同基礎鍵的腳本排在一起
     * 2. 按照 pre -> base -> post 的順序排列
     * 3. 子鍵（subkey）也按照生命週期順序排列
     */
    let keys = Object.entries(topMap)
        .reduce((a, [key, c]) => {
        /**
         * 先加入基礎鍵
         * Add base key first
         */
        a.push(key);
        /**
         * 如果有子鍵，則遞迴處理
         * If there are subkeys, process recursively
         */
        if (Object.keys(c).length) {
            /**
             * 對子鍵進行排序
             * Sort subkeys
             */
            c = (0, sort_object_keys2_1.sortObjectKeys)(c, {
                keys: (0, handleKeyOrdersCore_1.handleKeyOrdersCore)(Object.keys(c), opts),
                sort: sortKeyFn,
            });
            Object.keys(c).forEach(subkey => {
                /**
                 * 對每個子鍵內的前綴進行排序
                 * Sort prefixes within each subkey
                 */
                c[subkey] = (0, sort_object_keys2_1.sortObjectKeys)(c[subkey], {
                    keys: (0, handleKeyOrdersCore_1.handleKeyOrdersCore)(Object.keys(c[subkey]), opts),
                    sort: sortKeyFn,
                });
                Object.keys(c[subkey]).forEach(pre => {
                    /**
                     * 對每個前綴內的完整名稱進行排序
                     * Sort full names within each prefix
                     */
                    c[subkey][pre] = (0, sort_object_keys2_1.sortObjectKeys)(c[subkey][pre], {
                        keys: (0, handleKeyOrdersCore_1.handleKeyOrdersCore)(Object.keys(c[subkey][pre]), opts),
                        sort: sortKeyFn,
                    });
                    /**
                     * 將排序後的完整名稱添加到結果陣列
                     * Add sorted full names to result array
                     */
                    Object.keys(c[subkey][pre]).forEach(sub => {
                        a.push(c[subkey][pre][sub]);
                    });
                });
            });
        }
        return a;
    }, []);
    //keys = array_unique(keys)
    /**
     * 第四步：使用最終排序的鍵重新排列物件
     * Step 4: Reorder object using final sorted keys
     */
    return (0, sort_object_keys2_1.sortObjectKeys)(scripts, {
        keys,
        sort: opts.sortKeyFn,
    });
}
exports.default = sortPackageJsonScripts;
//# sourceMappingURL=sortScripts.js.map