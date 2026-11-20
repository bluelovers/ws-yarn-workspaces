import { IParseVersionResult } from './types';
/**
 * 解析 JetBrains 日期時間樣式版本號
 *
 * 格式: YYQ.MMDD.HHmm 或 YYQ.MMDD.HHmm-increment
 * 例如: 264.1120.1744-1 表示 2026年Q4 11 月 20 日 17:44 第一版
 *
 * 首段末位須為合法季度 (1-4) 才屬於此樣式；
 * 與 y2k 樣式 (2YY) 同時符合時以此樣式優先
 *
 * @param version - 版本號字串
 * @returns 解析結果，不符合格式時回傳 null
 */
export declare function _parseJetbrainsDateTime(version: string): IParseVersionResult<true, true> | null;
/**
 * 解析 y2k 日期時間樣式版本號
 *
 * 格式: 2YY.MMDD.HHmm 或 2YY.MMDD.HHmm-increment
 * 例如: 226.1120.1744-1 表示 2026 年 11 月 20 日 17:44 第一版
 * 首段 226 取自年份 2026 的第一個 2 與年份後兩位，2100 起不支援
 *
 * 與 JetBrains 樣式 (YYQ) 同時符合時由 JetBrains 樣式優先，此樣式只接手末位非季度的編碼
 *
 * @param version - 版本號字串
 * @returns 解析結果，不符合格式時回傳 null
 */
export declare function _parseY2KDateTime(version: string): IParseVersionResult<true, true> | null;
/**
 * 解析標準完整年份格式版本號
 *
 * 格式: YYYY.M.D-increment 或 YYYY.MD.increment
 *
 * @param version - 版本號字串
 * @returns 解析結果
 */
export declare function _parseStandardFullVersion(version: string): IParseVersionResult<false> | null;
/**
 * 解析 JetBrains 短年份格式版本號
 *
 * 格式: YYQ.M.D-increment 或 YYQ.MD.increment
 * 例如: 261.1.1-1 表示 2026年Q1 一月 一號 第一版
 *
 * @param version - 版本號字串
 * @returns 解析結果
 */
export declare function _parseJetbrainsVersion(version: string): IParseVersionResult<true> | null;
/**
 * 解析 JetBrains 短樣式，並要求首段為合法 YYQ 編碼
 *
 * `_parseJetbrainsVersion` 的正則允許任意位數首段，4 位年份 (2026.101.1)
 * 與非季度末碼 (266.1.1-1) 會被誤判成短樣式，分析時先擋下才能給出正確的符合風格
 *
 * @param version - 版本號字串
 * @returns 解析結果，首段非合法 YYQ 編碼時回傳 null
 */
export declare function _parseJetbrainsShort(version: string): IParseVersionResult | null;
