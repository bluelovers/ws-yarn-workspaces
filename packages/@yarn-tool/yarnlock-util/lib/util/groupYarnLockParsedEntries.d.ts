import { IParseNameAndVersionWithNpaResult } from '../types';
import { IComputedPackageEntries } from './reduceYarnLockParsedEntries';
import { IYarnLockDataRowV1, IYarnLockDataRowV2, IYarnLockParsedV1, IYarnLockParsedV2 } from '@yarn-tool/yarnlock-types';
/**
 * `groupYarnLockParsedEntries` 的選項。
 * Options for `groupYarnLockParsedEntries`.
 */
export interface IGroupYarnLockParsedEntriesOptions {
    /**
     * 只保留這些套件名；省略或傳入空陣列代表不過濾。
     * Keep only these package names; omitted or an empty array means "no filtering".
     */
    names?: string[];
}
/**
 * 把一份已解析的 lockfile 依套件名分組，值為 `[版本, 解析結果]` 陣列。
 * Group one parsed lockfile by package name, with `[version, parse result]` pairs as values.
 *
 * 與 `reduceYarnLockParsedEntries` 的差別在於：這裡負責「挑解析器」與「套件名過濾」
 * 兩件版本相關的事，歸約本身則直接沿用同模組的通用實作。
 * Compared to `reduceYarnLockParsedEntries`, this function owns the two version-specific
 * concerns — picking the parser and filtering by package name — while delegating the actual
 * accumulation to the shared generic implementation.
 *
 * @param parsedOldPackage 已解析的 v1 或 v2 lockfile / A parsed v1 or v2 lockfile
 * @param options 選項，目前只有 `names` 過濾 / Options, currently only the `names` filter
 * @returns 套件名 → `[version, IParseNameAndVersionWithNpaResult][]` /
 *          Package name → `[version, IParseNameAndVersionWithNpaResult][]`
 * @throws lockfile 版本不受支援時拋出 / Thrown when the lockfile version is unsupported
 */
export declare function groupYarnLockParsedEntries<R extends IYarnLockDataRowV1 | IYarnLockDataRowV2 = IYarnLockDataRowV1 | IYarnLockDataRowV2>(parsedOldPackage: IYarnLockParsedV1 | IYarnLockParsedV2, options?: IGroupYarnLockParsedEntriesOptions): IComputedPackageEntries<IParseNameAndVersionWithNpaResult>;
