import { EnumVersionStyle } from './types';
import { ISegVerDailyVersionIncrementNumber, ISegDayNumber, ISegMonthNumber, ISegTimeHourNumber, ISegTimeMinuteNumber, ISegYearNumber } from './types-seg';
/**
 * 根據樣式將日期轉換為版本字串（核心函數）
 *
 * @param style - 版本樣式
 * @param options - 選項
 * @returns 版本字串
 */
export declare function _dateToVersionByStyleCore(style: EnumVersionStyle, options: {
    year: ISegYearNumber;
    month: ISegMonthNumber;
    day: ISegDayNumber;
    dailyIncrement: ISegVerDailyVersionIncrementNumber;
    disableDailyVersionSuffix?: boolean;
    hour?: ISegTimeHourNumber;
    minute?: ISegTimeMinuteNumber;
}): string;
