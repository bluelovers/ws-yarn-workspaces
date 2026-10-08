import { basename, extname } from 'path';
import { fillPkgHostedInfo } from '../index';
import assert from 'node:assert/strict';
import { test } from 'node:test';

test(`{}`, () =>
{

	let actual = fillPkgHostedInfo({});

	console.dir(actual);

	assert.strictEqual(typeof actual.homepage, 'string');
	assert.strictEqual(typeof actual.bugs.url, 'string');
	assert.strictEqual(typeof actual.repository.type, 'string');
	assert.strictEqual(typeof actual.repository.url, 'string');
	assert.strictEqual(actual.repository.directory, 'packages/@yarn-tool/pkg-hosted-info');

});
