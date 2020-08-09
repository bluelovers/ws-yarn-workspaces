/// <reference types="bluebird" />
export declare function parseVersionByNpmPackageArg(input: string): {
    name: string;
    version: string;
};
export declare function queryVersionByNpmPackageArgWithCache(input: string): import("bluebird")<string>;
export default queryVersionByNpmPackageArgWithCache;
