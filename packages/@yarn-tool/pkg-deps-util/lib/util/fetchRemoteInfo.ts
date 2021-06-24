import Bluebird from 'bluebird';
import { parsePackageName } from '@yarn-tool/npm-package-arg-util/lib/parseArgvPkgName';
import { queryVersionWithCache } from '@yarn-tool/pkg-version-query/lib/queryVersion';
import { IParsePackageName } from '@yarn-tool/npm-package-arg-util/lib/types';
import { IFilteredRecord, IOptionsInstallDepsFromYarnLock } from '../types';

export function fetchRemoteInfo<T extends string>(packageNames: T[], options: IOptionsInstallDepsFromYarnLock = {})
{
	return Bluebird.resolve(packageNames)
		.reduce(async (data, input) =>
		{

			const result = parsePackageName(input);

			const versionQuery = await queryVersionWithCache(result.name, result.semver, options.queryOptions);

			// @ts-ignore
			data[result.name] = {
				...result,
				versionQuery,
			};

			return data
		}, {} as IFilteredRecord<Record<string, IParsePackageName & {
			versionQuery: string,
		}>, T>)
		;
}
