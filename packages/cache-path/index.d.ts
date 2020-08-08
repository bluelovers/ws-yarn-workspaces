import bluebird = require('bluebird');
/**
 * fn[] of any function return a string
 * stop when get first return
 */
export declare const defaultOrder: (typeof findPkgModulePath)[];
/**
 * a base dir name at cache root
 */
export declare const defaultBase = ".cache";
export interface IOptions {
    /**
     * a base dir name at cache root
     */
    base?: string;
    /**
     * name of cache
     */
    name?: string;
    cwd?: string;
    /**
     * fn[] of any function return a string
     * stop when get first return
     */
    fnOrder?: Array<((cwd?: string) => string) | ((cwd?: string) => any)>;
    /**
     * auto create dir if not exists
     */
    create?: boolean;
    /**
     * return a function
     */
    thunk?: boolean;
    /**
     * hash dir name, make sure it is unique
     */
    hash?: boolean | ((input: string) => string);
    /**
     * only work with fnOrder is set
     *
     * if true will not use defaultOrder when didn't get value from fnOrder
     */
    disableDefaultFailback?: boolean;
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
export declare function getCachePathAsync(options?: IOptions & {
    thunk: true;
}): bluebird<ICachePathThunk>;
export declare function getCachePathAsync(name: string, options?: IOptions & {
    thunk: true;
}): bluebird<ICachePathThunk>;
export declare function getCachePathAsync(name: string, options?: IOptions): bluebird<string>;
export declare function getCachePathAsync(options?: IOptions): bluebird<string>;
/**
 * normalize cache name
 */
export declare function normalizeName(name: string, hash?: IOptions["hash"]): string;
export declare function getCacheRoot(name: string): string;
export declare function getCacheRoot(options?: IOptions | string): string;
export declare function getCacheRootAsync(name: string): bluebird<string>;
export declare function getCacheRootAsync(options?: IOptions | string): bluebird<string>;
/**
 * get os temp dir
 */
export declare function getOSTempPath(cwd?: string): string;
/**
 * try get a pkg/node_modules
 */
export declare function findPkgModulePath(cwd?: string): string;
/**
 * try get npm global cache path
 */
export declare function findNpmCachePath(cwd?: string): string;
export default getCachePath;
