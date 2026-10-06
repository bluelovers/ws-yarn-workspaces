/**
 * yarn.lock 去重 (Dedupe) 的轉出口：實作位於相依套件 @yarn-tool/yarnlock-dedupe/object，
 * 此處僅 re-export，讓使用端從單一入口取得去重能力（SSoT）。
 *
 * yarn.lock dedupe re-exports: implementation lives in @yarn-tool/yarnlock-dedupe/object;
 * re-exported here so consumers get dedupe capability from one entry (SSoT).
 */
import { yarnDedupe } from '@yarn-tool/yarnlock-dedupe/object';
export * from '@yarn-tool/yarnlock-dedupe/object';
/**
 * @deprecated 舊名稱，請改用 `yarnDedupe` / old alias, use `yarnDedupe` instead
 */
export { yarnDedupe as Dedupe };
/**
 * 預設匯出直接給 yarnDedupe，讓 `import dedupe from` 的用法與工具函式慣用法一致。
 *
 * Default-exports yarnDedupe so `import dedupe from` matches the usual utility convention.
 */
export default yarnDedupe;
