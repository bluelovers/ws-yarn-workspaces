import { diff } from "@bluelovers/deep-diff";
import { buildComputedPackage } from './diff-service/buildComputedPackage';
import { ITSValueOrArray } from 'ts-type/lib/type/base';

export function buildDiff(
	oldYarnLockContent: ITSValueOrArray<Buffer | string>,
	newYarnLockContent: ITSValueOrArray<Buffer | string>,
)
{
	const oldPacakges = buildComputedPackage(oldYarnLockContent);

	const newPackages = buildComputedPackage(newYarnLockContent);

	return diff(oldPacakges, newPackages) ?? [];
}
