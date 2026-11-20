import { ITSNumberString } from 'ts-type';
export type ISegYearNumber = number;
/** Human-readable Month Number (1-12) */
export type ISegMonthNumber = number;
/** Zero-based Month Number (0-11) */
export type ISegMonthNumberCode = number;
/** 1-31 */
export type ISegDayNumber = number;
/** 0-23 */
export type ISegTimeHourNumber = number;
/** 0-59 */
export type ISegTimeMinuteNumber = number;
/** 1-4 */
export type ISegQuarterNumber = number;
/** 年份編碼：年份首位數字 + 年份後兩位 (如 226 = 2026 年，2100 起不支援) */
export type ISegYearCodeNumber = number;
export type ISeqVersionAny = `${number}.${number}.${number}` | `${number}.${number}.${string}` | (string & {});
export type ISeqNumberString = ITSNumberString | (string & {});
/** 月份區段編碼：月 * 100 (如 1100)，與 ISegMonthNumberCode (0-11) 無關 */
export type ISegVerMonthCodeNumber = number;
/** 月日合併編碼：月 * 100 + 日 (如 1120 = 11月20日) */
export type ISegVerMonthDayCodeNumber = number;
/** 年份季度編碼：年份後兩位 * 10 + 季度 (如 261 = 2026年Q1) */
export type ISegVerYearQuarterCodeNumber = number;
/** 當日版本號 1+ */
export type ISegVerDailyVersionIncrementNumber = number;
