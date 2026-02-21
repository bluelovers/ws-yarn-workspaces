"use strict";
/**
 * Update functions for npm-check-updates operations.
 * 提供 npm-check-updates 相關的更新功能函數。
 *
 * @module update
 *
 * @example
 * ```ts
 * import { npmCheckUpdates, checkResolutionsUpdate } from '@yarn-tool/ncu/lib/update';
 *
 * // 檢查並更新 package.json 中的依賴版本
 * const result = await npmCheckUpdates(cache, options);
 *
 * // 檢查並更新 resolutions 中的版本
 * const resolutionResult = await checkResolutionsUpdate(resolutions, yarnlock, options);
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkResolutionsUpdate = exports.npmCheckUpdates = void 0;
var npmCheckUpdates_1 = require("./update/npmCheckUpdates");
Object.defineProperty(exports, "npmCheckUpdates", { enumerable: true, get: function () { return npmCheckUpdates_1.npmCheckUpdates; } });
var checkResolutionsUpdate_1 = require("./update/checkResolutionsUpdate");
Object.defineProperty(exports, "checkResolutionsUpdate", { enumerable: true, get: function () { return checkResolutionsUpdate_1.checkResolutionsUpdate; } });
//# sourceMappingURL=update.js.map