/**
 * Created by user on 2020/6/11.
 */
/// <reference types="node" />
import { IYarnLockfileParseObject, IYarnLockfileParseObjectRow } from './types';
export declare function existsYarnLockfile(file: string): boolean;
export declare function checkYarnLockfileUnsafeCore(buf: Buffer | string): boolean;
export declare function checkAndReadYarnLockfileUnsafe(file: string): Buffer;
export declare function checkAndReadYarnLockfile(file: string): Record<string, IYarnLockfileParseObjectRow<string[]>>;
export declare function readYarnLockfile(file: string): Record<string, IYarnLockfileParseObjectRow<string[]>>;
export declare function writeYarnLockfile(file: string, data: IYarnLockfileParseObject): void;
export interface IFsYarnLockReturnType {
    yarnlock_file: string;
    yarnlock_exists: boolean;
    yarnlock_old: string;
}
export declare function fsYarnLock(root: string): IFsYarnLockReturnType;
