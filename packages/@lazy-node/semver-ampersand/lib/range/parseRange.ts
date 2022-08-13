import { cache } from './cache';
import { Comparator } from 'semver';
import { isNullSet } from '../comparator/detect';
import { IOptions } from '../types';
import { re, t } from 'semver/internal/re'
import { parseComparator, replaceGTE0 } from './util';
import { splitSpace } from '../util/split';
import { array_unique_overwrite } from 'array-hyper-unique';
import { normalizeRangeInput } from './normalizeRangeInput';

/**
 * memoize range parsing for performance.
 * this is a very hot path, and fully deterministic.
 */
export function getMemoOpts(options: IOptions)
{
	return Object.keys(options).filter(k => options[k]).join(',')
}

export function normalizeRangeInputForComparator(range: string, options: IOptions)
{
	let rangeList = splitSpace(range)
		.map(comp => parseComparator(comp, options))
	;

	rangeList = splitSpace(rangeList.join(' '))
		// >=0.0.0 is equivalent to *
		.map(comp => replaceGTE0(comp, options))

	return array_unique_overwrite(rangeList)
}

export function parseRangeCore(range: string, options: IOptions): ReadonlyArray<Comparator>
{
	range = normalizeRangeInput(range, options);

	// At this point, the range is completely trimmed and
	// ready to be split into comparators.

	let rangeList = normalizeRangeInputForComparator(range, options)

	if (options.loose)
	{
		rangeList = filterRangeListForComparator(rangeList, options)
	}

	let compList = rangeList
		.map(comp => new Comparator(comp, options))

	const result = reduceComparatorList(compList)

	return result
}

/**
 * in loose mode, throw out any that are not valid comparators
 */
export function filterRangeListForComparator(rangeList: string[], options: IOptions)
{
	const compRe = options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]

	return rangeList.filter(comp => !!comp.match(compRe))
}

/**
 * if any comparators are the null set, then replace with JUST null set
 * if more than one comparator, remove any * comparators
 * also, don't include the same comparator more than once
 */
export function reduceComparatorList(compList: Comparator[])
{
	const l = compList.length
	const rangeMap = new Map<string, Comparator>()
	for (const comp of compList)
	{
		if (isNullSet(comp))
		{
			return [comp]
		}
		rangeMap.set(comp.value, comp)
	}
	if (rangeMap.size > 1 && rangeMap.has(''))
	{
		rangeMap.delete('')
	}

	const result = [...rangeMap.values()]

	return result
}

export function parseRange(range: string, options: IOptions): ReadonlyArray<Comparator>
{
	range = range.trim()

	// memoize range parsing for performance.
	// this is a very hot path, and fully deterministic.
	const memoOpts = getMemoOpts(options)
	const memoKey = `parseRange:${memoOpts}:${range}`
	const cached = cache.get(memoKey)
	if (cached)
	{
		return cached
	}

	const result = parseRangeCore(range, options)

	cache.set(memoKey, result)
	return result
}
