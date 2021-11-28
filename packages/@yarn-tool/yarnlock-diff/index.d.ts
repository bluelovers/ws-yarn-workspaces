/// <reference types="node" />
import { buildDiff } from './lib/diff-service';
import { buildDiffTable } from './lib/formatter';
import { IOptionsParseVersionsDiff } from '@yarn-tool/semver-diff';
import { ITSValueOrArray } from 'ts-type/lib/type/base';
export { buildDiff };
export { buildDiffTable };
export declare function yarnLockDiff(yarnlock_old: ITSValueOrArray<Buffer | string>, yarnlock_new: ITSValueOrArray<Buffer | string>, options?: IOptionsParseVersionsDiff): string;
export default yarnLockDiff;
