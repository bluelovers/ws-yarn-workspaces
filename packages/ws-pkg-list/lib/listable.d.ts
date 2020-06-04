import { IListableRow, IReadPackage } from './types';
import IPackageJson from '@ts-type/package-dts';
export declare function wsPkgListableFromReaded<T = IPackageJson>(readed: {
    [k: string]: IReadPackage<T>;
}): IListableRow[];
export declare function wsPkgListableFromPaths(paths: string[], cwd?: string): IListableRow[];
export declare function wsPkgListable(cwd?: string): IListableRow[];
export default wsPkgListable;
