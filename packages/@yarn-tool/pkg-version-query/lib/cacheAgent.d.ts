import Cache from 'lru-cache-fs2';
import { ICachedVersionResult, IOptionsQueryVersion } from './types';
import { Options } from 'package-json';
export declare function initCache(options?: IOptionsQueryVersion<Options>): Cache<string, ICachedVersionResult>;
export declare function getCache(options?: IOptionsQueryVersion<Options>): Cache<string, ICachedVersionResult>;
