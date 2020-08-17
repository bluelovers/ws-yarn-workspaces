import { Argv } from 'yargs';
import { setupYarnAddToYargs } from './setupYarnAddToYargs';

export function setupYarnAddTypesToYargs<T extends any>(yargs: Argv<T>)
{
	return setupYarnAddToYargs(yargs, {
		allowEmptyName: true,
	})
		.option('auto', {
			desc: `auto install from package.json`,
			boolean: true,
		})
		.option('all', {
			desc: `dependencies, devDependencies from package.json`,
			boolean: true,
		})
		.option('AA', {
			desc: `--auto --all`,
			boolean: true,
		})
		.strict(false)
}
