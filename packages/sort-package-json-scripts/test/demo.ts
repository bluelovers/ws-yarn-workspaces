import sortPackageJsonScripts from '../index';

let ret = sortPackageJsonScripts({

	"lint": "npx eslint *.ts",

	"npm:publish": "npm publish",

	"prepublish:lockfile": "npx sync-lockfile .",
	"tsc:esm": "tsc -p tsconfig.esm.json",
	"ncu": "npx yarn-tool ncu -u",
	"sort-package-json": "npx yarn-tool sort",
	"test": "jest --coverage",
	"coverage": "npx nyc yarn run test",
	"test:mocha": "npx mocha --require ts-node/register \"!(node_modules)/*.{test,spec}.{ts,tsx}\"",
	"tsc:default": "tsc -p tsconfig.json",

	"prepublishOnly": "yarn run ncu && yarn run sort-package-json && yarn run test",

	"postpublish_": "git commit -m \"chore(release): publish\" .",
})

console.log(ret)
/*
{
	coverage: 'npx nyc yarn run test',
		lint: 'npx eslint *.ts',
	test: 'jest --coverage',
	'test:mocha': 'npx mocha --require ts-node/register "!(node_modules)/*.{test,spec}.{ts,tsx}"',
	'npm:publish': 'npm publish',
	'prepublish:lockfile': 'npx sync-lockfile .',
	prepublishOnly: 'yarn run ncu && yarn run sort-package-json && yarn run test',
	postpublish_: 'git commit -m "chore(release): publish" .',
	ncu: 'npx yarn-tool ncu -u',
	'sort-package-json': 'npx yarn-tool sort',
	'tsc:default': 'tsc -p tsconfig.json',
	'tsc:esm': 'tsc -p tsconfig.esm.json'
}
 */
