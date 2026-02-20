import requireResolveExtra, {
	isErrorModuleNotFound,
	requireResolveCore,
	handleOptionsPaths,
	requireExtra,
	importExtra,
	_unshiftArray,
	unshiftArray,
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
	buildResolvePaths,
	getTargetName,
	isValidPathSymbol,
	tryRequireExtra,
	tryImportExtra,
	createModuleNotFoundError,
	defaultMap,
	validSymbols,
} from '../index';

// ============================================================================
// 核心解析功能測試 / Core Resolution Tests
// ============================================================================

describe('requireResolveCore', () =>
{
	describe('基本解析功能', () =>
	{
		test('應該能夠解析存在的模組', () =>
		{
			const result = requireResolveCore('jest');
			expect(result).toContain('jest');
		});

		test('應該能夠解析帶有自訂對應的模組', () =>
		{
			const customMap = {
				'non-existent-module': 'jest',
			};

			const result = requireResolveCore('non-existent-module', { map: customMap });
			expect(result).toContain('jest');
		});

		test('應該在模組不存在時拋出錯誤', () =>
		{
			expect(() =>
			{
				requireResolveCore('this-module-definitely-does-not-exist-12345');
			}).toThrow();
		});
	});

	describe('路徑選項處理', () =>
	{
		test('應該能夠使用自訂 paths 選項', () =>
		{
			const result = requireResolveCore('jest', {
				paths: [process.cwd()],
			});
			expect(result).toContain('jest');
		});

		test('應該能夠使用 includeGlobal 選項', () =>
		{
			const result = requireResolveCore('jest', {
				includeGlobal: true,
			});
			expect(result).toContain('jest');
		});

		test('應該能夠使用 includeGlobal 陣列選項', () =>
		{
			const result = requireResolveCore('jest', {
				includeGlobal: [SymbolGlobalNpm],
			});
			expect(result).toContain('jest');
		});

		test('應該能夠使用 includeCurrentDirectory 選項', () =>
		{
			const result = requireResolveCore('jest', {
				includeCurrentDirectory: true,
			});
			expect(result).toContain('jest');
		});

		test('應該能夠使用 cwd 選項', () =>
		{
			const result = requireResolveCore('jest', {
				includeCurrentDirectory: true,
				cwd: process.cwd(),
			});
			expect(result).toContain('jest');
		});
	});
});

describe('buildResolvePaths', () =>
{
	test('應該建構正確的路徑陣列', () =>
	{
		const paths = buildResolvePaths({
			includeGlobal: true,
			includeCurrentDirectory: true,
		});

		expect(paths.length).toBeGreaterThan(0);
	});

	test('應該處理空選項', () =>
	{
		const paths = buildResolvePaths({});
		expect(Array.isArray(paths)).toBe(true);
	});

	test('應該處理 includeGlobal 陣列', () =>
	{
		const paths = buildResolvePaths({
			includeGlobal: [SymbolGlobalNpm, SymbolGlobalYarn],
		});

		expect(paths.length).toBeGreaterThan(0);
	});
});

// ============================================================================
// 路徑處理測試 / Path Handling Tests
// ============================================================================

describe('handleOptionsPaths', () =>
{
	test('應該返回 undefined 當 paths 為空', () =>
	{
		const result = handleOptionsPaths(void 0);
		expect(result).toBeUndefined();
	});

	test('應該返回 undefined 當 paths 為空陣列', () =>
	{
		const result = handleOptionsPaths([]);
		expect(result).toBeUndefined();
	});

	test('應該保留字串路徑', () =>
	{
		const result = handleOptionsPaths(['/path/to/dir']);
		expect(result).toEqual(['/path/to/dir']);
	});

	test('應該過濾掉 null 和 undefined 路徑', () =>
	{
		const result = handleOptionsPaths(['/path/to/dir', null, undefined, '/another/path'] as any);
		expect(result).toEqual(['/path/to/dir', '/another/path']);
	});

	test('應該將 SymbolCurrentDirectory 轉換為實際路徑', () =>
	{
		const result = handleOptionsPaths([SymbolCurrentDirectory]);
		expect(result).toHaveLength(1);
		expect(typeof result![0]).toBe('string');
	});

	test('應該將 SymbolGlobal 轉換為實際路徑', () =>
	{
		const result = handleOptionsPaths([SymbolGlobal]);
		expect(result!.length).toBeGreaterThan(0);
		result!.forEach(path =>
		{
			expect(typeof path).toBe('string');
		});
	});

	test('應該將 SymbolGlobalNpm 轉換為實際路徑', () =>
	{
		const result = handleOptionsPaths([SymbolGlobalNpm]);
		expect(result!.length).toBeGreaterThan(0);
	});

	test('應該將 SymbolGlobalYarn 轉換為實際路徑', () =>
	{
		const result = handleOptionsPaths([SymbolGlobalYarn]);
		expect(result).toHaveLength(1);
		expect(typeof result![0]).toBe('string');
	});

	test('應該將 SymbolModuleMain 轉換為實際路徑', () =>
	{
		const result = handleOptionsPaths([SymbolModuleMain]);
		expect(Array.isArray(result)).toBe(true);
	});

	test('應該處理混合類型的路徑陣列', () =>
	{
		const result = handleOptionsPaths([
			SymbolCurrentDirectory,
			'/custom/path',
			SymbolGlobalYarn,
		]);
		expect(result!.length).toBeGreaterThan(1);
	});
});

