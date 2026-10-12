import { ITSArrayListMaybeReadonly, ITSValueOrArrayMaybeReadonly } from 'ts-type';
import { IFinalizeIgnoreLinesOptions, IIgnoreFileOptions } from './types';
/**
 * 處理內容為行陣列
 *
 * @param content - 檔案內容
 */
export declare function processToLines(content: ITSValueOrArrayMaybeReadonly<string>): string[];
/**
 * 處理內容為行陣列並移除重複行（先出現者被移除）
 * Process content into a line array and drop duplicated lines (earlier ones removed)
 *
 * @param content - 檔案內容
 */
export declare function processToLinesDedupe(content: ITSValueOrArrayMaybeReadonly<string>): string[];
/**
 * 將行陣列還原為內容（LF 行尾）
 *
 * @param lines - 行陣列
 */
export declare function serializeLines(lines: ITSArrayListMaybeReadonly<string>): string;
/**
 * 將行陣列還原為內容，並在添加指定數量的換行
 *
 * @param lines - 行陣列
 * @param endCount - 結尾換行數量
 */
export declare function stringifyLines(lines: ITSArrayListMaybeReadonly<string>, options?: IIgnoreFileOptions): string;
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
 * 註解與空行維持原位不動，新規則一律接在行陣列的最後；
 * 檔案結尾換行不依賴行陣列末項，而由 `IgnoreFile` 的 `endCount` 還原。
 * Comments and blank lines stay in place; new rules are appended at the very end
 * of the array. The end-of-file newline does not rely on the last entry but is
 * restored from the `IgnoreFile`'s `endCount`.
 *
 * @param inputLines - 行陣列
 * @param patterns - 一條或多條規則
 */
export declare function addPatterns(inputLines: ITSArrayListMaybeReadonly<string>, patterns: ITSValueOrArrayMaybeReadonly<string>, force?: boolean): string[];
/**
 * 移除多條規則並回傳新陣列；註解與空行一律保留
 * Remove multiple rules and return a new array; comments and blank lines are always kept
 *
 * @param inputLines - 行陣列
 * @param patterns - 一條或多條規則
 */
export declare function removePatterns(inputLines: ITSArrayListMaybeReadonly<string>, patterns: ITSValueOrArrayMaybeReadonly<string>): string[];
/**
 * 將超過上限的連續空行縮減到上限
 * Shrink runs of blank lines beyond the upper bound down to the bound
 *
 * 每一段連續空行各自計算：被註解或規則分隔的空行不會跨段收合；
 * 超過 {@link EnumConst.MAX_BLANK_LINES} 的部分一律丟棄，包含末項的空字串。
 * 檔案結尾換行不存於行陣列，而由 `IgnoreFile` 的 `endCount` 還原，
 * 因此收合末項空行不會影響實際輸出的結尾換行。
 * Each run of blank lines is counted on its own — a run separated by a comment
 * or a rule never merges with another. Everything beyond
 * {@link EnumConst.MAX_BLANK_LINES} is dropped, including a trailing empty entry.
 * The end-of-file newline is not stored in the line array but restored from the
 * `IgnoreFile`'s `endCount`, so collapsing a trailing blank run does not change
 * the newlines actually written out.
 *
 * @param lines - 行陣列
 * @param options - 預留參數：本函式不依賴任何選項，
 * 型別與其他整理步驟一致，只是為了能整袋 {@link IFinalizeIgnoreLinesOptions} 直接傳入
 */
export declare function collapseIgnoreBlankLines(lines: ITSArrayListMaybeReadonly<string>, options?: IFinalizeIgnoreLinesOptions): string[];
/**
 * {@link collapseIgnoreBlankLines} 的字串版本：直接對內容收合連續換行
 * String counterpart of {@link collapseIgnoreBlankLines}: collapses blank runs in place
 *
 * 上限與 {@link EnumConst.MAX_BLANK_LINES} 一致（收合成 3 個換行）；
 * 行模型版本較精確，一般情況優先使用 {@link collapseIgnoreBlankLines}。
 * The bound matches {@link EnumConst.MAX_BLANK_LINES} (3 newlines); the line-model
 * version is the more precise one, so prefer {@link collapseIgnoreBlankLines}.
 */
export declare function collapseIgnoreBlankLinesFromString(content: string): string;
/**
 * 輸出前整理：移除重複的規則與重複的註解（皆只保留最後一筆）、收合超過上限的空行並移除首尾空行
 * Finalize before output: drop duplicate rules and duplicate comments (both keep only the last one), collapse blank lines beyond the bound and strip leading/trailing blank lines
 *
 * 規則行與註解行預設一起去重（重複的註解只留下最後一筆），
 * 傳 `disableDedupePatternsComment: true` 可只對規則行去重；
 * 空行永遠允許重複，其收合與移除首尾各自獨立處理。
 * Rule and comment lines are deduplicated together by default (a duplicated
 * comment keeps only its last occurrence); passing `disableDedupePatternsComment`
 * as `true` deduplicates rule lines only. Blank lines may always repeat, and
 * collapsing them plus stripping the ends are handled as separate steps.
 *
 * @param lines - 行陣列
 * @param options - 整理選項，四項皆預設執行，傳 `true` 才停用個別項目 /
 * Finalization options; all steps run by default, an explicit `true` disables that step
 */
export declare function finalizeIgnoreLines(lines: ITSArrayListMaybeReadonly<string>, options?: IFinalizeIgnoreLinesOptions): string[];
