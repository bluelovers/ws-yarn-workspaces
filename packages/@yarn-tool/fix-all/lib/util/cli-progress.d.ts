import progressEstimator from 'progress-estimator';
/**
 * 建立進度估計器
 * Create a progress estimator
 *
 * 快取路徑 (Cache path) 放在套件自己的 node_modules 快取目錄下，
 * 避免污染專案原始碼；目錄可能不存在，故先 ensureDirSync 建立
 * The cache path lives under the package's own node_modules cache directory
 * to avoid polluting project sources; the directory may not exist, so it is
 * created up front via ensureDirSync
 *
 * @param root - 專案根目錄，用於推導快取路徑 / Project root, used to derive the cache path
 * @returns 已設定儲存位置的 progress-estimator 實例 / A progress-estimator instance with storage configured
 */
export declare function createProgressEstimator(root: string): progressEstimator.ProgressEstimator;
