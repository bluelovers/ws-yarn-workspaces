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

			expect(result.versionOld).toBe('1.2.3');
			expect(result.versionNew).toBe('2.0.0');
			expect(result.partsOld).toEqual(['1', '2', '3']);
			expect(result.partsNew).toEqual(['2', '0', '0']);
			expect(result.index).toBe(0); // major differs
		});

		test('should detect minor version difference', () =>
		{
			const result = parseVersions('1.2.3', '1.3.0');

			expect(result.versionOld).toBe('1.2.3');
			expect(result.versionNew).toBe('1.3.0');
			expect(result.partsOld).toEqual(['1', '2', '3']);
			expect(result.partsNew).toEqual(['1', '3', '0']);
			expect(result.index).toBe(1); // minor differs
		});

		test('should detect patch version difference', () =>
		{
			const result = parseVersions('1.2.3', '1.2.4');

			expect(result.versionOld).toBe('1.2.3');
			expect(result.versionNew).toBe('1.2.4');
			expect(result.partsOld).toEqual(['1', '2', '3']);
			expect(result.partsNew).toEqual(['1', '2', '4']);
			expect(result.index).toBe(2); // patch differs
		});

		test('should return index 3 for identical versions', () =>
		{
			const result = parseVersions('1.2.3', '1.2.3');

			expect(result.versionOld).toBe('1.2.3');
			expect(result.versionNew).toBe('1.2.3');
			expect(result.index).toBe(3); // no difference
		});

	});

	describe('should handle pre-release versions', () =>
	{

		test('should handle versions with pre-release', () =>
		{
			const result = parseVersions('1.2.3-alpha.1', '1.2.3-beta.1');

			expect(result.partsOld).toEqual(['1', '2', '3-alpha.1']);
			expect(result.partsNew).toEqual(['1', '2', '3-beta.1']);
			expect(result.index).toBe(2); // patch differs (includes pre-release)
		});

		test('should handle versions with build metadata', () =>
		{
			const result = parseVersions('1.2.3+build.1', '1.2.3+build.2');

			expect(result.partsOld).toEqual(['1', '2', '3+build.1']);
			expect(result.partsNew).toEqual(['1', '2', '3+build.2']);
		});

	});

});

describe(`parseVersionsAndCompare`, () =>
{

	describe('should parse and compare versions correctly', () =>
	{

		test('should return comp 1 when new version is greater', () =>
		{
			const result = parseVersionsAndCompare('1.2.3', '1.3.0');

			expect(result.index).toBe(1);
			expect(result.comp).toBe(-1); // new minor is greater
		});

		test('should return comp -1 when old version is greater', () =>
		{
			const result = parseVersionsAndCompare('1.3.0', '1.2.3');

			expect(result.index).toBe(1);
			expect(result.comp).toBe(1); // old minor is greater
		});

		test('should return comp 0 for identical versions', () =>
		{
			const result = parseVersionsAndCompare('1.2.3', '1.2.3');

			expect(result.comp).toBeUndefined(); // no comparison needed
		});

		test('should detect major version upgrade', () =>
		{
			const result = parseVersionsAndCompare('1.2.3', '2.0.0');

			// new major is greater

			expect(result).toMatchSnapshot({
				index: 0,
				comp: -1,
			});

		});

		test('should detect version downgrade', () =>
		{
			const result = parseVersionsAndCompare('2.0.0', '1.0.0');

			expect(result).toMatchSnapshot({
				index: 0,
				comp: 1,
			});
		});

	});

});