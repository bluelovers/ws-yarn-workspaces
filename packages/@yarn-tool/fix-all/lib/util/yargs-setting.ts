import { Argv } from 'yargs';
import { IYargsSync, IYargsUnPackArgv } from '@yarn-tool/types';

export function setupToYargs<T>(yargs: Argv<T>)
{
	const _return = yargs
		.option('overwriteHostedGitInfo', {
			boolean: true,
			alias: ['O', 'overwrite'],
		})
		.option('branch', {
			string: true,
		})
		.option('resetStaticFiles', {
			boolean: true,
			alias: ['S'],
		})
	;

	return _return as any as IYargsSync<typeof _return>
}
