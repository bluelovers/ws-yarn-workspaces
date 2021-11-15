import { IFindRootOptions } from '@yarn-tool/find-root';
import { IPackageJson } from '@ts-type/package-dts/package-json';
import { IPackageJsonDependenciesField } from '@ts-type/package-dts/lib/package-json/types';
export interface IOptionsAddDepsToPackageJson extends Partial<IFindRootOptions> {
    cwd?: string;
    pkg?: IPackageJson;
    dev?: boolean;
    peer?: boolean;
    optional?: boolean;
}
export declare function _add_to_deps_field(pkg: IPackageJson, field: IPackageJsonDependenciesField, name: string, semver: string, override: boolean, bool: boolean): boolean;
export declare function addDependencies(pkg: IPackageJson, name: string, semver: string, options?: IOptionsAddDepsToPackageJson, override?: boolean): {
    pkg: IPackageJson<any>;
    bool: boolean;
};
export declare function addDependenciesIfNotExists(pkg: IPackageJson, name: string, semver: string, options?: IOptionsAddDepsToPackageJson): {
    pkg: IPackageJson<any>;
    bool: boolean;
};
export declare function addDependenciesOverwrite(pkg: IPackageJson, name: string, semver: string, options?: IOptionsAddDepsToPackageJson): {
    pkg: IPackageJson<any>;
    bool: boolean;
};
export default addDependencies;
