import path from 'path';
import pkgDir from 'pkg-dir';
import { existsSync, readFileSync } from 'fs';
import micromatch from 'micromatch';

/**
 * Adapted from:
 * https://github.com/yarnpkg/yarn/blob/ddf2f9ade211195372236c2f39a75b00fa18d4de/src/config.js#L612
 * @param {string} [initial]
 * @return {string|null}
 */
export function findWorkspaceRoot(initial?: string): string
{
	if (!initial)
	{
		initial = process.cwd();
	}

	let _pkg = pkgDir.sync(initial);

	if (!_pkg)
	{
		return null;
	}

	initial = path.normalize(_pkg);

	let previous: string = null;
	let current: string = initial;

	do
	{
		const manifest = readPackageJSON(current);
		const workspaces = extractWorkspaces(manifest);

		let { done, found } = checkWorkspaces(current, initial)

		if (done)
		{
			return found;
		}

		previous = current;
		current = path.dirname(current);
	}
	while (current !== previous);

	return null;
}

export function checkWorkspaces(current: string, initial: string)
{
	const manifest = readPackageJSON(current);
	const workspaces = extractWorkspaces(manifest);

	let done: boolean = false;
	let found: string;
	let relativePath: string;

	if (workspaces)
	{
		done = true;

		relativePath = path.relative(current, initial);
		if (relativePath === '' || isMatchWorkspaces(relativePath, workspaces))
		{
			found = current;
		}
		else
		{
			found = null;
		}
	}

	return {
		done,
		found,
		relativePath,
	}
}

export function isMatchWorkspaces(relativePath: string, workspaces: string[])
{
	let ls = micromatch([relativePath], workspaces);

	return ls.length > 0;
}

export function extractWorkspaces<T extends string[]>(manifest: {
	workspaces?: {
		packages: T
	}
}): T
export function extractWorkspaces<T extends string[]>(manifest: {
	workspaces?: T
}): T
export function extractWorkspaces(manifest: {
	workspaces?: any
})
{
	const workspaces = (manifest || {}).workspaces;
	return (workspaces && workspaces.packages) || (Array.isArray(workspaces) ? workspaces : null);
}

export function readPackageJSON<T extends {
	workspaces?: any
}>(dir: string): T
{
	const file = path.join(dir, 'package.json');
	if (existsSync(file))
	{
		return JSON.parse(readFileSync(file, 'utf8'));
	}
	return null;
}

findWorkspaceRoot.findWorkspaceRoot = findWorkspaceRoot;
findWorkspaceRoot.readPackageJSON = readPackageJSON;
findWorkspaceRoot.extractWorkspaces = extractWorkspaces;
findWorkspaceRoot.isMatchWorkspaces = isMatchWorkspaces;
findWorkspaceRoot.default = findWorkspaceRoot;

export default findWorkspaceRoot
