import requireResolveExtra, {
	isErrorModuleNotFound,
	requireResolveCore,
	handleOptionsPaths,
	requireExtra,
	_unshiftArray,
	resolvePackageCore,
	resolvePackageRoot,
	resolvePackageJsonLocation,
	createResolveLocationFn,
	readModulePackageJson,
	resolvePackage,
	IErrorModuleNotFound,
	buildResolvePaths,
	getTargetName,
	tryRequireExtra,
	createModuleNotFoundError,
	defaultMap,
} from '../index';
import { SymbolGlobalPnpm, SymbolGlobalNpm, SymbolGlobalYarn, SymbolCurrentDirectory, SymbolGlobal, SymbolModuleMain, isValidPathSymbol, getValidPathSymbols } from '@yarn-tool/get-paths-by-type';
import {
	validSymbols,
} from './lib/const';
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

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
			assert.ok(result.includes('jest'));
		});

		test('應該能夠解析帶有自訂對應的模組', () =>
		{
			const customMap = {
				'non-existent-module': 'jest',
			};

			const result = requireResolveCore('non-existent-module', { map: customMap });
			assert.ok(result.includes('jest'));
		});

		test('應該在模組不存在時拋出錯誤', () =>
		{
			assert.throws(() =>
			{
				requireResolveCore('this-module-definitely-does-not-exist-12345');
			});
		});
	});

	describe('路徑選項處理', () =>
	{
		test('應該能夠使用自訂 paths 選項', () =>
		{
			const result = requireResolveCore('jest', {
				paths: [process.cwd()],
			});
			assert.ok(result.includes('jest'));
		});

		test('應該能夠使用 includeGlobal 選項', () =>
		{
			const result = requireResolveCore('jest', {
				includeGlobal: true,
			});
			assert.ok(result.includes('jest'));
		});

		test('應該能夠使用 includeGlobal 陣列選項', () =>
		{
			const result = requireResolveCore('jest', {
				includeGlobal: [SymbolGlobalNpm, SymbolGlobalPnpm],
			});
			assert.ok(result.includes('jest'));
		});

		test('應該能夠使用 includeCurrentDirectory 選項', () =>
		{
			const result = requireResolveCore('jest', {
				includeCurrentDirectory: true,
			});
			assert.ok(result.includes('jest'));
		});

		test('應該能夠使用 cwd 選項', () =>
		{
			const result = requireResolveCore('jest', {
				includeCurrentDirectory: true,
				cwd: process.cwd(),
			});
			assert.ok(result.includes('jest'));
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

		assert.ok(paths.length > 0);
	});

	test('應該處理空選項', () =>
	{
		const paths = buildResolvePaths({});
		assert.strictEqual(Array.isArray(paths), true);
	});

	test('應該處理 includeGlobal 陣列', () =>
	{
		const paths = buildResolvePaths({
			includeGlobal: [SymbolGlobalNpm, SymbolGlobalYarn],
		});

		assert.ok(paths.length > 0);
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
		assert.strictEqual(result, undefined);
	});

	test('應該返回 undefined 當 paths 為空陣列', () =>
	{
		const result = handleOptionsPaths([]);
		assert.strictEqual(result, undefined);
	});

	test('應該保留字串路徑', () =>
	{
		const result = handleOptionsPaths(['/path/to/dir']);
		assert.deepStrictEqual(result, ['/path/to/dir']);
	});

	test('應該過濾掉 null 和 undefined 路徑', () =>
	{
		const result = handleOptionsPaths(['/path/to/dir', null, undefined, '/another/path'] as any);
		assert.deepStrictEqual(result, ['/path/to/dir', '/another/path']);
	});

	test('應該將 SymbolCurrentDirectory 轉換為實際路徑', () =>
	{
		const result = handleOptionsPaths([SymbolCurrentDirectory]);
		assert.strictEqual(result!.length, 1);
		assert.strictEqual(typeof result![0], 'string');
	});

	test('應該將 SymbolGlobal 轉換為實際路徑', () =>
	{
		const result = handleOptionsPaths([SymbolGlobal]);
		assert.ok(result!.length > 0);
		result!.forEach(path =>
		{
			assert.strictEqual(typeof path, 'string');
		});
	});

	test('應該將 SymbolGlobalNpm 轉換為實際路徑', () =>
	{
		const result = handleOptionsPaths([SymbolGlobalNpm]);
		assert.ok(result!.length > 0);
	});

	test('應該將 SymbolGlobalYarn 轉換為實際路徑', () =>
	{
		const result = handleOptionsPaths([SymbolGlobalYarn]);
		assert.strictEqual(result!.length, 1);
		assert.strictEqual(typeof result![0], 'string');
	});

	test('應該將 SymbolModuleMain 轉換為實際路徑', () =>
	{
		const result = handleOptionsPaths([SymbolModuleMain]);
		assert.strictEqual(Array.isArray(result), true);
	});

	test('應該處理混合類型的路徑陣列', () =>
	{
		const result = handleOptionsPaths([
			SymbolCurrentDirectory,
			'/custom/path',
			SymbolGlobalYarn,
		]);
		assert.ok(result!.length > 1);
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

		assert.strictEqual(isErrorModuleNotFound(error), true);
	});

	test('應該對其他錯誤返回 false', () =>
	{
		const error = new Error('Some other error') as any;
		error.code = 'OTHER_ERROR';

		assert.strictEqual(isErrorModuleNotFound(error), false);
	});

	test('應該對沒有 code 屬性的錯誤返回 false', () =>
	{
		const error = new Error('Error without code');

		assert.strictEqual(isErrorModuleNotFound(error), false);
	});
});

