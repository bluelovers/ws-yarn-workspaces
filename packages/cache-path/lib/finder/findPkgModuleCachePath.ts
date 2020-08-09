import { join } from "path";
import findRoot from '@yarn-tool/find-root';

export function findPkgPath(cwd?: string): string
{
	return findRoot({
		cwd,
	}).root
}

/**
 * try get a pkg/node_modules
 */
export function findPkgModulePath(cwd?: string): string
{
	return join(findPkgPath(cwd), 'node_modules');
}

export function findPkgModuleCachePath(cwd?: string): string
{
	return join(findPkgModulePath(cwd), '.cache');
}
