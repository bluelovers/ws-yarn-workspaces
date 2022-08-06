import { findRootLazy } from '@yarn-tool/find-root';
import { readPackageJson } from '@ts-type/package-dts';
import npa from '@yarn-tool/npm-package-arg-util';
import { yarnLockParse } from '@yarn-tool/yarnlock-parse';
import {
	groupYarnLockParsedEntries,
	IGroupYarnLockParsedEntriesOptions,
} from '@yarn-tool/yarnlock-util/lib/util/groupYarnLockParsedEntries';
import { IComputedPackageEntries } from '@yarn-tool/yarnlock-util/lib/util/reduceYarnLockParsedEntries';
import { IParseNameAndVersionWithNpaResult } from '@yarn-tool/yarnlock-util/lib/types';

import { pick } from 'lodash';
import { join } from 'path';
import { addDependenciesIfNotExists, EnumResultAddDependencies } from '@yarn-tool/pkg-deps-add';
import { fsYarnLockSafe } from '@yarn-tool/yarnlock-fs/lib/read';
import { array_unique_overwrite } from 'array-hyper-unique';
import { sortDependencies } from './util/sortDependencies';
import { fetchRemoteInfo } from './util/fetchRemoteInfo';
import { IAddedList, IFilteredRecord, IOptionsInstallDepsFromYarnLock, IResultInstallDeps } from './types';
import { IYarnLockParsedV1, IYarnLockParsedV2 } from '@yarn-tool/yarnlock-types';

export function filterDepsFromYarnLock<T extends string>(packageNames: T[],
	parsedOldPackage: IYarnLockParsedV1 | IYarnLockParsedV2,
	options?: IGroupYarnLockParsedEntriesOptions,
)
{
	let group = groupYarnLockParsedEntries(parsedOldPackage, options);

	return pick(group, packageNames.map((name) => npa(name).name)) as IFilteredRecord<IComputedPackageEntries<IParseNameAndVersionWithNpaResult>, T>;
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

	const added = [] as IAddedList;
	const exists = [] as string[];

	let others: T[] = packageNames.filter((packageName) =>
	{
		const result = npa(packageName);
		const { name } = result;

		let target = listRemoteInfo[name];

		let version = filteredYarnLock[name]?.find?.((value) => value[0] === target.versionQuery)?.[0];

		if (version?.length)
		{
			const semver = `^${version}`;
			let bool = addDependenciesIfNotExists(pkg, name, semver, options).bool;

			if (bool === EnumResultAddDependencies.changed)
			{
				added.push([name, semver]);

				return false;
			}
			else if (bool === null)
			{
				exists.push(name);
				return false;
			}
		}

		return true
	});

	const updated = others.length !== packageNames.length;

	if (updated)
	{
		sortDependencies(pkg)
	}

	const result = {
		cwd,
		rootData,
		added,
		exists,
		others,
		pkg,
		updated,
	};

	<IResultInstallDeps>result;

	return result
}

/**
 * 檢查並且過濾要安裝的版本是否已經存在於 yarn.lock 內
 */
export async function installDepsFromYarnLock<T extends string>(packageNames: T[],
	options: IOptionsInstallDepsFromYarnLock = {},
)
{
	packageNames = array_unique_overwrite(packageNames.filter(v => v?.length));

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
