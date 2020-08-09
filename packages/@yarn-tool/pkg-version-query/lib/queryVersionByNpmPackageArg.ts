import npmPackageArg from 'npm-package-arg';
import queryVersionWithCache from './queryVersion';

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

export function queryVersionByNpmPackageArgWithCache(input: string)
{
	const { name, version } = parseVersionByNpmPackageArg(input);

	return queryVersionWithCache(name, version)
}

export default queryVersionByNpmPackageArgWithCache
