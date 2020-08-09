import { VersionNotFoundError, PackageNotFoundError, Options, AbbreviatedMetadata } from 'package-json';
import { ITSRequireAtLeastOne } from 'ts-type/lib/type/record';
export interface ICachedVersionResultCore {
    key: string;
    name: string;
    version: string;
    result?: string;
    error?: VersionNotFoundError | PackageNotFoundError;
}
export declare type ICachedVersionResult = ITSRequireAtLeastOne<ICachedVersionResultCore, 'result' | 'error'>;
export declare type IOptionsQueryVersion<T extends Options | AbbreviatedMetadata> = T & {
    notThrowError?: boolean;
};
