/**
 * Created by user on 2020/6/13.
 */
import { IOptionsPkgListable, IListableRowExtraWithDeps } from './types';
export declare function wsPkgDepsListable<R extends IListableRowExtraWithDeps>(cwd?: string, options?: IOptionsPkgListable<R>): R[];
export declare function wsPkgDepsListableRecord<R extends IListableRowExtraWithDeps>(cwd?: string, options?: IOptionsPkgListable<R>): Record<string, R>;
export default wsPkgDepsListableRecord;