describe('createModuleNotFoundError', () =>
{
	test('應該建立正確的錯誤物件', () =>
	{
		const error = createModuleNotFoundError('test-module');

		assert.strictEqual(error.code, 'MODULE_NOT_FOUND');
		assert.ok(error.message.includes('test-module'));
		assert.strictEqual(isErrorModuleNotFound(error), true);
	});

	test('應該包含 basePath 在 requireStack 中', () =>
	{
		const error = createModuleNotFoundError('test-module', '/path/to/search');

		assert.ok(error.requireStack.includes('/path/to/search'));
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

		assert.ok(actual.result?.includes('jest'));
		assert.strictEqual(actual.error, undefined);
	});

	test('應該返回錯誤物件當模組不存在', () =>
	{
		const actual = requireResolveExtra('this-module-definitely-does-not-exist-12345');

		assert.strictEqual(actual.result, undefined);
		assert.notStrictEqual(actual.error, undefined);
		assert.strictEqual(actual.error!.code, 'MODULE_NOT_FOUND');
	});

	test('應該支援 includeGlobal 選項', () =>
	{
		const actual = requireResolveExtra('jest', {
			includeGlobal: true,
		});

		assert.ok(actual.result?.includes('jest'));
		assert.strictEqual(actual.error, undefined);
	});

	test('應該支援 includeCurrentDirectory 選項', () =>
	{
		const actual = requireResolveExtra('jest', {
			includeCurrentDirectory: true,
		});

		assert.ok(actual.result?.includes('jest'));
		assert.strictEqual(actual.error, undefined);
	});

	test('應該正確處理 MODULE_NOT_FOUND 錯誤不拋出', () =>
	{
		const actual = requireResolveExtra('@typescript-fake-package-xyz');

		assert.strictEqual(isErrorModuleNotFound(actual.error!), true);
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
		assert.notStrictEqual(result, undefined);
	});
});

describe('tryRequireExtra', () =>
{
	test('應該能夠載入存在的模組', () =>
	{
		const result = tryRequireExtra('jest');
		assert.notStrictEqual(result, undefined);
		assert.notStrictEqual(result, null);
	});

	test('應該返回 null 當模組不存在', () =>
	{
		const result = tryRequireExtra('this-module-definitely-does-not-exist-12345');
		assert.strictEqual(result, null);
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
		const result = _unshiftArray(arr, 1);

		assert.deepStrictEqual(result, [1, 2, 3, 4]);
		assert.deepStrictEqual(arr, [1, 2, 3, 4]);
	});

	test('當元素已在開頭時不應重複插入', () =>
	{
		const arr = [1, 2, 3];
		const result = _unshiftArray(arr, 1);

		assert.deepStrictEqual(result, [1, 2, 3]);
		assert.strictEqual(arr.length, 3);
	});

	test('應該處理空陣列', () =>
	{
		const arr: number[] = [];
		const result = _unshiftArray(arr, 1);

		assert.deepStrictEqual(result, [1]);
	});

	test('應該處理不同類型的元素', () =>
	{
		const arr = ['b', 'c'];
		const result = _unshiftArray(arr, 'a');

		assert.deepStrictEqual(result, ['a', 'b', 'c']);
	});
});

