/**
 * Created by user on 2020/6/11.
 */
import { ITSArrayListMaybeReadonly, ITSValueOfArray } from 'ts-type';
import { IDependency } from '@yarn-tool/table/lib/types';
export declare type IVersionValue = 'latest' | '*' | string | EnumVersionValue | EnumVersionValue2;
export declare enum EnumVersionValue {
    'major' = "major",
    'minor' = "minor",
    'latest' = "latest",
    'greatest' = "greatest",
    'newest' = "newest"
}
export declare enum EnumPackageManagersNpmMethod {
    'major' = "greatestMajor",
    'minor' = "greatestMinor",
    'latest' = "latest",
    'greatest' = "greatest",
    'newest' = "newest"
}
export declare const enum EnumVersionValue2 {
    any = "*"
}
declare module '@yarn-tool/table/lib/types' {
    interface IDependency {
        [name: string]: IVersionValue;
    }
}
export type { IDependency };
export type { IDependency as IPackageMap };
export interface IYarnLockfileParseFull<T extends ITSArrayListMaybeReadonly<string> = string[]> {
    type: string | 'success' | 'merge' | 'conflict';
    object: IYarnLockfileParseObject<T>;
}
export declare type IYarnLockfileParseObject<T extends ITSArrayListMaybeReadonly<string> = string[]> = Record<string, IYarnLockfileParseObjectRow<T>>;
/**
 * yarn.lock 資料
 */
export interface IYarnLockfileParseObjectRow<T extends ITSArrayListMaybeReadonly<string> = string[]> {
    version: string;
    /**
     * 安裝來源網址
     */
    resolved: string;
    /**
     * hash key
     */
    integrity: string;
    /**
     * 依賴列表
     */
    dependencies?: IDependencies<T>;
}
export declare type IDependencies<T extends ITSArrayListMaybeReadonly<string> = string[]> = Record<ITSValueOfArray<T>, string>;
export interface IFilterResolutions<T extends ITSArrayListMaybeReadonly<string>> {
    /**
     * yarn.lock key 列表
     */
    names: T;
    /**
     * 過濾後的 yarn lock deps
     */
    deps: {
        [P in (keyof ITSValueOfArray<T> | string)]: {
            [P in IVersionValue]: IYarnLockfileParseObjectRow<T>;
        };
    };
    /**
     * 實際安裝的版本編號
     */
    installed?: {
        [P in ITSValueOfArray<T>]: IVersionValue[];
    };
    /**
     * 每個模組最大的安裝版本
     */
    max?: {
        [P in ITSValueOfArray<T>]: {
            key: ITSValueOfArray<T>;
            value: IYarnLockfileParseObjectRow<T>;
        };
    };
}
export interface IRemoveResolutions<T extends ITSArrayListMaybeReadonly<string>> {
    /**
     * 執行前的 yarn.lock
     */
    yarnlock_old: IYarnLockfileParseObject<T>;
    /**
     * 執行後的 yarn.lock
     */
    yarnlock_new: IYarnLockfileParseObject<T>;
    /**
     * yarn.lock 是否有變動
     */
    yarnlock_changed: boolean;
    result: IFilterResolutions<T>;
}
