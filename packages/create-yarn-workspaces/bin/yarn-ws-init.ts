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
		// @ts-ignore
		let name = (yargs.argv.name || yargs.argv._[0]) as string;

		if (name)
		{
			name = join(CWD, name);
		}
		else
		{
			name = CWD;
		}

		//console.log(CWD, yargs.argv);

		// @ts-ignore
		yargs.argv.debug && debug.debug(yargs.argv);

		let bool = createYarnWorkspaces(name, {
			// @ts-ignore
			ignoreExistsPackage: !!yargs.argv.ignoreExistsPackage,
			// @ts-ignore
			ignoreParentWorkspaces: !!yargs.argv.ignoreParentWorkspaces,
			// @ts-ignore
			debug: !!yargs.argv.debug,
			/*
			 * 保留 undefined，讓 addStaticFiles 維持預設 true / Keep undefined so addStaticFiles keeps its default of true
			 * */
			// @ts-ignore
			addStaticFiles: yargs.argv.addStaticFiles,
			// @ts-ignore
			noStaticFiles: yargs.argv.noStaticFiles,
			// @ts-ignore
			resetStaticFiles: yargs.argv.resetStaticFiles,
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
