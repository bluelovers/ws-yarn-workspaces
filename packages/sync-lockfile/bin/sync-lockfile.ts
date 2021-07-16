#!/usr/bin/env node

/**
 * Created by user on 2020/1/8.
 */

import yargs from 'yargs';
import syncLockfile from '../index';

let argv = yargs
	.option('cwd', {
		alias: ['c'],
		default: process.cwd(),
		normalize: true,
		string: true,
	})
	.option('silent', {
		boolean: true,
	})
	.help(true)
	.showHelpOnFail(true)
	.parseSync()
;

syncLockfile(argv.cwd, {
	print: !argv.silent,
});
