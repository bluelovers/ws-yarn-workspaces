/**
 * yarn.lock 差異比較 (Diff) 的轉出口：實作位於相依套件 @yarn-tool/yarnlock-diff，
 * 此處僅 re-export，讓使用端從單一入口取得 diff 能力（SSoT）。
 *
 * yarn.lock diff re-exports: implementation lives in @yarn-tool/yarnlock-diff;
 * re-exported here so consumers get diff capability from one entry (SSoT).
 */
import { yarnLockDiff } from '@yarn-tool/yarnlock-diff';
import { _diffArray } from '@yarn-tool/yarnlock-diff/lib/formatter/diffArray002';

/**
 * 比較兩份 yarn.lock 內容並回傳可讀的差異字串，供 CLI 顯示變更結果。
 *
 * Compares two yarn.lock contents and returns a human-readable diff string for CLI output.
 */
export { yarnLockDiff }

/**
 * 產出差異陣列的底層格式化工具，供需要自行排版差異的進階用途。
 *
 * Low-level formatter producing a diff array, for advanced callers that render diffs themselves.
 */
export { _diffArray }

/**
 * 預設匯出直接給 yarnLockDiff，讓 `import diff from` 的用法與工具函式慣用法一致。
 *
 * Default-exports yarnLockDiff so `import diff from` matches the usual utility convention.
 */
export default yarnLockDiff
