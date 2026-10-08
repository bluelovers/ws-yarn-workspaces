// @ts-nocheck

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseOptionsOrLoose, parseOptionsOrLoose as parseOptions } from '../../lib/internal/parseOptionsOrLoose';

test('false values return { loose: false }', () =>
{
	const expected = {
		loose: false,
	};

	assert.deepStrictEqual(parseOptions(false), expected)
})

test('falsey values always empty options object', () =>
{
	const expected = {};

	assert.deepStrictEqual(parseOptions(null), expected)
	//expect(parseOptions(false)).toStrictEqual( expected)
	assert.deepStrictEqual(parseOptions(undefined), expected)
	assert.deepStrictEqual(parseOptions(), expected)
	assert.deepStrictEqual(parseOptions(0), expected)
	assert.deepStrictEqual(parseOptions(''), expected)
})

test('truthy non-objects always loose mode, for backwards comp', () =>
{
	const expected = {
		loose: true,
	};

	assert.deepStrictEqual(parseOptions('hello'), expected)
	assert.deepStrictEqual(parseOptions(true), expected)
	assert.deepStrictEqual(parseOptions(1), expected)
})

test('objects only include truthy flags we know about, set to true', () =>
{
	assert.deepStrictEqual(parseOptions(/asdf/), {})
	assert.deepStrictEqual(parseOptions(new Error('hello')), {})
	assert.deepStrictEqual(parseOptions({ loose: true, a: 1, rtl: 0 }), {
		loose: true,
		a: 1,
		rtl: false,
	})
	assert.deepStrictEqual(parseOptions({ loose: 1, rtl: 2, includePrerelease: 10 }), {
		loose: true,
		rtl: true,
		includePrerelease: true,
	})
})
