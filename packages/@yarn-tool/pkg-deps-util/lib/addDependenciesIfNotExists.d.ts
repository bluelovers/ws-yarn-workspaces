import { IPackageJson } from '@ts-type/package-dts';
import { IOptionsInstallDepsFromWorkspaces } from './installDepsFromWorkspaces';
export declare function addDependenciesIfNotExists(pkg: IPackageJson, name: string, semver: string, options?: IOptionsInstallDepsFromWorkspaces): {
    pkg: IPackageJson<any>;
    bool: boolean;
};
