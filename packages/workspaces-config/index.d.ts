/**
 * Created by user on 2018/5/14/014.
 */
import findPkg from 'find-pkg-ws';
export declare type WorkspacesConfig = {
    packages?: WorkspacesConfigArray;
    nohoist?: Array<string>;
};
export declare type WorkspacesConfigArray = Array<string>;
export declare function getConfig(cwd?: string): WorkspacesConfig;
export declare function parseWorkspaces(workspaces: WorkspacesConfig | WorkspacesConfigArray): WorkspacesConfig;
export declare function parseStaticPackagesPaths(workspaces: WorkspacesConfig | WorkspacesConfigArray): {
    static: string[];
    prefix: string[];
    all: string[];
};
export { findPkg };
export default getConfig;
