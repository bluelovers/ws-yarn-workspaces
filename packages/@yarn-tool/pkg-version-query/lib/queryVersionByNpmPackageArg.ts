import { npa, IResult } from '@yarn-tool/npm-package-arg-util';
import { queryVersionWithCache } from './queryVersion';
import { IOptionsQueryVersion } from './types';
import { Options } from 'package-json';

export function parseVersionByNpmPackageArg(input: string)
{
	return _parseVersionByNpmPackageArgCore(npa(input))
}

export function _parseVersionByNpmPackageArgCore(result: IResult)
{
	const { name, fetchSpec: version } = result;

	return {
		name,
		version,
	}
}

export function queryVersionByNpmPackageArgWithCache(input: string, options?: IOptionsQueryVersion<Options>)
{
	const { name, version } = parseVersionByNpmPackageArg(input);

	return queryVersionWithCache(name, version, options)
}

export default queryVersionByNpmPackageArgWithCache
