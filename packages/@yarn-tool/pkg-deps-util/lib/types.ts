import { IPackageJson } from '@ts-type/package-dts/package-json';
import { EnumInstallTypesErrorCode } from './const';
import { IFindRootOptions } from '@yarn-tool/find-root';
import { IGroupYarnLockParsedEntriesOptions } from '@yarn-tool/yarnlock-util/lib/util/groupYarnLockParsedEntries';
import { IOptionsQueryVersion } from '@yarn-tool/pkg-version-query/lib/types';
import { Options } from 'package-json';

export interface IOptionsCheckInstallTarget
{
	excludeVersion?: boolean;
	pkg?: IPackageJson;
	checkExists?: boolean;
}

export interface IReturnTypeCheckInstallTarget
{
	name: string;
	target: string;
	error: EnumInstallTypesErrorCode;
	msg: string;
}

export interface IOptionsInstallDepsFromWorkspaces extends Partial<IFindRootOptions>
{
	cwd?: string,
	pkg?: IPackageJson,
	dev?: boolean,
	peer?: boolean,
	optional?: boolean,
}

export interface IOptionsInstallDepsFromQuery extends IOptionsInstallDepsFromWorkspaces
{
	queryOptions?: IOptionsQueryVersion<Options>,
}

export interface IOptionsInstallDepsFromYarnLock extends IOptionsInstallDepsFromQuery, IGroupYarnLockParsedEntriesOptions
{

}

export type IFilteredRecord<T extends Record<string, any>, K extends string> = T extends Record<string, infer U>
	? T & Record<K, U>
	: T
