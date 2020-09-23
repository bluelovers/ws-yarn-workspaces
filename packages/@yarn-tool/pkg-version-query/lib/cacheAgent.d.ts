import Cache from 'lru-cache-fs2';
import { IOptionsQueryVersion } from './types';
import { Options } from 'package-json';
export declare function initCache(options?: IOptionsQueryVersion<Options>): Cache<string, import("ts-type").ITSRequireAtLeastOne<import("./types").ICachedVersionResultCore, "error" | "result">>;
export declare function getCache(options?: IOptionsQueryVersion<Options>): Cache<string, import("ts-type").ITSRequireAtLeastOne<import("./types").ICachedVersionResultCore, "error" | "result">>;
