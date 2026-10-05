/**
 * yarn-tool 系列套件共用的 yargs 相關工具型別 (Utility Types)。
 * 全部為純型別匯出，編譯後不產生任何執行期程式碼。
 *
 * Shared yargs-related utility types for yarn-tool packages.
 * All exports are type-only and produce no runtime code once compiled.
 */

/**
 * 此處匯入的 `Arguments`、`Argv`、`Omit` 皆為 yargs 的型別定義：
 * `Omit` 雖為 TypeScript 內建，但 yargs 有自行再匯出，沿用既有匯入
 * 可避免同時存在兩個來源的 `Omit` 造成型別解析上的差異。
 *
 * The imported `Arguments`, `Argv`, and `Omit` are all yargs type definitions.
 * `Omit` is also built into TypeScript, but yargs re-exports its own; keeping
 * the existing import avoids subtle type-resolution differences between two
 * sources of `Omit`.
 */
import { Arguments, Argv, Omit } from 'yargs';

/**
 * 從 `Argv` 實例型別解包 (Unpack) 出其攜帶的選項型別 (Options Type)。
 *
 * 以條件型別 (Conditional Type) 對 `Argv<infer O>` 進行推斷 (infer)：
 * 傳入的 `T` 若不是 `Argv`，將落入 `never` 分支，讓錯誤的用法在型別層級
 * 即可被發現，而不是在執行期才出錯。
 *
 * Unpacks the options type carried by an `Argv` instance type.
 *
 * Uses a conditional type to infer `O` from `Argv<infer O>`: when `T` is not
 * an `Argv`, the type falls into the `never` branch so incorrect usage is
 * caught at the type level rather than at runtime.
 *
 * @typeParam T - 某個 `Argv` 實例的型別 / An `Argv` instance type
 */
export type IYargsUnPackArgv<T extends Argv<any>> = T extends Argv<infer O> ? O : never;

/**
 * 將 `Arguments<T>` 的所有鍵以映射型別 (Mapped Type) 重述為相同型別的記錄 (Record)。
 *
 * 雖然結構上等同 `Arguments<T>`，轉寫成 `{ [key in keyof ...] }` 形式後，
 * 後續可較容易再做鍵的篩選或修飾（例如加上 `readonly`、剔除特定鍵）。
 *
 * Rebuilds every key of `Arguments<T>` as a record of the same type via a
 * mapped type.
 *
 * Structurally identical to `Arguments<T>`, but written as `{ [key in keyof ...] }`
 * so it is easier to further filter or decorate keys later (e.g. adding
 * `readonly` or dropping specific keys).
 *
 * @typeParam T - 選項型別 / The options type
 */
export type IYargsArgumentsRecord<T> = {
	[key in keyof Arguments<T>]: Arguments<T>[key]
}

/**
 * 「同步」版的 `Argv` 型別：將非同步 (Asynchronous) 的 `argv` 換成同步型別。
 *
 * `Omit` 先移除原本的 `argv`（其型別為可能為 `Promise` 的 `parse()` 結果），
 * 再以交集 (Intersection) 補回同步版本；`Exclude<..., Promise<any>>` 只保留
 * 非 `Promise` 的分支，因此對應到 `parse()` 而非 `parseAsync()` 的使用方式。
 *
 * The "synchronous" `Argv` type: replaces the asynchronous `argv` with a
 * synchronous one.
 *
 * `Omit` first drops the original `argv` (whose type may be a `Promise` from
 * `parse()`), then an intersection adds the synchronous version back;
 * `Exclude<..., Promise<any>>` keeps only the non-`Promise` branch, matching
 * `parse()` rather than `parseAsync()`.
 *
 * @typeParam T - 選項型別 / The options type
 */
export type IYargsArgvSync<T> = Omit<Argv<T>, 'argv'> & {
	argv: Exclude<Argv<T>["argv"], Promise<any>>
}

/**
 * 由 `Argv` 實例型別直接取得「同步」版 `Argv` 型別的便利別名。
 *
 * 先以 `IYargsUnPackArgv<T>` 解包出選項型別，再交給 `IYargsArgvSync`
 * 套用同步 `argv`，等同兩者的組合。
 *
 * Convenience alias that derives a synchronous `Argv` type straight from an
 * `Argv` instance type.
 *
 * Unpacks the options type via `IYargsUnPackArgv<T>` first, then applies the
 * synchronous `argv` through `IYargsArgvSync` — effectively their composition.
 *
 * @typeParam T - 某個 `Argv` 實例的型別 / An `Argv` instance type
 */
export type IYargsSync<T extends Argv<any>> = IYargsArgvSync<IYargsUnPackArgv<T>>
