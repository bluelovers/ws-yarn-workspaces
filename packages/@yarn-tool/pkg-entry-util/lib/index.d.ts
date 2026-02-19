/**
 * @yarn-tool/pkg-entry-util
 *
 * 用於處理 package.json entry 相關欄位的工具庫
 * Utility library for handling package.json entry-related fields
 *
 * 包含 bin、exports、publishConfig 欄位的修復與驗證功能
 * Includes fix and verification for bin, exports, and publishConfig fields
 */
export { fixPkgBinField } from './field/bin';
export { fixPublishConfig } from './field/publishConfig';
export { pkgExportsAddPJsonEntry, pkgExportsVerify } from './field/exports';
