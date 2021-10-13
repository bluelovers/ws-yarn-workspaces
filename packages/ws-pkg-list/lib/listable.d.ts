import { IListableRow, IReadPackage, IOptionsPkgListable } from './types';
import IPackageJson from '@ts-type/package-dts';
export declare function wsPkgListableFromReaded<R extends IListableRow = IListableRow, T = IPackageJson>(readed: {
    [k: string]: IReadPackage<T>;
}, options?: IOptionsPkgListable<R>): R[];
export declare function wsPkgListableFromPaths<R extends IListableRow = IListableRow>(paths: string[], cwd?: string, options?: IOptionsPkgListable<R>): R[];
export declare function wsPkgListable<R extends IListableRow = IListableRow>(cwd?: string, options?: IOptionsPkgListable<R>): R[];
export default wsPkgListable;
