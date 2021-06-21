import { IPackageJson, readPackageJson } from '@ts-type/package-dts';
import sortObjectKeys from 'sort-object-keys2/core';

export function sortDependencies(pkg: IPackageJson)
{
	let opts = {
		useSource: true,
	};

	sortObjectKeys(pkg.dependencies ?? {}, opts);
	sortObjectKeys(pkg.devDependencies ?? {}, opts);
	sortObjectKeys(pkg.peerDependencies ?? {}, opts);
	sortObjectKeys(pkg.optionalDependencies ?? {}, opts);

	return pkg
}
