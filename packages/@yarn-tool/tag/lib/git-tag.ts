import { IOptionsPackageTagInput } from './types';
import { formatPackageTag, handleOptions } from './core';
import { gitTag, gitTagSync, IOptions } from '@git-lazy/tag';
import { crossSpawnGitSync, crossSpawnGitAsync, ISpawnGitAsyncOptions, ISpawnGitSyncOptions } from '@git-lazy/spawn';
import pkgDir from 'pkg-dir';
import pathIsSame from 'path-is-same';

export async function gitPackageTag(options: IOptionsPackageTagInput, spawnOptions?: ISpawnGitAsyncOptions)
{
	options = handleOptions(options)

	if (!pathIsSame(await pkgDir(options.cwd), options.cwd))
	{
		throw new Error(`cwd must be same as package dir`)
	}

	const tag = formatPackageTag(options);

	options.message = options.message ?? tag;

	return gitTag(tag, options, spawnOptions)
}

export default gitPackageTag
