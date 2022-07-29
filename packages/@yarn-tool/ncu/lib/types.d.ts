import IPackageJson from '@ts-type/package-dts/package-json';
import { IVersionValue, EnumVersionValue, IDependency } from '@ts-type/package-dts/lib/package-json/types';
import setupNcuToYargs from './cli';
import { FullMetadata, AbbreviatedMetadata } from 'package-json';
import { IUnpackYargsArgv } from '@yarn-tool/yargs-util';
export * from '@ts-type/package-dts/lib/package-json/types';
export type { IUnpackYargsArgv };
export declare enum EnumPackageManagersNpmMethod {
    'major' = "greatestMajor",
    'minor' = "greatestMinor",
    'latest' = "latest",
    'greatest' = "greatest",
    'newest' = "newest"
}
export interface IVersionCacheMapKey {
    name: string;
    versionTarget: EnumVersionValue;
    version_old: IVersionValue;
}
export interface IVersionCacheMapValue extends IVersionCacheMapKey {
    version_new: IVersionValue;
}
export declare type ISetupNcuToYargsReturnType = ReturnType<typeof setupNcuToYargs>;
export declare type IOptionsNpmCheckUpdates = Partial<IUnpackYargsArgv<ISetupNcuToYargsReturnType>> & {
    json_old: IPackageJson;
    cwd?: string;
    packageData?: string;
    packageManager?: 'npm' | 'bower';
    json_new?: IPackageJson;
    json_changed?: boolean;
    list_updated?: Record<string, string>;
    loglevel?: 'silent' | 'verbose';
    semverLevel?: EnumVersionValue.major | EnumVersionValue.minor;
    versionTarget?: EnumVersionValue;
    current?: IDependency;
    noSafe?: boolean;
};
/**
 * @deprecated
 */
export { IOptionsNpmCheckUpdates as IOptions };
export declare type IRomotePackageJsonReturnType = FullMetadata | AbbreviatedMetadata;
export interface IOptionsFetchVersion {
    field?: string | 'time' | 'versions' | 'dist-tags.latest';
    filter?(version: IVersionValue): boolean;
    currentVersion?: IVersionValue;
}
