#!/usr/bin/env node

import yargs, { Argv, Omit } from 'yargs';
import setupToYargs from '../lib/yargs-setting';
import { IOptionsWithType, IOptionsUpdateChangelog } from '..';
import updateChangelogByCwd from '../lib/lerna/from-list';
import { createDependencyTable } from '@yarn-tool/table';
import pathIsSame from 'path-is-same';
import { join } from 'path';
import { colorizeDiff } from '@yarn-tool/semver-diff';

const argv = setupToYargs(yargs)
	.option('cwd', {
		default: process.cwd(),
		normalize: true,
	})
	.showHelpOnFail(true)
	.version()
	.help()
	.argv
;

let options: Partial<IOptionsWithType<IOptionsUpdateChangelog>> = {

	changelogPreset: argv.preset,
	tagPrefix: argv['tag-prefix'],

	type: argv.type || (argv['lerna-package'] ? 'independent' : 'root'),

}

updateChangelogByCwd(argv.cwd, options)
	.then(data => {

		const table = createDependencyTable({
			colAligns: ['left', 'left'],
		});

		table.push([`rootPath`, data.rootPath])

		if (!pathIsSame(data.rootPath, data.cwd))
		{
			table.push([`targetPath`, data.cwd])
		}

		table.push([`changelogPreset`, data.options.changelogPreset])
		table.push([`type`, data.options.type])
		table.push([`tagPrefix`, data.options.tagPrefix])

		let version = colorizeDiff(data.pkg.version, data.version);

		table.push([`package`, data.pkg.name])
		table.push([`version`, version])
		table.push([`file`, data.logPath])

		console.log(table.toString().replace(/ +$/g, ''));
	})
;
