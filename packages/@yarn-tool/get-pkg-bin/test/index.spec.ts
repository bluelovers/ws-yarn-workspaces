/**
 * @jest-environment node
 *
 * @yarn-tool/get-pkg-bin 測試檔案
 * Test file for @yarn-tool/get-pkg-bin
 */

import {
	normalizePackageBins,
	defaultPackageBin,
	_normalizePackageBinsCore,
	_defaultPackageBinCore,
	_findDefaultPackageBinByBins,
} from '../index';
import {
	getPackageBins,
	handlePackageBins,
	firstPackageBin,
	getPackageInfo,
	_handleDefaultKey,
} from '../util';
import { resolvePackage } from '@yarn-tool/resolve-package';

describe('@yarn-tool/get-pkg-bin', () => {
	describe('getPackageBins', () => {
		it('should handle string bin format', () => {
			const pkg = {
				name: 'my-cli',
				bin: './cli.js',
			};
			const result = getPackageBins(pkg);
			expect(result).toEqual({
				'my-cli': './cli.js',
			});
		});

		it('should handle object bin format', () => {
			const pkg = {
				name: 'my-toolkit',
				bin: {
					'tool-a': './bin/tool-a.js',
					'tool-b': './bin/tool-b.js',
				},
			};
			const result = getPackageBins(pkg);
			expect(result).toEqual({
				'tool-a': './bin/tool-a.js',
				'tool-b': './bin/tool-b.js',
			});
		});

		it('should return undefined when bin is not provided', () => {
			const pkg = {
				name: 'no-bin-package',
			};
			const result = getPackageBins(pkg);
			expect(result).toBeUndefined();
		});

		it('should return undefined when bin is null', () => {
			const pkg = {
				name: 'null-bin-package',
				bin: null,
			};
			const result = getPackageBins(pkg);
			expect(result).toBeUndefined();
		});
	});

	describe('handlePackageBins', () => {
		it('should normalize relative paths', () => {
			const bins = {
				'cli': 'cli.js',
				'tool': 'bin/tool.js',
			};
			const result = handlePackageBins(bins);
			expect(result).toHaveProperty('cli');
			expect(result).toHaveProperty('tool');
			// 路徑應該被正規化為相對路徑格式（以 ./ 開頭）
			expect(result.cli.startsWith('.')).toBe(true);
			expect(result.tool.startsWith('.')).toBe(true);
		});

		it('should use resolveFn when provided', () => {
			const bins = {
				'cli': 'cli.js',
			};
			const resolveFn = jest.fn((bin) => `/resolved${bin}`);
			const result = handlePackageBins(bins, resolveFn);

			expect(resolveFn).toHaveBeenCalled();
			expect(result.cli).toContain('/resolved');
		});

		it('should handle absolute paths', () => {
			const bins = {
				'cli': '/absolute/path/cli.js',
			};
			const result = handlePackageBins(bins);
			expect(result.cli).toBe('/absolute/path/cli.js');
		});
	});

	describe('firstPackageBin', () => {
		it('should return the first bin path', () => {
			const bins = {
				'first': './first.js',
				'second': './second.js',
			};
			const result = firstPackageBin(bins);
			expect(result).toBe('./first.js');
		});

		it('should return undefined for empty bins', () => {
			const result = firstPackageBin({});
			expect(result).toBeUndefined();
		});

		it('should return undefined for null/undefined', () => {
			expect(firstPackageBin(null as any)).toBeUndefined();
			expect(firstPackageBin(undefined as any)).toBeUndefined();
		});
	});

	describe('getPackageInfo', () => {
		it('should get info from pkg object', () => {
			const pkg = {
				name: 'test-pkg',
				version: '1.0.0',
			};
			const result = getPackageInfo({ pkg });

			expect(result.name).toBe('test-pkg');
			expect(result.pkg).toBe(pkg);
			expect(result.pkgRoot).toBeUndefined();
		});

		it('should prefer options.name over pkg.name', () => {
			const pkg = {
				name: 'pkg-name',
			};
			const result = getPackageInfo({
				name: 'override-name',
				pkg,
			});

			expect(result.name).toBe('override-name');
		});

		it('should throw error when neither name nor pkg is provided', () => {
			expect(() => getPackageInfo({} as any)).toThrow('name or pkg is not valid');
		});

		it('should resolve package by name', () => {
			// 使用已知的套件進行測試
			const result = getPackageInfo({
				name: '@yarn-tool/get-pkg-bin',
				includeCurrentDirectory: true,
			});

			expect(result.name).toBe('@yarn-tool/get-pkg-bin');
			expect(result.pkg).toBeDefined();
			expect(result.pkgRoot).toBeDefined();
		});
	});

	describe('_handleDefaultKey', () => {
		it('should return provided defaultKey', () => {
			const pkgInfo = {
				name: 'my-package',
				pkgRoot: '/path',
				pkg: {} as any,
			};
			const result = _handleDefaultKey(pkgInfo, 'custom-bin');
			expect(result).toBe('custom-bin');
		});

		it('should infer from package name without scope', () => {
			const pkgInfo = {
				name: 'my-package',
				pkgRoot: '/path',
				pkg: {} as any,
			};
			const result = _handleDefaultKey(pkgInfo, undefined);
			expect(result).toBe('my-package');
		});

		it('should strip scope from package name', () => {
			const pkgInfo = {
				name: '@scope/my-package',
				pkgRoot: '/path',
				pkg: {} as any,
			};
			const result = _handleDefaultKey(pkgInfo, undefined);
			expect(result).toBe('my-package');
		});

		it('should return undefined for invalid package name', () => {
			const pkgInfo = {
				name: undefined as any,
				pkgRoot: '/path',
				pkg: {} as any,
			};
			const result = _handleDefaultKey(pkgInfo, undefined);
			expect(result).toBeUndefined();
		});
	});

	describe('_findDefaultPackageBinByBins', () => {
		it('should return matching bin by defaultKey', () => {
			const bins = {
				'my-cli': './my-cli.js',
				'other': './other.js',
			};
			const result = _findDefaultPackageBinByBins(bins, 'other');
			expect(result).toBe('./other.js');
		});

		it('should return first bin when defaultKey not found', () => {
			const bins = {
				'first': './first.js',
				'second': './second.js',
			};
			const result = _findDefaultPackageBinByBins(bins, 'not-exist');
			expect(result).toBe('./first.js');
		});

		it('should return first bin when defaultKey not provided', () => {
			const bins = {
				'first': './first.js',
				'second': './second.js',
			};
			const result = _findDefaultPackageBinByBins(bins, undefined);
			expect(result).toBe('./first.js');
		});
	});

	describe('normalizePackageBins', () => {
		it('should normalize bins from pkg object with bin', () => {
			// 使用模擬的 package.json 物件進行測試
			const result = normalizePackageBins({
				name: 'test-pkg',
				pkg: {
					name: 'test-pkg',
					bin: {
						'test-bin': './bin/test.js',
					},
				},
				pkgRoot: '/mock/path',
				usePathResolve: true,
			});

			expect(result).toBeDefined();
			expect(Object.keys(result).length).toBeGreaterThan(0);
			expect(result).toHaveProperty('test-bin');
		});

		it('should normalize bins with string bin format', () => {
			const result = normalizePackageBins({
				name: 'test-pkg',
				pkg: {
					name: 'test-pkg',
					bin: './cli.js',
				},
				pkgRoot: '/mock/path',
				usePathResolve: true,
			});

			expect(result).toBeDefined();
			// 字串格式的 bin，鍵名是套件名稱
			expect(result).toHaveProperty('test-pkg');
		});
	});

	describe('defaultPackageBin', () => {
		it('should get default bin from pkg object', () => {
			const result = defaultPackageBin({
				name: 'my-cli',
				pkg: {
					name: 'my-cli',
					bin: './cli.js',
				},
				pkgRoot: '/mock/path',
				usePathResolve: true,
			});

			expect(result).toBeDefined();
			expect(typeof result).toBe('string');
		});

		it('should get default bin with custom defaultKey', () => {
			const result = defaultPackageBin(
				{
					name: 'my-pkg',
					pkg: {
						name: 'my-pkg',
						bin: {
							'cli': './cli.js',
							'tool': './tool.js',
						},
					},
					pkgRoot: '/mock/path',
					usePathResolve: true,
				},
				'tool'
			);

			expect(result).toBeDefined();
			expect(typeof result).toBe('string');
			expect(result).toContain('tool.js');
		});
	});

	describe('Integration tests', () => {
		it('should work with real package (ts-node)', () => {
			// 注意：此測試需要 ts-node 已安裝
			const tsNodeInfo = resolvePackage('ts-node', {
				includeGlobal: true,
				includeCurrentDirectory: true,
			});

			if (tsNodeInfo && tsNodeInfo.pkg) {
				const bins = normalizePackageBins({
					...tsNodeInfo,
				});

				expect(bins).toBeDefined();
				expect(Object.keys(bins).length).toBeGreaterThan(0);

				const defaultBin = defaultPackageBin({
					...tsNodeInfo,
				});

				expect(defaultBin).toBeDefined();
			}
		});

		it('should handle multiple bins correctly', () => {
			const mockPkg = {
				name: 'multi-bin-pkg',
				bin: {
					'bin1': './bin1.js',
					'bin2': './bin2.js',
					'bin3': './bin3.js',
				},
			};

			const bins = getPackageBins(mockPkg);
			expect(bins).toBeDefined();
			expect(Object.keys(bins!)).toHaveLength(3);
			expect(bins).toHaveProperty('bin1');
			expect(bins).toHaveProperty('bin2');
			expect(bins).toHaveProperty('bin3');
		});
	});
});
