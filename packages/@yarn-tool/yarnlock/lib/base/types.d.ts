import { ITSArrayListMaybeReadonly } from 'ts-type';
import { IDependencies } from '../types';
export interface IYarnLockfileParseObjectRowBase<T extends ITSArrayListMaybeReadonly<string> = string[]> {
    version: string;
    /**
     * 依賴列表
     */
    dependencies?: IDependencies<T>;
}
