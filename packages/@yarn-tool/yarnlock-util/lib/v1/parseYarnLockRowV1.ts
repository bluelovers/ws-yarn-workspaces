import { IYarnLockDataRowV1 } from '@yarn-tool/yarnlock-parse/index';
//import npa, { Result } from 'npm-package-arg';
import { PACKAGE_REGEX } from '../const';
import { IParseNameAndVersion } from '../types';
import { getSemverFromNpaResult, IResult, npa } from '@yarn-tool/npm-package-arg-util/index';

export function parseYarnLockRowV1(packageName: string, packageData: IYarnLockDataRowV1): IParseNameAndVersion
{
	let parsed: IResult;

	try
	{
		parsed = npa(packageName);
	}
	catch (e)
	{}

	const name =
		parsed?.name ?? PACKAGE_REGEX.exec(packageName)?.groups?.packageName;

	if (name?.length)
	{
		let semver = getSemverFromNpaResult(parsed);

		return {
			name,
			version: packageData.version,
			type: parsed.type,
			raw: parsed.raw,
			semver,
		}
	}
}
