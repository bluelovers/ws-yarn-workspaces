import { IYarnLockDataRowV2 } from '@yarn-tool/yarnlock-parse/index';
import { parseResolution } from '@yarnpkg/parsers';
import { IParseNameAndVersion } from '../types';
import npa from 'npm-package-arg';

export function parseYarnLockRowV2(packageName: string, packageData: IYarnLockDataRowV2): IParseNameAndVersion
{
	let ret = parseResolution(packageData.resolution)

	let name = ret?.descriptor?.fullName;
	let version = ret?.descriptor?.description;

	if (name)
	{
		version = version.replace(/^(npm):/, '');

		if (!version.length)
		{
			version = ret.descriptor.description
		}

		let parsed = npa(`${name}@${version}`);

		return {
			name,
			version,
			type: parsed.type,
			raw: parsed.raw,
			semver: parsed.rawSpec,
		}
	}
}
