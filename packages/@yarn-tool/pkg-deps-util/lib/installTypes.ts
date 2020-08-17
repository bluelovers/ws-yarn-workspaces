import { packageNameToTypes } from '@yarn-tool/npm-package-arg-util/lib/packageNameToTypes';
import queryVersionWithCache from '@yarn-tool/pkg-version-query/lib/queryVersion';
import { generatePackageArg } from '@yarn-tool/npm-package-arg-util/lib/generatePackageArg';
import { _queryVersion } from '@yarn-tool/pkg-version-query/lib/core';
import {
	VersionNotFoundError,
	PackageNotFoundError,
	FullMetadata,
	AbbreviatedMetadata,
	AbbreviatedVersion,
} from 'package-json';
import { IParsePackageName } from '@yarn-tool/npm-package-arg-util/lib/types';
import { IPackageJson } from '@ts-type/package-dts/package-json';
import { existsDependencies } from './util/existsDependencies';

export function getPackageInfo(packageName: string | IParsePackageName, excludeVersion?: boolean)
{
	const data = typeof packageName === 'string' ? packageNameToTypes(packageName) : packageName;

	let version = 'latest';

	if (!excludeVersion && data.semver?.length > 0)
	{
		version = data.semver ?? 'latest';
	}

	return _queryVersion(data.name, {
		version,
		//fullMetadata: true,
	})
		.catch(VersionNotFoundError, () =>
		{
			return _queryVersion(data.name, {
				version: 'latest',
				//fullMetadata: true,
			})
		})
		.catch(PackageNotFoundError, err => void 0 as AbbreviatedVersion)
		;
}

export const enum EnumInstallTypesErrorCode
{
	NOT_EXISTS = 1,
	DEPRECATED = 2,

	SKIP = 3,
}

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
	}
}
