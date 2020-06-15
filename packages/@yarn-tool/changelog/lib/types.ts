/**
 * Created by user on 2020/6/15.
 */

import { ITSRequireAtLeastOne } from 'ts-type';

export type IChangelogPreset = string | "conventional-changelog-angular" | "@bluelovers/conventional-changelog-bluelovers";
export type IType = "independent" | "root" | string

export interface IOptionsBaseCore
{
	changelogPreset?: IChangelogPreset,
	rootPath?: string,
}

export interface IOptionsBase extends IOptionsBaseCore
{
	tagPrefix?: string | 'v',
}

export type IOptionsInput = IOptionsBase & ITSRequireAtLeastOne<IOptionsBaseCore>;

export type IOptionsUpdateChangelog = IOptionsInput & {
	version?: string,
}

export type IOptionsRecommendVersion = IOptionsInput & {
	prereleaseId?: string,
}

export type IOptionsWithType<T extends Record<any, any>> = T & {
	type?: IType,
}

export interface IReturnTypeUpdateChangelog
{
	logPath: string;
	newEntry: string;
	version: string;
}
