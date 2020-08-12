import { IYarnLockDataRowV1 } from '@yarn-tool/yarnlock-parse/index';

export interface IPackageData extends IYarnLockDataRowV1
{
	version: string;
	resolved: string;
	integrity: string;
	dependencies: Record<string, string>;
	object: Record<string, IPackageData>;
}

export interface ILockData
{
	type: "success";
	object: Record<string, IPackageData>;
}
