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
export { npmCheckUpdates } from './update/npmCheckUpdates';
export { checkResolutionsUpdate } from './update/checkResolutionsUpdate';
