import { packageNameToTypes } from '@yarn-tool/npm-package-arg-util/lib/packageNameToTypes';
import { generatePackageArg } from '@yarn-tool/npm-package-arg-util/lib/generatePackageArg';
import { IPackageJson } from '@ts-type/package-dts/package-json';
import { existsDependencies } from './util/existsDependencies';
import { getPackageInfo } from './getPackageInfo';
import { EnumInstallTypesErrorCode } from './const';

export async function checkInstallTargetTypes(packageName: string, options?: {
	excludeVersion?: boolean,
	pkg?: IPackageJson,
	checkExists?: boolean,
})
{
	let data = packageNameToTypes(packageName);
	let { name } = data;

	if (options?.checkExists && existsDependencies(name, options?.pkg ?? {}))
	{
		let target = generatePackageArg({
			name,
			semver: data.semver,
		}, data.semver?.length > 0);

		return {
			name,
			target,
			error: EnumInstallTypesErrorCode.SKIP,
			msg: `${name} already exists in package dependencies`,
		}
	}

	let info = await getPackageInfo(data, options?.excludeVersion);

	let target = generatePackageArg({
		name,
		semver: data.type !== 'tag' && info?.version?.length ? `^${info.version}` : data.semver,
	}, data.semver?.length > 0);

	if (info == null)
	{
		return {
			name,
			target,
			error: EnumInstallTypesErrorCode.NOT_EXISTS,
			msg: `${name} not exists`,
		}
	}
	else if (info.deprecated)
	{
		return {
			name,
			target,
			error: EnumInstallTypesErrorCode.DEPRECATED,
			msg: info.deprecated,
		}
	}

	return {
		name,
		target,
		error: EnumInstallTypesErrorCode.SUCCESS,
		msg: `install ${target}`,
	}
}
