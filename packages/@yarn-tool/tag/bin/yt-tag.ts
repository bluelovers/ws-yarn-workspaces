#!/usr/bin/env node

import setupToYargs from '../lib/yargs-setting';
import yargs, { Argv, Omit } from 'yargs';
import gitPackageTag from '../lib/git-tag';

let argv = setupToYargs(yargs)
	.option('cwd', {
		default: process.cwd(),
		normalize: true,
	})
	.showHelpOnFail(true)
	.version()
	.help()
	.argv
;

gitPackageTag({
	cwd: argv.cwd,
	tagPrefix: argv['tag-prefix'],
	excludeName: argv['exclude-name'],
	message: argv.message,
	forceGitTag: argv['force-git-tag'],
	signGitTag: argv['sign-git-tag'],
}, {
	stdio: 'inherit',
})
	.then(result => {
		process.exit(result.exitCode);
	})
;
