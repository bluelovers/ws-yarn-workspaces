import { IListableRow, IListableRowExtraWithDeps } from 'ws-pkg-list/lib/types';
import { IPackageJsonDependenciesField, IDependency } from '@ts-type/package-dts/lib/package-json/types';
import { ITSPartialRecord } from 'ts-type/lib/type/record';
import { ITSRequireAtLeastOne } from 'ts-type/lib/type/record';
export interface IMap<R extends IListableRow> {
    changed: R[];
    others: R[];
    data: Record<string, string>;
}
export interface ICache<R extends IListableRow = IListableRow> {
    listable?: R[];
    record?: Record<string, R>;
    names?: string[];
    map?: IMap<R>;
}
export declare type ICacheInput<R extends IListableRow = IListableRow> = ITSRequireAtLeastOne<ICache<R>, 'listable' | 'record'>;
export declare function fixPkgDepsVersionsCore<T extends ITSPartialRecord<IPackageJsonDependenciesField, IDependency>, R extends IListableRow>(row: T, cache: ICacheInput<R>): {
    row: T;
    map: IMap<R>;
    changed: boolean;
    cache: ICache<R>;
};
export declare function fixWsVersionsCore<R extends IListableRowExtraWithDeps>(listable: R[], cwd?: string): {
    changed: R[];
    others: R[];
    data: Record<string, string>;
    cwd: string;
    listable: R[];
    record: Record<string, R>;
    names: string[];
};
export declare function fixWsVersions(cwd?: string): {
    changed: IListableRowExtraWithDeps[];
    others: IListableRowExtraWithDeps[];
    data: Record<string, string>;
    cwd: string;
    listable: IListableRowExtraWithDeps[];
    record: Record<string, IListableRowExtraWithDeps>;
    names: string[];
};
export default fixWsVersions;
