import { IPackageJson } from '@ts-type/package-dts/package-json';
import { defaultWorkspaceRootScripts } from '@yarn-tool/pkg-entry-util/lib/preset/scripts/ws-root-scripts';
import { fillDummyScripts } from '@yarn-tool/pkg-entry-util/lib/preset/scripts/dummy';
import { dependencies, devDependencies, peerDependencies } from './package.demo.json';

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
		dependencies,
		devDependencies,
		peerDependencies,
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
