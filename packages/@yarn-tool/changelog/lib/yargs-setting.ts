/**
 * Created by user on 2020/6/15.
 */

import { Arguments, Argv, Omit } from 'yargs';
import { IYargsSync, IYargsUnPackArgv } from '@yarn-tool/types';

export function setupToYargs<T>(yargs: Argv<T>)
{
	const _return = yargs
		.option('preset', {
			desc: `Name of the preset you want to use. Must be one of the following:\n@bluelovers/conventional-changelog-bluelovers, angular, atom, codemirror, ember, eslint, express, jquery, jscs or jshint`,
			alias: ['p', 'changelogPreset'],
			string: true,
		})
		.option('lerna-package', {
			desc: `Generate a changelog for a specific lerna package (:pkg-name@1.0.0)`,
			alias: 'l',
			boolean: true,
			default: true,
		})
		.option('type', {
			string: true,
		})
		.option('tag-prefix', {
			desc: `Tag prefix to consider when reading the tags`,
			alias: 't',
			string: true,
		})
		.option('cwd', {
			default: process.cwd(),
			normalize: true,
		})
	;

	return _return as any as IYargsSync<typeof _return>
}

export default setupToYargs
