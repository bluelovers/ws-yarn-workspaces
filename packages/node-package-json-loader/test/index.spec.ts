/**
 * Created by user on 2020/4/6.
 */

import PackageJsonLoader from '../index';
import { join } from "path";
import { outputJSON } from 'fs-extra';

it('should sort', function ()
{

	let pkg = new PackageJsonLoader(Buffer.from(JSON.stringify({
			"name": "npm-init2",
			"version": "1.0.56",
			"private": false,
			"description": "a lazy npm init for create new package, support yarn workspace. make we without use `mkdir xxx && cd xxx && [npm|yarn] init` with `npx npm-init2 xxx`",
			"keywords": [
				"cli",
				"init",
				"npm",
				"tool",
				"util",
				"yarn-tool",
				"workspace",
				"workspaces",
				"yarn"
			],
			"homepage": "https://github.com/bluelovers/npm-init2#readme",
			"bugs": {
				"url": "https://github.com/bluelovers/npm-init2/issues"
			},
			"repository": {
				"type": "git",
				"url": "git+https://github.com/bluelovers/npm-init2.git"
			},
			"license": "ISC",
			"author": "",
			"contributors": [],
			"main": "index.js",
			"bin": {
				"npm-init2": "bin/npm-init2.js"
			},
			"directories": {
				"lib": "lib"
			},
			"scripts": {
				"ncu": "npx yarn-tool ncu -u",
				"npm:publish": "npm publish",
				"postpublish_": "git commit -m \"chore(release): publish\" .",
				"prebuild:lockfile": "npx sync-lockfile .",
				"prepublishOnly": "yarn run ncu && yarn run sort-package-json",
				"sort-package-json": "npx yarn-tool sort",
				"test": "echo \"Error: no test specified\" && exit 1"
			},
			"config": {},
			"resolutions": {},
			"dependencies": {
				"@yarn-tool/find-root": "^1.0.5",
				"@yarn-tool/pkg-git-info": "^1.0.3",
				"@yarn-tool/static-file": "^1.0.17",
				"@yarn-tool/update-notifier": "^1.0.10",
				"cross-spawn-extra": "^2.0.0",
				"find-yarn-workspace-root2": "^1.2.8",
				"fs-extra": "^9.0.0",
				"json5": "^2.1.2",
				"npm-package-json-loader": "^1.0.7",
				"validate-npm-package-name": "^3.0.0",
				"workspaces-config": "^1.0.4",
				"yargs": "^15.3.1"
			},
			"devDependencies": {
				"@types/fs-extra": "^8.1.0",
				"@types/json5": "^0.0.30",
				"@types/validate-npm-package-name": "^3.0.0",
				"@types/yargs": "^15.0.4"
			},
			"bundleDependencies": [],
			"preferGlobal": true,
			"publishConfig": {},
			"gitHead": "764afbf30c0505cf214354e8f7efe703ce30ae98",
			"licenses": []
		}
	)));

	pkg.autofix();
	pkg.sort();

	let json = pkg.data;

	expectMatchSnapshot(json);

	outputJSON(join(__dirname, 'demo.json'), json, {
		spaces: 2
	})
});

function expectMatchSnapshot(actual)
{
	expect(actual).toMatchSnapshot();
	expect(Object.keys(actual)).toMatchSnapshot();
	expect(JSON.stringify(actual, null, 2)).toMatchSnapshot();
}
