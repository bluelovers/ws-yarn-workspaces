import { IListableRow } from 'ws-pkg-list';
import { IOptionsUpdateChangelog, IOptionsWithType, IReturnTypeUpdateChangelog } from '../types';
export declare function updateChangelog(pkg: IListableRow, options?: IOptionsWithType<IOptionsUpdateChangelog>): Promise<IReturnTypeUpdateChangelog>;
export default updateChangelog;
