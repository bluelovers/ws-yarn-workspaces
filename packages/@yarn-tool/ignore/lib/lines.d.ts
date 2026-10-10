import { ITSArrayListMaybeReadonly, ITSValueOrArrayMaybeReadonly } from 'ts-type';
/** 單一行的類型 */
export declare enum EnumLineType {
    Comment = "comment",
    Blank = "blank",
    Pattern = "pattern"
}
/**
 * 輸出前整理的選項
 * Options for finalizing before output
 */
export interface IFinalizeIgnoreLinesOptions {
    /**
     * 是否移除重複的規則，只保留最後一筆；註解不受影響，預設 true
     * Whether to remove duplicate rules, keeping only the last one; comments are
     * unaffected. Defaults to true
     */
    dedupePatterns?: boolean;
    /**
     * 是否將超過上限的連續空行縮減到上限，預設 true
     * Whether to shrink runs of blank lines beyond the upper bound, defaults to true
     */
    collapseBlankLines?: boolean;
    /**
     * 是否移除檔案開頭與結尾的空白行，預設 true
     * Whether to strip blank lines at the start and the end of the file, defaults to true
     */
    omitBlankLines?: boolean;
}
export type IExcludeReadonlyArray<T extends ITSValueOrArrayMaybeReadonly<any>> = Extract<T, string | any[]>;
/**
 * 分析單一行的類型
 *
 * @param line - 不含行尾符號的一行
 * @returns 行的類型，見 {@link EnumLineType}
 */
export declare function lineType(line: string): EnumLineType;
/**
 * 處理內容為行陣列
 *
 * @param content - 檔案內容
 */
export declare function processToLines(content: ITSValueOrArrayMaybeReadonly<string>): string[];
export declare function processToLinesDedupe(content: ITSValueOrArrayMaybeReadonly<string>): string[];
/**
 * 將行陣列還原為內容（LF 行尾）
 *
 * @param lines - 行陣列
 */
export declare function serializeLines(lines: ITSArrayListMaybeReadonly<string>): string;
/**
 * 取得所有規則行（過濾註解與空行）
 *
 * @param lines - 行陣列
 */
export declare function listPatternsOnly(lines: ITSArrayListMaybeReadonly<string>): string[];
/**
 * 新增多條規則並回傳新陣列
 * Add multiple rules and return a new array
 *
 * 只與「插入位置前方最近的一條規則」比對，相同即略過；
 * 不走訪整份行陣列去重——遠處的重複由 {@link finalizeIgnoreLines} 在輸出前處理。
 *
 * 註解與空行維持原位不動，新規則一律插在規則區塊的尾端；
 * 若內容以換行結尾（行陣列最後一項為空字串），則插在它之前，
 * 讓「檔案結尾換行」維持在最後一項。
 *
 * @param lines - 行陣列
 * @param patterns - 一條或多條規則
 */
export declare function addPatterns(inputLines: ITSArrayListMaybeReadonly<string>, patterns: ITSValueOrArrayMaybeReadonly<string>): string[];
/**
 * 移除多條規則並回傳新陣列；註解與空行一律保留
 * Remove multiple rules and return a new array; comments and blank lines are always kept
 *
 * @param inputLines - 行陣列
 * @param patterns - 一條或多條規則
 */
export declare function removePatterns(inputLines: ITSArrayListMaybeReadonly<string>, patterns: ITSValueOrArrayMaybeReadonly<string>): string[];
/**
 * 移除重複的規則，只保留最後一筆；註解與空行不受影響
 * Remove duplicate rules, keeping only the last occurrence; comments and blank lines are unaffected
 *
 * 以 `findLastIndex` 找出每條規則最後出現的位置，
 * 只有該位置的那一筆會被保留，其餘同名規則列一律捨棄。
 * `findLastIndex` locates the last occurrence of each rule; only the entry at
 * that position survives and every other line with the same rule is dropped.
 *
 * @param lines - 行陣列
 */
export declare function dedupeIgnorePatterns(lines: ITSArrayListMaybeReadonly<string>): string[];
/**
 * 將超過上限的連續空行縮減到上限
 * Shrink runs of blank lines beyond the upper bound down to the bound
 *
 * 末項若是空字串，代表「檔案結尾換行」而非空行，
 * 會先取出再收合，避免把結尾換行誤刪。
 * A trailing empty entry means the end-of-file newline rather than a blank line,
 * so it is taken out first and re-appended to avoid being removed.
 *
 * @param lines - 行陣列
 */
export declare function collapseIgnoreBlankLines(lines: ITSArrayListMaybeReadonly<string>): string[];
export declare function collapseIgnoreBlankLinesFromString(content: string): string;
/**
 * 輸出前整理：移除重複規則（只保留最後一筆）、收合超過上限的空行並移除首尾空行
 * Finalize before output: drop duplicate rules (keep the last one), collapse blank lines beyond the bound and strip leading/trailing blank lines
 *
 * 註解不參與去重，位置與數量都不會被更動。
 * Comments take no part in deduplication, so their position and count never change.
 *
 * @param lines - 行陣列
 * @param options - 整理選項，三項皆預設啟用 / Finalization options, all enabled by default
 */
export declare function finalizeIgnoreLines(lines: ITSArrayListMaybeReadonly<string>, options?: IFinalizeIgnoreLinesOptions): string[];
