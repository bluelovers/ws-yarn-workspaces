import { IOptionsInstallDepsFromWorkspaces } from './installDepsFromWorkspaces';
export interface IOptionsInstallDeps extends IOptionsInstallDepsFromWorkspaces {
}
export declare function filterInstallDeps(packageNames: string[], options?: IOptionsInstallDeps): {
    cwd: string;
    packageNames: string[];
    pkg: import("@ts-type/package-dts").IPackageJson<any>;
    rootData: import("@yarn-tool/find-root").IFindRootReturnType;
    added: [name: string, semver: string][];
    exists: string[];
} | {
    cwd: string;
    packageNames: string[];
    pkg?: undefined;
    rootData?: undefined;
    added?: undefined;
    exists?: undefined;
};
