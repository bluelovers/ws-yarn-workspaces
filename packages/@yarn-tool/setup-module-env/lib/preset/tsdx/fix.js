"use strict";
/**
 * tsdx package.json 修復與調整工具函式
 * Utility functions for fixing and adjusting tsdx package.json
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixTsdxPackage = fixTsdxPackage;
const dot_values2_1 = require("dot-values2");
/**
 * 修復 tsdx 專案的 package.json 設定
 * Fix tsdx project's package.json configuration
 *
 * 根據工作區 (workspace) 的狀態調整 tslib 依賴的位置：
 * Adjusts tslib dependency location based on workspace status:
 *
 * - 如果位於工作區內但不是工作區根目錄：移除 tslib 依賴（由根目錄統一管理）
 *   If inside a workspace but not the workspace root: removes tslib dependency (managed by root)
 *
 * - 如果是獨立專案或工作區根目錄：將 tslib 從 dependencies 移至 devDependencies
 *   If standalone project or workspace root: moves tslib from dependencies to devDependencies
 *
 * @param pkg - package.json 物件 / package.json object
 * @param config - 包含 rootData 的設定選項 / configuration options containing rootData
 * @returns 修改後的 package.json 物件 / Modified package.json object
 */
function fixTsdxPackage(pkg, config) {
    var _a, _b, _c, _d, _e;
    var _f, _g;
    // 檢查是否在工作區內但不是工作區本身（即子套件）
    // Check if inside a workspace but not the workspace itself (i.e., sub-package)
    if (config.rootData.hasWorkspace && !config.rootData.isWorkspace) {
        // 在工作區子套件中，移除 tslib 依賴（由根目錄統一管理）
        // In workspace sub-packages, remove tslib dependency (managed by root)
        (0, dot_values2_1.deleteValue)(pkg, ['dependencies', 'tslib']);
        (0, dot_values2_1.deleteValue)(pkg, ['devDependencies', 'tslib']);
    }
    else {
        // 確保 devDependencies 存在
        // Ensure devDependencies exists
        (_a = pkg.devDependencies) !== null && _a !== void 0 ? _a : (pkg.devDependencies = {});
        // 如果 tslib 在 dependencies 中，將其移至 devDependencies
        // If tslib is in dependencies, move it to devDependencies
        if (((_c = (_b = pkg.dependencies) === null || _b === void 0 ? void 0 : _b['tslib']) === null || _c === void 0 ? void 0 : _c.length) > 0) {
            (_d = (_f = pkg.devDependencies)['tslib']) !== null && _d !== void 0 ? _d : (_f['tslib'] = pkg.dependencies['tslib']);
            (0, dot_values2_1.deleteValue)(pkg, ['dependencies', 'tslib']);
        }
        // 如果是根目錄，確保 @bluelovers/tsconfig 存在
        // If it's the root directory, ensure @bluelovers/tsconfig exists
        if (config.rootData.isRoot) {
            (_e = (_g = pkg.devDependencies)['@bluelovers/tsconfig']) !== null && _e !== void 0 ? _e : (_g['@bluelovers/tsconfig'] = '*');
        }
    }
    return pkg;
}
//# sourceMappingURL=fix.js.map