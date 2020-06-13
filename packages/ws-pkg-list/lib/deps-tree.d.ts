/**
 * Created by user on 2020/6/13.
 */
import { IListableRowExtra, IOptionsPkgListable, IListableRowWithDeps } from './types';
export declare function wsPkgDepsListable<R extends IListableRowExtra<IListableRowWithDeps>>(cwd?: string, options?: IOptionsPkgListable<R>): R[];
export declare function wsPkgDepsListableRecord<R extends IListableRowExtra<IListableRowWithDeps>>(cwd?: string, options?: IOptionsPkgListable<R>): Record<string, R>;
export default wsPkgDepsListableRecord;
