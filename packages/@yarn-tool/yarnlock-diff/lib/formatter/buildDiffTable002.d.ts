import { Diff } from 'deep-diff';
import { IComputedPackage } from '../diff-service/types';
import { IOptionsParseVersionsDiff } from '@yarn-tool/semver-diff/index';
export declare function buildDiffTable(diff: Diff<IComputedPackage, IComputedPackage>[], options?: IOptionsParseVersionsDiff): string;
