import { diff, Diff } from "deep-diff";
import { fromNullable, Option } from "fp-ts/lib/Option";
import { yarnLockParse } from '@yarn-tool/yarnlock-parse/index';
import { computeHashmapOfPackageAndVersionList } from './diff-service/computeHashmapOfPackageAndVersionList';
import { buildComputedPackage } from './diff-service/buildComputedPackage';
import { ITSValueOrArray } from 'ts-type/lib/type/base';
import { IComputedPackage } from './diff-service/types';

export function buildDiff(
	oldYarnLockContent: ITSValueOrArray<Buffer | string>,
	newYarnLockContent: ITSValueOrArray<Buffer | string>,
): Option<Diff<IComputedPackage, IComputedPackage>[]>
{
	const oldPacakges = buildComputedPackage(oldYarnLockContent);

	const newPackages = buildComputedPackage(newYarnLockContent);

	return fromNullable(diff(oldPacakges, newPackages));
}
