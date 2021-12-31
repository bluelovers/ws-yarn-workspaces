import { IPackageJson } from '@ts-type/package-dts/package-json';
import { existsSync } from 'fs-extra';
import { join, posix } from 'upath2';

export function fixBinPath(bin: string, root: string)
{
	if (
		!existsSync(join(root, bin))
		&& existsSync(join(root, 'bin', bin))
	)
	{
		return join('.', 'bin', bin);
	}

	return null;
}

export function fixPkgBinField<T extends IPackageJson>(pkg: T, root: string)
{
	if (pkg.bin)
	{
		if (typeof pkg.bin === 'string')
		{
			let bin_new = fixBinPath(pkg.bin, root);

			if (bin_new)
			{
				// @ts-ignore
				pkg.bin = bin_new;
			}
		}
		else if (typeof pkg.bin === 'object' && !Array.isArray(pkg.bin))
		{
			Object.keys(pkg.bin)
				.forEach(function (key)
				{
					if (typeof pkg.bin[key] === 'string')
					{
						let bin_new = fixBinPath(pkg.bin[key], root);

						if (bin_new)
						{
							pkg.bin[key] = bin_new;
						}
					}
				})
			;
		}
	}

	return pkg
}
