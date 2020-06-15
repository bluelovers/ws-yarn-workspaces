/**
 * Created by user on 2020/6/15.
 */
import { IOptions } from '@git-lazy/tag';
export interface IOptionsPackageTag extends IOptions {
    cwd: string;
    name?: string;
    version?: string;
    tagPrefix?: string;
    excludeName?: boolean;
    pkg?: IPackageJsonWithVersion;
}
export interface IPackageJsonWithVersion {
    name: string;
    version: string;
}
export declare type IOptionsPackageTagInput = IOptionsPackageTag & (IPackageJsonWithVersion | {
    version: string;
    pkg: IPackageJsonWithVersion;
} | {
    name: string;
    pkg: IPackageJsonWithVersion;
});