describe('getTargetName', () =>
{
	test('應該返回原始名稱當沒有對應', () =>
	{
		assert.strictEqual(getTargetName('jest'), 'jest');
	});

	test('應該返回對應後的名稱', () =>
	{
		const map = { 'my-module': 'my-module/dist/index' };
		assert.strictEqual(getTargetName('my-module', map), 'my-module/dist/index');
	});

	test('應該優先使用自訂對應', () =>
	{
		const map = { tsdx: 'tsdx/custom-path' };
		assert.strictEqual(getTargetName('tsdx', map), 'tsdx/custom-path');
	});
});

describe('isValidPathSymbol', () =>
{
	test('應該對有效的 Symbol 返回 true', () =>
	{
		assert.strictEqual(isValidPathSymbol(SymbolCurrentDirectory), true);
		assert.strictEqual(isValidPathSymbol(SymbolGlobal), true);
		assert.strictEqual(isValidPathSymbol(SymbolGlobalNpm), true);
		assert.strictEqual(isValidPathSymbol(SymbolGlobalYarn), true);
		assert.strictEqual(isValidPathSymbol(SymbolModuleMain), true);
	});

	test('應該對無效的值返回 false', () =>
	{
		assert.strictEqual(isValidPathSymbol('string'), false);
		assert.strictEqual(isValidPathSymbol(123), false);
		assert.strictEqual(isValidPathSymbol(null), false);
		assert.strictEqual(isValidPathSymbol(undefined), false);
		assert.strictEqual(isValidPathSymbol(Symbol('custom')), false);
	});
});

describe('defaultMap', () =>
{
	test('應該包含 tsdx 對應', () =>
	{
		assert.strictEqual(defaultMap.tsdx, 'tsdx/dist/index');
	});
});

describe('validSymbols', () =>
{
	test('應該包含所有有效的 Symbol', () =>
	{
		assert.ok(validSymbols.includes(SymbolCurrentDirectory));
		assert.ok(validSymbols.includes(SymbolGlobal));
		assert.ok(validSymbols.includes(SymbolGlobalNpm));
		assert.ok(validSymbols.includes(SymbolGlobalYarn));
		assert.ok(validSymbols.includes(SymbolModuleMain));
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

			assert.strictEqual(result.name, 'jest');
			assert.notStrictEqual(result.pkgRoot, undefined);
			assert.notStrictEqual(result.entryPointLocation, undefined);
			assert.ok(result.entryPointLocation.includes('jest'));
		});

		test('應該返回正確的套件根目錄', () =>
		{
			const result = resolvePackageCore('jest');

			assert.ok(result.pkgRoot.includes('jest'));
		});
	});

	describe('擴充選項支援', () =>
	{
		test('應該支援 includeGlobal 選項', () =>
		{
			const result = resolvePackageCore('jest', {
				includeGlobal: true,
			});

			assert.strictEqual(result.name, 'jest');
			assert.notStrictEqual(result.pkgRoot, undefined);
		});

		test('應該支援 includeGlobal 陣列選項', () =>
		{
			const result = resolvePackageCore('jest', {
				includeGlobal: [SymbolGlobalNpm, SymbolGlobalPnpm],
			});

			assert.strictEqual(result.name, 'jest');
			assert.notStrictEqual(result.pkgRoot, undefined);
		});

		test('應該支援 includeCurrentDirectory 選項', () =>
		{
			const result = resolvePackageCore('jest', {
				includeCurrentDirectory: true,
			});

			assert.strictEqual(result.name, 'jest');
			assert.notStrictEqual(result.pkgRoot, undefined);
		});

		test('應該支援 cwd 選項', () =>
		{
			const result = resolvePackageCore('jest', {
				includeCurrentDirectory: true,
				cwd: process.cwd(),
			});

			assert.strictEqual(result.name, 'jest');
			assert.notStrictEqual(result.pkgRoot, undefined);
		});

		test('應該支援自訂 paths 選項', () =>
		{
			const result = resolvePackageCore('jest', {
				paths: [process.cwd()],
			});

			assert.strictEqual(result.name, 'jest');
			assert.notStrictEqual(result.pkgRoot, undefined);
		});

		test('應該支援混合選項', () =>
		{
			const result = resolvePackageCore('jest', {
				includeGlobal: true,
				includeCurrentDirectory: true,
				paths: [process.cwd()],
				cwd: process.cwd(),
			});

			assert.strictEqual(result.name, 'jest');
			assert.notStrictEqual(result.pkgRoot, undefined);
		});
	});
});

describe('resolvePackageRoot', () =>
{
	test('應該返回套件的根目錄路徑', () =>
	{
		const result = resolvePackageRoot('jest');

		assert.notStrictEqual(result, undefined);
		assert.ok(result.includes('jest'));
	});
});

