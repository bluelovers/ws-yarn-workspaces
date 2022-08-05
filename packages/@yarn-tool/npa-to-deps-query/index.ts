import {
	npaToDepsValue,
	npaResultToDepsValue,
	IOptions as IOptionsDepsValue,
	IDepsResult,
} from '@yarn-tool/npa-to-deps';
import Bluebird from 'bluebird';
import { ITSResolvable } from 'ts-type';
import { queryVersionWithCache } from '@yarn-tool/pkg-version-query/lib/queryVersion';
import { IOptionsQueryVersion } from '@yarn-tool/pkg-version-query/lib/types';
import { Options } from 'package-json';

export interface IOptions extends IOptionsDepsValue
{
	queryOptions?: IOptionsQueryVersion<Options>,
}

export function queryDepsValueByNpaResult(depsResult: ITSResolvable<IDepsResult>, options?: IOptions)
{
	return Bluebird.resolve(depsResult)
		.then(depsResult =>
		{
			const name = depsResult.name;
			const operator = depsResult.operator ?? '';

			if (depsResult.fetchQuery)
			{
				return queryVersionWithCache(depsResult.name, depsResult.semver ?? depsResult.result.fetchSpec, options?.queryOptions)
					.then(version =>
					{
						return {
							name,
							value: `${operator}${version}`,
						};
					})
			}

			return {
				name,
				value: `${operator}${depsResult.semver}`,
			};
		})
}

export function queryDepsValueByNpa(input: string, options?: IOptions)
{
	return Bluebird.resolve()
		.then(() =>
		{
			return npaToDepsValue(input, options)
		})
		.then((result) =>
		{
			return queryDepsValueByNpaResult(result, options)
				.then((ret) => {
					return {
						...result,
						...ret,
					}
				})
		})
}

export default queryDepsValueByNpa
