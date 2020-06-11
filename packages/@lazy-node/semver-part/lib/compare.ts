/**
 * Created by user on 2020/6/11.
 */
import { _part } from './_core';

import _compare from 'semver/functions/compare';

import _cmp from 'semver/functions/cmp';
import { Operator as ISemverOperator, Options as ISemverOptions } from 'semver';

export type { ISemverOperator, ISemverOptions };

export type IOptionsOrLoose = boolean | ISemverOptions
export type ICompareReturnType = 1 | 0 | -1

export function compare(part1: string, part2: string, optionsOrLoose?: IOptionsOrLoose): ICompareReturnType
{
	return _compare(..._part(part1, part2), optionsOrLoose as any)
}

export function eq(part1: string, part2: string, optionsOrLoose?: IOptionsOrLoose)
{
	return compare(part1, part2, optionsOrLoose as any) === 0
}

export function neq(part1: string, part2: string, optionsOrLoose?: IOptionsOrLoose)
{
	return compare(part1, part2, optionsOrLoose as any) !== 0
}

export function gt(part1: string, part2: string, optionsOrLoose?: IOptionsOrLoose)
{
	return compare(part1, part2, optionsOrLoose as any) > 0
}

export function gte(part1: string, part2: string, optionsOrLoose?: IOptionsOrLoose)
{
	return compare(part1, part2, optionsOrLoose as any) >= 0
}

export function lt(part1: string, part2: string, optionsOrLoose?: IOptionsOrLoose)
{
	return compare(part1, part2, optionsOrLoose as any) < 0
}

export function lte(part1: string, part2: string, optionsOrLoose?: IOptionsOrLoose)
{
	return compare(part1, part2, optionsOrLoose as any) <= 0
}

export function cmp(part1: string, operator: ISemverOperator, part2: string, optionsOrLoose?: IOptionsOrLoose)
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
