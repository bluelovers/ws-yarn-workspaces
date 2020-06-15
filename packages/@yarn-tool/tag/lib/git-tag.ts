import { IOptionsPackageTagInput, IOptionsPackageTag } from './types';
import { formatPackageTag, handleOptions } from './core';
import { gitTag, gitTagSync, IOptions } from '@git-lazy/tag';
import { crossSpawnGitSync, crossSpawnGitAsync, ISpawnGitAsyncOptions, ISpawnGitSyncOptions } from '@git-lazy/spawn';
import pkgDir from 'pkg-dir';
import pathIsSame from 'path-is-same';
import { findRoot } from '@yarn-tool/find-root';
import { join } from 'path';

export async function gitPackageTag(options: IOptionsPackageTag, spawnOptions?: ISpawnGitAsyncOptions)
{
	let cwd = options?.cwd ?? process.cwd();

	let rootData = findRoot({
		cwd,
	})

	if (rootData.hasWorkspace && rootData.isWorkspace)
	{
		throw new Error(`disallow create git tag for workspace root`)
	}
	else if (!pathIsSame(rootData.pkg, cwd))
	{
		throw new Error(`cwd must be same as package dir`)
	}

	if (!rootData.pkg)
	{
		options.pkg = await import(join(rootData.pkg, 'package.json'))
			.then(m => m.default || m)
		;
	}

	cwd = options.cwd = rootData.pkg;

	options = handleOptions(options as any)

	const tag = formatPackageTag(options as any);

	options.message = options.message ?? tag;

	spawnOptions = {
		...spawnOptions,
		cwd,
	}

	return gitTag(tag, options, spawnOptions)
}

export default gitPackageTag