// ============================================================================
// 錯誤處理測試 / Error Handling Tests
// ============================================================================

describe('isErrorModuleNotFound', () =>
{
	test('應該對 MODULE_NOT_FOUND 錯誤返回 true', () =>
	{
		const error = new Error('Cannot find module') as IErrorModuleNotFound<Error>;
		error.code = 'MODULE_NOT_FOUND';
		error.requireStack = [];

		expect(isErrorModuleNotFound(error)).toBe(true);
	});

	test('應該對其他錯誤返回 false', () =>
	{
		const error = new Error('Some other error') as any;
		error.code = 'OTHER_ERROR';

		expect(isErrorModuleNotFound(error)).toBe(false);
	});

	test('應該對沒有 code 屬性的錯誤返回 false', () =>
	{
		const error = new Error('Error without code');

		expect(isErrorModuleNotFound(error)).toBe(false);
	});
});

describe('createModuleNotFoundError', () =>
{
	test('應該建立正確的錯誤物件', () =>
	{
		const error = createModuleNotFoundError('test-module');

		expect(error.code).toBe('MODULE_NOT_FOUND');
		expect(error.message).toContain('test-module');
		expect(isErrorModuleNotFound(error)).toBe(true);
	});

	test('應該包含 basePath 在 requireStack 中', () =>
	{
		const error = createModuleNotFoundError('test-module', '/path/to/search');

		expect(error.requireStack).toContain('/path/to/search');
	});
});

// ============================================================================
// 解析結果測試 / Resolution Result Tests
// ============================================================================

describe('requireResolveExtra', () =>
{
	test('應該返回結果物件當模組存在', () =>
	{
		const actual = requireResolveExtra('jest');

		expect(actual.result).toContain('jest');
		expect(actual.error).toBeUndefined();
	});

	test('應該返回錯誤物件當模組不存在', () =>
	{
		const actual = requireResolveExtra('this-module-definitely-does-not-exist-12345');

		expect(actual.result).toBeUndefined();
		expect(actual.error).toBeDefined();
		expect(actual.error!.code).toBe('MODULE_NOT_FOUND');
	});

	test('應該支援 includeGlobal 選項', () =>
	{
		const actual = requireResolveExtra('jest', {
			includeGlobal: true,
		});

		expect(actual.result).toContain('jest');
		expect(actual.error).toBeUndefined();
	});

	test('應該支援 includeCurrentDirectory 選項', () =>
	{
		const actual = requireResolveExtra('jest', {
			includeCurrentDirectory: true,
		});

		expect(actual.result).toContain('jest');
		expect(actual.error).toBeUndefined();
	});

	test('應該正確處理 MODULE_NOT_FOUND 錯誤不拋出', () =>
	{
		const actual = requireResolveExtra('@typescript-fake-package-xyz');

		expect(isErrorModuleNotFound(actual.error!)).toBe(true);
	});
});

// ============================================================================
// 模組載入測試 / Module Loading Tests
// ============================================================================

describe('requireExtra', () =>
{
	test('應該能夠載入存在的模組', () =>
	{
		const result = requireExtra('jest');
		expect(result).toBeDefined();
	});
});

describe('importExtra', () =>
{
	test('應該能夠動態導入存在的模組', async () =>
	{
		const result = await importExtra('jest');
		expect(result).toBeDefined();
	});
});

describe('tryRequireExtra', () =>
{
	test('應該能夠載入存在的模組', () =>
	{
		const result = tryRequireExtra('jest');
		expect(result).toBeDefined();
		expect(result).not.toBeNull();
	});

	test('應該返回 null 當模組不存在', () =>
	{
		const result = tryRequireExtra('this-module-definitely-does-not-exist-12345');
		expect(result).toBeNull();
	});
});

describe('tryImportExtra', () =>
{
	test('應該能夠動態導入存在的模組', async () =>
	{
		const result = await tryImportExtra('jest');
		expect(result).toBeDefined();
		expect(result).not.toBeNull();
	});

	test('應該返回 null 當模組不存在', async () =>
	{
		const result = await tryImportExtra('this-module-definitely-does-not-exist-12345');
		expect(result).toBeNull();
	});
});

