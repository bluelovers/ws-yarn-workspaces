import Cache, { IOptionsLRUCacheFS } from 'lru-cache-fs2';
import {
	normalizeName,
	getCachePath,
	findPkgModulePath,
	findYarnCachePath,
	findNpmCachePath,
	findOSTempPath,
} from 'cache-path';
import { ICachedVersionResult, IOptionsQueryVersion } from './types';
import { Options } from 'package-json';

let cache: Cache<string, ICachedVersionResult>;

export function initCache(options?: IOptionsQueryVersion<Options>)
{
	let id = '@yarn-tool/pkg-version-query';

	let cwd = getCachePath(id, {
		fnOrder: [
			findYarnCachePath,
			findNpmCachePath,
			findOSTempPath,
			findPkgModulePath,
		],
	});

	let { cacheAgentOptions } = options;

	cacheAgentOptions = {
//		max: 1000,
//		maxAge: 5 * 60 * 1000,
		...cacheAgentOptions,
		cacheName: normalizeName(id, true),
		autoCreate: true,
		cwd,
	}

	if (!cacheAgentOptions.max || cacheAgentOptions.max <= 100)
	{
		cacheAgentOptions.max = 1000;
	}

	if (!cacheAgentOptions.maxAge || cacheAgentOptions.maxAge <= 60 * 1000)
	{
		cacheAgentOptions.maxAge = 10 * 60 * 1000;
	}

	const cache = new Cache<string, ICachedVersionResult>(cacheAgentOptions);

	return cache;
}

export function getCache(options?: IOptionsQueryVersion<Options>)
{
	return options?.cacheAgent ?? (cache ??= initCache(options));
}
