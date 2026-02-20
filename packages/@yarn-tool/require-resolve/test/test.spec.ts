import requireResolveExtra, {
	isErrorModuleNotFound,
	requireResolveCore,
	handleOptionsPaths,
	requireExtra,
	importExtra,
	_unshiftArray,
	resolvePackageCore,
	resolvePackageRoot,
	resolvePackageJsonLocation,
	createResolveLocationFn,
	readModulePackageJson,
	resolvePackage,
	SymbolCurrentDirectory,
	SymbolGlobal,
	SymbolGlobalNpm,
	SymbolGlobalYarn,
	SymbolModuleMain,
	IErrorModuleNotFound,
} from '../index';

describe('整合測試', () =>
{
	const tsdx_path = requireResolveExtra('@bluelovers/tsdx', {
		includeGlobal: true,
		includeCurrentDirectory: true,
	}).result;

	test('ts-jest', () =>
	{
		let actual = requireResolveExtra('ts-jest', {
			includeGlobal: true,
			includeCurrentDirectory: true,
			paths: [
				tsdx_path,
			],
		});

		expect(actual).toMatchSnapshot({
			result: expect.any(String),
			error: void 0
		});
	});

	test('typescript', () =>
	{
		let actual = requireResolveExtra('typescript', {
			includeGlobal: true,
			includeCurrentDirectory: true,
			paths: [
				tsdx_path,
			],
		});

		expect(actual).toMatchSnapshot({
			result: expect.any(String),
			error: void 0
		});
	});

	test('MODULE_NOT_FOUND', () =>
	{
		let actual = requireResolveExtra('@typescript', {
			includeGlobal: true,
			includeCurrentDirectory: true,
			paths: [
				tsdx_path,
			],
		});

		expect(actual).toHaveProperty('error.code', 'MODULE_NOT_FOUND');
		expect(isErrorModuleNotFound(actual.error!)).toBeTruthy();
		expect(actual.result).toBeUndefined();
	});
});