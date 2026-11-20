import { Dayjs } from 'dayjs';
import { IDateInfo, IDateInfoMonthDay, IDateInput, IHourAndMinute, IParseJetbrainsYearResult, IParseMonthDayResult, IVersionStyleOptions } from './types';
import { ITSTypeAndStringLiteral } from 'ts-type';
import { IOptionsTzDayjsSafeParse } from 'dayjs-tz-helper';
import { ISegDayNumber, ISegVerMonthCodeNumber, ISegVerMonthDayCodeNumber, ISegMonthNumber, ISegQuarterNumber, ISegTimeHourNumber, ISegTimeMinuteNumber, ISegYearCodeNumber, ISegYearNumber, ISegVerYearQuarterCodeNumber, ISeqNumberString } from './types-seg';
/**
 * 從月份取得季度
 *
 * @param month - 月份 (1-12)
 * @returns 季度 (1-4)
 */
export declare function getQuarterFromMonth(month: ISegMonthNumber): ISegQuarterNumber;
/**
 * 根據年份和季度取得 JetBrains 風格的年份編碼
 *
 * @param year - 年份
 * @param quarter - 季度 (1-4)
 * @returns 年份編碼 (如 261 表示 2026年Q1)
 */
export declare function getJetbrainsYearCode(year: ISegYearNumber, quarter: ISegQuarterNumber): ISegVerYearQuarterCodeNumber;
/** 此模式僅支援的年份下界 */
export declare const JETBRAINS_DATETIME_YEAR_MIN = 2000;
/**
 * 此模式僅支援的年份上界
 *
 * 編碼只保留年份後兩位，2100 年代會與 2000 年代產生相同編碼，故止於 2099
 */
export declare const JETBRAINS_DATETIME_YEAR_MAX = 2099;
/**
 * 根據年份取得日期時間樣式的年份編碼
 *
 * 編碼由年份首位數字 (2026 的 2) 與年份後兩位組成，故 2026 -> 226；
 * 與 YYQ 季度編碼 (261) 分開，因為此樣式第三段已是時間，不再需要季度資訊
 *
 * @param year - 年份
 * @returns 年份編碼 (如 226 表示 2026 年)
 */
export declare function getY2KDateTimeYearCode(year: ISegYearNumber): ISegYearCodeNumber;
/**
 * 從年份編碼還原日期時間樣式的年份
 *
 * 組碼時被捨棄的百位數以 0 還原 (226 -> 2026)，故僅於支援年份範圍內成立
 *
 * @param yearCode - 年份編碼 (200-299)
 * @returns 年份 (2000-2099)
 */
export declare function _parseY2KDateTimeYear(yearCode: ISegYearCodeNumber): ISegYearNumber;
/** 支援年份範圍對應的年份編碼下界 (200)，由年份規則推導而非寫死 */
export declare const Y2K_DATETIME_YEAR_CODE_MIN: number;
/** 支援年份範圍對應的年份編碼上界 (299)，由年份規則推導而非寫死 */
export declare const Y2K_DATETIME_YEAR_CODE_MAX: number;
/**
 * 從 HHmm 四位數字解析時分
 *
 * 例如: 1744 -> hour=17, minute=44; 0005 -> hour=0, minute=5
 *
 * @param timeStr - 時間字串 (HHmm)
 * @returns 時分資訊，格式不合法時回傳 null
 */
export declare function _parseTimeFromHHmm(timeStr: string): IHourAndMinute | null;
/**
 * 以兩位數補零格式化時分
 *
 * @param hour - 小時 (0-23)
 * @param minute - 分鐘 (0-59)
 * @returns HHmm 字串 (如 "1744")
 */
export declare function _formatTimeToHHmm(hour: ISegTimeHourNumber, minute: ISegTimeMinuteNumber): string;
/**
 * 取得月份區段編碼
 *
 * 為月日合併編碼的高位部分，供組合月日編碼時使用 (11 -> 1100)
 *
 * @param month - 月份 (1-12)
 * @returns 月份區段編碼
 */
