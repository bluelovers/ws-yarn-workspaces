import { ICopyStaticFilesOptions, IStaticFilesMapArray, IStaticFilesMapArrayEntry } from './types';
import { CopyOptionsSync, copySync, ensureDirSync, existsSync, pathExistsSync } from 'fs-extra';
import { dirname, resolve } from 'path';
import { defaultCopyStaticFiles } from './const';
import { parseStaticMap } from './parseStaticMap';
import { copyStaticFilesEntry } from './copyStaticFilesEntry';
import __root from '../__root';

export function copyStaticFiles<K extends string>(options: ICopyStaticFilesOptions<K>)
{
	if (typeof options.cwd !== 'string' || !options.cwd?.length || !options.cwd)
	{
		throw new TypeError(`options.cwd must is string`)
	}

	if (!pathExistsSync(options.cwd))
	{
		throw new TypeError(`options.cwd not exists`)
	}

	let ls = parseStaticMap<K>(options.file_map ?? defaultCopyStaticFiles as IStaticFilesMapArray<K>);

	if (!ls.length)
	{
		throw new TypeError(`Invalid file map: ${options.file_map}`)
	}

	const staticRoot = options.staticRoot || __root;
	const { cwd, overwrite } = options;

	return ls.filter((entry) =>
		{
			return copyStaticFilesEntry(entry, cwd, staticRoot, overwrite)
		})
		;
}

