import { cache } from './cache';
import { Comparator } from 'semver';
import { isNullSet } from '../comparator/detect';
import { IOptions } from '../types';
import { caretTrimReplace, comparatorTrimReplace, re, t, tildeTrimReplace } from 'semver/internal/re'
import debug from 'semver/internal/debug';
import { hyphenReplace, parseComparator, replaceGTE0 } from './util';

export function parseRange(range: string, options: IOptions): ReadonlyArray<Comparator>
{
	range = range.trim()

	// memoize range parsing for performance.
	// this is a very hot path, and fully deterministic.
	const memoOpts = Object.keys(options).join(',')
	const memoKey = `parseRange:${memoOpts}:${range}`
	const cached = cache.get(memoKey)
	if (cached)
	{
		return cached
	}

	const loose = options.loose
	// `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
	const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE]
	range = range.replace(hr, hyphenReplace(options.includePrerelease))
	debug('hyphen replace', range)
	// `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
	range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace)
	debug('comparator trim', range, re[t.COMPARATORTRIM])

	// `~ 1.2.3` => `~1.2.3`
	range = range.replace(re[t.TILDETRIM], tildeTrimReplace)

	// `^ 1.2.3` => `^1.2.3`
	range = range.replace(re[t.CARETTRIM], caretTrimReplace)

	// normalize spaces
	range = range.split(/\s+/).join(' ')

	// At this point, the range is completely trimmed and
	// ready to be split into comparators.

	const compRe = loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
	const rangeList = range
		.split(' ')
		.map(comp => parseComparator(comp, options))
		.join(' ')
		.split(/\s+/)
		// >=0.0.0 is equivalent to *
		.map(comp => replaceGTE0(comp, options))
		// in loose mode, throw out any that are not valid comparators
		.filter(options.loose ? comp => !!comp.match(compRe) : () => true)
		.map(comp => new Comparator(comp, options))

	// if any comparators are the null set, then replace with JUST null set
	// if more than one comparator, remove any * comparators
	// also, don't include the same comparator more than once
	const l = rangeList.length
	const rangeMap = new Map()
	for (const comp of rangeList)
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
	cache.set(memoKey, result)
	return result
}
