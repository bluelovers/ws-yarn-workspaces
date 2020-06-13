/**
 * Created by user on 2020/6/5.
 */
import IPackageJson from '@ts-type/package-dts';
import { ITSPartialRecord } from 'ts-type';
import { IPackageJsonDependenciesField, IDependency } from '@ts-type/package-dts/lib/package-json/types';
export declare type IReadPackage<T = IPackageJson> = {
    name: string;
    path: string;
    fullpath: string;
    config: {
        name: string;
        version: string;
        private?: boolean;
        [k: string]: unknown;
    } & T;
};
export interface IListableRow {
    name: string;
    version: string;
    "private": boolean;
    location: string;
}
export declare type IListableRowExtra<T extends IListableRow = IListableRow> = T & {
    prefix: string;
};
export interface IReadedPackages<T = IPackageJson> {
    [k: string]: IReadPackage<T>;
}
export interface IOptionsPkgListable<R extends IListableRow = IListableRow> {
    handler?(row: IListableRow, pkg: IPackageJson): R;
}
export interface IListableRowWithDeps extends IListableRow, ITSPartialRecord<IPackageJsonDependenciesField, IDependency> {
}
export interface IListableRowExtraWithDeps extends IListableRowExtra<IListableRowWithDeps> {
}
