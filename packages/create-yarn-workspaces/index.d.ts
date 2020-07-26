/**
 * Created by user on 2018/5/13/013.
 */
import { IPackageJson } from '@ts-type/package-dts/package-json';
export * from './lib/index';
export * from './lib/util';
export interface IOptions {
    cwd?: string;
    ignoreParentWorkspaces?: boolean;
    ignoreExistsPackage?: boolean;
    initPackageJson?<T extends Record<string, any> = {}>(current: IPackageJson): IPackageJson & T;
    debug?: boolean;
}
export declare function createYarnWorkspaces(cwd?: string, options?: IOptions): boolean;
export declare function _createYarnWorkspaces(targetPath: string, options?: IOptions): boolean;
export declare function createDirByPackages(cwd: string, packages: string[]): boolean;
export default createYarnWorkspaces;
