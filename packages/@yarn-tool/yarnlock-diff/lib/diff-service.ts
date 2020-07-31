import { diff, Diff } from "deep-diff";
import { fromNullable, Option } from "fp-ts/lib/Option";
import { yarnLockParse } from '@yarn-tool/yarnlock-parse/index';
import { computeHashmapOfPackageAndVersionList } from './diff-service/computeHashmapOfPackageAndVersionList';
import { buildComputedPackage } from './diff-service/buildComputedPackage';

export function buildDiff(
	oldYarnLockContent: (Buffer | string)[],
	newYarnLockContent: (Buffer | string)[],
): Option<Diff<{}, {}>[]>
{
	const oldPacakges = buildComputedPackage(oldYarnLockContent);

	const newPackages = buildComputedPackage(newYarnLockContent);

	return fromNullable(diff(oldPacakges, newPackages));
}
