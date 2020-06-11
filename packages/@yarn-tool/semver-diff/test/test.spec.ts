import { parseVersionsDiffCore } from '..';

test(`parseVersionsDiffCore`, () =>
{

	let actual = parseVersionsDiffCore('42.6.7.9.3-alpha', '42.6.7.9.3-prealpha');
	let expected;

	//expect(actual).toStrictEqual(expected);
	expect(actual).toMatchSnapshot();

});

