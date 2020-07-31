import { IPackageData } from './types';
import { IComputedPackage } from '../types';

export const PACKAGE_REGEX = /(?<packageName>.*)@(?:(?<semverPin>[\^\$])?(?<major>\d)(?:\.(?<minor>\d))?(?:\.(?<patch>\d))?(?:-(?<prerelease>[0-9a-zA-Z-]+)(?:.(?<prereleaseVersion>[0-9a-zA-Z]+))?)?(?:\+(?<metadata>[0-9a-zA-Z-]+)(?:.(?<metadataVersion>[0-9a-zA-Z]+))?)?|\*)/;

export function computeHashmapOfPackageAndVersionList(
	alreadyComputedPackage: IComputedPackage,
	parsedOldPackage: Record<string, IPackageData>,
): IComputedPackage
{
	const newComputedPackage = { ...alreadyComputedPackage };
	Object.entries(parsedOldPackage).forEach(([packageName, packageData]) =>
	{
		const regexResult = PACKAGE_REGEX.exec(packageName);
		const packageNameWithoutVersion =
			regexResult && regexResult.groups && regexResult.groups.packageName;

		if (!packageNameWithoutVersion) return;
		if (newComputedPackage[packageNameWithoutVersion])
		{
			newComputedPackage[packageNameWithoutVersion].push(packageData.version);
			newComputedPackage[packageNameWithoutVersion] = [
				...new Set(newComputedPackage[packageNameWithoutVersion]),
			];
			newComputedPackage[packageNameWithoutVersion].sort();
		}
		else
		{
			newComputedPackage[packageNameWithoutVersion] = [packageData.version];
		}
	});
	return newComputedPackage;
}
