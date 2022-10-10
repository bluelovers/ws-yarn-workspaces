import { IOptionsInstallDepsFromWorkspaces } from './types';
import { IPackageJson } from '@ts-type/package-dts';
export interface IOptionsInstallDeps extends IOptionsInstallDepsFromWorkspaces {
}
export declare function filterInstallDeps(packageNames: string[], options?: IOptionsInstallDeps): {
    cwd: string;
    packageNames: string[];
    pkg: IPackageJson<unknown>;
    rootData: import("@yarn-tool/find-root").IFindRootReturnType;
    added: import("./types").IAddedList;
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
