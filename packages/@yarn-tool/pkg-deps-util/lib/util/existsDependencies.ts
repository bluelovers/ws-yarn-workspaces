import { IPackageJson } from '@ts-type/package-dts/package-json';

export function existsDependencies(name: string,
	pkg: IPackageJson | Partial<Record<'dependencies' | 'devDependencies' | 'optionalDependencies', Record<string, string>>>,
)
{
	return pkg.dependencies?.[name]
		?? pkg.devDependencies?.[name]
		?? pkg.optionalDependencies?.[name]
		;
}
