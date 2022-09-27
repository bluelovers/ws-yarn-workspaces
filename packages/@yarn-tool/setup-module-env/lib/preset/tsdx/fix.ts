import { IPackageJson } from '@ts-type/package-dts/package-json';
import { ISetupTsdxOptions } from './index';
import { deleteValue } from 'dot-values2';

export function fixTsdxPackage<P extends IPackageJson>(pkg: P, config?: Partial<ISetupTsdxOptions<P>>)
{
	if (config?.rootData.hasWorkspace && !config.rootData.isWorkspace)
	{
		deleteValue(pkg, ['dependencies', 'tslib']);
		deleteValue(pkg, ['devDependencies', 'tslib']);
	}
	else
	{
		pkg.devDependencies ??= {};

		if (pkg.dependencies?.['tslib']?.length > 0)
		{
			pkg.devDependencies['tslib'] ??= pkg.dependencies['tslib'];
			deleteValue(pkg, ['dependencies', 'tslib']);
		}

		if (config?.rootData.isRoot)
		{
			pkg.devDependencies['@bluelovers/tsconfig'] ??= '*';
		}
	}

	return pkg
}
