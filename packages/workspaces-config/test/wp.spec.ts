/**
 * Created by user on 2020/4/6.
 */
import { parseWorkspaces, parseStaticPackagesPaths } from '../index';
import assert from 'node:assert/strict';
import { it } from 'node:test';

const data = [
	"packages/@yarn-tool/*",
	"packages/*",
]

it('should parseWorkspaces', function (t)
{
	let actual = parseWorkspaces(data)

	assert.deepStrictEqual(actual, {
		packages: [
			"packages/@yarn-tool/*",
			"packages/*",
		],
	})
	t.assert.snapshot(actual);
});

it('should parseWorkspaces v2', function (t)
{
	let actual = parseWorkspaces({ packages: data })

	assert.deepStrictEqual(actual, {
		packages: [
			"packages/@yarn-tool/*",
			"packages/*",
		],
	})
	t.assert.snapshot(actual);
});

it('should parseStaticPackagesPaths', function (t)
{
	let actual = parseStaticPackagesPaths(data)

	assert.deepStrictEqual(actual, {
		static: [],
		prefixRoot: ['packages', 'packages'],
		prefix: ['packages/@yarn-tool', 'packages'],
		prefixSub: ['@yarn-tool', ''],
		all: ['packages/@yarn-tool/*', 'packages/*'],
	})
	t.assert.snapshot(actual);
});
