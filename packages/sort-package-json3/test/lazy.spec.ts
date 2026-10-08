import { sortPackageJson } from '../index';
import { test } from 'node:test';

test(`exports`, (t) =>
{
	let data = {
		"name": "my-package",
		"type": "module",
		"exports": {
			".": {
				// Entry-point for TypeScript resolution - must occur first!
				"types": "./types/index.d.ts",
				// Entry-point for `import "my-package"` in ESM
				"import": "./esm/index.js",
				// Entry-point for `require("my-package") in CJS
				"require": "./commonjs/index.cjs",
			},
			"./k2": {

				// Entry-point for `require("my-package") in CJS
				"require": "./commonjs/index.cjs",
				// Entry-point for TypeScript resolution - must occur first!
				"types": "./types/index.d.ts",
				// Entry-point for `import "my-package"` in ESM
				"import": "./esm/index.js",
			},
		},
		// CJS fall-back for older versions of Node.js
		"main": "./commonjs/index.cjs",
		// Fall-back for older versions of TypeScript
		"types": "./types/index.d.ts",
	};

	let actual = sortPackageJson(data);

	t.assert.snapshot(actual);
	t.assert.snapshot(JSON.stringify(actual, null, 2));

});

