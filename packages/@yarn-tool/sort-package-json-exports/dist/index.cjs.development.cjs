'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var sortObjectKeys2 = require('sort-object-keys2');
var isPlainObject = require('is-plain-obj');

/**
 * Sort package.json exports field / 排序 package.json exports 欄位
 *
 * This module provides utilities for sorting the exports field in package.json.
 * It ensures consistent key ordering for better readability and version control.
 *
 * 此模組提供排序 package.json 中 exports 欄位的工具函式。
 * 確保鍵值順序一致，提高可讀性和版本控制友好性。
 *
 * @module @yarn-tool/sort-package-json-exports
 *
 * @example
 * ```typescript
 * import sortPackageJsonExports from '@yarn-tool/sort-package-json-exports';
 *
 * const exports = {
 *   '.': {
 *     import: './dist/index.esm.mjs',
 *     require: './dist/index.cjs',
 *     types: './dist/index.d.ts',
 *   },
 * };
 *
 * const sorted = sortPackageJsonExports(exports);
 * // Returns: { '.': { types: './dist/index.d.ts', require: './dist/index.cjs', import: './dist/index.esm.mjs' } }
 * ```
 */

/**
 * Check if the exports value is an entry object (not a string).
 * 檢查 exports 值是否為項物件（非字串）。
 *
 * @template T - The exports value type / exports 值類型
 * @template O - The exports entry object type / exports 項物件類型
 * @param exports - The exports value to check / 要檢查的 exports 值
 * @returns True if exports is an entry object / 若 exports 為項物件則返回 true
 */
function isPackageJsonExportsEntryObject(exports) {
  return isPlainObject(exports);
}
/**
 * Handle and merge options with defaults.
 * 處理並合併選項與預設值。
 *
 * @param options - Custom options / 自定義選項
 * @returns Merged root and entry order arrays / 合併後的根和項順序陣列
 *
 * @internal
 */
function _handleOptions(options) {
  const rootOrder = ['types', 'require', 'import', 'node', 'node-addons'];
  const entryOrder = [...rootOrder, 'default', '.', './', './package.json'];
  if (options) {
    var _options$rootOrder, _options$entryOrder;
    if ((_options$rootOrder = options.rootOrder) !== null && _options$rootOrder !== void 0 && _options$rootOrder.length) {
      rootOrder.splice(0, 0, ...options.rootOrder);
    }
    if ((_options$entryOrder = options.entryOrder) !== null && _options$entryOrder !== void 0 && _options$entryOrder.length) {
      entryOrder.splice(0, 0, ...options.entryOrder);
    }
  }
  return {
    rootOrder,
    entryOrder
  };
}
/**
 * Sort the exports field in package.json.
 * 排序 package.json 中的 exports 欄位。
 *
 * Sorts both root-level keys and nested entry keys according to
 * a predefined order that follows Node.js resolution preferences.
 *
 * 根據預定義的順序排序根層級鍵和巢狀項鍵，遵循 Node.js 解析偏好。
 *
 * @param exports - The exports value from package.json / 來自 package.json 的 exports 值
 * @param options - Custom sorting options / 自定義排序選項
 * @returns The sorted exports object / 排序後的 exports 物件
 *
 * @example
 * ```typescript
 * const exports = {
 *   '.': {
 *     import: './dist/index.esm.mjs',
 *     require: './dist/index.cjs',
 *     types: './dist/index.d.ts',
 *   },
 *   './sub': {
 *     default: './dist/sub.js',
 *     types: './dist/sub.d.ts',
 *   },
 * };
 *
 * const sorted = sortPackageJsonExports(exports);
 * // Returns:
 * // {
 * //   '.': { types: './dist/index.d.ts', require: './dist/index.cjs', import: './dist/index.esm.mjs' },
 * //   './sub': { types: './dist/sub.d.ts', default: './dist/sub.js' }
 * // }
 * ```
 */
function sortPackageJsonExports(exports, options) {
  if (isPackageJsonExportsEntryObject(exports)) {
    const {
      rootOrder,
      entryOrder
    } = _handleOptions(options);
    sortObjectKeys2.sortObjectKeys(exports, {
      keys: rootOrder,
      useSource: true
    });
    Object.keys(exports).forEach(key => {
      const value = exports[key];
      if (isPackageJsonExportsEntryObject(value)) {
        exports[key] = sortObjectKeys2.sortObjectKeys(value, {
          keys: entryOrder,
          useSource: true
        });
      }
    });
  }
  return exports;
}

exports._handleOptions = _handleOptions;
exports.default = sortPackageJsonExports;
exports.isPackageJsonExportsEntryObject = isPackageJsonExportsEntryObject;
exports.sortPackageJsonExports = sortPackageJsonExports;
//# sourceMappingURL=index.cjs.development.cjs.map
