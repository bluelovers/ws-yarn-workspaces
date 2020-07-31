import { Diff } from 'deep-diff';
import { IComputedPackage } from '../diff-service/types';
/**
 * @deprecated
 */
export declare function buildDiffTable(diff: Diff<IComputedPackage, IComputedPackage>[]): string;
