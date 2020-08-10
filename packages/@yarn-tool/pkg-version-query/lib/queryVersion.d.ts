import { Options } from 'package-json';
import Bluebird from 'bluebird';
import { IOptionsQueryVersion } from './types';
export declare function queryVersionWithCache(name: string, targetVersion?: string, options?: IOptionsQueryVersion<Options>): Bluebird<string>;
export declare function queryVersion(name: string, targetVersion?: string, save?: boolean, options?: IOptionsQueryVersion<Options>): Bluebird<string>;
export default queryVersionWithCache;
