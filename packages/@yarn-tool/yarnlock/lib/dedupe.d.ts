import { IYarnLockfileParseObject } from './types';
export interface IOptionsDedupe {
    includePackages?: string[];
    excludePackages?: string[];
    useMostCommon?: boolean;
}
export declare function listDuplicates(yarnlock_old: IYarnLockfileParseObject | string, options?: IOptionsDedupe): string[];
export declare function fixDuplicates(yarnlock_old: IYarnLockfileParseObject | string, options?: IOptionsDedupe): string;
export declare function yarnDedupe(yarnlock_old: string, options?: IOptionsDedupe): {
    /**
     * 執行前的 yarn.lock
     */
    yarnlock_old: string;
    /**
     * 執行後的 yarn.lock
     */
    yarnlock_new: string;
    /**
     * yarn.lock 是否有變動
     */
    yarnlock_changed: boolean;
};
/**
 * @deprecated
 */
export { yarnDedupe as Dedupe };
export default yarnDedupe;
