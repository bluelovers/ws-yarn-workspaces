import { Argv } from 'yargs';
import { IYargsSync, IYargsUnPackArgv } from '@yarn-tool/types';

export function setupToYargs<T>(yargs: Argv<T>)
{
	const _return = yargs
		.option('no-git-tag-version', {
			desc: 'no git tag version',
			boolean: true,
			default: true,
		})
		.option('new-version', {
			desc: 'new version',
			string: true,
		})
		.option('major', {
			desc: 'auto-increment major version number',
			boolean: true,
		})
		.option('minor', {
			desc: 'auto-increment minor version number',
			boolean: true,
		})
		.option('patch', {
			desc: 'auto-increment patch version number',
			boolean: true,
		})
		.option('premajor', {
			desc: 'auto-increment premajor version number',
			boolean: true,
		})
		.option('preminor', {
			desc: 'auto-increment preminor version number',
			boolean: true,
		})
		.option('prepatch', {
			desc: 'auto-increment prepatch version number',
			boolean: true,
		})
		.option('prerelease', {
			desc: 'auto-increment prerelease version number',
			boolean: true,
		})
		.option('non-interactive', {
			alias: ['no-interactive'],
			desc: 'do not show interactive prompts',
			boolean: true,
		})
		.option('bump', {
			desc: 'bump version of packages',
			string: true,
		})

	return _return as any as IYargsSync<typeof _return>
}
