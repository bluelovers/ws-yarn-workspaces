import { IYarnLockDataRowV2 } from '@yarn-tool/yarnlock-types';
import { parseResolution } from '@yarn-tool/yarnlock-parse-raw/lib/v2/parseResolution';
import { IParseNameAndVersionWithNpaResult } from '../types';
import { npaTry } from '@yarn-tool/npm-package-arg-util';
import { getSemverFromNpaResult } from '@yarn-tool/npm-package-arg-util/lib/getSemverFromNpaResult';
import { IResult } from '@yarn-tool/npm-package-arg-util/lib/types';

export function parseYarnLockRowV2(packageName: string, packageData: IYarnLockDataRowV2): IParseNameAndVersionWithNpaResult
{
	let ret = parseResolution(packageData.resolution)

	let name = ret?.descriptor?.fullName;

	if (name)
	{
		/**
		 * @todo support check patch
		 */
		let version = ret.descriptor.description ?? packageData.version;

		version = version.replace(/^(npm):/, '');

		if (!version.length)
		{
			version = ret.descriptor.description
		}

		/**
		 * @fixme support packageName: 'once@npm:^1.3.1, once@npm:^1.4.0'
		 */
		let parsed: IResult = npaTry(packageName);
		let semver: string;

		if (parsed)
		{
			semver = getSemverFromNpaResult(parsed);
		}

		return {
			name,
			version,
			type: parsed?.type,
			raw: parsed?.raw,
			semver,
		}
	}
}
