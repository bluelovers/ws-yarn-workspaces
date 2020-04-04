/**
 * Created by user on 2019/5/16.
 */

import yargs = require('yargs');
import { Argv, Omit } from 'yargs';

export function setupWorkspacesInitToYargs<T extends any>(yargs: Argv<T>)
{
	return yargs
		.default({
			//input: process.cwd(),
		})
		.option('name', {
			alias: ['n'],
			requiresArg: true,
			normalize: true,
			type: 'string',
		})
		.option('ignoreExistsPackage', {
			boolean: true,
			alias: ['i'],
		})
		.option('ignoreParentWorkspaces', {
			boolean: true,
		})
		.option('debug', {
			boolean: true,
		})
	;
}

export default setupWorkspacesInitToYargs
