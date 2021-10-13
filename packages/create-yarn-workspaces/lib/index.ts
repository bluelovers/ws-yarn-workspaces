import { IPackageJson } from '@ts-type/package-dts/package-json';

export function getDefaultPackageJson(name?: string): IPackageJson
{
	return (<IPackageJson>{
		"name": name,
		"version": "1.0.0",
		"private": true,
		"packageManager": "yarn@^1.22.11",
		"workspaces": [
			"packages/*",
		],
		keywords: [],
		"scripts": {
			"preversion": "yt ws run test",
			"lerna:publish": "yarn run prepublishOnly:root && lerna publish && yarn run postpublishOnly",
			"lerna:publish:yes": "yarn run prepublishOnly:root && lerna publish --yes --bump patch && yarn run postpublishOnly",
			"prepublishOnly": "echo prepublishOnly",
			"prepublishOnly:root": "yarn run prepublishOnly:check-bin && yarn run prepare:fix-ws-links",
			"prepublishOnly:lockfile": "ynpx --quiet sync-lockfile",
			"prepublishOnly:check-bin": "ynpx --quiet @yarn-tool/check-pkg-bin",
			"prepare:fix-ws-links": "ynpx --quiet @yarn-tool/fix-ws-links",
			"prepublishOnly:update": "yarn run ncu && yarn run sort-package-json",
			"ncu": "yarn run ncu:root && yarn run ncu:ws",
			"ncu:root": "yarn-tool ncu -u",
			"ncu:ws": "yarn-tool ws exec yarn-tool ncu -- -u",
			"sort-package-json": "yarn run sort-package-json:root && yarn run sort-package-json:ws",
			"sort-package-json:root": "yarn-tool sort",
			"sort-package-json:ws": "yarn-tool ws sort",
			"postpublishOnly": "yarn run postpublishOnly:ws-root-changelog & echo postpublishOnly",
			"postpublishOnly:ws-root-changelog": "ynpx ws-root-changelog & git commit ./CHANGELOG.md -m \"chore(changelog): update changelog toc in workspaces root\" & echo update changelog toc in workspaces root",
			"test": "yarn-tool ws run test",
			"install:reset-lockfile": "yarn-tool install --reset-lockfile",
			"tsc:showConfig": "ynpx get-current-tsconfig -p",
		},
		"dependencies": {
			"ts-type":"^1.2.32",
			"tslib": "^2.3.0"
		},
		"devDependencies": {
			"@types/jest": "^26.0.24",
			"@bluelovers/tsconfig": "^1.0.20",
			"@types/node": "*",
		},
		"peerDependencies": {
			"lerna": "*",
			"yarn": "*",
			"ynpx": "*",
			"@yarn-tool/require-resolve": "*",
			"yarn-tool": "*",
			"@bluelovers/conventional-changelog-bluelovers": "*",
		},
		"resolutions": {},
	}) as any;
}

export function getDefaultTsconfig()
{
	return {
		extends: "@bluelovers/tsconfig/esm/mapfile.json",
	}
}
