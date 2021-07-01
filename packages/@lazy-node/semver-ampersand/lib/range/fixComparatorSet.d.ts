import { IComparatorArrayInput, IComparatorSetInput } from '../types';
export declare function includeAny(comparatorsArray: IComparatorArrayInput): import("semver/classes/comparator");
/**
 * if we have any that are `*`, then the range is just `*`
 */
export declare function optimizeComparatorSetAny(comparatorsSet: IComparatorSetInput, unsafeOptimize?: boolean): IComparatorSetInput;
export declare function filterRemoveNullSet(comparatorsSet: IComparatorSetInput, unsafeOptimize?: boolean): IComparatorArrayInput[];
export declare function fixComparatorSet(comparatorsSet: IComparatorSetInput, unsafeOptimize?: boolean): IComparatorSetInput;
