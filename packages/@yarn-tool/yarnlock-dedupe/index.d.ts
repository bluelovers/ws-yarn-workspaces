/// <reference types="node" />
import { IOptionsDedupe } from './lib/types';
export declare function listDuplicates(yarnlock_old: Buffer | string, options?: IOptionsDedupe): string[];
export declare function fixDuplicates(yarnlock_old: Buffer | string, options?: IOptionsDedupe): string;
export declare function yarnDedupeFile(yarnlock_old_file: string, options?: IOptionsDedupe): {
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
declare const auto: {
    listDuplicates: typeof listDuplicates;
    fixDuplicates: typeof fixDuplicates;
    yarnDedupe: typeof yarnDedupe;
};
export default auto;
