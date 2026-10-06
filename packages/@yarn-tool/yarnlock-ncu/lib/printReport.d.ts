import { IYarnLockUpdateReport } from './types';
/**
 * 將更新報告轉為依賴表格 (dependency table) 文字，供終端機輸出使用。
 *
 * Turns the update report into a dependency table string for terminal output.
 *
 * @param report updateYarnLockTag 產生的更新報告 / the report produced by updateYarnLockTag
 * @param options 可選的著色與 console 設定 / optional colorize and console settings
 * @returns 有更新時回傳表格字串，否則回傳空字串 /
 * the table string when there are updates, otherwise an empty string
 */
export declare function printReport(report: IYarnLockUpdateReport, options?: {
    chalk?: any;
    console?: any;
}): string;
