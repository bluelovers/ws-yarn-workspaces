import Cache from 'lru-cache-fs2';
import {
	normalizeName,
	getCachePath,
	findPkgModulePath,
	findYarnCachePath,
	findNpmCachePath,
	findOSTempPath,
} from 'cache-path';
import { ICachedVersionResult } from './types';

let cache: Cache<string, ICachedVersionResult>;

export function initCache()
{
	let id = '@yarn-tool/pkg-version-query';

	let cwd = getCachePath(id, {
		fnOrder: [
			findYarnCachePath,
			findNpmCachePath,
			findOSTempPath,
			findPkgModulePath,
		],
	})

	const cache = new Cache<string, ICachedVersionResult>({
		max: 100,
		cacheName: normalizeName(id, true),
		cwd,
		autoCreate: true,
		maxAge: 60 * 1000,
	});

	return cache;
}

export function getCache()
{
	return cache ??= initCache();
}

