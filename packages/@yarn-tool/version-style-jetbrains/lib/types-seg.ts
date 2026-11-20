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

/** 當日版本號 1+ */
export type ISegDailyVersionIncrementNumber = number;

export type ISeqVersionAny = `${number}.${number}.${number}` | `${number}.${number}.${string}` | (string & {});

export type ISeqNumberString = ITSNumberString | (string & {});
