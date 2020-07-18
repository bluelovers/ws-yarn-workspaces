#!/usr/bin/env node

import yargs from 'yargs';
import linkToNodeModules from '../index';

let argv = yargs
	.option('name', {
		string: true,
	})
	.option('targetNodeModulesPath', {
		string: true,
		normalize: true,
	})
	.option('sourcePackagePath', {
		string: true,
		normalize: true,
	})
	.option('cwd', {
		string: true,
		normalize: true,
	})
	.option('targetNodeModulesName', {
		string: true,
	})
	.option('skipCheckWorkspace', {
		alias: [
			'W',
		],
		boolean: true,
	})
	.argv
;

console.dir(linkToNodeModules({
	...argv,
	throwError: true,
}))
