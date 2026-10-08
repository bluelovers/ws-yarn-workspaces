import { array_unique } from 'array-hyper-unique';
import { defaultNpmScriptsOrder, omitKey } from '../lib/util';
import sortPackageJsonScripts from '../index';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { maybe } from 'node-test-maybe';

/**
 * TODO: 這個測試會卡住，無限執行中，先跳過...
 * 即使使用 timeout 也無法解決，可能是無限循環
 */
test(`sort sub level`, { skip: 0 as any, timeout: 500 }, (t: test.TestContext) =>
{
	let keys = new Set([
		...defaultNpmScriptsOrder.values(),

		"start",
		"dev",
		"restart",
		"stop",
		"coverage",
		"lint",
		"test",
		"install",
		"uninstall",
		"build",
		"link",
		"npm",
		"prepublish",
		"prepare",
		"prepublishOnly",
		"prepack",
		"pack",
		"postpack",
		"publish",
		"postpublish",
		"shrinkwrap",
		"version",

		"myscript",
		"_myscript",
		"_myscript_",
		"myscript_",
		"myscript:abc",
	]).values();

	let source = [...keys].slice()
		.reduce((a, k, i) =>
		{

			let { name, omitted, key } = omitKey(k);

			addPrefix(a, name, i);
			addPrefix(a, omitted, i);
			addPrefix(a, key, i);
			addPrefix(a, k, i);

			[
				// ...defaultNpmScriptsOrder.values(),
				'ci',
				'npm',
				'yarn',
				'pnpm',
				'lerna',
				'ws',
			]
				// .slice(0, -30)
				.forEach((kk) =>
				{

					addPrefix(a, name+':'+kk, i);
					addPrefix(a, omitted+':'+kk, i);
					addPrefix(a, key+':'+kk, i);
					addPrefix(a, k+':'+kk, i);

				})
			;

			return a
		}, {} as Record<string, string>);

	let actual = sortPackageJsonScripts(source)

	expectMatchSnapshot(actual, source, t)

	function addPrefix(scripts: Record<string, string>, key: string, index: number)
	{
		scripts[`pre${key}`] = `echo pre${key}`;
		scripts[`${key}`] = `echo ${key}`;
		scripts[`post${key}`] = `echo post${key}`;
	}

	t.assert.ok(true);
});

function expectStringify(actual, expected)
{
	assert.deepStrictEqual(actual, expected);
	assert.deepStrictEqual(JSON.stringify(actual, null, 2), JSON.stringify(expected, null, 2));
}

function expectMatchSnapshot(actual, fixture, t)
{
	t.assert.deepStrictEqual(actual, fixture);

	// expect(actual).toMatchSnapshot();
	t.assert.snapshot(Object.keys(actual));
	t.assert.snapshot(actual);
	// t.assert.snapshot(JSON.stringify(actual, null, 2));

	console.dir(actual)
}
