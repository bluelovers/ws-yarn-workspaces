import { IAddedList, IOptionsInstallDepsFromWorkspaces } from './types';
export declare function installDepsFromWorkspaces(packageNames: string[], options?: IOptionsInstallDepsFromWorkspaces): {
    cwd: string;
    rootData: import("@yarn-tool/find-root").IFindRootReturnType & {
        hasWorkspace: true;
        isWorkspace: false;
    };
    added: IAddedList;
    exists: string[];
    others: string[];
    pkg: import("@ts-type/package-dts").IPackageJson<any>;
    updated: boolean;
};
