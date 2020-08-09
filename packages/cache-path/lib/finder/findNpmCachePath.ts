import { sync as crossSpawnExtra } from 'cross-spawn-extra';

/**
 * try get npm global cache path
 */
export function findNpmCachePath(cwd?: string, processEnv = process.env): string
{
	let cache = crossSpawnExtra('npm', [
		'config', 'get', 'cache',
	], {
		stripAnsi: true,
		env: processEnv,
		cwd,
	})?.stdout?.toString?.();

	return cache;
}
