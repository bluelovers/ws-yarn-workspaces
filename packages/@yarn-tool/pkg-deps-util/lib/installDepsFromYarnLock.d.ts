import { IGroupYarnLockParsedEntriesOptions } from '@yarn-tool/yarnlock-util/lib/util/groupYarnLockParsedEntries';
import { IComputedPackageEntries } from '@yarn-tool/yarnlock-util/lib/util/reduceYarnLockParsedEntries';
import { IParseNameAndVersionWithNpaResult } from '@yarn-tool/yarnlock-util/lib/types';
import { IAddedList, IFilteredRecord, IOptionsInstallDepsFromYarnLock } from './types';
import { IYarnLockParsedV1, IYarnLockParsedV2 } from '@yarn-tool/yarnlock-types';
/**
 * 自已解析的 yarn.lock 中取出指定套件的條目
 *
 * Pick the entries of the given packages out of a parsed yarn.lock.
 *
 * @param packageNames 要查找的套件名稱 (Package names to look up)
 * @param parsedOldPackage 已解析的 lock 內容，相容 v1 / v2 格式 (Parsed lock, v1 or v2)
 * @param options 分組選項，可用 `names` 覆寫要分組的鍵 (Grouping options, `names` overrides keys)
 *
 * @returns 以套件名稱為鍵的條目集合；查不到的名稱不會出現在回傳值中
 *
 * Entries keyed by package name; names without a match are simply absent.
 */
export declare function filterDepsFromYarnLock<T extends string>(packageNames: T[], parsedOldPackage: IYarnLockParsedV1 | IYarnLockParsedV2, options?: IGroupYarnLockParsedEntriesOptions): IFilteredRecord<IComputedPackageEntries<IParseNameAndVersionWithNpaResult>, T>;
/**
 * 依 yarn.lock 的解析結果寫入依賴 (Write dependencies based on yarn.lock)
 *
 * Writes dependencies using the versions resolved in yarn.lock.
 *
 * @param packageNames 要安裝的套件名稱或查詢字串 (Names or specifiers to install)
 * @param parsedOldPackage 已解析的 yarn.lock 內容 (The parsed yarn.lock)
 * @param options 安裝與查詢選項 (Install and query options)
 *
 * @returns 與其他安裝函式一致的回傳結構；lock 內找不到可用版本的套件會落在 `others`
 *
 * Same result shape as the other install helpers; packages without a usable
 * version in the lock end up in `others`.
 */
export declare function installDepsFromYarnLockCore<T extends string>(packageNames: T[], parsedOldPackage: IYarnLockParsedV1 | IYarnLockParsedV2, options?: IOptionsInstallDepsFromYarnLock): Promise<{
    cwd: string;
    rootData: import("@yarn-tool/find-root").IFindRootReturnType;
    added: IAddedList;
    exists: string[];
    others: T[];
    pkg: import("@ts-type/package-dts").IPackageJson<unknown>;
    updated: boolean;
}>;
/**
 * 檢查並且過濾要安裝的版本是否已經存在於 yarn.lock 內
 *
 * Check and filter whether the versions to install already exist in yarn.lock.
 *
 * @param packageNames 要安裝的套件名稱或查詢字串 (Names or specifiers to install)
 * @param options 安裝選項，可指定 `cwd` 與 `pkg` (Install options, `cwd` and `pkg`)
 *
 * @returns 若有 lock 條目可比對則回傳安裝結果；無 lock 或清單為空時回傳 `undefined`，
 * 呼叫端需自行處理此情況。
 *
 * Returns the install result when there are lock entries to compare against;
 * returns `undefined` when there is no lock or the list is empty, which callers
 * must handle.
 */
export declare function installDepsFromYarnLock<T extends string>(packageNames: T[], options?: IOptionsInstallDepsFromYarnLock): Promise<{
    cwd: string;
    rootData: import("@yarn-tool/find-root").IFindRootReturnType;
    added: IAddedList;
    exists: string[];
    others: T[];
    pkg: import("@ts-type/package-dts").IPackageJson<unknown>;
    updated: boolean;
}>;
