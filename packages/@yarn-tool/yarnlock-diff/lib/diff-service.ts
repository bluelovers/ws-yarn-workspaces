import { diff, Diff } from "deep-diff";
import { fromNullable, Option } from "fp-ts/lib/Option";
import { parse } from '@yarnpkg/lockfile';
import { computeHashmapOfPackageAndVersionList } from './diff-service/v1/computeHashmapOfPackageAndVersionList';

export function buildDiff(
	oldYarnLockContent: string[],
	newYarnLockContent: string[],
): Option<Diff<{}, {}>[]>
{
	const oldPacakges = oldYarnLockContent
		.map(v => parse(v))
		.map(data => data.object)
		.reduce(computeHashmapOfPackageAndVersionList, {});

	const newPackages = newYarnLockContent
		.map(v => parse(v))
		.map(data => data.object)
		.reduce(computeHashmapOfPackageAndVersionList, {});

	return fromNullable(diff(oldPacakges, newPackages));
}
