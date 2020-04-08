/**
 * Created by user on 2020/4/9.
 */

import { StdioOptions } from "child_process";
import { IPackageJson } from '@ts-type/package-dts';

export interface IResultBase
{
	code: 0 | 1 | number,
	signal: null | any,

	stdio: StdioOptions,
}

export interface IResultNotExists extends IResultBase
{

}

export interface IResultCore extends IResultBase
{
	/**
	 * 'C:\\WINDOWS\\system32\\cmd.exe'
	 */
	cmd: string,
	/**
	 * [ '/d', '/s', '/c', '"echo install"' ]
	 */
	args: string[],
	code: 0 | 1 | number,
	signal: null | any,
	stdout: string,
	stderr: string,
	event: string,
	/**
	 * 'echo install'
	 */
	script: string,
	/**
	 * 'pkg-a@1.0.0'
	 */
	pkgid: string,
	path: string
}

export interface IResult extends IResultCore
{

}

export type IError = Error & IResult

export interface IRunLifecycleScriptOptions
{
	event: string;
	args?: any[];
	path: string;
	env?: Record<string, any>;
	stdio?: StdioOptions;
	stdioString?: boolean;
	pkg?: any | IPackageJson,
	stdin?,
}

export interface IPackageJson2 extends IPackageJson
{
	_id: string,
}
