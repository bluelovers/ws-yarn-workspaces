import { hasOperator, isSimpleSemVerOperatorLike, isSimpleSemVerWildcardOnlyLike } from '../lib/checker';
import { parse, parseRange } from '..';
import { ISimpleSemVer } from '../lib/types';
import { validMultipleVersionRangeFixtures, validMultipleVersionRangeFixturesWildcards } from './fixtures/multiple-version-range/valid';
import { validSingleVersionRangeFixtures } from './fixtures/single-version-range/valid';
import { IFixturesEntryMultipleVersionRange } from './lib/types';
import stringifySimpleSemVer from '../lib/stringifySimpleSemVer';

describe('singleVersionRange', () =>
{
	describe('single', () =>
	{
		validSingleVersionRangeFixtures.forEach(({input, expected, description}) =>
		{
			test(`${input} - ${description}`, () =>
			{
				const result = parse(input);
				expect(result).toMatchSnapshot(expected);
			});
		});
	});

	describe('multiple', () =>
	{
		_testMultipleVersionRangeFixtures(validMultipleVersionRangeFixtures);
	});

	describe('multiple.wildcards', () =>
	{
		_testMultipleVersionRangeFixtures(validMultipleVersionRangeFixturesWildcards);
	});
});

function _fixExpected(expected: Partial<ISimpleSemVer>)
{
	for (const key in expected)
	{
		if (expected[key] === void 0 || expected[key] === null)
		{
			delete expected[key];
		}
	}

	return expected;
}

function _testMultipleVersionRangeFixtures(validMultipleFixtures: IFixturesEntryMultipleVersionRange[])
{
	validMultipleFixtures.forEach(({input, expected, description}) =>
		{
			describe(`${input} - ${description}`, () =>
			{
				let result: Partial<ISimpleSemVer>[];

				try
				{
					result = parseRange(input);
				}
				catch (e) {}

				let i = 0;
				let len = result?.length || 0;

				const _test2 = (i: number) => {
					try
					{
						let result_current = result?.[i];

						console.dir({
							result_current,
							expected,
							i,
							e2: expected[i],

							isSimpleSemVerOperatorLike: isSimpleSemVerOperatorLike(result_current),
							isSimpleSemVerWildcardOnlyLike: isSimpleSemVerWildcardOnlyLike(result_current),
						});

						let _fn = test;
						if (!result_current || !isSimpleSemVerWildcardOnlyLike(result_current) && isSimpleSemVerOperatorLike(result_current))
						{
							_fn = test.skip;
						}

						_fn(`[${i}]parseRange(${result_current})`, () =>
						{
							expect(result_current).toMatchSnapshot(_fixExpected(expected[i]));
						});

						_fn(`[${i}]parse(${result_current?.semver})`, () =>
						{
							const result2 = parse(result_current.semver);
							expect(result2.toJSON()).toMatchSnapshot(_fixExpected(result_current));
						});
					}
					catch (e)
					{

					}
				}

				do
				{
					_test2(i);
				}
				while (++i < len);
			});
		});
}
