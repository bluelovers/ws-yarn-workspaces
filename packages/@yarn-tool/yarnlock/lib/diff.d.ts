import { IOptionsParseVersionsDiff } from '@yarn-tool/semver-diff';
import { IChalk } from 'debug-color2';
import { DiffArray } from 'deep-diff';
export declare function yarnLockDiff(yarnlock_old: string, yarnlock_new: string, options?: IOptionsParseVersionsDiff): string;
export declare function _diffArray(array: DiffArray<{}, {}>, chalk: IChalk): string[];
