import npmPackageArg from 'npm-package-arg';
import queryVersionWithCache from './queryVersion';
import { IOptionsQueryVersion } from './types';
import { Options } from 'package-json';

export function parseVersionByNpmPackageArg(input: string): {
	name: string;
	version: string;
}
{
	const { name, fetchSpec: version } = npmPackageArg(input);

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
