import { parse, parseRange } from "../..";
import { EnumSemverWildcard } from "../../lib/types";

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
});

function _testW(input: string)
{
	test('parseRange', () =>
	{

		let result = parseRange(input);

		expect(result[0]).toBeTruthy();
		expect(result[0]).toHaveProperty('semver', input);

	});

	test('parse', () =>
	{

		let result = parse(input);

		expect(result).toBeTruthy();
		expect(result).toHaveProperty('semver', input);

	});
}
