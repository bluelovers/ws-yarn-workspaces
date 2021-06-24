import { IOptionsInstallDepsFromWorkspaces } from './types';
export interface IOptionsInstallDeps extends IOptionsInstallDepsFromWorkspaces {
}
export declare function filterInstallDeps(packageNames: string[], options?: IOptionsInstallDeps): {
    cwd: string;
    packageNames: string[];
    pkg: import("npm-package-json-loader").IPackageJson<any>;
    rootData: import("@yarn-tool/find-root").IFindRootReturnType;
    added: [name: string, semver: string][];
    exists: string[];
    updated: boolean;
} | {
    cwd: string;
    packageNames: string[];
    pkg?: undefined;
    rootData?: undefined;
    added?: undefined;
    exists?: undefined;
    updated?: undefined;
};
