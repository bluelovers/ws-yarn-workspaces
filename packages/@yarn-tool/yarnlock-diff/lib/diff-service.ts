import { diff, Diff } from "deep-diff";
import { fromNullable, Option } from "fp-ts/lib/Option";
import { yarnLockParse } from '@yarn-tool/yarnlock-parse/index';
import { computeHashmapOfPackageAndVersionList } from './diff-service/computeHashmapOfPackageAndVersionList';

export function buildDiff(
	oldYarnLockContent: string[],
	newYarnLockContent: string[],
): Option<Diff<{}, {}>[]>
{
	const oldPacakges = oldYarnLockContent
		.map(v => yarnLockParse(v))
		.reduce(computeHashmapOfPackageAndVersionList, {});

	const newPackages = newYarnLockContent
		.map(v => yarnLockParse(v))
		.reduce(computeHashmapOfPackageAndVersionList, {});

	return fromNullable(diff(oldPacakges, newPackages));
}
