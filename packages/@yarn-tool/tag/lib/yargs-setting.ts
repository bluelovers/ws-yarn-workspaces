/**
 * Created by user on 2020/6/15.
 */

import yargs, { Argv, Omit } from 'yargs';
import { IYargsSync, IYargsUnPackArgv } from '@yarn-tool/types';

export function setupToYargs<T>(yargs: Argv<T>)
{
	const _return = yargs
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
		.option('message', {
			alias: 'm',
			string: true,
		})
		.option('force-git-tag', {
			alias: 'f',
			boolean: true,
		})
		.option('sign-git-tag', {
			boolean: true,
		})
	;

	return _return as any as IYargsSync<typeof _return>
}

export default setupToYargs
