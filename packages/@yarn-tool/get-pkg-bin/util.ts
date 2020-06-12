/**
 * Created by user on 2020/2/16.
 */

import type { IPackageJson } from '@ts-type/package-dts';
import { sep, isAbsolute, normalize } from 'upath2';
import { resolvePackage } from '@yarn-tool/resolve-package';

export * from './lib/types';
import { IPackageJsonLike, IOptions } from './lib/types';

export function getPackageBins(pkg: IPackageJsonLike): Record<string, string>
{
	if (pkg.bin != null)
	{
		if (typeof pkg.bin === 'string')
		{
			return {
				[pkg.name]: pkg.bin,
			}
		}
		else
		{
			return {
				...pkg.bin,
			}
		}
	}
}

export function handlePackageBins<K extends string>(bins: Record<K, string>,
	resolveFn?: (bin: string, ...argv) => string,
)
{
	const _cwd = '.' + sep;

	return Object.entries(bins)
		.reduce((a, [k, bin]) =>
		{
			if (resolveFn)
			{
				bin = resolveFn(_cwd + bin as string);
			}

			if (!isAbsolute(normalize(bin)))
			{
				bin = _cwd + normalize(bin);
			}
			else
			{
				bin = normalize(bin);
			}

			a[k] = bin;
			return a
		}, {} as Record<K, string>)
}

export function firstPackageBin(bins: Record<string, string>): string
{
	bins = bins || {};
	let keys = Object.keys(bins);

	if (keys.length)
	{
		return bins[keys[0]]
	}
}

export function getPackageInfo(options: IOptions)
{
	let { pkgRoot, pkg, name } = options;

	if (pkg)
	{
		name = name || options.pkg.name;
	}
	else if (name)
	{
		let data = resolvePackage(options.name, {
			paths: options.paths,
		});
		pkg = data.pkg;
		pkgRoot = pkgRoot || data.pkgRoot;
	}
	else
	{
		throw new TypeError(`name or pkg is not valid`)
	}

	return {
		name,
		pkgRoot,
		pkg: pkg as IPackageJson,
	}
}
