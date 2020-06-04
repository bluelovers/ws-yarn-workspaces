/**
 * Created by user on 2020/6/5.
 */
export declare function findModulesPackagePathsCore(cwd: string, dir?: string): {
    cwd: string;
    modules: {
        name: string;
        location: string;
    }[];
};
export declare function findModulesPackagePaths(cwd?: string, dir?: string): {
    cwd: string;
    modules: {
        name: string;
        location: string;
    }[];
};
export default findModulesPackagePaths;
