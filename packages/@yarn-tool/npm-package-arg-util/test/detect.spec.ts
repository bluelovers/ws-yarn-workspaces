/**
 * @fileoverview Tests for type guard functions
 * @description 類型守衛函數的測試
 */

import { isURLResult } from '../lib/detect';
import {
	_lazyTestIsAliasResult,
	_lazyTestIsFileResult,
	_lazyTestIsRegistryResult,
	_lazyTestIsHostedGitResult,
	_lazyTestIsURLResult,
	_lazyTestNpmPackageArgResult001,
	_lazyTestNpaTypeGuard,
} from './lib/test';

/**
 * Tests for isAliasResult function
 * isAliasResult 函數的測試
 */
describe('isAliasResult', () =>
{
	test('should return true for alias packages', () =>
	{
		_lazyTestIsAliasResult('my-lodash@npm:lodash@4.17.21');
	});

	test('should return false for non-alias packages', () =>
	{
		_lazyTestIsAliasResult('lodash@4.17.21', null, false);
	});
});

/**
 * Tests for isFileResult function
 * isFileResult 函數的測試
 */
describe('isFileResult', () =>
{
	test('should return true for file packages', () =>
	{
		_lazyTestIsFileResult('./packages/my-pkg', {
			type: 'directory',
		});
	});

	test('should return true for directory packages', () =>
	{
		_lazyTestIsFileResult('../other-pkg', {
			type: 'directory',
		});
	});

	test('should return false for registry packages', () =>
	{
		_lazyTestIsFileResult('lodash@4.17.21', null, false);
	});
});

/**
 * Tests for isRegistryResult function
 * isRegistryResult 函數的測試
 */
describe('isRegistryResult', () =>
{
	test('should return true for version packages', () =>
	{
		_lazyTestIsRegistryResult('lodash@4.17.21', {
			type: 'version',
		});
	});

	test('should return true for range packages', () =>
	{
		_lazyTestIsRegistryResult('lodash@^4.17.0', {
			type: 'range',
		});
	});

	test('should return true for tag packages', () =>
	{
		_lazyTestIsRegistryResult('lodash@beta', {
			type: 'tag',
		});
	});

	test('should return true for packages without version (defaults to range)', () =>
	{
		_lazyTestIsRegistryResult('lodash', {
			type: 'range',
		});
	});

	test('should return false for git packages', () =>
	{
		_lazyTestIsRegistryResult('bluelovers/ws-yarn-workspaces', {
			type: 'git',
		}, false);
	});
});

/**
 * Tests for isHostedGitResult function
 * isHostedGitResult 函數的測試
 */
describe('isHostedGitResult', () =>
{
	test('should return true for GitHub shorthand', () =>
	{
		_lazyTestIsHostedGitResult('bluelovers/ws-yarn-workspaces', {
			type: 'git',
		});
	});

	test('should return true for GitHub URL', () =>
	{
		_lazyTestIsHostedGitResult('github:bluelovers/ws-yarn-workspaces', {
			type: 'git',
		});
	});

	test('should return false for registry packages', () =>
	{
		_lazyTestIsHostedGitResult('lodash@4.17.21', null, false);
	});
});

/**
 * Tests for isURLResult function
 * isURLResult 函數的測試
 */
describe('isURLResult', () =>
{
	test('should return false for GitHub shorthand (hosted)', () =>
	{
		// GitHub shorthand is hosted, not URL
		// GitHub 簡寫是託管的，不是 URL
		_lazyTestNpaTypeGuard('bluelovers/ws-yarn-workspaces', {
			propertyMatchers: {
				type: 'git',
			},
			actualExpected: false,
			fn: isURLResult,
		});
	});

	test('should return false for registry packages', () =>
	{
		_lazyTestNpaTypeGuard('lodash@4.17.21', {
			actualExpected: false,
			fn: isURLResult,
		});
	});
});

/**
 * Tests for isNpmPackageArgResult function
 * isNpmPackageArgResult 函數的測試
 */
describe('isNpmPackageArgResult', () =>
{
	test('should return true for registry packages', () =>
	{
		_lazyTestNpaTypeGuard('lodash@4.17.21');
	});

	test('should return true for git packages', () =>
	{
		_lazyTestNpaTypeGuard('bluelovers/ws-yarn-workspaces', {
			propertyMatchers: {
				type: 'git',
			}
		});
	});

	test('should return true for alias packages', () =>
	{
		_lazyTestNpaTypeGuard('my-lodash@npm:lodash@4.17.21');
	});

	test('should return true for file packages', () =>
	{
		_lazyTestNpaTypeGuard('./packages/my-pkg', {
			propertyMatchers: {
				type: 'directory',
			}
		});
	});
});