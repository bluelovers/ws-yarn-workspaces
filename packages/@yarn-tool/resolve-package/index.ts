import { dirname } from 'upath2';
import type { IPackageJson } from '@ts-type/package-dts';

export function resolvePackage(name: string, options?: { paths?: string[]; })
{
	let pkgRoot = dirname(require.resolve(`${name}/package.json`, options));

	return {
		name,
		pkgRoot,
		pkg: require(`${pkgRoot}/package.json`) as any as IPackageJson,
	}
}

export default resolvePackage
