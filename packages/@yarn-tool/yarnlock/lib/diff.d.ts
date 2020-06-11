import { IChalk } from 'debug-color2';
import { DiffArray } from 'deep-diff';
export declare function yarnLockDiff(yarnlock_old: string, yarnlock_new: string): string;
export declare function _diffArray(array: DiffArray<{}, {}>, chalk: IChalk): string[];
