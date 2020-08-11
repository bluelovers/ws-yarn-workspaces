import parseSimpleSemVer from '../lib/parseSimpleSemVer';
import { isSimpleSemVerObjectLike, hasOperator, assertSimpleSemVerObjectLike } from '../lib/checker';
import { stringifySemverFull } from '../lib/stringifySimpleSemVer';

describe(`parseSimpleSemVer`, () =>
{

	test(`^4.0.0-dev.20200615`, () =>
	{
		let version = `^4.0.0-dev.20200615`;

		let actual = parseSimpleSemVer(version);

		expect(isSimpleSemVerObjectLike(actual)).toBeTruthy();
		expect(hasOperator(actual)).toBeTruthy();

		expect(stringifySemverFull(actual)).toStrictEqual(version);

		expect(actual).toMatchSnapshot();

	});

})
