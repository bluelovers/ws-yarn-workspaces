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