// ============================================================================
// 工具函數測試 / Utility Function Tests
// ============================================================================

describe('unshiftArray', () =>
{
	test('應該將元素插入陣列開頭', () =>
	{
		const arr = [2, 3, 4];
		const result = unshiftArray(arr, 1);

		expect(result).toEqual([1, 2, 3, 4]);
		expect(arr).toEqual([1, 2, 3, 4]);
	});

	test('當元素已在開頭時不應重複插入', () =>
	{
		const arr = [1, 2, 3];
		const result = unshiftArray(arr, 1);

		expect(result).toEqual([1, 2, 3]);
		expect(arr.length).toBe(3);
	});

	test('應該處理空陣列', () =>
	{
		const arr: number[] = [];
		const result = unshiftArray(arr, 1);

		expect(result).toEqual([1]);
	});

	test('應該處理不同類型的元素', () =>
	{
		const arr = ['b', 'c'];
		const result = unshiftArray(arr, 'a');

		expect(result).toEqual(['a', 'b', 'c']);
	});
});

describe('_unshiftArray (向後相容別名)', () =>
{
	test('應該與 unshiftArray 功能相同', () =>
	{
		const arr1 = [2, 3, 4];
		const arr2 = [2, 3, 4];

		const result1 = unshiftArray(arr1, 1);
		const result2 = _unshiftArray(arr2, 1);

		expect(result1).toEqual(result2);
	});
});

describe('getTargetName', () =>
{
	test('應該返回原始名稱當沒有對應', () =>
	{
		expect(getTargetName('jest')).toBe('jest');
	});

	test('應該返回對應後的名稱', () =>
	{
		const map = { 'my-module': 'my-module/dist/index' };
		expect(getTargetName('my-module', map)).toBe('my-module/dist/index');
	});

	test('應該優先使用自訂對應', () =>
	{
		const map = { tsdx: 'tsdx/custom-path' };
		expect(getTargetName('tsdx', map)).toBe('tsdx/custom-path');
	});
});

describe('isValidPathSymbol', () =>
{
	test('應該對有效的 Symbol 返回 true', () =>
	{
		expect(isValidPathSymbol(SymbolCurrentDirectory)).toBe(true);
		expect(isValidPathSymbol(SymbolGlobal)).toBe(true);
		expect(isValidPathSymbol(SymbolGlobalNpm)).toBe(true);
		expect(isValidPathSymbol(SymbolGlobalYarn)).toBe(true);
		expect(isValidPathSymbol(SymbolModuleMain)).toBe(true);
	});

	test('應該對無效的值返回 false', () =>
	{
		expect(isValidPathSymbol('string')).toBe(false);
		expect(isValidPathSymbol(123)).toBe(false);
		expect(isValidPathSymbol(null)).toBe(false);
		expect(isValidPathSymbol(undefined)).toBe(false);
		expect(isValidPathSymbol(Symbol('custom'))).toBe(false);
	});
});

describe('defaultMap', () =>
{
	test('應該包含 tsdx 對應', () =>
	{
		expect(defaultMap.tsdx).toBe('tsdx/dist/index');
	});
});

describe('validSymbols', () =>
{
	test('應該包含所有有效的 Symbol', () =>
	{
		expect(validSymbols).toContain(SymbolCurrentDirectory);
		expect(validSymbols).toContain(SymbolGlobal);
		expect(validSymbols).toContain(SymbolGlobalNpm);
		expect(validSymbols).toContain(SymbolGlobalYarn);
		expect(validSymbols).toContain(SymbolModuleMain);
	});
});

// ============================================================================
// 套件解析測試 / Package Resolution Tests
// ============================================================================

describe('resolvePackageCore', () =>
{
	describe('基本解析功能', () =>
	{
		test('應該能夠解析已安裝的模組', () =>
		{
			const result = resolvePackageCore('jest');

			expect(result.name).toBe('jest');
			expect(result.pkgRoot).toBeDefined();
			expect(result.entryPointLocation).toBeDefined();
			expect(result.entryPointLocation).toContain('jest');
		});

		test('應該返回正確的套件根目錄', () =>
		{
			const result = resolvePackageCore('jest');

			expect(result.pkgRoot).toContain('jest');
		});
	});

	describe('擴充選項支援', () =>
	{
		test('應該支援 includeGlobal 選項', () =>
		{
			const result = resolvePackageCore('jest', {
				includeGlobal: true,
			});

			expect(result.name).toBe('jest');
			expect(result.pkgRoot).toBeDefined();
		});

		test('應該支援 includeGlobal 陣列選項', () =>
		{
			const result = resolvePackageCore('jest', {
				includeGlobal: [SymbolGlobalNpm],
			});

			expect(result.name).toBe('jest');
			expect(result.pkgRoot).toBeDefined();
		});

		test('應該支援 includeCurrentDirectory 選項', () =>
		{
			const result = resolvePackageCore('jest', {
				includeCurrentDirectory: true,
			});

			expect(result.name).toBe('jest');
			expect(result.pkgRoot).toBeDefined();
		});

		test('應該支援 cwd 選項', () =>
		{
			const result = resolvePackageCore('jest', {
				includeCurrentDirectory: true,
				cwd: process.cwd(),
			});

			expect(result.name).toBe('jest');
			expect(result.pkgRoot).toBeDefined();
		});

		test('應該支援自訂 paths 選項', () =>
		{
			const result = resolvePackageCore('jest', {
				paths: [process.cwd()],
			});

			expect(result.name).toBe('jest');
			expect(result.pkgRoot).toBeDefined();
		});

		test('應該支援混合選項', () =>
		{
			const result = resolvePackageCore('jest', {
				includeGlobal: true,
				includeCurrentDirectory: true,
				paths: [process.cwd()],
				cwd: process.cwd(),
			});

			expect(result.name).toBe('jest');
			expect(result.pkgRoot).toBeDefined();
		});
	});
});

