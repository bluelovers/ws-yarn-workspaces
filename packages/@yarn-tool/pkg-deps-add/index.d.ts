import { IFindRootOptions } from '@yarn-tool/find-root';
import { IPackageJson } from '@ts-type/package-dts/package-json';
import { IDependency, IPackageJsonDependenciesField, IVersionValue } from '@ts-type/package-dts/lib/package-json/types';
import { ITSArrayListMaybeReadonly } from 'ts-type/lib/type/base';
import { ITSPartialRecord } from 'ts-type/lib/type/record';
export declare const enum EnumResultAddDependencies {
    changed = 2,
    exists = 1
}
export interface IOptionsAddDepsToPackageJson extends Partial<IFindRootOptions> {
    cwd?: string;
    pkg?: IPackageJson;
    dev?: boolean;
    peer?: boolean;
    optional?: boolean;
}
export declare function _checkDependenciesExists<N extends string, T extends ITSArrayListMaybeReadonly<string>>(record: IDependency<T>, name: N): record is IDependency<T> & IDependency<N>;
export declare function checkDependenciesExists<N extends string, T extends IPackageJsonDependenciesField, P extends IPackageJson = IPackageJson>(pkg: P, field: T, name: N): pkg is P & Record<T, Record<N, IVersionValue>>;
export declare function _checkDependenciesExistsAll<N extends string, T extends IPackageJsonDependenciesField, P extends IPackageJson = IPackageJson>(pkg: P, fields: ITSArrayListMaybeReadonly<T>, name: N): {
    _exists: boolean;
    _field: IPackageJsonDependenciesField[];
} & ITSPartialRecord<IPackageJsonDependenciesField, boolean>;
export declare function checkDependenciesExistsAll<N extends string, P extends IPackageJson = IPackageJson>(pkg: P, name: N): {
    _exists: boolean;
    _field: IPackageJsonDependenciesField[];
} & ITSPartialRecord<IPackageJsonDependenciesField, boolean>;
export declare function _add_to_deps_field_core<T extends IPackageJson>(pkg: T, field: IPackageJsonDependenciesField, name: string, semver: string): T;
export declare function _add_to_deps_field(pkg: IPackageJson, field: IPackageJsonDependenciesField, name: string, semver: string, override: boolean, bool: EnumResultAddDependencies, existsOnly?: boolean): EnumResultAddDependencies;
export declare function addDependencies(pkg: IPackageJson, name: string, semver: string, options?: IOptionsAddDepsToPackageJson, override?: boolean, existsOnly?: boolean): {
    pkg: IPackageJson<unknown>;
    bool: EnumResultAddDependencies;
};
export declare function addDependenciesIfNotExists(pkg: IPackageJson, name: string, semver: string, options?: IOptionsAddDepsToPackageJson): {
    pkg: IPackageJson<unknown>;
    bool: EnumResultAddDependencies;
};
export declare function addDependenciesOverwrite(pkg: IPackageJson, name: string, semver: string, options?: IOptionsAddDepsToPackageJson): {
    pkg: IPackageJson<unknown>;
    bool: EnumResultAddDependencies;
};
export default addDependencies;