export declare function getMonthCode(month: ISegMonthNumber): ISegVerMonthCodeNumber;
/**
 * 取得月日合併編碼
 *
 * 以「月 * 100 + 日」壓縮月日 (11, 20 -> 1120)，與 _parseMonthDayFromMD 互為反運算
 *
 * @param month - 月份 (1-12)
 * @param day - 日期 (1-31)
 * @returns 月日合併編碼
 */
export declare function getMonthDayCode(month: ISegMonthNumber, day: ISegDayNumber): ISegVerMonthDayCodeNumber;
/**
 * 從月日合併數字解析月日資訊
 *
 * 將三位或四位數的月日合併數字解析為月份和日期
 * 例如: 101 -> month=1, day=1; 615 -> month=6, day=15
 *
 * @param monthDay - 月日合併數字 (如 101, 615, 1231)
 * @returns 月日資訊
 */
export declare function _parseMonthDayFromMD(monthDay: ITSTypeAndStringLiteral<number>): IDateInfoMonthDay;
/**
 * 判斷是否為月日合併格式 (MD > 12)
 *
 * 由於月日合併格式中，月日數值必須大於 12 才能與標準格式區分
 * 例如: 101 表示 1月1日，而 115 表示 1月15日
 *
 * @param monthOrMD - 月份或月日合併字串
 * @returns 檢測結果
 */
export declare function _detectIsMDCombined(monthOrMD: string): {
    monthDay: number;
    isMDCombined: boolean;
};
/**
 * 從版本字串的月份/日部分解析月日資訊
 *
 * @param monthOrMD - 月份或月日合併字串
 * @param dayOrIncrement - 日或遞增部分
 * @param increment - 遞增部分（可選）
 * @returns 解析後的月日資訊
 */
export declare function _parseMonthDayInfo(monthOrMD: ISeqNumberString, dayOrIncrement: ISeqNumberString, increment?: ISeqNumberString): IParseMonthDayResult;
/**
 * 從版本字串解析 JetBrains 年份和季度
 *
 * yearQuarter = (year % 100) * 10 + quarter
 * 所以: quarter = yearQuarter % 10, year = 2000 + floor(yearQuarter / 10)
 *
 * @param yearQuarterStr - 年份季度字串 (e.g., "261")
 * @returns 解析後的年份和季度
 */
export declare function _parseJetbrainsYearQuarter(yearQuarterStr: string): IParseJetbrainsYearResult;
/**
 * 從輸入取得 dayjs 物件
 *
 * 支援從多种输入类型转换为 dayjs 对象
 *
 * @param date - 日期輸入 (Dayjs | Date | number | string | IDateInfo)
 * @param opts - dayjs 選項
 * @returns dayjs 物件
 */
export declare function getDayjsFromInput(date: IDateInput, opts?: IOptionsTzDayjsSafeParse): Dayjs;
/**
 * 從 Date 物件取得日期資訊
 *
 * 將 JavaScript Date 物件轉換為 IDateInfo 格式
 *
 * @param date - Date 物件
 * @returns 日期資訊
 *
 * @deprecated 建議使用 _getDateInfoFromDayjs
 */
export declare function _getDateInfoFromDate(date: Date): IDateInfo;
/**
 * 從 dayjs 物件取得日期資訊
 *
 * 將 dayjs 物件轉換為 IDateInfo 格式
 * 注意: dayjs 的月份是 0-based，需要轉換為 1-based
 *
 * @param date - dayjs 物件
 * @returns 日期資訊
 */
export declare function _getDateInfoFromDayjs(date: Dayjs): IDateInfo;
/**
 * 從選項取得日期資訊
 *
 * @param options - 選項
 * @returns 日期資訊
 *
 * @deprecated 當 options 確定經過 _handleVersionStyleOptionsCore 或 _handleVersionStyleOptions 處理過時可以直接使用 _getDateInfoFromDayjs
 */
export declare function _getDateInfoFromOptions(options: IVersionStyleOptions | IDateInput): IDateInfo;
