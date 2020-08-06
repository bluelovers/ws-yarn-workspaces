import { IPackageData } from './types';
import { PACKAGE_REGEX } from './const';
import { IParsePackageRow } from '../types';
import npa, { Result } from 'npm-package-arg';

export function parsePackageRow(packageName: string, packageData: IPackageData): IParsePackageRow
{
	let parsed: Result;

	try
	{
		parsed = npa(packageName);
	}
	catch (e) {}

	const packageNameWithoutVersion =
		parsed?.name ?? PACKAGE_REGEX.exec(packageName)?.groups?.packageName;

	if (packageNameWithoutVersion)
	{
		return {
			name: packageNameWithoutVersion,
			version: packageData.version,
		}
	}
}
