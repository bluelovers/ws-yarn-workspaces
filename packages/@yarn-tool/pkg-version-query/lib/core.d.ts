import { Options, AbbreviatedVersion, AbbreviatedMetadata, FullMetadataOptions, FullMetadata } from 'package-json';
import Bluebird from 'bluebird';
import { IOptionsQueryVersion } from './types';
export declare function _queryVersion(packageName: string, options: IOptionsQueryVersion<FullMetadataOptions>): Bluebird<FullMetadata>;
export declare function _queryVersion(packageName: string, options: Omit<Options, 'allVersions' | 'version'> & {
    allVersions?: false;
    version: string;
}): Bluebird<AbbreviatedVersion>;
export declare function _queryVersion(packageName: string, options?: IOptionsQueryVersion<Options>): Bluebird<AbbreviatedMetadata>;
