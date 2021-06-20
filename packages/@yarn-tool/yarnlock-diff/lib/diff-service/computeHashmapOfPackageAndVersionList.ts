import {
	assertYarnLockParsedIsSupported,
	isYarnLockParsedV1,
	isYarnLockParsedV2,
	IYarnLockDataRowV1,
	IYarnLockDataRowV2,
	IYarnLockParsedV1,
	IYarnLockParsedV2,
} from '@yarn-tool/yarnlock-parse/index';

import { parsePackageRow as v1 } from './v1/parsePackageRow';
import { parsePackageRow as v2 } from './v2/parsePackageRow';

import { IComputedPackage } from './types';
import { array_unique_overwrite } from 'array-hyper-unique/index';
import { compareLoose } from 'semver';
import { EnumDetectYarnLock } from '@yarn-tool/detect-yarnlock-version/lib/types';

export function computeHashmapOfPackageAndVersionList(alreadyComputedPackage: IComputedPackage,
	parsedOldPackage: IYarnLockParsedV1 | IYarnLockParsedV2,
): IComputedPackage
{
	let fn: (packageName: string, packageData: any, ...argv) => {
		name: string;
		version: string;
	};

	assertYarnLockParsedIsSupported(parsedOldPackage, (verType, parsedOldPackage) => {

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

	Object.entries<IYarnLockDataRowV1 | IYarnLockDataRowV2>(parsedOldPackage.data)
		.forEach(([packageName, packageData]) =>
		{
			const result = fn(packageName, packageData);

			if (typeof result === 'undefined' || result === null)
			{
				return;
			}

			alreadyComputedPackage[result.name] ??= [];
			alreadyComputedPackage[result.name].push(result.version);

			array_unique_overwrite(alreadyComputedPackage[result.name])

			alreadyComputedPackage[result.name].sort(compareLoose);
		})
	;

	return alreadyComputedPackage;
}
