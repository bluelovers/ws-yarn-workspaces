#!/usr/bin/env node

import createYarnWorkspaces from '..';
import debug from 'debug-color2/logger';
import yargs from 'yargs';
import { join } from 'path';
import setupWorkspacesInitToYargs from '../yargs-setting';

const CWD = process.cwd();

let cli = setupWorkspacesInitToYargs(yargs)
	// @ts-ignore
	.command('$0', '', function (yargs)
	{
		let name = yargs.argv.name || yargs.argv._[0];

		if (name)
		{
			name = join(CWD, name);
		}
		else
		{
			name = CWD;
		}

		//console.log(CWD, yargs.argv);

		yargs.argv.debug && debug.debug(yargs.argv);

		let bool = createYarnWorkspaces(name, {
			ignoreExistsPackage: !!yargs.argv.ignoreExistsPackage,
			ignoreParentWorkspaces: !!yargs.argv.ignoreParentWorkspaces,
			debug: !!yargs.argv.debug,
		});

		//console.log(77777777777, bool);

		if (!bool)
		{
			console.log('\n');
			yargs.showHelp();
		}
		else
		{
			debug.success(`done`);
		}
	})
	.version()
	.help()
	.argv
;
