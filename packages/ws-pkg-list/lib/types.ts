/**
 * Created by user on 2020/6/5.
 */
import IPackageJson from '@ts-type/package-dts'

export type IReadPackage<T = IPackageJson> = {
	name: string;
	path: string;
	fullpath: string;
	config: {
		name: string;
		version: string;
		private: boolean;
		[k: string]: unknown;
	} & T;
}

export interface IListableRow
{
	name: string;
	version: string;
	"private": boolean;
	location: string;
}

export interface IListableRowExtra extends IListableRow
{
	prefix: string,
}

export interface IReadedPackages<T = IPackageJson>
{
	[k: string]: IReadPackage<T>,
}
