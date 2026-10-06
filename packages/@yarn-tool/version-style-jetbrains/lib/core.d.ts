/**
 * 版本字串產生核心
 * Version string generation core
 *
 * 此模組刻意不處理日期解析與預設值，只負責把已解析的年月日
 * 依照樣式格式化，方便 index.ts 與 helpers 共用同一套規則。
 * This module intentionally skips date parsing and defaulting; it only formats
 * already-parsed year/month/day by style so index.ts and helpers share one rule set.
 */
import { EnumVersionStyle } from './types';
/**
 * 根據樣式將日期轉換為版本字串（核心函數）
 * Convert date to version string by style (core function)
 *
 * @param style - 版本樣式 / Version style
 * @param options - 選項 / Options (year, month, day, dailyIncrement, disableDailyVersionSuffix)
 * @returns 版本字串 / Version string
 */
export declare function _dateToVersionByStyleCore(style: EnumVersionStyle, options: {
    year: number;
    month: number;
    day: number;
    dailyIncrement: number;
    disableDailyVersionSuffix?: boolean;
}): string;
