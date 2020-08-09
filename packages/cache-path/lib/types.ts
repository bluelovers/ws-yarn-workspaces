import { DirOptions, dirSync } from 'tmp';

export type ICachePathThunk = ((p1?: string, ...args: string[]) => string);

export interface IOptions extends DirOptions
{
	/**
	 * a base dir name at cache root
	 */
	base?: string,
	/**
	 * name of cache
	 */
	name?: string,

	cwd?: string,

	/**
	 * fn[] of any function return a string
	 * stop when get first return
	 */
	fnOrder?: Array<((cwd?: string) => string) | ((cwd?: string) => any)>,

	/**
	 * auto create dir if not exists
	 */
	create?: boolean,
	/**
	 * return a function
	 */
	thunk?: boolean,

	/**
	 * hash dir name, make sure it is unique
	 */
	hash?: boolean | ((input: string) => string),

	/**
	 * only work with fnOrder is set
	 *
	 * if true will not use defaultOrder when didn't get value from fnOrder
	 */
	disableDefaultFailback?: boolean,

	processEnv?: NodeJS.ProcessEnv,
}
