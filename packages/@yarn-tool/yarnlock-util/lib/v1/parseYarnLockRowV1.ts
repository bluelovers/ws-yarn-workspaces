import { IYarnLockDataRowV1 } from '@yarn-tool/yarnlock-types';
import { PACKAGE_REGEX } from '../const';
import { IParseNameAndVersionWithNpaResult } from '../types';
import { npaTry } from '@yarn-tool/npm-package-arg-util';
import { getSemverFromNpaResult } from '@yarn-tool/npm-package-arg-util/lib/getSemverFromNpaResult';
import { IResult } from '@yarn-tool/npm-package-arg-util/lib/types';

export function parseYarnLockRowV1(packageName: string, packageData: IYarnLockDataRowV1): IParseNameAndVersionWithNpaResult
{
	let parsed: IResult = npaTry(packageName);

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
