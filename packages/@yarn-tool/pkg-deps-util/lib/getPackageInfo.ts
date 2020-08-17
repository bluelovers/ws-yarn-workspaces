import { IParsePackageName } from '@yarn-tool/npm-package-arg-util/lib/types';
import { packageNameToTypes } from '@yarn-tool/npm-package-arg-util/lib/packageNameToTypes';
import { _queryVersion } from '@yarn-tool/pkg-version-query/lib/core';
import { VersionNotFoundError, PackageNotFoundError, AbbreviatedVersion } from 'package-json';

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
