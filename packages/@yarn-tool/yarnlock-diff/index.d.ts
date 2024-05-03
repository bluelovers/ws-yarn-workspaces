import { buildDiff } from './lib/diff-service';
import { buildDiffTable } from './lib/formatter';
import { IOptionsParseVersionsDiff } from '@yarn-tool/semver-diff';
import { ITSValueOrArray } from 'ts-type/lib/type/base';
export { buildDiff };
export { buildDiffTable };
export declare function yarnLockDiff(yarnlock_old: ITSValueOrArray<Buffer | string>, yarnlock_new: ITSValueOrArray<Buffer | string>, options?: IOptionsParseVersionsDiff): string;
export declare function _yarnLockDiffCore(yarnlock_old: ITSValueOrArray<Buffer | string>, yarnlock_new: ITSValueOrArray<Buffer | string>, options: IOptionsParseVersionsDiff): {
    _ok: boolean;
    table: import("cli-table3").Table;
    formatedDiff: {
        [k: string]: [string, string, string, string];
    };
};
export default yarnLockDiff;
