/**
 * 測試版本解析功能 / Test version parsing functionality
 */
import { parseVersions, parseVersionsAndCompare } from '../lib/parse';
import _compare from 'semver/functions/compare';
import _cmp from 'semver/functions/cmp';

describe(`parseVersions`, () =>
{

	describe('should parse version differences correctly', () =>
	{

		test('should detect major version difference', () =>
		{
			const result = parseVersions('1.2.3', '2.0.0');

			expect(result).toMatchSnapshot({
				versionOld: '1.2.3',
				versionNew: '2.0.0',
				partsOld: ['1', '2', '3'],
				partsNew: ['2', '0', '0'],
				index: 0,
			});
		});

		test('should detect minor version difference', () =>
		{
			const result = parseVersions('1.2.3', '1.3.0');

			expect(result).toMatchSnapshot({
				versionOld: '1.2.3',
				versionNew: '1.3.0',
				partsOld: ['1', '2', '3'],
				partsNew: ['1', '3', '0'],
				index: 1,
			});
		});

		test('should detect patch version difference', () =>
		{
			const result = parseVersions('1.2.3', '1.2.4');

			expect(result).toMatchSnapshot({
				versionOld: '1.2.3',
				versionNew: '1.2.4',
				partsOld: ['1', '2', '3'],
				partsNew: ['1', '2', '4'],
				index: 2,
			});
		});

		test('should return index 3 for identical versions', () =>
		{
			const result = parseVersions('1.2.3', '1.2.3');

			expect(result).toMatchSnapshot({
				versionOld: '1.2.3',
				versionNew: '1.2.3',
				index: 3,
			});
		});

	});

	describe('should handle pre-release versions', () =>
	{

		test('should handle versions with pre-release', () =>
		{
			const result = parseVersions('1.2.3-alpha.1', '1.2.3-beta.1');

			expect(result).toMatchSnapshot({
				partsOld: ['1', '2', '3-alpha.1'],
				partsNew: ['1', '2', '3-beta.1'],
				index: 2,
			});
		});

		test('should handle versions with build metadata', () =>
		{
			const result = parseVersions('1.2.3+build.1', '1.2.3+build.2');

			expect(result).toMatchSnapshot({
				partsOld: ['1', '2', '3+build.1'],
				partsNew: ['1', '2', '3+build.2'],
			});
		});

	});

});

describe(`parseVersionsAndCompare`, () =>
{

	describe('should parse and compare versions correctly', () =>
	{

		test('should return comp -1 when new version is greater', () =>
		{
			const result = parseVersionsAndCompare('1.2.3', '1.3.0');

			expect(result).toMatchSnapshot({
				index: 1,
				comp: -1, // 舊版本 < 新版本
			});
		});

		test('should return comp 1 when old version is greater', () =>
		{
			const result = parseVersionsAndCompare('1.3.0', '1.2.3');

			expect(result).toMatchSnapshot({
				index: 1,
				comp: 1, // 舊版本 > 新版本
			});
		});

		test('should return comp 0 for identical versions', () =>
		{
			const result = parseVersionsAndCompare('1.2.3', '1.2.3');

			expect(result).toMatchObject({
				comp: 0,
			});
		});

		test('should detect major version upgrade', () =>
		{
			const result = parseVersionsAndCompare('1.2.3', '2.0.0');

			expect(result).toMatchSnapshot({
				index: 0,
				comp: -1, // 舊版本 < 新版本
			});
		});

		test('should detect version downgrade', () =>
		{
			const result = parseVersionsAndCompare('2.0.0', '1.0.0');

			expect(result).toMatchSnapshot({
				index: 0,
				comp: 1, // 舊版本 > 新版本
			});
		});

	});

});
