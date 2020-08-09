import Bluebird from 'bluebird';
export declare function queryVersionWithCache(name: string, targetVersion?: string): Bluebird<string>;
export declare function queryVersion(name: string, targetVersion?: string, save?: boolean): Bluebird<string>;
export default queryVersionWithCache;
