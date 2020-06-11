/**
 * Created by user on 2020/6/11.
 */

import { ITSRequireAtLeastOne } from 'ts-type';
import { console, chalkByConsole } from 'debug-color2';
import { colorizeDiffCore } from './core';
import { IOptionsParseVersionsDiff, IOptionsParseVersionsDiffPlus } from './types';

export function colorizeDiff(from: string,
	to: string,
	options?: ITSRequireAtLeastOne<IOptionsParseVersionsDiff, keyof IOptionsParseVersionsDiffPlus>,
): string
{
	if (options?.chalk)
	{
		return colorizeDiffCore(from, to, options as any)
	}

	return chalkByConsole((chalk) =>
	{
		return colorizeDiffCore(from, to, {
			...options,
			// @ts-ignore
			chalk,
		})
	}, options?.console ?? console)
}
