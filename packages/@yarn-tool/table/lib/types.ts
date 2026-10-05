/**
 * 共用型別 (Shared Types) 的單一事實來源 (Single Source of Truth)：
 * 將 `cli-table3` 與套件內部使用的依賴型別集中再匯出，
 * 讓使用端只依賴本套件即可取得表格相關型別，避免各處重複宣告。
 *
 * Single source of truth for shared types: re-exports table-related types from
 * `cli-table3` together with the dependency type used internally, so consumers
 * only need to depend on this package instead of declaring them everywhere.
 */
import { Cell } from 'cli-table3';

/**
 * `cli-table3` 的表格與單元格 (Cell) 相關型別，統一以 `I` 前綴命名，
 * 以符合本 monorepo 的介面命名慣例。
 *
 * Table and cell types from `cli-table3`, all renamed with an `I` prefix to
 * follow this monorepo's interface naming convention.
 */
export type {
	Table as ITable,
	TableConstructorOptions as ITableConstructorOptions,
	Cell as ICell,
	HorizontalAlignment as IHorizontalAlignment,
	VerticalAlignment as IVerticalAlignment,
} from 'cli-table3';

/**
 * 依賴清單 (Dependency Map) 型別，定義於 `@ts-type/package-dts` 的
 * `package.json` 型別中；此處再匯出供 `toDependencyTable` 等 API 使用。
 *
 * Dependency map type defined in `@ts-type/package-dts`'s `package.json` types;
 * re-exported here for APIs such as `toDependencyTable`.
 */
export type { IDependency } from '@ts-type/package-dts/lib/package-json/types';
