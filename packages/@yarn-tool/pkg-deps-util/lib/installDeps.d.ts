import { IOptionsInstallDepsFromWorkspaces } from './installDepsFromWorkspaces';
export interface IOptionsInstallDeps extends IOptionsInstallDepsFromWorkspaces {
}
export declare function filterInstallDeps(packageNames: string[], options?: IOptionsInstallDeps): Promise<{
    cwd: string;
    packageNames: string[];
    pkg: import("npm-package-json-loader").IPackageJson<any>;
    rootData: import("@yarn-tool/find-root").IFindRootReturnType;
} | {
    cwd: string;
    packageNames: string[];
    pkg?: undefined;
    rootData?: undefined;
}>;
