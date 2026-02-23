/**
 * 測試字串化功能 / Test stringification functionality
 */
import { stringify, stringifyFull } from '../index';

describe(`stringify`, () =>
{

	describe('should stringify simple versions', () =>
	{

		test('should stringify a simple 3-part version', () =>
		{
			expect(stringify({
				major: '1',
				minor: '0',
				patch: '0',
			})).toBe('1.0.0');
		});

		test('should stringify with default values', () =>
		{
			expect(stringify({
				major: '1',
			} as any)).toBe('1.0.0');
		});

	});

	describe('should stringify versions with pre-release', () =>
	{

		test('should stringify with pre-release', () =>
		{
			expect(stringify({
				major: '1',
				minor: '0',
				patch: '0',
				release: 'alpha.1',
			})).toBe('1.0.0-alpha.1');
		});

		test('should stringify with complex pre-release', () =>
		{
			expect(stringify({
				major: '1',
				minor: '2',
				patch: '3',
				release: 'beta.2',
			})).toBe('1.2.3-beta.2');
		});

	});

	describe('should stringify versions with build metadata', () =>
	{

		test('should stringify with build metadata', () =>
		{
			expect(stringify({
				major: '1',
				minor: '0',
				patch: '0',
				build: 'build.123',
			})).toBe('1.0.0+build.123');
		});

		test('should stringify with pre-release and build', () =>
		{
			expect(stringify({
				major: '1',
				minor: '2',
				patch: '3',
				release: 'alpha.1',
				build: 'build.456',
			})).toBe('1.2.3-alpha.1+build.456');
		});

	});

});

describe(`stringifyFull`, () =>
{

	describe('should stringify with operator', () =>
	{

		test('should stringify with >= operator', () =>
		{
			expect(stringifyFull({
				operator: '>=',
				major: '1',
				minor: '0',
				patch: '0',
			})).toBe('>=1.0.0');
		});

		test('should stringify with ^ operator', () =>
		{
			expect(stringifyFull({
				operator: '^',
				major: '1',
				minor: '2',
				patch: '3',
			})).toBe('^1.2.3');
		});

		test('should stringify with ~ operator', () =>
		{
			expect(stringifyFull({
				operator: '~',
				major: '2',
				minor: '0',
				patch: '0',
			})).toBe('~2.0.0');
		});

		test('should stringify with < operator and pre-release', () =>
		{
			expect(stringifyFull({
				operator: '<',
				major: '2',
				minor: '0',
				patch: '0',
				release: 'beta.1',
			})).toBe('<2.0.0-beta.1');
		});

	});

});