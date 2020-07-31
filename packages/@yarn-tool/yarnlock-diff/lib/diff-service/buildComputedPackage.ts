import { IComputedPackage } from './types';
import { yarnLockParse } from '@yarn-tool/yarnlock-parse/index';
import { computeHashmapOfPackageAndVersionList } from './computeHashmapOfPackageAndVersionList';

export function buildComputedPackage(yarnLockContentList: (Buffer | string)[], alreadyComputedPackage: IComputedPackage = {})
{
	return yarnLockContentList
		.map(v => yarnLockParse(v))
	.reduce(computeHashmapOfPackageAndVersionList, alreadyComputedPackage);
}
