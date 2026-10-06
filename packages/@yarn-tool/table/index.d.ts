/**
 * 模組入口：彙整並再匯出 yarn-tool 共用的 CLI 表格工具。
 * 集中於此單一入口（Single Entry）再匯出，讓使用端只需引用套件名稱，
 * 不必知道內部 `lib/` 的目錄結構。
 *
 * Module entry: re-exports the shared CLI table utilities of yarn-tool.
 * Everything is gathered into this single entry so consumers only need to
 * import the package name without knowing the internal `lib/` layout.
 *
 * Created by user on 2020/6/11.
 */
import CliTable from 'cli-table3';
export * from './lib/types';
export * from './lib/deps-table';
export * from './lib/core';
export * from './lib/style';
/**
 * 以 `CliTable` 與 `Table` 兩個名稱同時匯出 `cli-table3` 的建構子，
 * 相容不同命名偏好的使用端（既有程式碼大多使用 `Table` 這個名稱）。
 *
 * Exports the `cli-table3` constructor under both `CliTable` and `Table`
 * names to accommodate consumers with different naming preferences
 * (existing code mostly uses the name `Table`).
 */
export { CliTable };
export { CliTable as Table };
/**
 * 預設匯出即為 `cli-table3` 建構子，讓 `import Table from '@yarn-tool/table'`
 * 的用法與直接使用 `cli-table3` 一致。
 *
 * The default export is the `cli-table3` constructor, so
 * `import Table from '@yarn-tool/table'` behaves the same as using
 * `cli-table3` directly.
 */
export default CliTable;
