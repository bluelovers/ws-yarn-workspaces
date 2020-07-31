import { IParsePackageRow } from '../types';
import { parseResolution, parseShell } from '@yarnpkg/parsers';

export function parsePackageRow(packageName: string, packageData): IParsePackageRow
{
	let ret = parseResolution(packageData.resolution)

	let packageNameWithoutVersion = ret?.descriptor?.fullName;
	let version = ret?.descriptor?.description;

	if (packageNameWithoutVersion)
	{
		version = version.replace(/^(npm):/, '');

		if (!version.length)
		{
			version = ret.descriptor.description
		}

		return {
			name: packageNameWithoutVersion,
			version,
		}
	}
}
