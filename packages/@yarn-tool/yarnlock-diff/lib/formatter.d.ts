/**
 * 格式化（Formatter）模組的統一入口，刻意只轉發給 `buildDiffTable002`。
 * Single entry point of the formatter module, deliberately re-exporting only
 * `buildDiffTable002`.
 *
 * `buildDiffTable001` 是舊版實作（依賴未列入 dependencies 的 `cli-table` 與 `chalk`），
 * 保留檔案僅供比對，不從此處曝光，以免呼叫端誤用。
 * `buildDiffTable001` is the legacy implementation (it relies on `cli-table` and `chalk`, which
 * are not listed in dependencies); the file is kept only for reference and is not exposed here
 * so callers cannot pick it by accident.
 */
export { buildDiffTable } from './formatter/buildDiffTable002';
