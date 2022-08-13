/**
 * Created by user on 2018/5/14/014.
 */
import findPkg from 'find-pkg-ws';
export type WorkspacesConfig = {
    packages?: WorkspacesConfigArray;
    nohoist?: Array<string>;
};
export type WorkspacesConfigArray = Array<string>;
export declare function getConfig(cwd?: string): WorkspacesConfig;
export declare function parseWorkspaces(workspaces: WorkspacesConfig | WorkspacesConfigArray): WorkspacesConfig;
export interface IParseStaticPackagesPathsReturnType {
    static: string[];
    prefixRoot: string[];
    prefix: string[];
    prefixSub: string[];
    all: string[];
}
export declare function parseStaticPackagesPaths(workspaces: WorkspacesConfig | WorkspacesConfigArray): IParseStaticPackagesPathsReturnType;
export { findPkg };
export default getConfig;
