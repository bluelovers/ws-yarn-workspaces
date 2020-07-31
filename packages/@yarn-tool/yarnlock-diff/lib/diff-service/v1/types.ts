export interface IPackageData
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
