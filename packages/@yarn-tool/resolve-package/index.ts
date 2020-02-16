import { dirname } from 'upath2';
import type { IPackageJson } from '@ts-type/package-dts';

export function resolvePackage(name: string)
{
	return {
		name,
		pkgRoot: dirname(require.resolve(`${name}/package.json`)),
		pkg: require(`${name}/package.json`) as any as IPackageJson,
	}
}

export default resolvePackage
