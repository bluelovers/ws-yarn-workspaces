/**
 * Created by user on 2020/6/11.
 */
import { ITSArrayListMaybeReadonly } from 'ts-type';
import { IRemoveResolutions, IFilterResolutions, IDependencies, IYarnLockfileParseObject } from './types';
export declare function filterResolutions<T extends ITSArrayListMaybeReadonly<string>>(pkg: {
    resolutions?: IDependencies<T>;
}, yarnlock: IYarnLockfileParseObject<T>): IFilterResolutions<T>;
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
export declare function filterDuplicateYarnLock<T extends ITSArrayListMaybeReadonly<string>>(yarnlock: IYarnLockfileParseObject<T>): IFilterResolutions<T>;
export declare function exportYarnLock<T extends ITSArrayListMaybeReadonly<string>>(yarnlock: IYarnLockfileParseObject<T>, filter?: (key: keyof IYarnLockfileParseObject<T>, index: number, array_keys: (keyof IYarnLockfileParseObject<T>)[], yarnlock: IYarnLockfileParseObject<T>) => boolean): IFilterResolutions<T>;
