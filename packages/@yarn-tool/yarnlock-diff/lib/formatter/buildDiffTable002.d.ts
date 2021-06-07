import { IDiffNode } from '@bluelovers/deep-diff';
import { IComputedPackage } from '../diff-service/types';
import { IOptionsParseVersionsDiff } from '@yarn-tool/semver-diff/index';
export declare function buildDiffTable(diff: IDiffNode<IComputedPackage, IComputedPackage>[], options?: IOptionsParseVersionsDiff): string;
