import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { Comparator } from 'semver';
import { Range } from '../../lib/Range';

import rangeIntersection from '../fixtures/range-intersection'
import rangeInclude from '../fixtures/range-include'
import rangeExclude from '../fixtures/range-exclude'
import rangeParse from '../fixtures/range-parse'

import { inspect } from 'util';
import { _replaceDoubleVerticalBar } from '../util';

//jest.setTimeout(5000 * 10);

describe('range tests', () =>
{
	rangeInclude.forEach(([range, ver, options]) =>
	{
		test(`${range} ${inspect(options)}`, () => {
			const r = new Range(range, options)
			assert.ok(r.test(ver))
		})
	})
})

describe('range parsing', () =>
{
	//expect.assertions(rangeParse.length)
	rangeParse.forEach(([range, expected, options]) => test(`${range} ${inspect(options)} ${expected = _replaceDoubleVerticalBar(expected)}`, (t) =>
	{
		if (expected == null)
		{
			assert.throws(() => new Range(range), (err: any) =>
			{
				t.assert.snapshot(err.message)
				return true
			})
		}
		else
		{
			assert.strictEqual(new Range(range, options).range || '*', expected)
			assert.strictEqual(new Range(range, options).range, new Range(expected).range)
		}
	}))
})

test('throw for empty comparator set, even in loose mode', (t) =>
{
	assert.throws(() => new Range('sadf||asdf', { loose: true }), (err: any) =>
	{
		t.assert.snapshot(err.message)
		return true
	})
})

test('convert comparator to range', () =>
{
	const c = new Comparator('>=1.2.3')
	const r = new Range(c)
	assert.strictEqual(r.raw, c.value)
})

test('range as argument to range ctor', (t) =>
{
	const loose = new Range('1.2.3', { loose: true })

	t.assert.snapshot(loose)

	assert.deepStrictEqual(new Range(loose, { loose: true }), loose)
	assert.deepStrictEqual(new Range(loose, true), loose)

	assert.deepStrictEqual(new Range(loose), loose)
	assert.notDeepStrictEqual(new Range(loose, { loose: false }), loose)

	const incPre = new Range('1.2.3', { includePrerelease: true })

	t.assert.snapshot(incPre)

	assert.deepStrictEqual(new Range(incPre, { includePrerelease: true }), incPre)
	assert.deepStrictEqual(new Range(incPre), incPre)
})

describe('negative range tests', () =>
{
	rangeExclude.forEach(([range, ver, options]) =>
	{
		test(`${range} ${inspect(options)}`, () => {
			const r = new Range(range, options)
			assert.ok(!r.test(ver))
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
		assert.throws(() => new Range(loose))
		assert.strictEqual(new Range(loose, true).range, comps)
	})
})

test('tostrings', () =>
{
	assert.strictEqual(new Range('>= v1.2.3').toString(), '>=1.2.3')
})

describe('ranges intersect', () =>
{
	rangeIntersection.forEach(([r0, r1, expected]) =>
	{
		test(`${r0} <~> ${r1}`, () =>
		{
			const range0 = new Range(r0)
			const range1 = new Range(r1)

			assert.strictEqual(range0.intersects(range1), expected)
			assert.strictEqual(range1.intersects(range0), expected)
		})
	})
})

test('missing range parameter in range intersect', (t) =>
{
	assert.throws(() =>
	{
		// @ts-expect-error
		new Range('1.0.0').intersects()
	}, (err: any) =>
	{
		t.assert.snapshot(err.message)
		return true
	})
})
