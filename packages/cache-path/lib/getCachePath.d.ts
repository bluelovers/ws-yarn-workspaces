import { IOptions, ICachePathThunk } from './types';
import Bluebird from 'bluebird';
/**
 * a base dir name at cache root
 */
export declare const defaultBase = ".cache";
export declare function getCachePath(options: IOptions & {
    thunk: true;
}): ICachePathThunk;
export declare function getCachePath(name: string, options?: IOptions & {
    thunk: true;
}): ICachePathThunk;
export declare function getCachePath(name: string, options?: IOptions): string;
export declare function getCachePath(options: IOptions): string;
export declare function getCachePathAsync(options: IOptions & {
    thunk: true;
}): Bluebird<ICachePathThunk>;
export declare function getCachePathAsync(name: string, options: IOptions & {
    thunk: true;
}): Bluebird<ICachePathThunk>;
export declare function getCachePathAsync(name: string, options?: IOptions): Bluebird<string>;
export declare function getCachePathAsync(options: IOptions): Bluebird<string>;
