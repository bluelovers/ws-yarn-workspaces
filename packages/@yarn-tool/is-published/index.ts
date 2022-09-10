import { IOptions, queryDepsValueByNpaResult } from '@yarn-tool/npa-to-deps-query';
import { ITSResolvable } from 'ts-type';
import { IDepsResult, npaToDepsValue } from '@yarn-tool/npa-to-deps';
import Bluebird from 'bluebird';
import { PackageNotFoundError, VersionNotFoundError } from 'package-json';
import { IResult } from '@yarn-tool/npm-package-arg-util';

export const enum EnumIsPublishedState
{
	VersionPublished = 0,
	VersionNotFound = 1,
	PackageNotFound = 2,
}

export interface IPublishedResultBase
{
	depsResult: IDepsResult<IResult>;
	exists: boolean;
	isPublished: null | boolean;
	state: EnumIsPublishedState;
}

export interface IPublishedResultVersionPublished extends IPublishedResultBase
{
	queryResult: {
		name: string;
		value: string;
	};
	exists: true;
	isPublished: true;
	state: EnumIsPublishedState.VersionPublished;
}

export interface IPublishedResultVersionNotFound extends IPublishedResultBase
{
	queryResult?: {
		name: string;
		value: string;
	};
	exists: true;
	isPublished: false;
	state: EnumIsPublishedState.VersionNotFound;
}

export interface IPublishedResultPackageNotFound extends IPublishedResultBase
{
	exists: false;
	isPublished: null;
	state: EnumIsPublishedState.PackageNotFound;
}

export type IPublishedResult = IPublishedResultVersionPublished | IPublishedResultVersionNotFound | IPublishedResultPackageNotFound;

export function _isPublishedCoreByNpaResult(depsResult: ITSResolvable<IDepsResult<IResult>>, options?: IOptions)
{
	return Bluebird.resolve(depsResult)
		.then(depsResult =>
		{
			return queryDepsValueByNpaResult({
				...depsResult,
				operator: '',
				fetchQuery: true,
			}, options)
				.then((queryResult) =>
				{
					const isPublished = depsResult.semver === queryResult.value;

					return {
						depsResult,
						queryResult,
						exists: true as const,
						isPublished,
						state: isPublished ? EnumIsPublishedState.VersionPublished as const : EnumIsPublishedState.VersionNotFound as const,
					}
				})
				.catch(VersionNotFoundError, err => {
					return {
						depsResult,
						exists: true as const,
						isPublished: false as const,
						state: EnumIsPublishedState.VersionNotFound as const,
					}
				})
				.catch(PackageNotFoundError, err =>
				{
					return {
						depsResult,
						exists: false as const,
						isPublished: null as null,
						state: EnumIsPublishedState.PackageNotFound as const,
					}
				}) as Bluebird<IPublishedResult>
		})
}

export function _isPublishedCore(input: string, options?: IOptions)
{
	return Bluebird.resolve()
		.then(() =>
		{
			return npaToDepsValue(input, options)
		})
		.then((result) =>
		{
			return _isPublishedCoreByNpaResult(result, options)
		})
}

export function _isPublishedCoreByPackageJSON(pkg: {
	name: string,
	version: string,
}, options?: IOptions)
{
	return _isPublishedCore(`${pkg.name}@${pkg.version}`, options)
}

export function isPublishedByNpaResult(depsResult: ITSResolvable<IDepsResult>, options?: IOptions)
{
	return _isPublishedCoreByNpaResult(depsResult, options)
		.then(data => data?.isPublished)
}

export function isPublished(input: string, options?: IOptions)
{
	return _isPublishedCore(input, options)
		.then(data => data?.isPublished)
}

export function isPublishedByPackageJSON(pkg: {
	name: string,
	version: string,
}, options?: IOptions)
{
	return isPublished(`${pkg.name}@${pkg.version}`, options)
}

export default isPublishedByPackageJSON
