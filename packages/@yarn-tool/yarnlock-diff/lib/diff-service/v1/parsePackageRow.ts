import { IPackageData } from './types';
import { PACKAGE_REGEX } from './const';
import { IParsePackageRow } from '../types';

export function parsePackageRow(packageName: string, packageData: IPackageData): IParsePackageRow
{
	const regexResult = PACKAGE_REGEX.exec(packageName);

	const packageNameWithoutVersion =
		regexResult?.groups?.packageName;

	if (packageNameWithoutVersion)
	{
		return {
			name: packageNameWithoutVersion,
			version: packageData.version,
		}
	}
}
