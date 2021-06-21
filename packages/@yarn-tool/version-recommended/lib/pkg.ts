import { nextVersionRecommendedByWorkspacesProject, nextVersionRecommendedByWorkspacesFindUp } from './ws';
import { findRoot } from '@yarn-tool/find-root/index';
import { readPackageJson } from '@ts-type/package-dts/index';
import { join } from 'path';
import { INextVersionRecommendedOptions } from './types';
import { IPackageJson } from '@ts-type/package-dts/package-json';

export function nextVersionRecommendedByPackage<T extends {
	version?: string
}>(pkg: T, options?: INextVersionRecommendedOptions)
{
	if (typeof pkg.version !== 'string' || !pkg.version.length)
	{
		throw  new TypeError(`pkg.version is require`)
	}

	return {
		...nextVersionRecommendedByWorkspacesFindUp(pkg.version, options),
		pkg,
	}
}

export function nextVersionRecommendedByPackageFindUp<T extends {
	version?: string
	// @ts-ignore
} = IPackageJson>(options?: INextVersionRecommendedOptions)
{
	options ??= {};
	options.cwd ??= process.cwd();

	let rootData = findRoot(options as any)

	let pkg = readPackageJson(join(rootData.pkg, 'package.json'))

	options.cwd = rootData.root;

	// @ts-ignore
	return nextVersionRecommendedByPackage<T>(pkg as T, options)
}
