import _packageJson, {
	Options,
	AbbreviatedVersion,
	AbbreviatedMetadata,
	FullMetadataOptions,
	FullMetadata,
} from 'package-json';
import Bluebird from 'bluebird';
import { IOptionsQueryVersion } from './types';

export function _queryVersion(packageName: string,
	options: IOptionsQueryVersion<FullMetadataOptions>,
): Bluebird<FullMetadata>;
export function _queryVersion(packageName: string,
	options: Omit<Options, 'allVersions' | 'version'> & {
		allVersions?: false,
		version: string,
	},
): Bluebird<AbbreviatedVersion>
export function _queryVersion(packageName: string,
	options?: IOptionsQueryVersion<Options>,
): Bluebird<AbbreviatedMetadata>
export function _queryVersion(packageName: string, options?: IOptionsQueryVersion<Options>)
{
	options ??= {};

	return Bluebird.resolve(_packageJson(packageName, options))
		.catch(e =>
		{
			if (options.notThrowError)
			{
				return
			}

			return Promise.reject(e)
		}) as any
		;
}
