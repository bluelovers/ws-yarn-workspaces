/**
 * @yarn-tool/pkg-entry-util
 *
 * 用於處理 package.json entry 相關欄位的工具庫
 * Utility library for handling package.json entry-related fields
 *
 * 包含 bin、exports、publishConfig 欄位的修復與驗證功能
 * Includes fix and verification for bin, exports, and publishConfig fields
 *
 * 同時提供各類套件的預設 npm scripts 集合
 * Also provides default npm scripts collections for various package types
 */

/**
 * 匯出 bin 欄位修復功能 / Export bin field fix functionality
 *
 * 修復 package.json 中 bin 欄位的路徑問題
 * Fix path issues in package.json bin field
 */
export { fixPkgBinField } from './field/bin';

/**
 * 匯出 publishConfig 欄位修復功能 / Export publishConfig field fix functionality
 *
 * 修復 publishConfig 欄位以符合發布需求
 * Fix publishConfig field for publishing requirements
 */
export { fixPublishConfig } from './field/publishConfig';

/**
 * 匯出 exports 欄位處理功能 / Export exports field handling functionality
 *
 * 驗證與修復 package exports 路徑
 * Verify and fix package exports paths
 */
export { pkgExportsAddPJsonEntry, pkgExportsVerify } from './field/exports';
