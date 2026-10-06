/**
 * Created by user on 2020/6/5.
 */
import IPackageJson from '@ts-type/package-dts';
import { ITSPartialRecord } from 'ts-type';
import { IPackageJsonDependenciesField, IDependency } from '@ts-type/package-dts/lib/package-json/types';
/**
 * readPackages() 回傳的單一套件資料，包含路徑資訊與解析後的 package.json 內容。
 * Per-package data returned by `readPackages()`, pairing path info with the parsed `package.json` content.
 *
 * @param T package.json 的型別預設為 IPackageJson。The `package.json` type, defaulting to `IPackageJson`.
 */
export type IReadPackage<T = IPackageJson> = {
    /** 套件名稱（package.json 的 name）。Package name from `package.json`. */
    name: string;
    /** 相對於 cwd 或工作區根目錄的路徑。Path relative to `cwd` or the workspace root. */
    path: string;
    /** 套件資料夾的絕對路徑。Absolute path of the package folder. */
    fullpath: string;
    /** package.json 檔案的完整路徑。Full path of the `package.json` file. */
    manifestLocation: string;
    /** 解析後的 package.json 內容。The parsed `package.json` content. */
    config: {
        name: string;
        version: string;
        private?: boolean;
        [k: string]: unknown;
    } & T;
};
/**
 * 可列表（Listable）列的基礎欄位，供 wsPkgListable 等函式共用。
 * Base fields of a listable row, shared by functions such as `wsPkgListable`.
 */
export interface IListableRowBase {
    name: string;
    version: string;
    "private": boolean;
    /**
     * 套件資料夾的位置。
     * Location of the package folder.
     */
    location: string;
}
/**
 * 具備 package.json 位置的列，用於需要讀取 manifest 的場景。
 * Row that also carries the `package.json` location, for consumers that need to read the manifest.
 */
export interface IListableRow extends IListableRowBase {
    /**
     * package.json 檔案的位置。
     * Location of `package.json`.
     */
    manifestLocation: string;
}
/**
 * 額外帶有 prefix（相對於根目錄的前綴）的列型別。
 * Row variant that also carries a `prefix` relative to the root directory.
 */
export type IListableRowExtra<T extends IListableRow = IListableRow> = T & {
    prefix: string;
};
/**
 * 以套件名稱為鍵、IReadPackage 為值的索引結構。
 * Index structure keyed by package name with `IReadPackage` values.
 */
export interface IReadedPackages<T = IPackageJson> {
    [k: string]: IReadPackage<T>;
}
/**
 * wsPkgListable 系列函式的選項，可透過程式化 handler 自訂或過濾每一列。
 * Options for the `wsPkgListable` family; a programmatic `handler` can customize or filter each row.
 */
export interface IOptionsPkgListable<R extends IListableRow = IListableRow> {
    /** 回傳自訂列，或拋出錯誤以中斷處理。Return a customized row, or throw to abort processing. */
    handler?(row: IListableRow, pkg: IPackageJson): R;
}
/**
 * 各種依賴欄位（dependencies 等）的集合，由 wsPkgDepsListable 併入列中。
 * Aggregates the dependency fields (e.g. `dependencies`) merged into rows by `wsPkgDepsListable`.
 */
export interface IListableRowWithDeps extends IListableRow, ITSPartialRecord<IPackageJsonDependenciesField, IDependency> {
}
/**
 * 同時具備依賴欄位與 prefix 的列型別，為 wsPkgDepsListable 的回傳元素。
 * Row with both dependency fields and `prefix`; the element type returned by `wsPkgDepsListable`.
 */
export interface IListableRowExtraWithDeps extends IListableRowExtra<IListableRowWithDeps> {
}
