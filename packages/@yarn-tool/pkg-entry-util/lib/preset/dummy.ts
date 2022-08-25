import { ITSArrayListMaybeReadonly } from 'ts-type/lib/type/base';

export function _fillDummyScriptsCore<T extends Record<string, string>>(scripts: T, prefix: string, fields: ITSArrayListMaybeReadonly<string>)
{
	// @ts-ignore
	scripts ??= {};

	let text = `echo ${prefix ?? ''}`.trim();

	fields.forEach(k =>
	{
		// @ts-ignore
		scripts[k] ??= `${text} ${k}`
	});

	return scripts;
}

export function fillDummyScripts<T extends Record<string, string>>(scripts?: T, prefix?: string)
{
	return _fillDummyScriptsCore(scripts, prefix, [
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
	] as const);
}
