import { nextVersionRecommendedByWorkspacesProject, nextVersionRecommendedByWorkspacesFindUp } from './ws';
import { findRoot } from '@yarn-tool/find-root/index';
import { readPackageJson } from '@ts-type/package-dts/index';
import { join } from 'path';
import { INextVersionRecommendedOptions } from './types';

export function nextVersionRecommendedByPackage(pkg: {
	version?: string
}, options?: INextVersionRecommendedOptions)
{
	if (typeof pkg.version !== 'string' || !pkg.version.length)
	{
		throw  new TypeError(`pkg.version is require`)
	}

	return nextVersionRecommendedByWorkspacesFindUp(pkg.version, options)
}

export function nextVersionRecommendedByPackageFindUp(options?: INextVersionRecommendedOptions)
{
	options ??= {};
	options.cwd ??= process.cwd();

	let rootData = findRoot(options as any)

	let pkg = readPackageJson(join(rootData.pkg, 'package.json'))

	options.cwd = rootData.root;

	return nextVersionRecommendedByPackage(pkg, options)
}
