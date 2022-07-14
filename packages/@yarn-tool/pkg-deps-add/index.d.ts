import { IFindRootOptions } from '@yarn-tool/find-root';
import { IPackageJson } from '@ts-type/package-dts/package-json';
import { IPackageJsonDependenciesField } from '@ts-type/package-dts/lib/package-json/types';
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
export declare function _add_to_deps_field_core<T extends IPackageJson>(pkg: T, field: IPackageJsonDependenciesField, name: string, semver: string): T;
export declare function _add_to_deps_field(pkg: IPackageJson, field: IPackageJsonDependenciesField, name: string, semver: string, override: boolean, bool: EnumResultAddDependencies, existsOnly?: boolean): EnumResultAddDependencies;
export declare function addDependencies(pkg: IPackageJson, name: string, semver: string, options?: IOptionsAddDepsToPackageJson, override?: boolean, existsOnly?: boolean): {
    pkg: IPackageJson<any>;
    bool: EnumResultAddDependencies;
};
export declare function addDependenciesIfNotExists(pkg: IPackageJson, name: string, semver: string, options?: IOptionsAddDepsToPackageJson): {
    pkg: IPackageJson<any>;
    bool: EnumResultAddDependencies;
};
export declare function addDependenciesOverwrite(pkg: IPackageJson, name: string, semver: string, options?: IOptionsAddDepsToPackageJson): {
    pkg: IPackageJson<any>;
    bool: EnumResultAddDependencies;
};
export default addDependencies;
