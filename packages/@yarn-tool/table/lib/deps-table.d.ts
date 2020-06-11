/**
 * Created by user on 2020/6/11.
 */
import { IOptionsParseVersionsDiff } from '@yarn-tool/semver-diff';
import { IDependency } from './types';
export declare function toDependencyTable(args: {
    from: IDependency;
    to: IDependency;
    options?: IOptionsParseVersionsDiff;
}): import("cli-table3").Table;
export default toDependencyTable;
