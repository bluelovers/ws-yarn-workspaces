/**
 * Created by user on 2020/6/12.
 */
import { IVersionValue, IOptionsNpmCheckUpdates, IPackageMap, EnumVersionValue, IVersionCacheMapKey, IOptionsFetchVersion } from './types';
import Bluebird from 'bluebird';
import packageJson from 'package-json';
import { getVersionTarget } from './remote/getVersionTarget';
export { queryRemoteVersions } from './remote/queryRemoteVersions';
export declare function requestVersion(packageName: string): Bluebird<packageJson.AbbreviatedMetadata>;
export declare function fetchVersion(packageName: string, options?: IOptionsFetchVersion, ncuOptions?: Partial<IOptionsNpmCheckUpdates>): Bluebird<string[]>;
export { getVersionTarget };
export declare function queryPackageManagersNpm(name: string, version?: IVersionValue, versionTarget?: EnumVersionValue): Bluebird<IVersionValue>;
export declare function packageMapToKeyObject(packageMap: IPackageMap, versionTarget: IVersionCacheMapKey["versionTarget"]): IVersionCacheMapKey[];
export declare function isUpgradeable(current: IVersionValue, latest: IVersionValue): boolean;
export declare function updateSemver(current: IVersionValue, latest: IVersionValue, options?: Partial<IOptionsNpmCheckUpdates>): IVersionValue;
