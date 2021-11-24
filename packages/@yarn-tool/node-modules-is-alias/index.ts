import { sync as pkgDirSync } from 'pkg-dir';
import { parsePackageName } from '@yarn-tool/npm-package-arg-util/lib/parseArgvPkgName';
import { resolvePackage } from '@yarn-tool/resolve-package';
import { basename, dirname, isAbsolute, normalize } from 'upath2';

export function assertIsAbsolutePath(absolutePath: string): asserts absolutePath is string
{
	if (!isAbsolute(absolutePath))
	{
		throw new RangeError(`Input path should be absolute path: ${absolutePath}`)
	}
}

export function parseModulePath(absolutePath: string)
{
	assertIsAbsolutePath(absolutePath);

	const root = normalize(pkgDirSync(absolutePath));
	const moduleBasename = basename(root);
	const parentBasename = basename(dirname(root));
	const isTypes = parentBasename === '@types';
	const inNodeModules = parentBasename === 'node_modules';

	return {
		root,
		moduleBasename,
		parentBasename,
		isTypes,
		inNodeModules,
	}
}

export function parseModulePathIsAlias(absolutePath: string)
{
	const data = parseModulePath(absolutePath);

	const resolveData = resolvePackage(absolutePath);
	const parsed = parsePackageName(resolveData.pkg.name);

	const isAlias = !!(data.moduleBasename !== parsed.subname || data.isTypes && parsed.scope !== '@types' || parsed.scope && parsed.scope !== data.parentBasename);

	return {
		...data,
		parsed,
		resolveData,
		isAlias,
	}
}

export function parseModulePathIsAliasUnsafe(absolutePath: string)
{
	return parseModulePathIsAlias(resolvePackage(absolutePath).pkgRoot)
}

export function modulePathIsAlias(dir: string)
{
	return parseModulePathIsAlias(dir).isAlias
}

export default modulePathIsAlias
