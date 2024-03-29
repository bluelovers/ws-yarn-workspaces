/**
 * Created by user on 2020/6/11.
 */
import { ITSArrayListMaybeReadonly } from 'ts-type';
import { IRemoveResolutions, IFilterResolutions, IYarnLockfileParseObject } from './types';
import { IDependencies } from '@ts-type/package-dts/package-json';
import { IYarnLockDataRecord } from '@yarn-tool/yarnlock-types';
export declare function filterResolutions<T extends ITSArrayListMaybeReadonly<string>>(pkg: {
    resolutions?: IDependencies<T>;
}, yarnlock: IYarnLockDataRecord): IFilterResolutions<T>;
/**
 *
 * @example ```
 let pkg = readPackageJson('G:/Users/The Project/nodejs-yarn/ws-create-yarn-workspaces/package.json');

 let y = readYarnLockfile('G:/Users/The Project/nodejs-yarn/ws-create-yarn-workspaces/yarn.lock')

 console.dir(removeResolutions(pkg, y), {
    depth: null,
});
 ```
 */
export declare function removeResolutions<T extends ITSArrayListMaybeReadonly<string>>(pkg: {
    resolutions?: IDependencies<T>;
}, yarnlock_old: IYarnLockfileParseObject<T>): IRemoveResolutions<T>;
export declare function removeResolutionsCore<T extends ITSArrayListMaybeReadonly<string>>(result: IFilterResolutions<T>, yarnlock_old: IYarnLockfileParseObject<T>): IRemoveResolutions<T>;
export declare function filterDuplicateYarnLock<T extends ITSArrayListMaybeReadonly<string>>(yarnlock: IYarnLockDataRecord): IFilterResolutions<ITSArrayListMaybeReadonly<string>>;
export declare function exportYarnLock<T extends ITSArrayListMaybeReadonly<string>>(yarnlock: IYarnLockDataRecord, filter?: (key: keyof IYarnLockfileParseObject<T>, index: number, array_keys: (keyof IYarnLockfileParseObject<T>)[], yarnlock: IYarnLockDataRecord) => boolean): IFilterResolutions<T>;
