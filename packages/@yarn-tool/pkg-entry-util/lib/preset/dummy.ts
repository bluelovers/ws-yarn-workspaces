export function fillDummyScripts<T extends Record<string, string>>(scripts?: T, prefix?: string)
{
	// @ts-ignore
	scripts ??= {};

	let text = `echo ${prefix ?? ''}`.trim();

	([
		'preversion',
		'version',
		'prepublishOnly',
		'postversion',
		'publish',
		'prepublish',
		'postpublish',
		'postpublishOnly',
		'prepare',
		'prepack',
		'pack',
		'postpack',
		'pretest',
		'ci:build',
		'ci:install',
	] as const).forEach(k =>
	{
		// @ts-ignore
		scripts[k] ??= `${text} ${k}`
	});
	return scripts;
}
