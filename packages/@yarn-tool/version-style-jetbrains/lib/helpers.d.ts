/**
 * 版本樣式輔助函數
 * Version style helper functions
 *
 * 內部使用的輔助函數
 * Internal helper functions
 */
import { IParseVersionResult } from './types';
/**
 * 解析標準完整年份格式版本號
 * Parse standard full year format version
 *
 * 格式: YYYY.M.D-increment 或 YYYY.MD.increment
 *
 * @param version - 版本號字串 / Version string
 * @returns 解析結果 / Parse result
 */
export declare function _parseStandardFullVersion(version: string): IParseVersionResult<false> | null;
/**
 * 解析 JetBrains 短年份格式版本號
 * Parse JetBrains short year format version
 *
 * 格式: YYQ.M.D-increment 或 YYQ.MD.increment
 * 例如: 261.1.1-1 表示 2026年Q1 一月 一號 第一版
 *
 * @param version - 版本號字串 / Version string
 * @returns 解析結果 / Parse result
 */
export declare function _parseJetbrainsVersion(version: string): IParseVersionResult<true> | null;
/**
 * 解析版本號（內部函數）
 * Parse version string (internal function)
 *
 * @param version - 版本號字串 / Version string
 * @returns 解析結果 / Parse result
 */
export declare function _parseVersion(version: string): IParseVersionResult | null;
