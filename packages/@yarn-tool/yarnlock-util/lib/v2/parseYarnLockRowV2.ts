import { IYarnLockDataRowV2 } from '@yarn-tool/yarnlock-parse/index';
import { parseResolution } from '@yarnpkg/parsers';
import { IParseNameAndVersion } from '../types';
//import npa from 'npm-package-arg';
import { npa, IResult } from '@yarn-tool/npm-package-arg-util/index';
import { getSemverFromNpaResult } from '@yarn-tool/npm-package-arg-util/lib/getSemverFromNpaResult';
import SemverRange from '@lazy-node/semver-ampersand/lib/Range';

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

		let parsed: IResult;
		let semver: string;

		try
		{
			/**
			 * @fixme support packageName: 'once@npm:^1.3.1, once@npm:^1.4.0'
			 */
			parsed = npa(packageName);
			semver = getSemverFromNpaResult(parsed);
		}
		catch (e)
		{
			/*
			console.dir({
				name,
				version,
			})
			console.dir({
				packageName,
				packageData,
			})

			 */
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
