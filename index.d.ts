/// <reference types="node" />
import { SpawnSyncOptionsWithBufferEncoding } from 'child_process';
export interface IOptions {
    base?: string;
    name?: string;
    cwd?: string;
    fnOrder?: Array<(cwd?: string) => string>;
    create?: boolean;
    thunk?: boolean;
    hash?: boolean | ((input: string) => string);
}
export declare type ICachePathThunk = ((p1?: string, ...args: string[]) => string);
export declare function getCachePath(options?: IOptions & {
    thunk: true;
}): ICachePathThunk;
export declare function getCachePath(name: string, options?: IOptions & {
    thunk: true;
}): ICachePathThunk;
export declare function getCachePath(name: string, options?: IOptions): string;
export declare function getCachePath(options?: IOptions): string;
export declare function normalizeName(name: string, hash?: IOptions["hash"]): string;
export declare function getCacheRoot(name: string): string;
export declare function getCacheRoot(options?: IOptions | string): string;
export declare function getOSTempPath(cwd?: string): string;
export declare function findPkgModulePath(cwd?: string): string;
export declare function findNpmCachePath(cwd?: string): string;
export declare function findPkgPath(cwd?: string): string;
export declare function spawn_stdout(bin: string, argv?: string[], options?: SpawnSyncOptionsWithBufferEncoding): string;
export default getCachePath;
