import { IOptions as IOptionsDepsValue, IDepsResult } from '@yarn-tool/npa-to-deps';
import Bluebird from 'bluebird';
import { ITSResolvable } from 'ts-type';
import { IOptionsQueryVersion } from '@yarn-tool/pkg-version-query/lib/types';
import { Options } from 'package-json';
import { IResult } from '@yarn-tool/npm-package-arg-util/lib/types';
export interface IOptions extends IOptionsDepsValue {
    queryOptions?: IOptionsQueryVersion<Options>;
}
export declare function queryDepsValueByNpaResult(depsResult: ITSResolvable<IDepsResult>, options?: IOptions): Bluebird<{
    name: string;
    value: string;
}>;
export declare function queryDepsValueByNpa(input: string, options?: IOptions): Bluebird<IDepsResult<IResult> & {
    name: string;
    value: string;
}>;
export default queryDepsValueByNpa;
