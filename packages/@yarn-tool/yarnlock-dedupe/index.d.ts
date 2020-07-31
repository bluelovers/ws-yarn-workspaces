/// <reference types="node" />
import { IOptionsDedupe } from './lib/types';
export declare function listDuplicates(yarnlock_old: Buffer | string, options?: IOptionsDedupe): string[];
export declare function fixDuplicates(yarnlock_old: Buffer | string, options?: IOptionsDedupe): string;
declare const auto: {
    listDuplicates: typeof listDuplicates;
    fixDuplicates: typeof fixDuplicates;
};
export default auto;
