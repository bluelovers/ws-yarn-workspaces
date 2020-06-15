/**
 * Created by user on 2020/6/15.
 */

import { Argv, Omit } from 'yargs';

export function setupToYargs<T>(yargs: Argv<T>)
{
	return yargs
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
	;
}

export default setupToYargs
