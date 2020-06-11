/**
 * Created by user on 2020/6/11.
 */

import { IStylesNameWithoutFn } from 'debug-color2/lib/types';
import { Console2 } from 'debug-color2';
import { IStylesColorNames } from 'debug-color2/lib/styles';
import { ICompareReturnType } from '@lazy-node/semver-part';

import { IChalk } from 'debug-color2'

export interface IParseVersionsDiffCore
{
	_colors: [
		IStylesColorNames, IStylesColorNames, IStylesColorNames
	];
	color: IStylesColorNames;
	leadingWildcard: string;
	result: string;
	middot: string;
	resultAppend: string;
	comp: ICompareReturnType;
	versionOld: string;
	versionNew: string;
	partsOld: string[];
	partsNew: string[];
	index: number;
}

export interface IOptionsParseVersionsDiffPlus
{
	chalk?: Pick<IChalk, IStylesNameWithoutFn>,
	console?: Console2,
}

export interface IOptionsParseVersionsDiff extends IOptionsParseVersionsDiffPlus
{
	_colors?: [IStylesColorNames, IStylesColorNames, IStylesColorNames],
}
