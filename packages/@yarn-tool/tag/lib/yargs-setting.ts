/**
 * Created by user on 2020/6/15.
 */

import yargs, { Argv, Omit } from 'yargs';

export function setupToYargs<T>(yargs: Argv<T>)
{
	return yargs
		.option('cwd', {
			default: process.cwd(),
			normalize: true,
		})
		.option('tag-prefix', {
			alias: 't',
			string: true,
		})
		.option('exclude-name', {
			boolean: true,
		})
	;
}

export default setupToYargs