describe('resolvePackageRoot', () =>
{
	test('應該返回套件的根目錄路徑', () =>
	{
		const result = resolvePackageRoot('jest');

		expect(result).toBeDefined();
		expect(result).toContain('jest');
	});
});

describe('resolvePackageJsonLocation', () =>
{
	test('應該返回 package.json 的完整路徑', () =>
	{
		const result = resolvePackageJsonLocation('jest');

		expect(result).toBeDefined();
		expect(result).toContain('jest');
		expect(result).toMatch(/jest.*package\.json$/);
	});
});

describe('createResolveLocationFn', () =>
{
	test('應該返回一個函數', () =>
	{
		const resolveLocation = createResolveLocationFn('jest');

		expect(typeof resolveLocation).toBe('function');
	});

	test('返回的函數應該能夠解析相對路徑', () =>
	{
		const resolveLocation = createResolveLocationFn('jest');
		const result = resolveLocation('package.json');

		expect(result).toMatch(/jest.*package\.json$/);
	});

	test('應該支援多個路徑參數', () =>
	{
		const resolveLocation = createResolveLocationFn('jest');
		const result = resolveLocation('build', 'cli', 'index.js');

		expect(result).toMatch(/jest/);
	});
});

describe('readModulePackageJson', () =>
{
	test('應該能夠讀取模組的 package.json', () =>
	{
		const pkg = readModulePackageJson('jest');

		expect(pkg.name).toBe('jest');
		expect(pkg.version).toBeDefined();
	});
});

describe('resolvePackage', () =>
{
	test('應該返回完整的套件資訊', () =>
	{
		const result = resolvePackage('jest');

		expect(result.name).toBe('jest');
		expect(result.pkgRoot).toBeDefined();
		expect(result.entryPointLocation).toBeDefined();
		expect(result.pkg).toBeDefined();
		expect(result.pkg.name).toBe('jest');
		expect(result.pkgJsonLocation).toBeDefined();
		expect(result.resolveLocation).toBeDefined();
		expect(typeof result.resolveLocation).toBe('function');
	});

	test('resolveLocation 應該能夠解析相對路徑', () =>
	{
		const { resolveLocation } = resolvePackage('jest');
		const result = resolveLocation('package.json');

		expect(result).toMatch(/jest.*package\.json$/);
	});

	test('pkgJsonLocation 應該指向正確的 package.json', () =>
	{
		const { pkgJsonLocation } = resolvePackage('jest');

		expect(pkgJsonLocation).toMatch(/jest.*package\.json$/);
	});
});

// ============================================================================
// Symbols 匯出測試 / Symbols Export Tests
// ============================================================================

describe('Symbols 匯出', () =>
{
	test('應該匯出正確的 Symbols', () =>
	{
		expect(typeof SymbolCurrentDirectory).toBe('symbol');
		expect(typeof SymbolGlobal).toBe('symbol');
		expect(typeof SymbolGlobalNpm).toBe('symbol');
		expect(typeof SymbolGlobalYarn).toBe('symbol');
		expect(typeof SymbolModuleMain).toBe('symbol');
	});

	test('Symbols 應該可以通過 Symbol.for 取得', () =>
	{
		expect(SymbolCurrentDirectory).toBe(Symbol.for('cwd'));
		expect(SymbolGlobal).toBe(Symbol.for('global'));
		expect(SymbolGlobalNpm).toBe(Symbol.for('npm'));
		expect(SymbolGlobalYarn).toBe(Symbol.for('yarn'));
		expect(SymbolModuleMain).toBe(Symbol.for('module.main'));
	});
});

// ============================================================================
// 整合測試 / Integration Tests
// ============================================================================

describe('整合測試', () =>
{
	const tsdx_path = requireResolveExtra('tsdx').result;

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