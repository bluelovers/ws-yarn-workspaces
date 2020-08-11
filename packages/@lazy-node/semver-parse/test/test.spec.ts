import { deepOwnEqual } from './deepOwnEqual';
import * as semverutils from '..';
import { parse, parseRange } from '../index';

describe('parse', function ()
{

	it('should parse a simple 3-part version', function ()
	{
		deepOwnEqual(parse('1.0.0'), {
			semver: '1.0.0',
			version: '1.0.0',
			major: '1',
			minor: '0',
			patch: '0',
		});
	});

	it('should parse pre-release versions', function ()
	{
		deepOwnEqual(parse('1.0.0-alpha1'), {
			semver: '1.0.0-alpha1',
			version: '1.0.0',
			major: '1',
			minor: '0',
			patch: '0',
			release: 'alpha1',
		});
	});

	it('should parse build numbers', function ()
	{
		deepOwnEqual(parse('1.0.0+build-123'), {
			semver: '1.0.0+build-123',
			version: '1.0.0',
			major: '1',
			minor: '0',
			patch: '0',
			build: 'build-123',
		});
	});

	it('should not parse invalid versions', function ()
	{
		expect(parse('a.b.c')).toBeUndefined();
		expect(parse('1')).toBeUndefined();
		expect(parse('1.0')).toBeUndefined();
		expect(parse('1.0.0b')).toBeUndefined();
		expect(parse('1.0.0+build-abc.')).toBeUndefined();
	});

});

describe('parseRange', function ()
{

	it('should parse an exact version as a range', function ()
	{

		deepOwnEqual(parseRange('1.0.0'), [
			{
				semver: '1.0.0',
				major: '1',
				minor: '0',
				patch: '0',
			},
		]);
	});

	it('should ignore the v- prefix', function ()
	{

		deepOwnEqual(parseRange('v1.0.0'), [
			{
				semver: 'v1.0.0',
				major: '1',
				minor: '0',
				patch: '0',
			},
		]);
	});

	it('should parse a comparison operator', function ()
	{
		deepOwnEqual(parseRange('< v2.0.0'), [
			{
				semver: '< v2.0.0',
				operator: '<',
				major: '2',
				minor: '0',
				patch: '0',
			},
		]);
	});

	it('should parse tilde', function ()
	{
		deepOwnEqual(parseRange('~1.0.0'), [
			{
				semver: '~1.0.0',
				operator: '~',
				major: '1',
				minor: '0',
				patch: '0',
			},
		]);
	});

	it('should parse caret', function ()
	{
		deepOwnEqual(parseRange('^1.0.0'), [
			{
				semver: '^1.0.0',
				operator: '^',
				major: '1',
				minor: '0',
				patch: '0',
			},
		]);
	});

	it('should parse tilde and v- prefix', function ()
	{
		deepOwnEqual(parseRange('~v1.0.0'), [
			{
				semver: '~v1.0.0',
				operator: '~',
				major: '1',
				minor: '0',
				patch: '0',
			},
		]);
	});

	it('should parse ||', function ()
	{
		deepOwnEqual(parseRange('~1.0.0 || ~2.0.0'), [
			{
				semver: '~1.0.0',
				operator: '~',
				major: '1',
				minor: '0',
				patch: '0',
			}, {
				operator: '||',
			}, {
				semver: '~2.0.0',
				operator: '~',
				major: '2',
				minor: '0',
				patch: '0',
			},
		]);
	});

	it('should parse build numbers', function ()
	{
		deepOwnEqual(parseRange('2.0.0+build.1848'), [
			{
				semver: '2.0.0+build.1848',
				major: '2',
				minor: '0',
				patch: '0',
				build: 'build.1848',
			},
		]);
	});

	it('should parse pre-release versions', function ()
	{
		deepOwnEqual(parseRange('1.0.0-rc1'), [
			{
				semver: '1.0.0-rc1',
				major: '1',
				minor: '0',
				patch: '0',
				release: 'rc1',
			},
		]);
	});

	it('should parse pre-release versions with hyphens', function ()
	{

		deepOwnEqual(parseRange('1.0.0-rc-2'), [
			{
				semver: '1.0.0-rc-2',
				major: '1',
				minor: '0',
				patch: '0',
				release: 'rc-2',
			},
		]);
	});

	it('should parse hyphen ranges', function ()
	{
		deepOwnEqual(parseRange('1.0.0 - 1.0.x'), [
			{
				semver: '1.0.0',
				major: '1',
				minor: '0',
				patch: '0',
			}, {
				operator: '-',
			}, {
				semver: '1.0.x',
				major: '1',
				minor: '0',
				patch: 'x',
			},
		]);
	});

	it('should parse constrained * ranges', function ()
	{
		deepOwnEqual(parseRange('1.*'), [
			{
				semver: '1.*',
				major: '1',
				minor: '*',
			},
		]);
	});

	it('should parse constrained .x', function ()
	{
		deepOwnEqual(parseRange('1.x'), [
			{
				semver: '1.x',
				major: '1',
				minor: 'x',
			},
		]);
	});

	it('should parse ~> ranges', function ()
	{
		deepOwnEqual(parseRange('~> 2.0.0'), [
			{
				semver: '~> 2.0.0',
				operator: '~>',
				major: '2',
				minor: '0',
				patch: '0',
			},
		]);
	});

});
