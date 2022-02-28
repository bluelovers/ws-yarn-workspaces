/**
 * Created by user on 2020/6/15.
 */
import { IOptionsPackageTagInput, IPackageJsonWithVersion } from './types';
export declare function handleOptions(options: IOptionsPackageTagInput): {
    cwd: string;
    name: string;
    version: string;
    tagPrefix: string;
    excludeName?: boolean;
    pkg?: IPackageJsonWithVersion;
    message?: string;
    forceGitTag?: boolean;
    signGitTag?: boolean;
    annotated?: boolean;
    target?: string;
};
export declare function formatPackageTag(options: IOptionsPackageTagInput): string;
