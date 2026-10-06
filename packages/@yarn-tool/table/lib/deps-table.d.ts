/**
 * 將更新前後的兩份依賴清單轉為「版本差異」表格 (Version Diff Table)。
 *
 * Converts two dependency maps (before/after) into a version diff table.
 *
 * Created by user on 2020/6/11.
 */
import { IOptionsParseVersionsDiff } from '@yarn-tool/semver-diff';
import { IDependency } from './types';
/**
 * 建立版本差異表格。
 *
 * 以 `to`（更新後）的鍵為準遍歷，因為「新增的依賴」只可能存在於 `to`；
 * 若改以 `from` 為準，會漏掉新套件。`from` 中不存在的依賴其舊版本欄
 * 以空字串填補，避免輸出 `undefined`。
 *
 * Builds a version diff table.
 *
 * Iterates over the keys of `to` (the updated set) because a newly added
 * dependency can only exist there — iterating `from` would miss new packages.
 * A missing "from" version is padded with an empty string so the output never
 * contains `undefined`.
 *
 * @param args.from - 更新前的依賴清單 / Dependency map before the update
 * @param args.to - 更新後的依賴清單 / Dependency map after the update
 * @param args.options - 版本差異著色選項 / Options for colorizing the version diff
 * @returns 已填入資料列的表格實例 / A table instance with rows already pushed
 */
export declare function toDependencyTable(args: {
    from: IDependency;
    to: IDependency;
    options?: IOptionsParseVersionsDiff;
}): import("cli-table3").Table;
export default toDependencyTable;
