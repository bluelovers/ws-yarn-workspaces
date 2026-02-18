/**
 * @yarn-tool/pkg-entry-util
 *
 * 用於處理 package.json entry 相關欄位的工具庫
 * Utility library for handling package.json entry-related fields
 *
 * 包含 bin、exports、publishConfig 欄位的修復與驗證功能
 * Includes fix and verification for bin, exports, and publishConfig fields
 */

// 匯出 bin 欄位修復功能 / Export bin field fix functionality
export { fixPkgBinField } from './field/bin';

// 匯出 publishConfig 欄位修復功能 / Export publishConfig field fix functionality
export { fixPublishConfig } from './field/publishConfig';

// 匯出 exports 欄位處理功能 / Export exports field handling functionality
export { pkgExportsAddPJsonEntry, pkgExportsVerify } from './field/exports';
