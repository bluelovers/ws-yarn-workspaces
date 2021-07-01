import { Comparator } from 'semver';
import { SemverRange, Range } from '../../lib/Range';

import rangeIntersection from '../fixtures/range-intersection'
import rangeInclude from '../fixtures/range-include'
import rangeExclude from '../fixtures/range-exclude'
import rangeParse from '../fixtures/range-parse'
import { reDoubleVerticalBar, separatorDoubleVerticalBar } from '../../lib/const';

import { inspect } from 'util';

//jest.setTimeout(5000 * 10);

describe('range tests', () =>
{
	rangeInclude.forEach(([range, ver, options]) =>
	{
		test(`${range} ${inspect(options)}`, () => {
			const r = new Range(range, options)
			expect(r.test(ver)).toBeTruthy()
		})
	})
})

describe('range parsing', () =>
{
	//expect.assertions(rangeParse.length)
	rangeParse.forEach(([range, expected, options]) => test(`${range} ${inspect(options)} ${expected = _replaceDoubleVerticalBar(expected)}`, () =>
	{
		if (expected == null)
		{
			expect(() => new Range(range)).toThrowErrorMatchingSnapshot()
		}
		else
		{
			expect(new Range(range, options).range || '*').toStrictEqual(expected)
			expect(new Range(range, options).range).toStrictEqual(new Range(expected).range)
		}
	}))
})

test('throw for empty comparator set, even in loose mode', () =>
{
	expect(() => new Range('sadf||asdf', { loose: true })).toThrowError(TypeError('Invalid SemVer Range: sadf||asdf'))
})

test('convert comparator to range', () =>
{
	const c = new Comparator('>=1.2.3')
	const r = new Range(c)
	expect(r.raw).toStrictEqual(c.value)
})

test('range as argument to range ctor', () =>
{
	const loose = new Range('1.2.3', { loose: true })

	expect(loose).toMatchSnapshot();

	expect(new Range(loose, { loose: true })).toStrictEqual(loose)
	expect(new Range(loose, true)).toStrictEqual(loose)

	expect(new Range(loose)).toStrictEqual(loose)
	expect(new Range(loose, { loose: false })).not.toStrictEqual(loose)

	const incPre = new Range('1.2.3', { includePrerelease: true })

	expect(incPre).toMatchSnapshot();

	expect(new Range(incPre, { includePrerelease: true })).toStrictEqual(incPre)
	expect(new Range(incPre)).toStrictEqual(incPre)
})

describe('negative range tests', () =>
{
	rangeExclude.forEach(([range, ver, options]) =>
	{
		test(`${range} ${inspect(options)}`, () => {
			const r = new Range(range, options)
			expect(r.test(ver)).toBeFalsy()
		})
	})
})

test('strict vs loose ranges', () =>
{
	[
		['>=01.02.03', '>=1.2.3'],
		['~1.02.03beta', '>=1.2.3-beta <1.3.0-0'],
	].forEach(([loose, comps]) =>
	{
		expect(() => new Range(loose)).toThrow()
		expect(new Range(loose, true).range).toStrictEqual(comps)
	})
})

test('tostrings', () =>
{
	expect(new Range('>= v1.2.3').toString()).toStrictEqual('>=1.2.3')
})

describe('ranges intersect', () =>
{
	rangeIntersection.forEach(([r0, r1, expected]) =>
	{
		test(`${r0} <~> ${r1}`, () =>
		{
			const range0 = new Range(r0)
			const range1 = new Range(r1)

			expect(range0.intersects(range1)).toStrictEqual(expected)
			expect(range1.intersects(range0)).toStrictEqual(expected)
		})
	})
})

test('missing range parameter in range intersect', () =>
{
	expect(() =>
	{
		// @ts-expect-error
		new Range('1.0.0').intersects()
	}).toThrowError(new TypeError('a Range is required'))
})

function _replaceDoubleVerticalBar(expected: string)
{
	if (expected != null)
	{
		return expected.replace(reDoubleVerticalBar, separatorDoubleVerticalBar)
	}

	return expected
}
