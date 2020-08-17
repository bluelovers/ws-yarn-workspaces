import { lazyFlags } from '../util/lazyFlags';

export function flagsYarnAdd(argv: {
	[k: string]: boolean,
}): string[]
{
	return lazyFlags([
		'dev',
		'peer',
		'optional',
		'exact',
		'tilde',
		'ignore-workspace-root-check',
		'audit',
	], argv)
}
