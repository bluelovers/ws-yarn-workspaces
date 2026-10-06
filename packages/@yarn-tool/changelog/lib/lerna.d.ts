/**
 * Lerna 相關 API 的轉出口 (Re-exports of the Lerna related APIs)
 * 說明：這裡刻意只做彙整轉出，讓 `lib/lerna` 成為一個穩定的匯入面；
 * 同時再次轉出 `./types`，使既有 `import ... from '../types'` 與
 * `import ... from './lerna'` 都能取得同一份型別（避免型別重複定義）。
 * Why: it only aggregates re-exports so `lib/lerna` stays a stable import surface;
 * `./types` is re-exported as well so both `from '../types'` and `from './lerna'`
 * resolve to the same type definitions (no duplicated types).
 *
 * @module lerna
 */
export * from './types';
export * from './lerna/recommend';
export * from './lerna/update';
export * from './lerna/from-list';
/**
 * 模組命名空間預設導出，方便 `import lerna from './lib/lerna'` 取得完整 API
 * Default namespace export, so `import lerna from './lib/lerna'` exposes the full API
 */
declare const _default: typeof import("./lerna");
export default _default;
