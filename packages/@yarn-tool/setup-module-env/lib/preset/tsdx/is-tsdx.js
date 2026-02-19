"use strict";
/**
 * tsdx 專案識別工具函式
 * Utility functions for identifying tsdx projects
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTsdxPackage = isTsdxPackage;
/**
 * 檢查是否為 tsdx 專案
 * Check if the package is a tsdx project
 *
 * 透過檢查 package.json 中的 keywords 和 exports 欄位來判斷是否為 tsdx 專案。
 * Determines if a package is a tsdx project by checking the keywords and exports fields in package.json.
 *
 * @param pkg - package.json 物件 / package.json object
 * @param config - 設定選項 (可選) / configuration options (optional)
 * @returns 如果是 tsdx 專案則返回 true，否則返回 false / Returns true if it's a tsdx project, false otherwise
 */
function isTsdxPackage(pkg, config) {
    var _a, _b;
    // 檢查關鍵字是否包含 tsdx 標記，且 exports['.'] 為物件類型
    // Check if keywords include tsdx marker and exports['.'] is an object type
    return ((_a = pkg.keywords) === null || _a === void 0 ? void 0 : _a.includes("create-by-tsdx" /* EnumTsdx.keyword */)) && typeof ((_b = pkg.exports) === null || _b === void 0 ? void 0 : _b['.']) === 'object';
}
//# sourceMappingURL=is-tsdx.js.map