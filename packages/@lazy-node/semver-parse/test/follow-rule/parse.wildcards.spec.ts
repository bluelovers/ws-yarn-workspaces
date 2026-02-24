import { parse, parseRange } from "../..";
import { EnumOperatorBase, EnumSemverWildcard, ISimpleSemVerObjectBase } from "../../lib/types";

describe('wildcards', () =>
{
	describe(EnumSemverWildcard.star, () =>
	{

		_testW(EnumSemverWildcard.star);

	})

	describe(EnumSemverWildcard.x, () =>
	{
		_testW(EnumSemverWildcard.x);
	})

	test(`parseRange('${EnumSemverWildcard.x} || ${EnumSemverWildcard.star}')`, () =>
	{

		const input = `${EnumSemverWildcard.x} || ${EnumSemverWildcard.star}`;

		let result = parseRange(input);

		_testCore001(EnumSemverWildcard.x, result[0]);

		expect(result[1]).toHaveProperty('operator', EnumOperatorBase.OR);

		_testCore001(EnumSemverWildcard.star, result[2]);

	})

});

function _testW(input: string)
{
	test('parseRange', () =>
	{

		let result = parseRange(input);

		_testCore001(input, result[0]);

	});

	test('parse', () =>
	{

		let result = parse(input);

		_testCore001(input, result);

	});
}

function _testCore001(input: string, result: ISimpleSemVerObjectBase)
{
	expect(result).toBeTruthy();
	expect(result).toHaveProperty('semver', input);
}
