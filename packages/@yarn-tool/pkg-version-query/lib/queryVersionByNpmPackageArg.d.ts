/// <reference types="bluebird" />
import { IOptionsQueryVersion } from './types';
import { Options } from 'package-json';
export declare function parseVersionByNpmPackageArg(input: string): {
    name: string;
    version: string;
};
export declare function queryVersionByNpmPackageArgWithCache(input: string, options?: IOptionsQueryVersion<Options>): import("bluebird")<string>;
export default queryVersionByNpmPackageArgWithCache;
