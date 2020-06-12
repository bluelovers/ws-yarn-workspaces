export const reShebang = /^\s*#!\s*([^\s]+)(?:\s+([^\s]+)(?:\s+([^\r\n]+))?(?=\r|\n|$))?/;

/**
 * Extract normalized shebang command token.
 *
 *
 * Examples:
 *
 *  shebang("#!/usr/bin/ruby") // "ruby"
 *
 *  shebang("#!/usr/bin/env node") // "node"
 *
 *  @param: {String}
 *  @return {String|null}
 */
export function shebang(line: string): IScriptName
{
	return matchShebang(line)?.script
}

export function removeShebang(line: string)
{
	return line.replace(reShebang, '')
}

export type IScriptName = string | 'env' | 'node' | 'sh';

export interface IMatchShebangReturnType
{
	shebang: string;
	bin: string;
	name: IScriptName;
	script: IScriptName;
	argv: string | '';
	isExtra: boolean;
}

export function matchShebang(line: string): IMatchShebangReturnType
{
	const matched = line.match(reShebang)

	if (matched?.length > 0)
	{
		const paths = matched[1].split('/');
		let script: IScriptName = paths[paths.length - 1];
		let name: IScriptName = script;

		let i = 2;
		let isExtra: boolean = false;

		if (script === 'env')
		{
			script = matched[2];
			i = 3;
			isExtra = true;
		}

		let rest = matched.slice(i).filter(v => typeof v !== 'undefined')

		return {
			shebang: matched[0],

			bin: matched[1],
			name,

			script,
			argv: rest.join(' '),

			isExtra,
		}
	}
}

export default shebang;
