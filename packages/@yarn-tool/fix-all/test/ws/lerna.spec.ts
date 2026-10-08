/// <reference types="jest" />
/// <reference types="node" />

import assert from 'node:assert/strict';
import { describe, it, after, beforeEach, afterEach, mock } from 'node:test';
import {
	_fixLernaJsonCore,
	_fixLernaDeprecatedCore,
	_fixLernaJson,
	IOptionsFixLerna,
} from '../../lib/ws/lerna';
import { ILernaJson } from '@ts-type/package-dts/lerna-json';
import { join } from 'path';
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'fs';
import { __root } from '../__root';

/**
 * Mock resolvePackage 函數
 * Mock resolvePackage function
 */
// node:test 未提供可用的模組級 mock（本機 Node 無 mock.module），改以 mock.method 替換模組 exports 上的 resolvePackage，等效於原 jest.mock 工廠
// node:test has no usable module-level mock (mock.module is unavailable in this Node build); patch the exported resolvePackage via mock.method instead, equivalent to the original jest.mock factory
const _resolvePackageModule = require('@yarn-tool/require-resolve/lib/package');

mock.method(_resolvePackageModule, 'resolvePackage');

import { resolvePackage } from '@yarn-tool/require-resolve/lib/package';

/**
 * 測試用的臨時目錄路徑
 * Temporary directory path for testing
 */
const TEMP_DIR = join(__root, 'test/temp/lerna-test');

/**
 * 建立測試用的 lerna.json 檔案
 * Create lerna.json file for testing
 *
 * @param content - 檔案內容 / File content
 * @param filename - 檔案名稱（預設為 lerna.json）/ File name (default: lerna.json)
 */
function _createLernaJson(content: ILernaJson, filename = 'lerna.json'): string
{
	if (!existsSync(TEMP_DIR))
	{
		mkdirSync(TEMP_DIR, { recursive: true });
	}
	const filePath = join(TEMP_DIR, filename);
	writeFileSync(filePath, JSON.stringify(content, null, 2));
	return filePath;
}

/**
 * 清理測試環境
 * Clean up test environment
 */
function _cleanup(): void
{
	if (existsSync(TEMP_DIR))
	{
		rmSync(TEMP_DIR, { recursive: true, force: true });
	}
}

describe('_fixLernaJsonCore', () => {
	/**
	 * 基礎 lerna.json 設定物件
	 * Base lerna.json configuration object
	 */
	const baseLernaJson: ILernaJson = {
		packages: ['packages/*'],
		command: {
			publish: {
				ignoreChanges: ['*.log'],
			},
		},
		version: 'independent',
	};

	/**
	 * 模板 lerna.json 設定物件
	 * Template lerna.json configuration object
	 */
	const tplLernaJson: ILernaJson = {
		packages: ['packages/*'],
		command: {
			publish: {
				ignoreChanges: ['**/node_modules/**', '*.test.ts'],
				concurrency: 1,
			},
			version: {
				conventionalCommits: true,
			},
		},
		version: 'independent',
	};

	it('should merge command settings with defaultsDeep', () => {
		const result = _fixLernaJsonCore(
			JSON.parse(JSON.stringify(baseLernaJson)),
			tplLernaJson
		);

		assert.strictEqual(result.command.publish.concurrency, 1);
		assert.strictEqual(result.command.version?.conventionalCommits, true);
	});

	it('should concatenate and deduplicate ignoreChanges', () => {
		const result = _fixLernaJsonCore(
			JSON.parse(JSON.stringify(baseLernaJson)),
			tplLernaJson
		);

		assert.ok(
			['*.log', '**/node_modules/**', '*.test.ts'].every(pattern =>
				(result.command.publish.ignoreChanges as string[]).includes(pattern)
			)
		);
	});

	it('should remove duplicate ignoreChanges entries', () => {
		// 故意加入重複項目測試去重功能
		// Intentionally add duplicate entries to test deduplication
		const duplicateJson: ILernaJson = {
			...baseLernaJson,
			command: {
				publish: {
					ignoreChanges: ['**/node_modules/**', '*.log'],
				},
			},
		};

		const result = _fixLernaJsonCore(duplicateJson, tplLernaJson);

		// 計算唯一值的數量應該等於陣列長度
		// Count of unique values should equal array length
		const uniqueCount = new Set(result.command.publish.ignoreChanges as string[]).size;
		assert.strictEqual((result.command.publish.ignoreChanges as string[]).length, uniqueCount);
	});

	it('should preserve existing command settings', () => {
		const customJson: ILernaJson = {
			...baseLernaJson,
			command: {
				publish: {
					ignoreChanges: ['custom-pattern'],
					concurrency: 5,
					loglevel: 'verbose',
				},
			},
		};

		const result = _fixLernaJsonCore(customJson, tplLernaJson);

		// 現有設定應該被保留
		// Existing settings should be preserved
		assert.strictEqual(result.command.publish.concurrency, 5);
		assert.strictEqual(result.command.publish.loglevel, 'verbose');
	});
});

