/**
 * 依賴寫入函式的再匯出 (Re-exports of the dependency write helpers)
 *
 * 這些函式實際實作於 `@yarn-tool/pkg-deps-add`；此處再匯出是為了讓既有使用端
 * 可繼續以 `pkg-deps-util` 的路徑存取，維持向後相容。
 *
 * The functions live in `@yarn-tool/pkg-deps-add`; re-exporting them keeps the
 * old `pkg-deps-util` import paths working for existing consumers.
 */
export { _add_to_deps_field, addDependencies, addDependenciesIfNotExists, } from '@yarn-tool/pkg-deps-add';
