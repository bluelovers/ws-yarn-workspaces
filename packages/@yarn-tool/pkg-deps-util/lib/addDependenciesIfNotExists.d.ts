import { IPackageJson } from '@ts-type/package-dts';
import { IOptionsInstallDepsFromWorkspaces } from './types';
import { IPackageJsonDependenciesField } from '@ts-type/package-dts/lib/package-json/types';
export declare function addDependencies(pkg: IPackageJson, name: string, semver: string, options?: IOptionsInstallDepsFromWorkspaces, override?: boolean): {
    pkg: IPackageJson<any>;
    bool: boolean;
};
export declare function _add_to_deps_field(pkg: IPackageJson, field: IPackageJsonDependenciesField, name: string, semver: string, override: boolean, bool: boolean): boolean;
export declare function addDependenciesIfNotExists(pkg: IPackageJson, name: string, semver: string, options?: IOptionsInstallDepsFromWorkspaces): {
    pkg: IPackageJson<any>;
    bool: boolean;
};
