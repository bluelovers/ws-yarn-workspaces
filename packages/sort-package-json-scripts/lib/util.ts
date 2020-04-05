
export function omitKey(name: string)
{
	const key = name
		.replace(/^[_:\-]+/, '')
		.split(/[_:\-]+/)[0]
		.replace(/\d+$/, '')
	;
	const omitted = key
		.replace(/^(?:pre|post)/, '')
	;

	return {
		name,
		key,
		omitted,
	}
}

export const defaultNpmScriptsOrder = new Set([

	'start',
	'dev',
	'restart',
	'stop',

	'coverage',
	'lint',
	'test',

	'install',
	'uninstall',

	'build',

	'link',

	'npm',

	'prepublish',
	'prepare',
	'prepublishOnly',
	'prepack',
	'pack',
	'postpack',
	'publish',

	'postpublish',

	'shrinkwrap',

	'version',

])

export const otherNpmScriptsOrder = new Set([

	'prettier',

])
