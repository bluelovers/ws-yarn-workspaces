/**
 * Created by user on 2018/6/5/005.
 */
export declare function workspacesPackagesList(absolute?: boolean): string[];
export declare function workspacesPackagesList(cwd?: string, absolute?: boolean): string[];
export declare type IReadPackage<T = unknown> = {
    name: string;
    path: string;
    fullpath: string;
    config: {
        name: string;
        version: string;
        [k: string]: unknown;
    } & T;
};
export declare function readPackages<T = unknown>(ls: string[], cwd?: string): {
    [k: string]: IReadPackage<T>;
};
export declare function tsConfigPaths(cwd?: string): {
    [k: string]: string[];
};
export declare function tsConfigPaths(ls: string[]): {
    [k: string]: string[];
};
export declare function tsConfigPaths(ls: ReturnType<typeof workspacesPackagesList>): {
    [k: string]: string[];
};
export declare function tsConfigPaths(ls: ReturnType<typeof readPackages>): {
    [k: string]: string[];
};
export declare function tsConfigPaths(ls: string[] | ReturnType<typeof workspacesPackagesList> | ReturnType<typeof readPackages>): {
    [k: string]: string[];
};
export default workspacesPackagesList;
