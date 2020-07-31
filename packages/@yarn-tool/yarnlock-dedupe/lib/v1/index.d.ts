import { fixDuplicates } from './fixDuplicates';
import { listDuplicates } from './listDuplicates';
import { IOptionsDedupe } from '../types';
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
export { fixDuplicates, listDuplicates, };
declare const v1: {
    fixDuplicates: typeof fixDuplicates;
    listDuplicates: typeof listDuplicates;
    yarnDedupe: typeof yarnDedupe;
};
export default v1;
