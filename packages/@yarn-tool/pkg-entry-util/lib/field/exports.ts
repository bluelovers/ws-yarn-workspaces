import { IPackageJson } from '@ts-type/package-dts/package-json';
import { PackageExportsEntry, PackageExportsFallback } from '@ts-type/package-dts/types/package.json';
import { pathExistsSync } from 'fs-extra';
import { findRootLazy } from '@yarn-tool/find-root';
import { resolvePackage, resolvePackageRoot } from '@yarn-tool/resolve-package';

export function _pkgExportsAddPJsonEntryCore<T extends IPackageJson["exports"]>(pkgExports: T)
{
	if (typeof pkgExports === 'object')
	{
		pkgExports['./package.json'] ??= './package.json';
	}

	return pkgExports
}

export function pkgExportsAddPJsonEntry<T extends IPackageJson>(pkg: T)
{
	_pkgExportsAddPJsonEntryCore(pkg.exports);

	return pkg
}

export function _isPackageExportsEntry(entry: string | keyof keyof IPackageJson["exports"],
	value: PackageExportsEntry | PackageExportsFallback,
): value is PackageExportsEntry
{
	return entry.startsWith('./') && !!(value ?? false)
}

export function pkgExportsVerify<T extends IPackageJson>(pkg: T, options?: {
	cwd?: string,
})
{
	if (typeof pkg.exports === 'object')
	{
		const rootData = findRootLazy({
			cwd: options?.cwd,
		});

		if (!rootData.isWorkspace && rootData.pkg)
		{
			const list: string[] = [];

			Object.entries(pkg.exports)
				.forEach(([entry, value]) =>
				{
					if (_isPackageExportsEntry(entry, value))
					{
						const _ = resolvePackage(rootData.pkg);

						([typeof value === 'string' ? value : Object.values(value)] as string[])
							.flat()
							.forEach(file =>
							{
								/**
								 * skip check './src/*'
								 */
								if (file.includes?.('*'))
								{
									return;
								}

								const bool = pathExistsSync(_.resolveLocation(file));

								if (!bool)
								{
									list.push(`path of '${entry}' does not exist: '${file}'`);
								}

							})
						;
					}
				})
			;

			if (list.length > 0)
			{
				let err = new Error(`Invalid package exports: ${rootData.pkg}\n${list.slice().map(v => ` - ${v}`).join('\n')}`);

				// @ts-ignore
				err.list = list;
				// @ts-ignore
				err.rootData = rootData;
				// @ts-ignore
				err.pkgExports = pkg.exports;

				throw err;
			}
		}

	}

	return null as null
}
