import { findRoot, findRootLazy, IFindRootOptions } from '@yarn-tool/find-root';
import { IPackageJson, readPackageJson } from '@ts-type/package-dts';
import { IOptionsInstallDepsFromWorkspaces } from './installDepsFromWorkspaces';
import Bluebird from 'bluebird';
import { IOptionsQueryVersion } from '@yarn-tool/pkg-version-query/lib/types';
import { Options } from 'package-json';
import { queryVersionWithCache } from '@yarn-tool/pkg-version-query/lib/queryVersion';
import npa from '@yarn-tool/npm-package-arg-util';
import { parsePackageName } from '@yarn-tool/npm-package-arg-util/lib/parseArgvPkgName';
import { IParsePackageName } from '@yarn-tool/npm-package-arg-util/lib/types';
import {
	assertYarnLockParsedIsSupported,
	isYarnLockParsedV1,
	isYarnLockParsedV2,
	IYarnLockDataRowV1,
	IYarnLockDataRowV2,
	IYarnLockParsedV1,
	IYarnLockParsedV2,
} from '@yarn-tool/yarnlock-parse';
import {
	groupYarnLockParsedEntries,
	IGroupYarnLockParsedEntriesOptions,
} from '@yarn-tool/yarnlock-util/lib/util/groupYarnLockParsedEntries';
import { IComputedPackageEntries } from '@yarn-tool/yarnlock-util/lib/util/reduceYarnLockParsedEntries';
import { IParseNameAndVersion } from '@yarn-tool/yarnlock-util/lib/types';

import { pick } from 'lodash';
import { join } from 'path';
import { addDependenciesIfNotExists } from './addDependenciesIfNotExists';
import { fsYarnLockSafe, fsYarnLock } from '@yarn-tool/yarnlock-fs/lib/read';
import { yarnLockParse } from '@yarn-tool/yarnlock-parse';
import sortObjectKeys from 'sort-object-keys2/core';

export interface IOptionsInstallDepsFromYarnLock extends IOptionsInstallDepsFromWorkspaces, IGroupYarnLockParsedEntriesOptions
{
	queryOptions?: IOptionsQueryVersion<Options>,
}

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

export type IFilteredRecord<T extends Record<string, any>, K extends string> = T extends Record<string, infer U>
	? T & Record<K, U>
	: T

export function filterDepsFromYarnLock<T extends string>(packageNames: T[],
	parsedOldPackage: IYarnLockParsedV1 | IYarnLockParsedV2,
	options?: IGroupYarnLockParsedEntriesOptions
)
{
	let group = groupYarnLockParsedEntries(parsedOldPackage, options);

	console.dir(group)

	return pick(group, packageNames.map((name) => npa(name).name)) as IFilteredRecord<IComputedPackageEntries<IParseNameAndVersion>, T>;
}

export async function installDepsFromYarnLockCore<T extends string>(packageNames: T[],
	parsedOldPackage: IYarnLockParsedV1 | IYarnLockParsedV2,
	options: IOptionsInstallDepsFromYarnLock = {},
)
{
	let names = packageNames.map((name) => npa(name).name) as T[];

	let listRemoteInfo = await fetchRemoteInfo(packageNames, options);

	let filteredYarnLock = filterDepsFromYarnLock(names, parsedOldPackage, {
		...options,
		names,
	});

	const cwd = options.cwd ??= process.cwd();

	const rootData = findRootLazy(options);

	const pkg = options.pkg ?? readPackageJson(join(rootData.pkg, 'package.json'));

	const added = [] as [name: string, semver: string][];
	let others: T[] = packageNames.filter((packageName) => {
		const result = npa(packageName);
		const { name } = result;

		let target = listRemoteInfo[name];

		let version = filteredYarnLock[name]?.find?.((value) => value[0] === target.versionQuery)?.[0];

		if (version?.length)
		{
			const semver = `^${version}`;
			let bool: boolean = addDependenciesIfNotExists(pkg, name, semver, options).bool;

			if (bool === false)
			{
				added.push([name, semver]);

				return false;
			}
			else if (bool === null)
			{
				return false;
			}
		}

		return true
	});

	if (others.length !== packageNames.length)
	{
		let opts = {
			useSource: true,
		};

		sortObjectKeys(pkg.dependencies ?? {}, opts);
		sortObjectKeys(pkg.devDependencies ?? {}, opts);
		sortObjectKeys(pkg.peerDependencies ?? {}, opts);
		sortObjectKeys(pkg.optionalDependencies ?? {}, opts);
	}

	return {
		cwd,
		rootData,
		added,
		others,
		pkg,
	}
}

/**
 * 檢查並且過濾要安裝的版本是否已經存在於 yarn.lock 內
 */
export async function installDepsFromYarnLock<T extends string>(packageNames: T[],
	options: IOptionsInstallDepsFromYarnLock = {},
)
{
	if (packageNames.length)
	{
		options.cwd ??= process.cwd();

		const rootData = findRootLazy(options);

		let yarnlock_cache = fsYarnLockSafe(rootData.root);

		if (yarnlock_cache.yarnlock_old?.length)
		{
			let parsedOldPackage = yarnLockParse(yarnlock_cache.yarnlock_old);

			return installDepsFromYarnLockCore(packageNames, parsedOldPackage, options)
		}
	}
}
