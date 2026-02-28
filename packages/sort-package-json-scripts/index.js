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
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortPackageJsonScripts = void 0;
const tslib_1 = require("tslib");
const sortScripts_1 = tslib_1.__importDefault(require("./lib/sortScripts"));
exports.sortPackageJsonScripts = sortScripts_1.default;
exports.default = sortScripts_1.default;
//# sourceMappingURL=index.js.map