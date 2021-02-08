import { IOptionsQueryVersion } from './types';
import { Options } from 'package-json';
export declare function queryVersionCacheRaw(name: string, targetVersion: string, options: IOptionsQueryVersion<Options>): import("./types").ICachedVersionResult;
