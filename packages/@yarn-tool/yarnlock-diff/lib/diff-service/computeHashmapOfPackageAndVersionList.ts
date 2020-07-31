import {
	IYarnLockParsedV1,
	IYarnLockParsedV2,
	isYarnLockParsedV1,
	isYarnLockParsedV2,
} from '@yarn-tool/yarnlock-parse/index';
import { computeHashmapOfPackageAndVersionList as v1 } from './v1/computeHashmapOfPackageAndVersionList';
import { computeHashmapOfPackageAndVersionList as v2 } from './v2/computeHashmapOfPackageAndVersionList';
import { IComputedPackage } from './types';

export function computeHashmapOfPackageAndVersionList(alreadyComputedPackage: IComputedPackage,
	parsedOldPackage: IYarnLockParsedV1 | IYarnLockParsedV2): IComputedPackage
{
	if (isYarnLockParsedV1(parsedOldPackage))
	{
		return v1(alreadyComputedPackage, parsedOldPackage.data)
	}
	else if (isYarnLockParsedV2(parsedOldPackage))
	{
		return v2(alreadyComputedPackage, parsedOldPackage.data)
	}

	throw new TypeError(`can't detect yarn.lock version`)
}
