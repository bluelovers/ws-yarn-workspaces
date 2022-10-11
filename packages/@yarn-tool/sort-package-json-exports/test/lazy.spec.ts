import { sortPackageJsonExports } from '../src/index';

test(`exports`, () =>
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

	expect(actual).toMatchSnapshot();
	expect(JSON.stringify(actual, null, 2)).toMatchSnapshot();

});

