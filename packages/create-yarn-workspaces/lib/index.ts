import { IPackageJson } from '@ts-type/package-dts/package-json';
import { defaultWorkspaceRootScripts } from '@yarn-tool/pkg-entry-util/lib/preset/scripts/ws-root-scripts';
import { fillDummyScripts } from '@yarn-tool/pkg-entry-util/lib/preset/scripts/dummy';

export function getDefaultPackageJson(name?: string): IPackageJson
{
	let json: IPackageJson = {
		"name": name,
		"version": "1.0.0",
		"private": true,
		"packageManager": "yarn@1.22.19",
		"workspaces": [
			"packages/*",
		],
		keywords: [
			"create-by-yarn-tool",
		],
		"scripts": defaultWorkspaceRootScripts(),
		"dependencies": {
			"ts-type": ">=3",
			"tslib": ">=2",
		},
		"devDependencies": {
			"@types/jest": "^29",
			"@bluelovers/tsconfig": "^1.0.32",
			"@types/node": "latest",
			"@yarn-tool/ws-find-up-paths": "*",
		},
		"peerDependencies": {
			"lerna": "*",
			"yarn": "*",
			"ynpx": "*",
			"typescript": "*",
			"ts-node": "*",
			"@yarn-tool/require-resolve": "*",
			"yarn-tool": "*",
			"@bluelovers/conventional-changelog-bluelovers": "*",
		},
		"resolutions": {},
	} as any;

	fillDummyScripts(json.scripts, 'workspaces');

	return json;
}

export function getDefaultTsconfig()
{
	return {
		extends: "@bluelovers/tsconfig/esm/mapfile.json",
	}
}
