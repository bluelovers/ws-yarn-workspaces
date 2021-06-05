import requireResolveExtra, { isErrorModuleNotFound } from '../index';

describe(`describe`, () =>
{
	const tsdx_path = requireResolveExtra('tsdx').result;

	console.dir(tsdx_path)

	test(`ts-jest`, () =>
	{

		let actual = requireResolveExtra('ts-jest', {
			includeGlobal: true,
			includeCurrentDirectory: true,
			paths: [
				tsdx_path,
			],
		});

		console.dir(actual);

		expect(actual).toMatchSnapshot({
			result: expect.any(String),
			error: void 0
		});

	});

	test(`typescript`, () =>
	{

		let actual = requireResolveExtra('typescript', {
			includeGlobal: true,
			includeCurrentDirectory: true,
			paths: [
				tsdx_path,
			],
		});

		console.dir(actual);

		expect(actual).toMatchSnapshot({
			result: expect.any(String),
			error: void 0
		});

	});

	test(`MODULE_NOT_FOUND`, () =>
	{

		let actual = requireResolveExtra('@typescript', {
			includeGlobal: true,
			includeCurrentDirectory: true,
			paths: [
				tsdx_path,
			],
		});

		console.dir(actual);

		expect(actual).toHaveProperty('error.code', 'MODULE_NOT_FOUND');

		expect(isErrorModuleNotFound(actual.error)).toBeTruthy();

		expect(actual.result).toBeUndefined();

	});

})
