import { BaseEncodingOptions } from "fs";

export type IBufferOrString = Buffer | string;

export interface IOptionsReadFile extends BaseEncodingOptions
{
	flag?: string;
}

export interface IFsYarnLockReturnType
{
	yarnlock_file: string;
	yarnlock_exists: boolean;
	yarnlock_old: string;
}
