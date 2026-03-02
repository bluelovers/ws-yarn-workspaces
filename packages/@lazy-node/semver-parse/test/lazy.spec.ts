import parseSimpleSemVer from '../lib/parseSimpleSemVer';
import { isSimpleSemVerObjectLike, hasOperator, assertSimpleSemVerObjectLike } from '../lib/checker';
import { stringifySemverFull } from '../lib/stringifySimpleSemVer';
import { _lazyReturnResultAll } from './lib/util';

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

		expect(_lazyReturnResultAll(version)).toMatchSnapshot();

	});

	[
		`4.0.0-dev.20200615`,
		`12.0.0`,
		`12.0`,
		`12`,
		`12.x`,
		`12.0.x`,
		`12.x.0`,
	].forEach(version => {
		test(version, () =>
		{
			let actual = _lazyReturnResultAll(version);

			expect(actual).toMatchSnapshot();

			expect(actual.parseSimpleSemVer.result).toMatchObject({
				major: expect.any(String),
			});
			expect(actual.parseSimpleSemVerRange.result).toMatchObject(expect.arrayContaining([
				expect.objectContaining({
					major: expect.any(String),
				}),
			]))
		});
	})

})
