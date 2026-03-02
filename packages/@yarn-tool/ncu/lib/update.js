"use strict";
/**
 * Update functions for npm-check-updates operations.
 * 提供 npm-check-updates 相關的更新功能函數。
 *
 * 此模組是 @yarn-tool/ncu 的核心更新功能入口，提供兩個主要功能：
 * - npmCheckUpdates: 檢查和更新 package.json 中的依賴版本
 * - checkResolutionsUpdate: 檢查和更新 yarn.lock 中的 resolutions
 *
 * This module is the core update functionality entry point for @yarn-tool/ncu,
 * providing two main features:
 * - npmCheckUpdates: Check and update dependency versions in package.json
 * - checkResolutionsUpdate: Check and update resolutions in yarn.lock
 *
 * @module update
 *
 * @example
 * ```ts
 * import { npmCheckUpdates, checkResolutionsUpdate } from '@yarn-tool/ncu/lib/update';
 *
 * /**
 *  * 檢查並更新 package.json 中的依賴版本
 *  * Check and update dependency versions in package.json
 *  *
 * const result = await npmCheckUpdates(cache, options);
 *
 * /**
 *  * 檢查並更新 resolutions 中的版本
 *  * Check and update versions in resolutions
 *  *
 * const resolutionResult = await checkResolutionsUpdate(resolutions, yarnlock, options);
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkResolutionsUpdate = exports.npmCheckUpdates = void 0;
/**
 * 核心 npm-check-updates 封裝函數
 * Core npm-check-updates wrapper function
 *
 * 此函數會：
 * - 執行 npm-check-updates 檢查
 * - 比對當前版本與最新版本
 * - 更新 package.json 內容
 * - 輸出更新結果表格
 *
 * This function will:
 * - Execute npm-check-updates check
 * - Compare current and latest versions
 * - Update package.json content
 * - Output update result table
 */
var npmCheckUpdates_1 = require("./update/npmCheckUpdates");
Object.defineProperty(exports, "npmCheckUpdates", { enumerable: true, get: function () { return npmCheckUpdates_1.npmCheckUpdates; } });
/**
 * yarn.lock resolutions 更新函數
 * yarn.lock resolutions update function
 *
 * 此函數會：
 * - 解析 yarn.lock 內容
 * - 檢查 resolutions 中的版本更新
 * - 生成更新後的 yarn.lock 內容
 * - 提供變更報告
 *
 * This function will:
 * - Parse yarn.lock content
 * - Check version updates in resolutions
 * - Generate updated yarn.lock content
 * - Provide change report
 */
var checkResolutionsUpdate_1 = require("./update/checkResolutionsUpdate");
Object.defineProperty(exports, "checkResolutionsUpdate", { enumerable: true, get: function () { return checkResolutionsUpdate_1.checkResolutionsUpdate; } });
//# sourceMappingURL=update.js.map