/// <reference types="jest" />

import sortPackageJsonScripts from '../index';
import { defaultNpmScriptsOrder } from '../lib/util';

it('sort base', function ()
{
	const fixture = {
		test: 'node test.js',
		multiply: '2 * 3', // between p(ostinstall) and install
		watch: 'watch things',
		prewatch: 'echo "about to watch"',
		postinstall: 'echo "Installed"',
		start: 'node server.js',
		posttest: 'abc',
		pretest: 'xyz',
		postprettier: 'echo "so pretty"',
		preprettier: 'echo "not pretty"',
		prettier: 'prettier -l "**/*.js"',
		prepare: 'npm run build',
		'pre-fetch-info': 'foo',
	}

	const expected = {
		start: 'node server.js',
		pretest: 'xyz',
		test: 'node test.js',
		posttest: 'abc',
		postinstall: 'echo "Installed"',
		prepare: 'npm run build',
		multiply: '2 * 3',
		preprettier: 'echo "not pretty"',
		prettier: 'prettier -l "**/*.js"',
		postprettier: 'echo "so pretty"',
		'pre-fetch-info': 'foo',
		prewatch: 'echo "about to watch"',
		watch: 'watch things'
	}

	let actual = sortPackageJsonScripts(fixture)

	expect(actual).toStrictEqual(expected);

	expectMatchSnapshot(actual);
	expectStringify(actual, expected)
});

it('sort base v2', function ()
{
	const fixture = {
		test: 'node test.js',
		multiply: '2 * 3', // between p(ostinstall) and install
		watch: 'watch things',
		prewatch: 'echo "about to watch"',
		postinstall: 'echo "Installed"',
		start: 'node server.js',
		posttest: 'abc',
		pretest: 'xyz',
		_postprettier: 'echo "so pretty"',
		preprettier_: 'echo "not pretty"',
		prettier_: 'prettier -l "**/*.js"',
		prepare: 'npm run build',
		'pre-fetch-info': 'foo',
	}

	const expected = {
		start: 'node server.js',
		pretest: 'xyz',
		test: 'node test.js',
		posttest: 'abc',
		postinstall: 'echo "Installed"',
		prepare: 'npm run build',
		preprettier_: 'echo "not pretty"',
		prettier_: 'prettier -l "**/*.js"',
		_postprettier: 'echo "so pretty"',
		multiply: '2 * 3',
		'pre-fetch-info': 'foo',
		prewatch: 'echo "about to watch"',
		watch: 'watch things'
	}

	let actual = sortPackageJsonScripts(fixture)

	expect(actual).toStrictEqual(expected);

	expectMatchSnapshot(actual);
	expectStringify(actual, expected)
});

it('sort yarn-tool scripts', function ()
{
	const fixture = {
		"coverage": "npx nyc yarn run test",
		"lint": "npx eslint **/*.ts",
		"sort-package-json": "npx yarn-tool sort",
		"test:mocha": "npx mocha --require ts-node/register \"!(node_modules)/**/*.{test,spec}.{ts,tsx}\"",
		"tsc:default": "tsc -p tsconfig.json",
		"ncu": "npx yarn-tool ncu -u",
		"npm:publish": "npm publish",
		"postpublish_": "git commit -m \"chore(release): publish\" .",
		"prepublish:lockfile": "npx sync-lockfile .",
		"prepublishOnly_": "yarn run ncu && yarn run sort-package-json && yarn run test",
		"test": "echo \"Error: no test specified\" && exit 1",
		"tsc:esm": "tsc -p tsconfig.esm.json"
	}

	const fixture2 = {
		"coverage": "npx nyc yarn run test",
		"lint": "npx eslint **/*.ts",
		"ncu": "npx yarn-tool ncu -u",
		"npm:publish": "npm publish",
		"tsc:default": "tsc -p tsconfig.json",
		"_postpublish_": "git commit -m \"chore(release): publish\" .",
		"prepublish:lockfile": "npx sync-lockfile .",
		"tsc:esm": "tsc -p tsconfig.esm.json",
		"_prepublishOnly:": "yarn run ncu && yarn run sort-package-json && yarn run test",
		"sort-package-json": "npx yarn-tool sort",
		"test-": "echo \"Error: no test specified\" && exit 1",
		"test:mocha": "npx mocha --require ts-node/register \"!(node_modules)/**/*.{test,spec}.{ts,tsx}\"",


	}

	let actual = sortPackageJsonScripts(fixture)
	let actual2 = sortPackageJsonScripts(fixture2)

	expectMatchSnapshot(actual);
	expectMatchSnapshot(actual2);
});

it('should defaultNpmScriptsOrder', function ()
{
	let keys = [...defaultNpmScriptsOrder.values()];

	let source = keys.slice().reverse()
		.reduce((a, k, i) => {
			a[k] = i.toString();
			return a
		}, {} as Record<string, string>);

	let actual = sortPackageJsonScripts(source)

	expect(Object.keys(actual)).toStrictEqual(keys)

	expectMatchSnapshot(actual)

	source = keys.slice()
		.reduce((a, k, i) => {
			a[k] = i.toString();
			return a
		}, {} as Record<string, string>);

	actual = sortPackageJsonScripts(source)

	expect(Object.keys(actual)).toStrictEqual(keys)

	expectMatchSnapshot(actual)
});

function expectStringify(actual, expected)
{
	expect(actual).toStrictEqual(expected);
	expect(JSON.stringify(actual, null, 2)).toStrictEqual(JSON.stringify(expected, null, 2));
}

function expectMatchSnapshot(actual)
{
	expect(actual).toMatchSnapshot();
	expect(Object.keys(actual)).toMatchSnapshot();
	expect(JSON.stringify(actual, null, 2)).toMatchSnapshot();
}
