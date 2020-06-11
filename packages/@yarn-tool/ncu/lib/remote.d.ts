/**
 * Created by user on 2020/6/12.
 */
import { IVersionValue, IOptionsNpmCheckUpdates, IPackageMap, EnumVersionValue, IVersionCacheMapKey, IOptionsFetchVersion } from './types';
import Bluebird from 'bluebird';
import packageJson from 'package-json';
export declare function requestVersion(packageName: string): Bluebird<packageJson.AbbreviatedMetadata>;
export declare function fetchVersion(packageName: string, options?: IOptionsFetchVersion, ncuOptions?: Partial<IOptionsNpmCheckUpdates>): Bluebird<string[]>;
export declare function getVersionTarget(options: Partial<IOptionsNpmCheckUpdates> | string | IOptionsNpmCheckUpdates['versionTarget']): IOptionsNpmCheckUpdates['versionTarget'];
export declare function queryPackageManagersNpm(name: string, version?: IVersionValue, versionTarget?: EnumVersionValue): Bluebird<IVersionValue>;
export declare function packageMapToKeyObject(packageMap: IPackageMap, versionTarget: IVersionCacheMapKey["versionTarget"]): IVersionCacheMapKey[];
export declare function queryRemoteVersions(packageMap: IPackageMap | string[], options?: Partial<IOptionsNpmCheckUpdates>): Bluebird<import("./types").IVersionCacheMapValue[]>;
export declare function isUpgradeable(current: IVersionValue, latest: IVersionValue): boolean;
export declare function updateSemver(current: IVersionValue, latest: IVersionValue, options?: Partial<IOptionsNpmCheckUpdates>): IVersionValue;
