/// <reference types="jest" />
/// <reference types="node" />

/**
 * @fileoverview Lerna 測試用的 Mock 工具函式庫
 * Mock utilities library for Lerna testing
 *
 * 提供建立模擬 lerna.json 設定、模擬 lerna 套件版本等功能
 * Provides functions to create mock lerna.json configs, mock lerna package versions, etc.
 */

import { ILernaJson } from '@ts-type/package-dts/lerna-json';
import { IOptionsFixLerna } from '../../../lib/ws/lerna';
import { join } from 'path';
import { mkdirSync, writeFileSync, existsSync, rmSync } from 'fs';

/**
 * 預設的 mock lerna.json 設定
 * Default mock lerna.json configuration
 */
export const DEFAULT_MOCK_LERNA_JSON: ILernaJson = {
	packages: ['packages/*'],
	command: {
		publish: {
			ignoreChanges: ['*.log'],
		},
	},
	version: 'independent',
};

/**
 * 預設的 mock 模板 lerna.json 設定
 * Default mock template lerna.json configuration
 */
export const DEFAULT_MOCK_TPL_LERNA_JSON: ILernaJson = {
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

/**
 * 建立 Mock IOptionsFixLerna 選項
 * Create mock IOptionsFixLerna options
 *
 * @param root - 專案根目錄路徑 / Project root directory path
 * @returns 模擬的選項物件 / Mock options object
 */
export function _createMockOptions(root: string): IOptionsFixLerna
{
	return {
		rootData: {
			cwd: root,
			root,
			pkg: join(root, 'package.json'),
			hasWorkspace: false,
			isWorkspace: false,
			ws: root,
			isRoot: true,
		},
	};
}

/**
 * 建立 Mock Lerna 套件版本檔案
 * Create mock Lerna package version file
 *
 * @param root - 專案根目錄 / Project root directory
 * @param version - Lerna 版本號（預設 7.0.0）/ Lerna version (default: 7.0.0)
 */
export function _mockLernaVersion(root: string, version = '7.0.0'): void
{
	const lernaPkgDir = join(root, 'node_modules/lerna');
	const lernaPkgPath = join(lernaPkgDir, 'package.json');

	mkdirSync(lernaPkgDir, { recursive: true });
	writeFileSync(lernaPkgPath, JSON.stringify({ version }));
}

/**
 * 建立 Mock lerna.json 檔案
 * Create mock lerna.json file
 *
 * @param root - 專案根目錄 / Project root directory
 * @param content - lerna.json 內容 / lerna.json content
 * @returns 檔案完整路徑 / Full file path
 */
export function _mockLernaJson(root: string, content: ILernaJson = DEFAULT_MOCK_LERNA_JSON): string
{
	const filePath = join(root, 'lerna.json');
	writeFileSync(filePath, JSON.stringify(content, null, 2));
	return filePath;
}

/**
 * 建立 Mock package.json 檔案
 * Create mock package.json file
 *
 * @param root - 專案根目錄 / Project root directory
 * @param name - 套件名稱（預設 test-pkg）/ Package name (default: test-pkg)
 * @returns 檔案完整路徑 / Full file path
 */
export function _mockPackageJson(root: string, name = 'test-pkg'): string
{
	const filePath = join(root, 'package.json');
	const content = {
		name,
		version: '1.0.0',
	};
	writeFileSync(filePath, JSON.stringify(content, null, 2));
	return filePath;
}

/**
 * 清理測試目錄
 * Clean up test directory
 *
 * @param dir - 要清理的目錄路徑 / Directory path to clean
 */
export function _cleanupDir(dir: string): void
{
	if (existsSync(dir))
	{
		rmSync(dir, { recursive: true, force: true });
	}
}

/**
 * 確保目錄存在，若不存在則建立
 * Ensure directory exists, create if not
 *
 * @param dir - 目錄路徑 / Directory path
 */
export function _ensureDir(dir: string): void
{
	if (!existsSync(dir))
	{
		mkdirSync(dir, { recursive: true });
	}
}

/**
 * Mock 產生器類別，提供更方便的測試環境設置
 * Mock generator class providing convenient test environment setup
 *
 * @example
 * ```typescript
 * const mock = new LernaMockGenerator('/tmp/test-project');
 * mock.setup({ lernaVersion: '7.0.0', hasLernaJson: true });
 * // ... 執行測試 ...
 * mock.cleanup();
 * ```
 */
export class LernaMockGenerator
{
	/** 專案根目錄路徑 / Project root directory path */
	public readonly root: string;

	/**
	 * @param root - 專案根目錄路徑 / Project root directory path
	 */
	constructor(root: string)
	{
		this.root = root;
	}

	/**
	 * 設置測試環境
	 * Setup test environment
	 *
	 * @param options - 設置選項 / Setup options
	 * @returns this（支援鏈式呼叫）/ this (supports chaining)
	 */
	setup(options: {
		/** Lerna 版本號 / Lerna version */
		lernaVersion?: string;
		/** 是否建立 lerna.json / Whether to create lerna.json */
		hasLernaJson?: boolean;
		/** 自訂 lerna.json 內容 / Custom lerna.json content */
		lernaJson?: ILernaJson;
		/** 是否建立 package.json / Whether to create package.json */
		hasPackageJson?: boolean;
	} = {}): this
	{
		_ensureDir(this.root);

		if (options.lernaVersion !== undefined)
		{
			_mockLernaVersion(this.root, options.lernaVersion);
		}

		if (options.hasLernaJson)
		{
			_mockLernaJson(this.root, options.lernaJson ?? DEFAULT_MOCK_LERNA_JSON);
		}

		if (options.hasPackageJson)
		{
			_mockPackageJson(this.root);
		}

		return this;
	}

	/**
	 * 取得 IOptionsFixLerna 選項
	 * Get IOptionsFixLerna options
	 *
	 * @returns 選項物件 / Options object
	 */
	getOptions(): IOptionsFixLerna
	{
		return _createMockOptions(this.root);
	}

	/**
	 * 清理測試環境
	 * Clean up test environment
	 */
	cleanup(): void
	{
		_cleanupDir(this.root);
	}
}
