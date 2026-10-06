/**
 * @yarn-tool/fix-ws-links/lib/util
 *
 * 路徑判斷的小工具轉傳模組
 * Small re-export module for path checks
 *
 * 以較短的別名統一供 index.ts 使用，避免各檔案各自引用實作套件
 * Provides short aliases shared by index.ts so each file does not import
 * the implementation packages directly
 */
/** 判斷路徑是否為符號連結 (Check whether a path is a symlink) */
export { isSymbolicLinkSync as isSymbolicLink } from 'fs-stat';
/** 比對兩路徑的 realpath 是否相同，任一不存在時回傳 undefined (Compare realpaths; returns undefined when either path is missing) */
export { fsSameRealpath as sameRealpath } from 'path-is-same';
