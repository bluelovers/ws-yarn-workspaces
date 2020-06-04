/**
 * Created by user on 2020/6/5.
 */
import { readPackages } from './readpkg';
import workspacesPackagesList from './listpkg';
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
export default tsConfigPaths;
