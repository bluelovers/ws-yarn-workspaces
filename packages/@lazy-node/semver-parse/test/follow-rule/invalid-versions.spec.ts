/**
 * Created by user on 2026/2/24.
 */

import { EnumSemverWildcard } from '../../lib/types';
import { parse, parseRange } from '../../index';
import { _lazyReturnResultAll, _lazyThrowError } from '../lib/util';

describe('invalid versions', () =>
{

	const input = EnumSemverWildcard.star;

	for (const input of [
		'a.b.c',
		'1.0.0b',

		'1.',
		'1.0.',
		'1.0.0.',

		'1.0.0-beta.1+build.123.',
		'1.0.0-beta.1.',

		'1+',
		'1.0+',
		'1.0.0+',

		'1.0.0-beta.1+build.123+',
		'1.0.0-beta.1+.',

		'1-',
		'1.0-',
		'1.0.0-',

		'1.0.0+build-abc.',

		// originalSemver 會解析成功所以先無視以下這部分
		// '1.0.0-beta.1+build.123-',
		// '1.0.0-beta.1-',
	])
	{
		describe(input, () =>
		{
			const resultAll = _lazyReturnResultAll(input);

			// beforeAll(() => {
			// 	resultAll = _lazyReturnResultAll(input);
			// });

			test('originalSemver', () =>
			{
				if (resultAll.originalSemver.err)
				{
					expect(() => _lazyThrowError(resultAll.originalSemver.err)).toThrowErrorMatchingSnapshot();
				}
				else
				{
					expect(resultAll.originalSemver.result).toBeFalsy();
				}

				expect(resultAll.originalSemver).toMatchSnapshot();
			});

			test('parseSimpleSemVer', () =>
			{
				if (resultAll.parseSimpleSemVer.err)
				{
					expect(() => _lazyThrowError(resultAll.parseSimpleSemVer.err)).toThrowErrorMatchingSnapshot();
				}
				else
				{
					expect(resultAll.parseSimpleSemVer.result).toBeFalsy();
				}

				expect(resultAll.parseSimpleSemVer).toMatchSnapshot();
			});

			test('parseSimpleSemVerRange', () =>
			{
				if (resultAll.parseSimpleSemVerRange.err)
				{
					expect(() => _lazyThrowError(resultAll.parseSimpleSemVerRange.err)).toThrowErrorMatchingSnapshot();
				}
				else
				{
					expect(resultAll.parseSimpleSemVerRange.result).toHaveLength(0);
				}

				expect(resultAll.parseSimpleSemVerRange).toMatchSnapshot();
			});

		});
	}

})
