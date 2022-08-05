import { IParseNameAndVersionWithNpaResult } from '../types';
import { parseYarnLockRowV1 } from '../v1/parseYarnLockRowV1';
import { parseYarnLockRowV2 } from '../v2/parseYarnLockRowV2';
import { IComputedPackageEntries, reduceYarnLockParsedEntries } from './reduceYarnLockParsedEntries';
import { assertYarnLockParsedIsSupported } from '@yarn-tool/yarnlock-parse-assert';
import {
	EnumDetectYarnLock,
	IYarnLockDataRowV1,
	IYarnLockDataRowV2,
	IYarnLockParsedV1,
	IYarnLockParsedV2,
} from '@yarn-tool/yarnlock-types';

export interface IGroupYarnLockParsedEntriesOptions
{
	names?: string[],
}

export function groupYarnLockParsedEntries<R extends IYarnLockDataRowV1 | IYarnLockDataRowV2 = IYarnLockDataRowV1 | IYarnLockDataRowV2>(
	parsedOldPackage: IYarnLockParsedV1 | IYarnLockParsedV2, options?: IGroupYarnLockParsedEntriesOptions)
{
	let fn: (packageName: string, packageData: any, ...argv) => IParseNameAndVersionWithNpaResult;

	assertYarnLockParsedIsSupported(parsedOldPackage, (verType, parsedOldPackage) =>
	{

		if (verType === EnumDetectYarnLock.v1)
		{
			fn = parseYarnLockRowV1
		}
		else
		{
			fn = parseYarnLockRowV2
		}

	});

	let names = options?.names;

	if (names?.length === 0)
	{
		names = void 0;
	}

	return reduceYarnLockParsedEntries<IComputedPackageEntries<IParseNameAndVersionWithNpaResult>>({}, parsedOldPackage, (data,
		[packageName, packageData],
	) =>
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
