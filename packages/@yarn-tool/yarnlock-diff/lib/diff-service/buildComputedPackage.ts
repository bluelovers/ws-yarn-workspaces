import { IComputedPackage } from './types';
import { yarnLockParse } from '@yarn-tool/yarnlock-parse/index';
import { computeHashmapOfPackageAndVersionList } from './computeHashmapOfPackageAndVersionList';
import { ITSValueOrArray } from 'ts-type/lib/type/base';

export function buildComputedPackage(yarnLockContentList: ITSValueOrArray<Buffer | string>, alreadyComputedPackage: IComputedPackage = {})
{
	if (!Array.isArray(yarnLockContentList))
	{
		yarnLockContentList = [yarnLockContentList];
	}

	return yarnLockContentList
		.map(v => yarnLockParse(v))
	.reduce(computeHashmapOfPackageAndVersionList, alreadyComputedPackage);
}
