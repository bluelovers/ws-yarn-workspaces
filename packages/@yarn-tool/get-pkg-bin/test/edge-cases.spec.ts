/**
 * @jest-environment node
 *
 * 邊界案例測試
 * Edge case tests for @yarn-tool/get-pkg-bin
 */

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
			expect(result).toEqual({
				'test-pkg': '',
			});
		});

		it('should handle bin as empty object', () => {
			const pkg = {
				name: 'test-pkg',
				bin: {},
			};
			const result = getPackageBins(pkg);
			expect(result).toEqual({});
		});

		it('should handle package name with scope', () => {
			const pkg = {
				name: '@org/my-cli',
				bin: './cli.js',
			};
			const result = getPackageBins(pkg);
			expect(result).toEqual({
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
			expect(result).toBeDefined();
			expect(result).toHaveProperty('cli-1');
			expect(result).toHaveProperty('cli_2');
		});
	});

	describe('handlePackageBins edge cases', () => {
		it('should handle empty bins object', () => {
			const result = handlePackageBins({});
			expect(result).toEqual({});
		});

		it('should handle bins with dot paths', () => {
			const bins = {
				'cli': './../cli.js',
			};
			const result = handlePackageBins(bins);
			expect(result).toHaveProperty('cli');
		});

		it('should handle bins with windows-style paths', () => {
			const bins = {
				'cli': 'bin\\\\cli.js',
			};
			const result = handlePackageBins(bins);
			expect(result).toHaveProperty('cli');
		});

		it('should handle resolveFn that throws error', () => {
			const bins = {
				'cli': 'cli.js',
			};
			const resolveFn = () => {
				throw new Error('Resolution failed');
			};

			expect(() => handlePackageBins(bins, resolveFn)).toThrow('Resolution failed');
		});
	});

	describe('firstPackageBin edge cases', () => {
		it('should handle single bin', () => {
			const bins = {
				'only': './only.js',
			};
			const result = firstPackageBin(bins);
			expect(result).toBe('./only.js');
		});

		it('should handle bins with Symbol keys (ignored)', () => {
			const bins: Record<string, string> = {
				'valid': './valid.js',
			};
			// @ts-ignore - 添加 symbol 鍵測試
			bins[Symbol('invalid')] = './invalid.js';

			const result = firstPackageBin(bins);
			expect(result).toBe('./valid.js');
		});
	});

	describe('getPackageInfo edge cases', () => {
		it('should handle pkg with missing name', () => {
			const pkg = {
				version: '1.0.0',
			};
			// 當 pkg.name 不存在時，name 應該是 undefined
			const result = getPackageInfo({ pkg } as any);
			expect(result.pkg).toBe(pkg);
		});

		it('should handle deeply nested scoped package names', () => {
			const pkg = {
				name: '@org/scope/nested',
				bin: './cli.js',
			};
			const result = getPackageInfo({ pkg });
			expect(result.name).toBe('@org/scope/nested');
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
			expect(result).toBe('my-package');
		});

		it('should handle whitespace-only defaultKey', () => {
			const pkgInfo = {
				name: 'my-package',
				pkgRoot: '/path',
				pkg: {} as any,
			};
			// 空白字串的 length > 0，所以不會被忽略
			const result = _handleDefaultKey(pkgInfo, '   ');
			expect(result).toBe('   ');
		});

		it('should handle package name with multiple slashes', () => {
			const pkgInfo = {
				name: 'a/b/c/d',
				pkgRoot: '/path',
				pkg: {} as any,
			};
			const result = _handleDefaultKey(pkgInfo, undefined);
			// pop() 會取得最後一個元素
			expect(result).toBe('d');
		});

		it('should handle package name that is just a scope', () => {
			const pkgInfo = {
				name: '@scope/',
				pkgRoot: '/path',
				pkg: {} as any,
			};
			const result = _handleDefaultKey(pkgInfo, undefined);
			expect(result).toBe('');
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
			expect(bins).toBeDefined();
			expect(bins).toHaveProperty('cli');
		});

		it('should handle very long bin paths', () => {
			const longPath = './' + 'a/'.repeat(100) + 'cli.js';
			const mockPkg = {
				name: 'test-pkg',
				bin: longPath,
			};

			const bins = getPackageBins(mockPkg);
			expect(bins).toBeDefined();
			expect(bins!['test-pkg']).toBe(longPath);
		});

		it('should handle unicode in package names', () => {
			const mockPkg = {
				name: '我的套件',
				bin: './cli.js',
			};

			const bins = getPackageBins(mockPkg);
			expect(bins).toBeDefined();
			expect(bins).toHaveProperty('我的套件');
		});
	});
});
