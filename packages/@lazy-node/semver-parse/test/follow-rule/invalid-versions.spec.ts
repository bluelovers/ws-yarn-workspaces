/**
 * Created by user on 2026/2/24.
 */

import { EnumSemverWildcard } from '../../lib/types';
import { parse, parseRange } from '../../index';
import { _lazyReturnResultAll, _lazyThrowError } from '../lib/util';
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

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

			test('originalSemver', (t) =>
			{
				if (resultAll.originalSemver.err)
				{
					assert.throws(() => _lazyThrowError(resultAll.originalSemver.err), (err: any) =>
					{
						t.assert.snapshot(err.message);
						return true;
					});
				}
				else
				{
					assert.ok(!resultAll.originalSemver.result);
				}

				t.assert.snapshot(resultAll.originalSemver);
			});

			test('parseSimpleSemVer', (t) =>
			{
				if (resultAll.parseSimpleSemVer.err)
				{
					assert.throws(() => _lazyThrowError(resultAll.parseSimpleSemVer.err), (err: any) =>
					{
						t.assert.snapshot(err.message);
						return true;
					});
				}
				else
				{
					assert.ok(!resultAll.parseSimpleSemVer.result);
				}

				t.assert.snapshot(resultAll.parseSimpleSemVer);
			});

			test('parseSimpleSemVerRange', (t) =>
			{
				if (resultAll.parseSimpleSemVerRange.err)
				{
					assert.throws(() => _lazyThrowError(resultAll.parseSimpleSemVerRange.err), (err: any) =>
					{
						t.assert.snapshot(err.message);
						return true;
					});
				}
				else
				{
					assert.strictEqual(resultAll.parseSimpleSemVerRange.result.length, 0);
				}

				t.assert.snapshot(resultAll.parseSimpleSemVerRange);
			});

		});
	}

})