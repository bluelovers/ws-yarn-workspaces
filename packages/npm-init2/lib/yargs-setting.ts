/**
 * Created by user on 2019/5/16.
 */

import yargs from 'yargs';
import { Argv, Omit } from 'yargs';

export function setupToYargs<T>(yargs: Argv<T>)
{
	return yargs
		.default({
			//input: process.cwd(),
		})
		.option('npmClient', {
			alias: ['N'],
			requiresArg: true,
			normalize: true,
			description: 'npm, yarn, ...etc',
			default: 'npm',
			type: 'string',
		})
		.option('yes', {
			alias: ['y', 'silent'],
//		requiresArg: true,
//		default: 'npm',
			type: 'boolean',
		})
		.option('cwd', {
			alias: ['C'],
			requiresArg: true,
			normalize: true,
//		default: process.cwd(),
			defaultDescription: process.cwd(),
			type: 'string',
		})
		.option('skipCheckWorkspace', {
			alias: ['W'],
			type: 'boolean',
		})
		.option('force', {
			alias: ['f'],
			type: 'boolean',
		})
		.option('sort', {
			type: 'boolean',
			default: true,
		})
		.option('private', {
			alias: ['p'],
			type: 'boolean',
		})
		.option('createModule', {
			alias: ['m'],
			type: 'string',
		})
		.option('name', {
			type: 'string',
		})
		.option('copyStatic', {
			type: 'boolean',
		})
}

export default setupToYargs
