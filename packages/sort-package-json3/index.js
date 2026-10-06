"use strict";
/**
 * Sort package.json with enhanced sorting capabilities.
 * 排序 package.json，提供增強的排序功能。
 *
 * This module provides an enhanced sort-package-json function that:
 * - Sorts package.json keys in a predefined order
 * - Sorts scripts following npm lifecycle order
 * - Sorts exports field with consistent key ordering
 *
 * 此模組提供增強的 sort-package-json 函式：
 * - 按預定義順序排序 package.json 鍵
 * - 按 npm 生命週期順序排序 scripts
 * - 按一致的鍵值順序排序 exports 欄位
 *
 * @module sort-package-json3
 *
 * @example
 * ```typescript
 * import sortPackageJson from 'sort-package-json3';
 *
 * const pkg = {
 *   dependencies: { ... },
 *   name: 'my-package',
 *   version: '1.0.0',
 *   scripts: {
 *     test: 'jest',
 *     pretest: 'npm run lint',
 *   },
 * };
 *
 * const sorted = sortPackageJson(pkg);
 * // Returns package.json with sorted keys and scripts
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortPackageJson = sortPackageJson;
const tslib_1 = require("tslib");
// @ts-ignore
const sort_package_json_1 = require("sort-package-json");
const sort_package_json_scripts_1 = require("sort-package-json-scripts");
const is_plain_obj_1 = tslib_1.__importDefault(require("is-plain-obj"));
const sort_package_json_exports_1 = require("@yarn-tool/sort-package-json-exports");
const sort_package_json_order_1 = require("@yarn-tool/sort-package-json-order");
/**
 * Sort package.json with enhanced sorting capabilities.
 * 排序 package.json，提供增強的排序功能。
 *
 * This function sorts:
 * 1. Top-level keys using a predefined order
 * 2. Scripts field following npm lifecycle order
 * 3. betterScripts field following npm lifecycle order
 * 4. Exports field with consistent key ordering
 *
 * 此函式排序：
 * 1. 頂層鍵使用預定義順序
 * 2. scripts 欄位遵循 npm 生命週期順序
 * 3. betterScripts 欄位遵循 npm 生命週期順序
 * 4. exports 欄位使用一致的鍵值順序
 *
 * @template T - The package.json type / package.json 類型
 * @param pkg - The package.json object to sort / 要排序的 package.json 物件
 * @returns The sorted package.json object / 排序後的 package.json 物件
 *
 * @example
 * ```typescript
 * import sortPackageJson from 'sort-package-json3';
 *
 * const pkg = {
 *   version: '1.0.0',
 *   name: 'my-package',
 *   scripts: {
 *     test: 'jest',
 *     pretest: 'npm run lint',
 *     posttest: 'echo done',
 *   },
 *   exports: {
 *     '.': {
 *       import: './dist/index.esm.mjs',
 *       require: './dist/index.cjs',
 *       types: './dist/index.d.ts',
 *     },
 *   },
 * };
 *
 * const sorted = sortPackageJson(pkg);
 * // Returns:
 * // {
 * //   name: 'my-package',
 * //   version: '1.0.0',
 * //   exports: { '.': { types: '...', require: '...', import: '...' } },
 * //   scripts: { pretest: '...', test: '...', posttest: '...' }
 * // }
 * ```
 */
function sortPackageJson(pkg) {
    /**
     * 第一步：交由 sort-package-json 核心依照 sortOrder 排序頂層鍵，
     * 因為核心已處理未在清單中的未知鍵（放最後），此處不重複實作以免順序規則分歧。
     *
     * Step 1: delegate top-level key ordering to the sort-package-json core with `sortOrder`,
     * since the core already handles unknown keys (kept last), avoiding divergent ordering rules.
     */
    pkg = (0, sort_package_json_1.sortPackageJson)(pkg, {
        sortOrder: sort_package_json_order_1.sortOrder,
    });
    /**
     * 第二步：只有純物件（Plain object）才可安全地重新排序；
     * 若 scripts 被設為陣列、字串或 null（少見但合法的自訂欄位），直接排序會改寫型別或遺失資料，故略過。
     *
     * Step 2: only plain objects can be safely re-ordered; if `scripts` was set to an
     * array, string or null (uncommon but legal custom values), sorting would mutate
     * the type or drop data, so the field is skipped instead.
     */
    if ((0, is_plain_obj_1.default)(pkg['scripts'])) {
        // @ts-ignore
        pkg.scripts = (0, sort_package_json_scripts_1.sortPackageJsonScripts)(pkg.scripts);
    }
    /**
     * betterScripts 與 scripts 採用同一套生命週期（Lifecycle）順序，
     * 但兩者是互相獨立的欄位，因此各自檢查、各自排序。
     *
     * `betterScripts` follows the same lifecycle ordering as `scripts`, yet they are
     * independent fields, so each is checked and sorted on its own.
     */
    if ((0, is_plain_obj_1.default)(pkg['betterScripts'])) {
        // @ts-ignore
        pkg.betterScripts = (0, sort_package_json_scripts_1.sortPackageJsonScripts)(pkg.betterScripts);
    }
    /**
     * exports 需要在核心排序之後處理，因為核心只決定 exports 這個鍵的位置，
     * 其內部的子路徑（Subpath）與條件（Condition）順序由 sortPackageJsonExports 負責。
     *
     * `exports` is handled after the core pass because the core only positions the
     * `exports` key itself; ordering of its subpaths and conditions is owned by
     * `sortPackageJsonExports`.
     */
    if ((0, is_plain_obj_1.default)(pkg['exports'])) {
        // @ts-ignore
        pkg.exports = (0, sort_package_json_exports_1.sortPackageJsonExports)(pkg.exports);
    }
    return pkg;
}
/**
 * 預設匯出（Default export）：與具名的 sortPackageJson 指向同一函式，
 * 讓 `import sortPackageJson from 'sort-package-json3'` 與 README 範例一致。
 *
 * Default export pointing at the same function as the named `sortPackageJson`,
 * so `import sortPackageJson from 'sort-package-json3'` matches the README example.
 */
exports.default = sortPackageJson;
//# sourceMappingURL=index.js.map