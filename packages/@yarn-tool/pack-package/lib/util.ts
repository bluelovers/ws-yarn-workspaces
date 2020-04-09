/**
 * Created by user on 2020/4/9.
 */

import { IPackageJson } from '@ts-type/package-dts';

export function getTarballName(pkg: IPackageJson, versionPrefix?: string)
{
	const name =
		pkg.name[0] === "@"
			? // scoped packages get special treatment
			pkg.name.substr(1).replace(/\//g, "-")
			: pkg.name;

	return `${name}-${versionPrefix ?? ''}${pkg.version}.tgz`;
}
