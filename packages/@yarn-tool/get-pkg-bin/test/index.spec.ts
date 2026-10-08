/**
 * @jest-environment node
 *
 * @yarn-tool/get-pkg-bin 測試檔案
 * Test file for @yarn-tool/get-pkg-bin
 */

import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';

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
import { resolvePackage } from '@yarn-tool/require-resolve';

describe('@yarn-tool/get-pkg-bin', () => {
	describe('getPackageBins', () => {
		it('should handle string bin format', () => {
			const pkg = {
				name: 'my-cli',
				bin: './cli.js',
			};
			const result = getPackageBins(pkg);
			assert.deepStrictEqual(result, {
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
			assert.deepStrictEqual(result, {
				'tool-a': './bin/tool-a.js',
				'tool-b': './bin/tool-b.js',
			});
		});

		it('should return undefined when bin is not provided', () => {
			const pkg = {
				name: 'no-bin-package',
			};
			const result = getPackageBins(pkg);
			assert.strictEqual(result, undefined);
		});

		it('should return undefined when bin is null', () => {
			const pkg = {
				name: 'null-bin-package',
				bin: null,
			};
			const result = getPackageBins(pkg);
			assert.strictEqual(result, undefined);
		});
	});

	describe('handlePackageBins', () => {
		it('should normalize relative paths', () => {
			const bins = {
				'cli': 'cli.js',
				'tool': 'bin/tool.js',
			};
			const result = handlePackageBins(bins);
			assert.notStrictEqual(result.cli, undefined);
			assert.notStrictEqual(result.tool, undefined);
			// 路徑應該被正規化為相對路徑格式（以 ./ 開頭）
			assert.strictEqual(result.cli.startsWith('.'), true);
			assert.strictEqual(result.tool.startsWith('.'), true);
		});

		it('should use resolveFn when provided', () => {
			const bins = {
				'cli': 'cli.js',
			};
			const resolveFn = mock.fn((bin) => `/resolved${bin}`);
			const result = handlePackageBins(bins, resolveFn);

			assert.ok(resolveFn.mock.callCount() > 0);
			assert.ok(result.cli.includes('/resolved'));
		});

		it('should handle absolute paths', () => {
			const bins = {
				'cli': '/absolute/path/cli.js',
			};
			const result = handlePackageBins(bins);
			assert.strictEqual(result.cli, '/absolute/path/cli.js');
		});
	});

	describe('firstPackageBin', () => {
		it('should return the first bin path', () => {
			const bins = {
				'first': './first.js',
				'second': './second.js',
			};
			const result = firstPackageBin(bins);
			assert.strictEqual(result, './first.js');
		});

		it('should return undefined for empty bins', () => {
			const result = firstPackageBin({});
			assert.strictEqual(result, undefined);
		});

		it('should return undefined for null/undefined', () => {
			assert.strictEqual(firstPackageBin(null as any), undefined);
			assert.strictEqual(firstPackageBin(undefined as any), undefined);
		});
	});

	describe('getPackageInfo', () => {
		it('should get info from pkg object', () => {
			const pkg = {
				name: 'test-pkg',
				version: '1.0.0',
			};
			const result = getPackageInfo({ pkg });

			assert.strictEqual(result.name, 'test-pkg');
			assert.strictEqual(result.pkg, pkg);
			assert.strictEqual(result.pkgRoot, undefined);
		});

		it('should prefer options.name over pkg.name', () => {
			const pkg = {
				name: 'pkg-name',
			};
			const result = getPackageInfo({
				name: 'override-name',
				pkg,
			});

			assert.strictEqual(result.name, 'override-name');
		});

		it('should throw error when neither name nor pkg is provided', () => {
			assert.throws(() => getPackageInfo({} as any), /name or pkg is not valid/);
		});

		/**
		 * @todo fix me
		 */
		it('should resolve package by name', { skip: true }, () => {
			// 使用已知的套件進行測試
			const result = getPackageInfo({
				name: '@yarn-tool/get-pkg-bin',
				includeCurrentDirectory: true,
			});

			assert.strictEqual(result.name, '@yarn-tool/get-pkg-bin');
			assert.notStrictEqual(result.pkg, undefined);
			assert.notStrictEqual(result.pkgRoot, undefined);
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
			assert.strictEqual(result, 'custom-bin');
		});

		it('should infer from package name without scope', () => {
			const pkgInfo = {
				name: 'my-package',
				pkgRoot: '/path',
				pkg: {} as any,
			};
			const result = _handleDefaultKey(pkgInfo, undefined);
			assert.strictEqual(result, 'my-package');
		});

		it('should strip scope from package name', () => {
			const pkgInfo = {
				name: '@scope/my-package',
				pkgRoot: '/path',
				pkg: {} as any,
			};
			const result = _handleDefaultKey(pkgInfo, undefined);
			assert.strictEqual(result, 'my-package');
		});

		it('should return undefined for invalid package name', () => {
			const pkgInfo = {
				name: undefined as any,
				pkgRoot: '/path',
				pkg: {} as any,
			};
			const result = _handleDefaultKey(pkgInfo, undefined);
			assert.strictEqual(result, undefined);
		});
	});

	describe('_findDefaultPackageBinByBins', () => {
		it('should return matching bin by defaultKey', () => {
			const bins = {
				'my-cli': './my-cli.js',
				'other': './other.js',
			};
			const result = _findDefaultPackageBinByBins(bins, 'other');
			assert.strictEqual(result, './other.js');
		});

		it('should return first bin when defaultKey not found', () => {
			const bins = {
				'first': './first.js',
				'second': './second.js',
			};
			const result = _findDefaultPackageBinByBins(bins, 'not-exist');
			assert.strictEqual(result, './first.js');
		});

		it('should return first bin when defaultKey not provided', () => {
			const bins = {
				'first': './first.js',
				'second': './second.js',
			};
			const result = _findDefaultPackageBinByBins(bins, undefined);
			assert.strictEqual(result, './first.js');
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

			assert.notStrictEqual(result, undefined);
			assert.ok(Object.keys(result).length > 0);
			assert.notStrictEqual(result['test-bin'], undefined);
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

			assert.notStrictEqual(result, undefined);
			// 字串格式的 bin，鍵名是套件名稱
			assert.notStrictEqual(result['test-pkg'], undefined);
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

			assert.notStrictEqual(result, undefined);
			assert.strictEqual(typeof result, 'string');
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

			assert.notStrictEqual(result, undefined);
			assert.strictEqual(typeof result, 'string');
			assert.ok(result.includes('tool.js'));
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

				assert.notStrictEqual(bins, undefined);
				assert.ok(Object.keys(bins).length > 0);

				const defaultBin = defaultPackageBin({
					...tsNodeInfo,
				});

				assert.notStrictEqual(defaultBin, undefined);
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
			assert.notStrictEqual(bins, undefined);
			assert.strictEqual(Object.keys(bins!).length, 3);
			assert.notStrictEqual(bins!.bin1, undefined);
			assert.notStrictEqual(bins!.bin2, undefined);
			assert.notStrictEqual(bins!.bin3, undefined);
		});
	});
});
