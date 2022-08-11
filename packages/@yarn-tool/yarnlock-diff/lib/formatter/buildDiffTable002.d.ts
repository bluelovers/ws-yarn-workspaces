import { IDiffNode } from '@bluelovers/deep-diff';
import { IComputedPackage } from '../diff-service/types';
import { IOptionsParseVersionsDiff } from '@yarn-tool/semver-diff';
export declare function buildDiffTable(diff: IDiffNode<IComputedPackage, IComputedPackage>[], options?: IOptionsParseVersionsDiff): string;
export declare function _handleDiffTable(result: ReturnType<typeof _buildDiffTableCore>, options: IOptionsParseVersionsDiff): string;
export declare function _buildDiffTableCore(diff: IDiffNode<IComputedPackage, IComputedPackage>[], options?: IOptionsParseVersionsDiff): {
    _ok: boolean;
    table: import("cli-table3").Table;
    formatedDiff: {
        [k: string]: [string, string, string, string];
    };
};
