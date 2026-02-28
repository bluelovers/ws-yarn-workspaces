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
    pkg = (0, sort_package_json_1.sortPackageJson)(pkg, {
        sortOrder: sort_package_json_order_1.sortOrder,
    });
    if ((0, is_plain_obj_1.default)(pkg.scripts)) {
        // @ts-ignore
        pkg.scripts = (0, sort_package_json_scripts_1.sortPackageJsonScripts)(pkg.scripts);
    }
    if ((0, is_plain_obj_1.default)(pkg.betterScripts)) {
        // @ts-ignore
        pkg.betterScripts = (0, sort_package_json_scripts_1.sortPackageJsonScripts)(pkg.betterScripts);
    }
    if ((0, is_plain_obj_1.default)(pkg.exports)) {
        // @ts-ignore
        pkg.exports = (0, sort_package_json_exports_1.sortPackageJsonExports)(pkg.exports);
    }
    return pkg;
}
exports.default = sortPackageJson;
//# sourceMappingURL=index.js.map