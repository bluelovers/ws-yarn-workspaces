import { test } from 'node:test';
import { sortPackageJsonExports } from '../src/index';

test(`exports`, (t) =>
{
	let data = {
		"./k2": {

			// Entry-point for `require("my-package") in CJS
			"require": "./commonjs/index.cjs",
			// Entry-point for TypeScript resolution - must occur first!
			"types": "./types/index.d.ts",
			// Entry-point for `import "my-package"` in ESM
			"import": "./esm/index.js",
		},
		".": {
			// Entry-point for `import "my-package"` in ESM
			"import": "./esm/index.js",
			// Entry-point for TypeScript resolution - must occur first!
			"types": "./types/index.d.ts",
			// Entry-point for `require("my-package") in CJS
			"require": "./commonjs/index.cjs",
		},
	};

	let actual = sortPackageJsonExports(data);

	t.assert.snapshot(actual);
	t.assert.snapshot(JSON.stringify(actual, null, 2));

});

