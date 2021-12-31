import { IPackageJson } from '@ts-type/package-dts/package-json';
import { IPackageJsonPublishConfig } from '@ts-type/package-dts/lib/package-json/types';

export function fixPublishConfig<T extends IPackageJson>(pkg: T)
{
	if (!pkg.publishConfig
		&& !pkg.private
		&& pkg.name
		&& /\//.test(pkg.name)
	)
	{
		pkg.publishConfig = {
			access: "public",
		};
	}
	return pkg as T & {
		publishConfig: IPackageJsonPublishConfig
	}
}
