
import { ensureLinkSync, ensureDirSync, symlink, ensureSymlinkSync } from 'fs-extra';
import { join, dirname } from 'upath2';
import { IPackageJson } from '@ts-type/package-dts';
import { findRoot, IFindRootOptions } from '@yarn-tool/find-root';
import { readPackageJSON } from 'find-yarn-workspace-root2/core';
import { fsSymlinkSync } from 'fs-symlink-extra';

export interface IOptions extends Partial<IFindRootOptions>
{
	name: string,
	targetNodeModulesPath: string,
	sourcePackagePath: string,
	cwd?: string,
	targetNodeModulesName?: string,
	overwrite?: boolean,
}

export function linkToNodeModulesCore<T extends IOptions>(options: T)
{
	let resultPath = join(options.targetNodeModulesPath, options.name);

	fsSymlinkSync(options.sourcePackagePath, resultPath, {
		overwrite: options.overwrite ?? true,
	});

	return {
		...options,
		resultPath,
	}
}

export function linkToNodeModules<T extends Partial<IOptions>>(options?: T)
{
	options ??= {} as T;
	options.cwd ??= process.cwd();

	if (!options.sourcePackagePath || !options.targetNodeModulesPath)
	{
		let rootData = findRoot(options as IFindRootOptions);

		options.sourcePackagePath ??= rootData.pkg;
		options.targetNodeModulesPath ??= join(rootData.root, options.targetNodeModulesName ?? 'node_modules')
	}

	options.name ??= readPackageJSON<IPackageJson>(options.sourcePackagePath).name;

	return linkToNodeModulesCore(options as IOptions)
}

export default linkToNodeModules
