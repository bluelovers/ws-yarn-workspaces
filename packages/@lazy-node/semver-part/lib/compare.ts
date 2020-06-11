/**
 * Created by user on 2020/6/11.
 */
import { _part } from './_core';

import _compare from 'semver/functions/compare';

import _cmp from 'semver/functions/cmp';
import { Operator, Options } from 'semver';

export type { Operator, Options } from 'semver';

export type IOptionsOrLoose = boolean | Options
export type ICompareReturnType = 1 | 0 | -1

export function compare(part1: string, part2: string, optionsOrLoose?: boolean | Options)
{
	return _compare(..._part(part1, part2), optionsOrLoose as any)
}

export function eq(part1: string, part2: string, optionsOrLoose?: boolean | Options)
{
	return compare(part1, part2, optionsOrLoose as any) === 0
}

export function neq(part1: string, part2: string, optionsOrLoose?: boolean | Options)
{
	return compare(part1, part2, optionsOrLoose as any) !== 0
}

export function gt(part1: string, part2: string, optionsOrLoose?: boolean | Options)
{
	return compare(part1, part2, optionsOrLoose as any) > 0
}

export function gte(part1: string, part2: string, optionsOrLoose?: boolean | Options)
{
	return compare(part1, part2, optionsOrLoose as any) >= 0
}

export function lt(part1: string, part2: string, optionsOrLoose?: boolean | Options)
{
	return compare(part1, part2, optionsOrLoose as any) < 0
}

export function lte(part1: string, part2: string, optionsOrLoose?: boolean | Options)
{
	return compare(part1, part2, optionsOrLoose as any) <= 0
}

export function cmp(part1: string, operator: Operator, part2: string, optionsOrLoose?: boolean | Options)
{
	const [v1, v2] = _part(part1, part2)

	return _cmp(v1, operator, v2, optionsOrLoose)
}

export function tryCompare(v1: string, v2: string, optionsOrLoose?: IOptionsOrLoose)
{
	try
	{
		return compare(v1, v2, optionsOrLoose);
	}
	catch (e)
	{}
}
