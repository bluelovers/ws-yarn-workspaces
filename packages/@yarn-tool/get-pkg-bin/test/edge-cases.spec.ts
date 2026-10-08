/**
 * @jest-environment node
 *
 * 邊界案例測試
 * Edge case tests for @yarn-tool/get-pkg-bin
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
	normalizePackageBins,
	defaultPackageBin,
} from '../index';
import {
	getPackageBins,
	handlePackageBins,
	firstPackageBin,
	getPackageInfo,
	_handleDefaultKey,
} from '../util';

describe('Edge Cases', () => {
	describe('getPackageBins edge cases', () => {
		it('should handle bin as empty string', () => {
			const pkg = {
				name: 'test-pkg',
				bin: '',
			};
			const result = getPackageBins(pkg);
			assert.deepStrictEqual(result, {
				'test-pkg': '',
			});
		});

		it('should handle bin as empty object', () => {
			const pkg = {
				name: 'test-pkg',
				bin: {},
			};
			const result = getPackageBins(pkg);
			assert.deepStrictEqual(result, {});
		});

		it('should handle package name with scope', () => {
			const pkg = {
				name: '@org/my-cli',
				bin: './cli.js',
			};
			const result = getPackageBins(pkg);
			assert.deepStrictEqual(result, {
				'@org/my-cli': './cli.js',
			});
		});

		it('should handle bin paths with special characters', () => {
			const pkg = {
				name: 'test-pkg',
				bin: {
					'cli-1': './bin/cli-1.js',
					'cli_2': './bin/cli_2.js',
				},
			};
			const result = getPackageBins(pkg);
			assert.notStrictEqual(result, undefined);
			assert.notStrictEqual(result!['cli-1'], undefined);
			assert.notStrictEqual(result!.cli_2, undefined);
		});
	});

	describe('handlePackageBins edge cases', () => {
		it('should handle empty bins object', () => {
			const result = handlePackageBins({});
			assert.deepStrictEqual(result, {});
		});

		it('should handle bins with dot paths', () => {
			const bins = {
				'cli': './../cli.js',
			};
			const result = handlePackageBins(bins);
			assert.notStrictEqual(result.cli, undefined);
		});

		it('should handle bins with windows-style paths', () => {
			const bins = {
				'cli': 'bin\\\\cli.js',
			};
			const result = handlePackageBins(bins);
			assert.notStrictEqual(result.cli, undefined);
		});

		it('should handle resolveFn that throws error', () => {
			const bins = {
				'cli': 'cli.js',
			};
			const resolveFn = () => {
				throw new Error('Resolution failed');
			};

			assert.throws(() => handlePackageBins(bins, resolveFn), /Resolution failed/);
		});
	});

	describe('firstPackageBin edge cases', () => {
		it('should handle single bin', () => {
			const bins = {
				'only': './only.js',
			};
			const result = firstPackageBin(bins);
			assert.strictEqual(result, './only.js');
		});

		it('should handle bins with Symbol keys (ignored)', () => {
			const bins: Record<string, string> = {
				'valid': './valid.js',
			};
			// @ts-ignore - 添加 symbol 鍵測試
			bins[Symbol('invalid')] = './invalid.js';

			const result = firstPackageBin(bins);
			assert.strictEqual(result, './valid.js');
		});
	});

	describe('getPackageInfo edge cases', () => {
		it('should handle pkg with missing name', () => {
			const pkg = {
				version: '1.0.0',
			};
			// 當 pkg.name 不存在時，name 應該是 undefined
			const result = getPackageInfo({ pkg } as any);
			assert.strictEqual(result.pkg, pkg);
		});

		it('should handle deeply nested scoped package names', () => {
			const pkg = {
				name: '@org/scope/nested',
				bin: './cli.js',
			};
			const result = getPackageInfo({ pkg });
			assert.strictEqual(result.name, '@org/scope/nested');
		});
	});

	describe('_handleDefaultKey edge cases', () => {
		it('should handle empty string defaultKey', () => {
			const pkgInfo = {
				name: 'my-package',
				pkgRoot: '/path',
				pkg: {} as any,
			};
			const result = _handleDefaultKey(pkgInfo, '');
			assert.strictEqual(result, 'my-package');
		});

		it('should handle whitespace-only defaultKey', () => {
			const pkgInfo = {
				name: 'my-package',
				pkgRoot: '/path',
				pkg: {} as any,
			};
			// 空白字串的 length > 0，所以不會被忽略
			const result = _handleDefaultKey(pkgInfo, '   ');
			assert.strictEqual(result, '   ');
		});

		it('should handle package name with multiple slashes', () => {
			const pkgInfo = {
				name: 'a/b/c/d',
				pkgRoot: '/path',
				pkg: {} as any,
			};
			const result = _handleDefaultKey(pkgInfo, undefined);
			// pop() 會取得最後一個元素
			assert.strictEqual(result, 'd');
		});

		it('should handle package name that is just a scope', () => {
			const pkgInfo = {
				name: '@scope/',
				pkgRoot: '/path',
				pkg: {} as any,
			};
			const result = _handleDefaultKey(pkgInfo, undefined);
			assert.strictEqual(result, '');
		});
	});

	describe('Integration edge cases', () => {
		it('should handle circular path resolution', () => {
			const mockPkg = {
				name: 'test-pkg',
				bin: {
					'cli': './node_modules/.bin/cli',
				},
			};

			const bins = getPackageBins(mockPkg);
			assert.notStrictEqual(bins, undefined);
			assert.notStrictEqual(bins!.cli, undefined);
		});

		it('should handle very long bin paths', () => {
			const longPath = './' + 'a/'.repeat(100) + 'cli.js';
			const mockPkg = {
				name: 'test-pkg',
				bin: longPath,
			};

			const bins = getPackageBins(mockPkg);
			assert.notStrictEqual(bins, undefined);
			assert.strictEqual(bins!['test-pkg'], longPath);
		});

		it('should handle unicode in package names', () => {
			const mockPkg = {
				name: '我的套件',
				bin: './cli.js',
			};

			const bins = getPackageBins(mockPkg);
			assert.notStrictEqual(bins, undefined);
			assert.notStrictEqual(bins!['我的套件'], undefined);
		});
	});
});
