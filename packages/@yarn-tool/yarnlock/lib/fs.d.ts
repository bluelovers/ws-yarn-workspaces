/**
 * Created by user on 2020/6/11.
 */
/// <reference types="node" />
import { IYarnLockfileParseObject, IYarnLockfileParseObjectRow } from './types';
import { BaseEncodingOptions } from "fs";
export declare function existsYarnLockFile(file: string): boolean;
export declare function checkYarnLockFileUnsafeCore(buf: Buffer | string): boolean;
export declare function checkAndReadYarnLockFileUnsafe<T extends Buffer | string = Buffer>(file: string, options?: BaseEncodingOptions & {
    flag?: string;
} | BufferEncoding | null): T;
export declare function checkAndParseYarnLockFile(file: string, printError?: boolean): Record<string, IYarnLockfileParseObjectRow<string[]>>;
export declare function readYarnLockFile(file: string): Record<string, IYarnLockfileParseObjectRow<string[]>>;
export declare function writeYarnLockFile(file: string, data: IYarnLockfileParseObject): void;
export interface IFsYarnLockReturnType {
    yarnlock_file: string;
    yarnlock_exists: boolean;
    yarnlock_old: string;
}
/**
 * @deprecated
 */
export declare function fsYarnLock(root: string): IFsYarnLockReturnType;
export declare function fsYarnLockSafe(root: string): IFsYarnLockReturnType;
export default fsYarnLockSafe;
