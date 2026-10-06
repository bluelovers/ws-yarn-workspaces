import { IYarnLockDataRowV1, IYarnLockDataRowV2, IYarnLockParsedV1, IYarnLockParsedV2 } from '@yarn-tool/yarnlock-types';
/**
 * 依套件名分組後的容器：套件名 → `[列鍵, 列資料]` 陣列。
 * The container after grouping by package name: package name → array of `[row key, row data]`.
 *
 * 保留列鍵（而非只存解析結果）是為了讓呼叫端能重建原始區塊或做差異比對。
 * The row key is kept (rather than only the parsed result) so callers can rebuild the original
 * block or diff it later.
 */
export interface IComputedPackageEntries<T> {
    [packageName: string]: [key: string, data: T][];
}
/**
 * 對一份已解析的 lockfile 逐列執行自訂歸約（Reduce），是本套件整檔處理的最底層工具。
 * Run a custom reduction over every row of one parsed lockfile; this is the lowest-level
 * whole-file tool in this package.
 *
 * 採用 `reduce` 語意而非回傳新陣列，是因為使用者常要把結果累積成 map、
 * 計數或字串，一次走訪即可完成，不必先產生中間資料。
 * A `reduce` shape is used instead of returning a new array because callers usually accumulate
 * into a map, a counter, or a string; a single pass finishes the job without an intermediate
 * structure.
 *
 * @param alreadyComputedPackage 初始累積值（例如 `{}` 或 `[]`） / The initial accumulator
 *                               (for example `{}` or `[]`)
 * @param parsedOldPackage 已解析的 v1 或 v2 lockfile / A parsed v1 or v2 lockfile
 * @param fn 每列呼叫一次，回傳下一轮的累積值 / Called once per row, returns the next accumulator
 * @returns 歸約後的結果 / The reduced result
 * @throws lockfile 版本不受支援時拋出 / Thrown when the lockfile version is unsupported
 */
export declare function reduceYarnLockParsedEntries<T, R extends IYarnLockDataRowV1 | IYarnLockDataRowV2 = IYarnLockDataRowV1 | IYarnLockDataRowV2>(alreadyComputedPackage: T, parsedOldPackage: IYarnLockParsedV1 | IYarnLockParsedV2, fn: (alreadyComputedPackage: T, row: [key: string, packageData: R], index: number, parsedOldPackage: IYarnLockParsedV1 | IYarnLockParsedV2) => T): T;
