import {
	assertYarnLockParsedIsSupported,
	IYarnLockDataRowV1,
	IYarnLockDataRowV2,
	IYarnLockParsedV1,
	IYarnLockParsedV2,
} from '@yarn-tool/yarnlock-parse';
import { IParseNameAndVersion } from '../types';
import { EnumDetectYarnLock } from '@yarn-tool/detect-yarnlock-version/lib/types';
import { parseYarnLockRowV1 as v1 } from '../v1/parseYarnLockRowV1';
import { parseYarnLockRowV2 as v2 } from '../v2/parseYarnLockRowV2';
import { IComputedPackageEntries, reduceYarnLockParsedEntries } from './reduceYarnLockParsedEntries';

export interface IGroupYarnLockParsedEntriesOptions
{
	names?: string[],
}

export function groupYarnLockParsedEntries<R extends IYarnLockDataRowV1 | IYarnLockDataRowV2 = IYarnLockDataRowV1 | IYarnLockDataRowV2>(
	parsedOldPackage: IYarnLockParsedV1 | IYarnLockParsedV2, options?: IGroupYarnLockParsedEntriesOptions)
{
	let fn: (packageName: string, packageData: any, ...argv) => IParseNameAndVersion;

	assertYarnLockParsedIsSupported(parsedOldPackage, (verType, parsedOldPackage) =>
	{

		if (verType === EnumDetectYarnLock.v1)
		{
			fn = v1
		}
		else
		{
			fn = v2
		}

	});

	let names = options?.names;

	if (names?.length === 0)
	{
		names = void 0;
	}

	return reduceYarnLockParsedEntries<IComputedPackageEntries<IParseNameAndVersion>>({}, parsedOldPackage, (data, [packageName, packageData]) =>
	{
		const result = fn(packageName, packageData);

		const { name, version } = result;

		if (names?.includes(name) ?? true)
		{
			data[name] ??= [];
			data[name].push([version, result]);
		}

		return data;
	})
}
