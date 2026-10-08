/**
 * 測試字串化功能 / Test stringification functionality
 */
import { stringify, stringifyFull } from '../index';
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

describe(`stringify`, () =>
{

	describe('should stringify simple versions', () =>
	{

		test('should stringify a simple 3-part version', () =>
		{
			assert.strictEqual(stringify({
				major: '1',
				minor: '0',
				patch: '0',
			}), '1.0.0');
		});

		test('should stringify with default values', () =>
		{
			assert.strictEqual(stringify({
				major: '1',
			} as any), '1.0.0');
		});

	});

	describe('should stringify versions with pre-release', () =>
	{

		test('should stringify with pre-release', () =>
		{
			assert.strictEqual(stringify({
				major: '1',
				minor: '0',
				patch: '0',
				release: 'alpha.1',
			}), '1.0.0-alpha.1');
		});

		test('should stringify with complex pre-release', () =>
		{
			assert.strictEqual(stringify({
				major: '1',
				minor: '2',
				patch: '3',
				release: 'beta.2',
			}), '1.2.3-beta.2');
		});

	});

	describe('should stringify versions with build metadata', () =>
	{

		test('should stringify with build metadata', () =>
		{
			assert.strictEqual(stringify({
				major: '1',
				minor: '0',
				patch: '0',
				build: 'build.123',
			}), '1.0.0+build.123');
		});

		test('should stringify with pre-release and build', () =>
		{
			assert.strictEqual(stringify({
				major: '1',
				minor: '2',
				patch: '3',
				release: 'alpha.1',
				build: 'build.456',
			}), '1.2.3-alpha.1+build.456');
		});

	});

});

describe(`stringifyFull`, () =>
{

	describe('should stringify with operator', () =>
	{

		test('should stringify with >= operator', () =>
		{
			assert.strictEqual(stringifyFull({
				operator: '>=',
				major: '1',
				minor: '0',
				patch: '0',
			}), '>=1.0.0');
		});

		test('should stringify with ^ operator', () =>
		{
			assert.strictEqual(stringifyFull({
				operator: '^',
				major: '1',
				minor: '2',
				patch: '3',
			}), '^1.2.3');
		});

		test('should stringify with ~ operator', () =>
		{
			assert.strictEqual(stringifyFull({
				operator: '~',
				major: '2',
				minor: '0',
				patch: '0',
			}), '~2.0.0');
		});

		test('should stringify with < operator and pre-release', () =>
		{
			assert.strictEqual(stringifyFull({
				operator: '<',
				major: '2',
				minor: '0',
				patch: '0',
				release: 'beta.1',
			}), '<2.0.0-beta.1');
		});

	});

});