describe('_fixLernaDeprecatedCore', () => {
	/**
	 * 建立 Mock 選項
	 * Create mock options
	 */
	function _createMockOptionsForTest(testName: string): IOptionsFixLerna
	{
		const dir = join(TEMP_DIR, `deprecated-${testName}`);
		return {
			rootData: {
				cwd: dir,
				root: dir,
				pkg: join(dir, 'package.json'),
				hasWorkspace: false,
				isWorkspace: false,
				ws: dir,
				isRoot: true,
			},
		};
	}

	beforeEach(() => {
		// 每次測試前重置 mock
		// Reset mock before each test
		(resolvePackage as any).mock.resetCalls();
	});

	after(() => {
		_cleanup();
	});

	it('should remove useWorkspaces when lerna >= 7.0.0', () => {
		const mockOptions = _createMockOptionsForTest('v7');

		// Mock 回傳 lerna 7.0.0 版本
		// Mock return lerna 7.0.0 version
		(resolvePackage as any).mock.mockImplementation(() => ({
			pkg: { version: '7.0.0' },
		}));

		const lernaJson: ILernaJson = {
			packages: ['packages/*'],
			useWorkspaces: true,
			version: 'independent',
		};

		const result = _fixLernaDeprecatedCore(mockOptions, lernaJson);

		assert.strictEqual(result.useWorkspaces, undefined);
		assert.deepStrictEqual((resolvePackage as any).mock.calls[0]?.arguments, ['lerna', {
			includeGlobal: true,
			includeCurrentDirectory: true,
		}]);
	});

	it('should keep useWorkspaces when lerna < 7.0.0', () => {
		const mockOptions = _createMockOptionsForTest('v6');

		// Mock 回傳 lerna 6.0.0 版本
		// Mock return lerna 6.0.0 version
		(resolvePackage as any).mock.mockImplementation(() => ({
			pkg: { version: '6.0.0' },
		}));

		const lernaJson: ILernaJson = {
			packages: ['packages/*'],
			useWorkspaces: true,
			version: 'independent',
		};

		const result = _fixLernaDeprecatedCore(mockOptions, lernaJson);

		assert.strictEqual(result.useWorkspaces, true);
	});

	it('should handle missing lerna package gracefully', () => {
		const mockOptions = _createMockOptionsForTest('missing');

		// Mock 拋出錯誤（模擬 lerna 未安裝）
		// Mock throw error (simulate lerna not installed)
		(resolvePackage as any).mock.mockImplementation(() => {
			throw new Error('Cannot find module lerna');
		});

		const lernaJson: ILernaJson = {
			packages: ['packages/*'],
			useWorkspaces: true,
			version: 'independent',
		};

		// 應該靜默處理錯誤並返回原始物件
		// Should silently handle error and return original object
		const result = _fixLernaDeprecatedCore(mockOptions, lernaJson);

		assert.deepStrictEqual(result, lernaJson);
	});
});

describe('_fixLernaJson Integration', () => {
	afterEach(() => {
		_cleanup();
	});

	it('should process existing lerna.json file', () => {
		const lernaContent: ILernaJson = {
			packages: ['packages/*'],
			command: {
				publish: {
					ignoreChanges: ['*.log'],
				},
			},
			version: 'independent',
		};

		_createLernaJson(lernaContent);

		const options: IOptionsFixLerna = {
			rootData: {
				cwd: TEMP_DIR,
				root: TEMP_DIR,
				pkg: join(TEMP_DIR, 'package.json'),
				hasWorkspace: false,
				isWorkspace: false,
				ws: TEMP_DIR,
				isRoot: true,
			},
		};

		// 執行修復
		// Execute fix
		_fixLernaJson(options);

		// 驗證檔案已被更新
		// Verify file has been updated
		const updatedContent = JSON.parse(
			readFileSync(join(TEMP_DIR, 'lerna.json'), 'utf-8')
		);

		assert.notStrictEqual(updatedContent, undefined);
		assert.notStrictEqual(updatedContent.command, undefined);
	});

	it('should not throw when lerna.json does not exist', () => {
		const options: IOptionsFixLerna = {
			rootData: {
				cwd: join(TEMP_DIR, 'non-existent'),
				root: join(TEMP_DIR, 'non-existent'),
				pkg: join(TEMP_DIR, 'non-existent/package.json'),
				hasWorkspace: false,
				isWorkspace: false,
				ws: join(TEMP_DIR, 'non-existent'),
				isRoot: true,
			},
		};

		// 應該靜默處理不存在的檔案
		// Should silently handle non-existent file
		assert.doesNotThrow(() => _fixLernaJson(options));
	});
});