describe('resolvePackageJsonLocation', () =>
{
	test('應該返回 package.json 的完整路徑', () =>
	{
		const result = resolvePackageJsonLocation('jest');

		assert.notStrictEqual(result, undefined);
		assert.ok(result.includes('jest'));
		assert.match(result, /jest.*package\.json$/);
	});
});

describe('createResolveLocationFn', () =>
{
	test('應該返回一個函數', () =>
	{
		const resolveLocation = createResolveLocationFn('jest');

		assert.strictEqual(typeof resolveLocation, 'function');
	});

	test('返回的函數應該能夠解析相對路徑', () =>
	{
		const resolveLocation = createResolveLocationFn('jest');
		const result = resolveLocation('package.json');

		assert.match(result, /jest.*package\.json$/);
	});

	test('應該支援多個路徑參數', () =>
	{
		const resolveLocation = createResolveLocationFn('jest');
		const result = resolveLocation('build', 'cli', 'index.js');

		assert.match(result, /jest/);
	});
});

describe('readModulePackageJson', () =>
{
	test('應該能夠讀取模組的 package.json', () =>
	{
		const pkg = readModulePackageJson('jest');

		assert.strictEqual(pkg.name, 'jest');
		assert.notStrictEqual(pkg.version, undefined);
	});
});

describe('resolvePackage', () =>
{
	test('應該返回完整的套件資訊', () =>
	{
		const result = resolvePackage('jest');

		assert.strictEqual(result.name, 'jest');
		assert.notStrictEqual(result.pkgRoot, undefined);
		assert.notStrictEqual(result.entryPointLocation, undefined);
		assert.notStrictEqual(result.pkg, undefined);
		assert.strictEqual(result.pkg.name, 'jest');
		assert.notStrictEqual(result.pkgJsonLocation, undefined);
		assert.notStrictEqual(result.resolveLocation, undefined);
		assert.strictEqual(typeof result.resolveLocation, 'function');
	});

	test('resolveLocation 應該能夠解析相對路徑', () =>
	{
		const { resolveLocation } = resolvePackage('jest');
		const result = resolveLocation('package.json');

		assert.match(result, /jest.*package\.json$/);
	});

	test('pkgJsonLocation 應該指向正確的 package.json', () =>
	{
		const { pkgJsonLocation } = resolvePackage('jest');

		assert.match(pkgJsonLocation, /jest.*package\.json$/);
	});
});

// ============================================================================
// Symbols 匯出測試 / Symbols Export Tests
// ============================================================================

describe('Symbols 匯出', () =>
{
	test('應該匯出正確的 Symbols', () =>
	{
		assert.strictEqual(typeof SymbolCurrentDirectory, 'symbol');
		assert.strictEqual(typeof SymbolGlobal, 'symbol');
		assert.strictEqual(typeof SymbolGlobalNpm, 'symbol');
		assert.strictEqual(typeof SymbolGlobalYarn, 'symbol');
		assert.strictEqual(typeof SymbolModuleMain, 'symbol');
	});

	test('Symbols 應該可以通過 Symbol.for 取得', () =>
	{
		assert.strictEqual(SymbolCurrentDirectory, Symbol.for('cwd'));
		assert.strictEqual(SymbolGlobal, Symbol.for('global'));
		assert.strictEqual(SymbolGlobalNpm, Symbol.for('npm'));
		assert.strictEqual(SymbolGlobalYarn, Symbol.for('yarn'));
		assert.strictEqual(SymbolModuleMain, Symbol.for('module.main'));
	});
});

// ============================================================================
// 整合測試 / Integration Tests
// ============================================================================

describe('整合測試', () =>
{
	const tsdx_path = requireResolveExtra('tsdx').result;

	test('ts-jest', (t) =>
	{
		let actual = requireResolveExtra('ts-jest', {
			includeGlobal: true,
			includeCurrentDirectory: true,
			paths: [
				tsdx_path,
			],
		});

		t.assert.snapshot(actual);
	});

	test('typescript', (t) =>
	{
		let actual = requireResolveExtra('typescript', {
			includeGlobal: true,
			includeCurrentDirectory: true,
			paths: [
				tsdx_path,
			],
		});

		t.assert.snapshot(actual);
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

		assert.strictEqual(actual.error?.code, 'MODULE_NOT_FOUND');
		assert.ok(isErrorModuleNotFound(actual.error!));
		assert.strictEqual(actual.result, undefined);
	});
});
