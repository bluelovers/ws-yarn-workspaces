"use strict";
/**
 * Sort package.json scripts field following npm lifecycle scripts order.
 * 排序 package.json scripts 欄位，遵循 npm 生命週期腳本順序。
 *
 * This module provides utilities for sorting the scripts field in package.json.
 * By default, it follows npm lifecycle scripts order for better readability.
 *
 * 此模組提供排序 package.json 中 scripts 欄位的工具函式。
 * 預設遵循 npm 生命週期腳本順序，提高可讀性。
 *
 * ## 核心功能 / Core Features
 *
 * - **NPM 生命週期順序**: 預設遵循 npm 定義的腳本執行順序
 * - **腳本分組**: 自動將相關腳本（preXXX、XXX、postXXX）分組在一起
 * - **自定義排序**: 支援自訂排序邏輯和鍵值提取函式
 *
 * @module sort-package-json-scripts
 *
 * @example
 * ```typescript
 * import sortPackageJsonScripts from 'sort-package-json-scripts';
 *
 * const scripts = {
 *   'lint': 'npx eslint *.ts',
 *   'npm:publish': 'npm publish',
 *   'test': 'jest --coverage',
 *   'coverage': 'npx nyc yarn run test',
 *   'prepublishOnly': 'yarn run ncu && yarn run sort-package-json && yarn run test',
 * };
 *
 * const sorted = sortPackageJsonScripts(scripts);
 * // Returns scripts sorted by npm lifecycle order
 * ```
 *
 * @example
 * ```typescript
 * // 使用自定義選項
 * import sortPackageJsonScripts, { ISortPackageJsonScriptsOptions } from 'sort-package-json-scripts';
 *
 * const options: ISortPackageJsonScriptsOptions = {
 *   otherScriptNames: ['prettier', 'eslint'],
 *   defaultNpmScriptsOrder: ['build', 'test', 'lint'],
 *   sortKeyFn: (a, b) => a.localeCompare(b),
 * };
 *
 * const sorted = sortPackageJsonScripts(scripts, options);
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortPackageJsonScripts = void 0;
const sortScripts_1 = require("./lib/sortScripts");
Object.defineProperty(exports, "sortPackageJsonScripts", { enumerable: true, get: function () { return sortScripts_1.sortPackageJsonScripts; } });
/**
 * 預設匯出
 * Default export
 */
exports.default = sortScripts_1.sortPackageJsonScripts;
//# sourceMappingURL=index.js.map