/**
 * Created by user on 2020/6/13.
 */
/// <reference types="node" />
import { IPackageJson } from '@ts-type/package-dts';
export declare function hasShebang(buf: Buffer | string): boolean;
export declare function checkFile(file: string): boolean;
export declare function checkPkgJson(pkg: IPackageJson, cwd: string): {
    file: string;
    filename: string;
    hasShebang: boolean;
}[];
