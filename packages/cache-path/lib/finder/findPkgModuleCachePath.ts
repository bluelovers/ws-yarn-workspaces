import { join } from "path";
import { findRoot } from '@yarn-tool/find-root';

export function findPkgPath(cwd?: string): string
{
	return findRoot({
		cwd,
	}).root
}

export function findPkgModulePathCore(root: string): string
{
	return join(root, 'node_modules');
}

export function findPkgModuleCachePathCore(root: string): string
{
	return join(findPkgModulePathCore(root), '.cache');
}

/**
 * try get a pkg/node_modules
 */
export function findPkgModulePath(cwd?: string): string
{
	return findPkgModulePathCore(findPkgPath(cwd));
}

export function findPkgModuleCachePath(cwd?: string): string
{
	return findPkgModuleCachePathCore(findPkgPath(cwd));
}
