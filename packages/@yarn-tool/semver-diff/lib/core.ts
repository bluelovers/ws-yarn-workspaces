/**
 * Created by user on 2020/6/11.
 */

import { partsToVersion } from '@lazy-node/semver-part/lib/_core';
import { parseVersionsAndCompare } from '@lazy-node/semver-part/lib/parse';
import { IStylesColorNames } from 'debug-color2/lib/styles';
import { ITSRequireAtLeastOne } from 'ts-type';
import { colorizeDiff } from './colorize';
import { IOptionsParseVersionsDiff, IParseVersionsDiffCore } from './types';
import { console, chalkByConsoleMaybe } from 'debug-color2'

export function parseVersionsDiffCore(from: string, to: string, options?: IOptionsParseVersionsDiff,
): IParseVersionsDiffCore
{
	let leadingWildcard = '';

	if (/^[~^]/.test(to) && to[0] === from[0])
	{
		leadingWildcard = to[0];
		to = to.slice(1);
		from = from.slice(1);
	}

	const { _colors = ['red', 'cyan', 'green'] } = options || {};

	const data = parseVersionsAndCompare(from, to)

	const { index, partsNew, partsOld } = data;

	const color: IStylesColorNames = _colors[index];

	const middot = index > 0 && index < partsNew.length ? '.' : '';

	const result = partsToVersion(partsNew.slice(0, index));
	const resultAppend = partsToVersion(partsNew.slice(index));

	return {
		...data,
		_colors,
		color,
		leadingWildcard,
		result,
		middot,
		resultAppend,
	}
}

export function colorizeDiffCore(from: string, to: string, options?: ITSRequireAtLeastOne<IOptionsParseVersionsDiff, 'chalk'>,
): string
{
	let {
		leadingWildcard,
		result,
		middot,
		resultAppend,
		color,
		comp,
	} = parseVersionsDiffCore(from, to, options)

	if (options.stripAnsi !== true)
	{
		const { chalk } = options;

		// @ts-ignore
		resultAppend = (comp ? chalk[color](resultAppend) : chalk(resultAppend))
	}

	return leadingWildcard +
		result +
		middot +
		resultAppend
}

