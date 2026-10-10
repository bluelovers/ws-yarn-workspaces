import { ITSArrayListMaybeReadonly } from 'ts-type';
/**
 * 取得插入位置前方最近的一條規則，沒有則回傳 `undefined`
 *
 * 空行與註解不算規則，會被略過繼續向前找；
 * 因此「新增」只需比對這一個值，不必走訪整份行陣列去重。
 *
 * @param lines - 行陣列
 * @param index - 插入位置（不含），由此向前搜尋
 */
export declare function precedingPattern(lines: readonly string[], index: number): string | undefined;
/**
 * 判斷「新增」時是否應略過目前這條規則
 * Decide whether the rule being added should be skipped
 *
 * 由插入位置向前找「最近的一條規則」（跳過空行與註解）：
 * - 與目前規則相同 → `true`，略過不重複插入
 * - 不同、且不屬於本次批次 → `false`，前方已有其他規則，直接插入
 * - 走到開頭都只有本批次的規則 → falsy（`undefined`），一樣直接插入
 *
 * 因此「新增」只需比對這一個結果，不必走訪整份行陣列去重。
 * Searching backwards for the nearest rule (skipping blanks and comments):
 * the same rule returns `true` (skip the duplicate); a different rule outside the
 * batch returns `false`; reaching the start with only in-batch rules returns a
 * falsy `undefined` — both insert. Adding therefore only needs this one result
 * instead of deduping the whole line array.
 *
 * @param lines - 行陣列
 * @param index - 搜尋起點（不含），由插入位置向前
 * @param patterns - 本次批次的規則
 * @param value - 目前要插入的規則
 */
export declare function precedingPattern2(lines: readonly string[], index: number, patterns: readonly string[], value: string): boolean;
/**
 * 檢查是否已存在相同規則（忽略前後空白）
 *
 * 逐行轉成 {@link ILineToken} 後比對 `token.line`：
 * 空白只在轉換時處理一次，且只有規則行才算數——
 * 內容與規則相同的註解行不算已存在。
 *
 * @param lines - 行陣列
 * @param pattern - 規則
 */
export declare function hasPattern(lines: ITSArrayListMaybeReadonly<string>, pattern: string): boolean;
