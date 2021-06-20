import {
	assertYarnLockParsedIsSupported,
	isYarnLockParsedV1,
	isYarnLockParsedV2,
	IYarnLockDataRowV1,
	IYarnLockDataRowV2,
	IYarnLockParsedV1,
	IYarnLockParsedV2,
} from '@yarn-tool/yarnlock-parse';

import { parseYarnLockRowV1 as v1 } from '@yarn-tool/yarnlock-util/lib/v1/parseYarnLockRowV1';
import { parseYarnLockRowV2 as v2 } from '@yarn-tool/yarnlock-util/lib/v2/parseYarnLockRowV2';

import { IComputedPackage } from './types';
import { array_unique_overwrite } from 'array-hyper-unique';
import { compareLoose } from 'semver';
import { EnumDetectYarnLock } from '@yarn-tool/detect-yarnlock-version/lib/types';
import { IParseNameAndVersion } from '@yarn-tool/yarnlock-util/lib/types';
import { reduceYarnLockParsedEntries } from '@yarn-tool/yarnlock-util/lib/util/reduceYarnLockParsedEntries';

export function computeHashmapOfPackageAndVersionList(alreadyComputedPackage: IComputedPackage,
	parsedOldPackage: IYarnLockParsedV1 | IYarnLockParsedV2,
): IComputedPackage
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

	/*
	if (isYarnLockParsedV1(parsedOldPackage))
	{
		fn = v1
	}
	else if (isYarnLockParsedV2(parsedOldPackage))
	{
		fn = v2
	}
	else
	{
		throw new TypeError(`can't detect yarn.lock version`)
	}
	 */

	alreadyComputedPackage = reduceYarnLockParsedEntries(alreadyComputedPackage, parsedOldPackage, (alreadyComputedPackage,
		[packageName, packageData],
	) =>
	{

		const result = fn(packageName, packageData);

		if (typeof result !== 'undefined' && result !== null)
		{
			alreadyComputedPackage[result.name] ??= [];
			alreadyComputedPackage[result.name].push(result.version);
		}

		return alreadyComputedPackage;
	});

	Object.keys(alreadyComputedPackage)
		.forEach((name) =>
		{

			array_unique_overwrite(alreadyComputedPackage[name]);

			alreadyComputedPackage[name].sort(compareLoose);

		})
	;

	return alreadyComputedPackage;
}
