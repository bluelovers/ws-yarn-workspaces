/// <reference types="node" />
import { IOptionsDedupe } from './lib/types';
/**
 * @deprecated
 */
export declare function listDuplicates(yarnlock_old: Record<string, any> | Buffer | string, options?: IOptionsDedupe): string[];
/**
 * @deprecated
 */
export declare function fixDuplicates(yarnlock_old: Record<string, any> | Buffer | string, options?: IOptionsDedupe): string;
/**
 * @deprecated
 */
export declare function yarnDedupe(yarnlock_old: string, options?: IOptionsDedupe): {
    yarnlock_old: string;
    yarnlock_new: string;
    yarnlock_changed: boolean;
};
/**
 * @deprecated
 */
declare const auto: {
    listDuplicates: typeof listDuplicates;
    fixDuplicates: typeof fixDuplicates;
    yarnDedupe: typeof yarnDedupe;
};
/**
 * @deprecated
 */
export default auto;
