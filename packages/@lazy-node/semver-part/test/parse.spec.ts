/**
 * 測試版本解析功能 / Test version parsing functionality
 */
import { parseVersions, parseVersionsAndCompare } from '../lib/parse';
import _compare from 'semver/functions/compare';
import _cmp from 'semver/functions/cmp';
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

describe(`parseVersions`, () =>
{

	describe('should parse version differences correctly', () =>
	{

		test('should detect major version difference', (t) =>
		{
			const result = parseVersions('1.2.3', '2.0.0');

			t.assert.snapshot(result);
		});

		test('should detect minor version difference', (t) =>
		{
			const result = parseVersions('1.2.3', '1.3.0');

			t.assert.snapshot(result);
		});

		test('should detect patch version difference', (t) =>
		{
			const result = parseVersions('1.2.3', '1.2.4');

			t.assert.snapshot(result);
		});

		test('should return index 3 for identical versions', (t) =>
		{
			const result = parseVersions('1.2.3', '1.2.3');

			t.assert.snapshot(result);
		});

	});

	describe('should handle pre-release versions', () =>
	{

		test('should handle versions with pre-release', (t) =>
		{
			const result = parseVersions('1.2.3-alpha.1', '1.2.3-beta.1');

			t.assert.snapshot(result);
		});

		test('should handle versions with build metadata', (t) =>
		{
			const result = parseVersions('1.2.3+build.1', '1.2.3+build.2');

			t.assert.snapshot(result);
		});

	});

});

describe(`parseVersionsAndCompare`, () =>
{

	describe('should parse and compare versions correctly', () =>
	{

		test('should return comp -1 when new version is greater', (t) =>
		{
			const result = parseVersionsAndCompare('1.2.3', '1.3.0');

			t.assert.snapshot(result);
		});

		test('should return comp 1 when old version is greater', (t) =>
		{
			const result = parseVersionsAndCompare('1.3.0', '1.2.3');

			t.assert.snapshot(result);
		});

		test('should return comp 0 for identical versions', () =>
		{
			const result = parseVersionsAndCompare('1.2.3', '1.2.3');

			assert.strictEqual(result.comp, 0);
		});

		test('should detect major version upgrade', (t) =>
		{
			const result = parseVersionsAndCompare('1.2.3', '2.0.0');

			t.assert.snapshot(result);
		});

		test('should detect version downgrade', (t) =>
		{
			const result = parseVersionsAndCompare('2.0.0', '1.0.0');

			t.assert.snapshot(result);
		});

	});

});