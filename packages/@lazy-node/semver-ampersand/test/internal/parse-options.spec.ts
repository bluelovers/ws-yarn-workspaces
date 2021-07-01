// @ts-nocheck

import { parseOptionsOrLoose, parseOptionsOrLoose as parseOptions } from '../../lib/internal/parseOptionsOrLoose';

test('false values return { loose: false }', () =>
{
	const expected = {
		loose: false,
	};

	expect(parseOptions(false)).toStrictEqual(expected)
})

test('falsey values always empty options object', () =>
{
	const expected = {};

	expect(parseOptions(null)).toStrictEqual(expected)
	//expect(parseOptions(false)).toStrictEqual( expected)
	expect(parseOptions(undefined)).toStrictEqual(expected)
	expect(parseOptions()).toStrictEqual(expected)
	expect(parseOptions(0)).toStrictEqual(expected)
	expect(parseOptions('')).toStrictEqual(expected)
})

test('truthy non-objects always loose mode, for backwards comp', () =>
{
	const expected = {
		loose: true,
	};

	expect(parseOptions('hello')).toStrictEqual(expected)
	expect(parseOptions(true)).toStrictEqual(expected)
	expect(parseOptions(1)).toStrictEqual(expected)
})

test('objects only include truthy flags we know about, set to true', () =>
{
	expect(parseOptions(/asdf/)).toStrictEqual({})
	expect(parseOptions(new Error('hello'))).toStrictEqual({})
	expect(parseOptions({ loose: true, a: 1, rtl: 0 })).toStrictEqual({
		loose: true,
		a: 1,
		rtl: false,
	})
	expect(parseOptions({ loose: 1, rtl: 2, includePrerelease: 10 })).toStrictEqual({
		loose: true,
		rtl: true,
		includePrerelease: true,
	})
})
