export function trimKey(name: string, skipNumber?: boolean)
{
	return name
		.replace(/^[_:\-]+/, '')
		.replace(skipNumber ? /[_:\-]+$/ : /[\d_:\-]+$/, '')
}

export function firstPartKey(name: string)
{
	let key = trimKey(name);
	let first = key.split(/[_:\-]+/)[0];

	if (first === '')
	{
		key = trimKey(name, true);
		first = key.split(/[_:\-]+/)[0];
	}

	return first
}

/**
 * omit key logic
 */
export function omitKey(name: string)
{
	const key = firstPartKey(name);
	const omitted = key
		.replace(/^(?:pre|post)/, '')
	;

	return {
		/**
		 * input name
		 */
		name,
		/**
		 * omit name and only keep first part
		 */
		key,
		/**
		 * omit key with pre / post
		 */
		omitted,
	}
}

/**
 * group / sore scripts order, by default is follow npm lifecycle scripts
 */
export const defaultNpmScriptsOrder = new Set([

	'serve',
	'start',
	'dev',
	'restart',
	'stop',

	'review',
	'coverage',
	'lint',
	'test',

	'preinstallOnly',
	'install',
	'postinstallOnly',

	'preuninstallOnly',
	'uninstall',
	'postuninstallOnly',

	'build',
	'storybook',
	//'build-storybook',
	'analyze',

	'link',

	'ci',
	'npm',
	'yarn',
	'lerna',
	'ws',

	'version',

	'prepareOnly',
	'prepublish',
	'prepare',
	'prepublishOnly',
	'prepack',
	'pack',
	'postpack',
	'publish',

	'postpublish',

	// yarn-tool
	'postpublishOnly',

	'shrinkwrap',

])

/**
 * avoid omitKey wrong parse script name (e.g. prettier
 */
export const otherScriptNames = new Set([

	'prettier',

])
