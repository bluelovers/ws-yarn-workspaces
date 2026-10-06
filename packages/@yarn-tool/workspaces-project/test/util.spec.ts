import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { checkPaths, EnumCheckPaths } from '../lib/util';
import { join } from 'path';

describe(`describe`, () =>
{
	let root = __dirname;

	test(`EnumCheckPaths.root`, () =>
	{
		let rootPath = join(root, 'xxxx');

		let actual = checkPaths({
			root,
			rootPath,
		});
		let expected = EnumCheckPaths.root;

		assert.strictEqual(actual, expected);
	});

	test(`EnumCheckPaths.rootPath`, () =>
	{
		let rootPath = join(root);

		let actual = checkPaths({
			root,
			rootPath,
		});
		let expected = EnumCheckPaths.rootPath;

		assert.strictEqual(actual, expected);
	});

	test(`failed`, () =>
	{
		let rootPath = join(root, '..');

		let actual = checkPaths({
			root,
			rootPath,
		});
		let expected = EnumCheckPaths.failed;

		assert.strictEqual(actual, expected);
	});

	test(`root is empty return EnumCheckPaths.rootPath`, () =>
	{
		let rootPath = join(root);

		let actual = checkPaths({
			root: '',
			rootPath,
		});
		let expected = EnumCheckPaths.rootPath;

		assert.strictEqual(actual, expected);
	});

	test(`rootPath is empty return EnumCheckPaths.failed`, () =>
	{
		let rootPath = '';

		let actual = checkPaths({
			root,
			rootPath,
		});
		let expected = EnumCheckPaths.failed;

		assert.strictEqual(actual, expected);
	});

	test(`empty return EnumCheckPaths.failed`, () =>
	{
		let rootPath = '';

		let actual = checkPaths({
			root: '',
			rootPath,
		});
		let expected = EnumCheckPaths.failed;

		assert.strictEqual(actual, expected);
	});

});

describe(`skipStrictCheck`, () =>
{
	let root = __dirname;

	let options = {
		skipStrictCheck: true,
	}

	test(`EnumCheckPaths.root`, () =>
	{
		let rootPath = join(root, 'xxxx');

		let actual = checkPaths({
			root,
			rootPath,
		}, options);
		let expected = EnumCheckPaths.root;

		assert.strictEqual(actual, expected);
	});

	test(`EnumCheckPaths.rootPath`, () =>
	{
		let rootPath = join(root);

		let actual = checkPaths({
			root,
			rootPath,
		}, options);
		let expected = EnumCheckPaths.rootPath;

		assert.strictEqual(actual, expected);
	});

	test(`failed => rootPath`, () =>
	{
		let rootPath = join(root, '..');

		let actual = checkPaths({
			root,
			rootPath,
		}, options);
		let expected = EnumCheckPaths.rootPath

		assert.strictEqual(actual, expected);
	});

	test(`root is empty return EnumCheckPaths.rootPath`, () =>
	{
		let rootPath = join(root);

		let actual = checkPaths({
			root: '',
			rootPath,
		}, options);
		let expected = EnumCheckPaths.rootPath;

		assert.strictEqual(actual, expected);
	});

	test(`rootPath is empty return EnumCheckPaths.failed`, () =>
	{
		let rootPath = '';

		let actual = checkPaths({
			root,
			rootPath,
		}, options);
		let expected = EnumCheckPaths.failed;

		assert.strictEqual(actual, expected);
	});

	test(`empty return EnumCheckPaths.failed`, () =>
	{
		let rootPath = '';

		let actual = checkPaths({
			root: '',
			rootPath,
		}, options);
		let expected = EnumCheckPaths.failed;

		assert.strictEqual(actual, expected);
	});

})
