import { IFindRootOptions } from '@yarn-tool/find-root/index';
import { IPackageJson } from '@ts-type/package-dts/index';
export interface IOptionsInstallDepsFromWorkspaces extends Partial<IFindRootOptions> {
    cwd?: string;
    pkg?: IPackageJson;
    dev?: boolean;
    peer?: boolean;
    optional?: boolean;
}
export declare function installDepsFromWorkspaces(packageNames: string[], options?: IOptionsInstallDepsFromWorkspaces): {
    cwd: string;
    rootData: import("@yarn-tool/find-root").IFindRootReturnType;
    added: [name: string, semver: string][];
    exists: string[];
    others: string[];
    pkg: IPackageJson<any>;
};
