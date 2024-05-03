import { IOptionsFindUpPaths, IRuntimeFindUpPaths } from 'find-up-paths';
import { IFindRootReturnType } from '@yarn-tool/find-root';
export interface IOptionsFindUpPathsWorkspaces extends IOptionsFindUpPaths {
    ignoreCurrentPackage?: boolean;
    startFromCurrentPackage?: boolean;
}
export interface IRuntimeFindUpPathsWorkspaces<OPTS extends IOptionsFindUpPathsWorkspaces = IOptionsFindUpPathsWorkspaces> extends IRuntimeFindUpPaths<OPTS> {
    rootData: IFindRootReturnType;
}
export declare function handleOptions<T extends IOptionsFindUpPathsWorkspaces = IOptionsFindUpPathsWorkspaces>(cwd?: string | T, opts?: T): IRuntimeFindUpPathsWorkspaces<IOptionsFindUpPathsWorkspaces & T>;
export declare function pathParentsWorkspaces(cwd?: string | IOptionsFindUpPathsWorkspaces, opts?: IOptionsFindUpPathsWorkspaces): string[];
export declare function findUpPathsWorkspaces(pattern: string | string[], opts?: IOptionsFindUpPathsWorkspaces): {
    stat: import("fs").Stats;
    result: string;
};
export declare function findUpPathsWorkspacesAsync(pattern: string | string[], opts?: IOptionsFindUpPathsWorkspaces): Promise<{
    stat: import("fs").Stats;
    result: string;
}>;
export default findUpPathsWorkspaces;
