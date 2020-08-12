import { IPackageMap, IOptionsNpmCheckUpdates } from '../types';
import Bluebird from 'bluebird';
export declare function queryRemoteVersions(packageMap: IPackageMap | string[], options?: Partial<IOptionsNpmCheckUpdates>): Bluebird<import("../types").IVersionCacheMapValue[]>;
