/**
 * Created by user on 2018/5/13/013.
 */
import { Console2 } from 'debug-color2';
export declare const console: Console2;
export interface IOptions {
    cwd?: string;
    ignoreParentWorkspaces?: boolean;
    ignoreExistsPackage?: boolean;
    initPackageJson?<T = any>(current: ReturnType<typeof getDefaultPackageJson>): ReturnType<typeof getDefaultPackageJson> | (ReturnType<typeof getDefaultPackageJson> & T);
    debug?: boolean;
}
export declare function createYarnWorkspaces(cwd?: string, options?: IOptions): boolean;
export declare function isSamePath(p1: string, p2: string): boolean;
export declare function _createYarnWorkspaces(targetPath: string, options?: IOptions): boolean;
export declare function getDefaultTsconfig(): {
    extends: string;
};
export declare function getDefaultPackageJson(name?: string): {
    name: string;
    version: string;
    private: boolean;
    workspaces: string[];
    scripts: {
        [k: string]: string;
        test?: string;
    };
    resolutions: {
        [k: string]: string;
    };
    [k: string]: any;
};
export declare function createDirByPackages(cwd: string, packages: string[]): boolean;
export default createYarnWorkspaces;
