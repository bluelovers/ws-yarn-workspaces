export function getDefaultPackageJson(name?: string): {
	name: string;
	version: string;
	private: boolean;
	workspaces: string[];
	scripts: {
		[k: string]: string;
		test?: string;
	};
	resolutions: {
		[k: string]: string;
	};
	[k: string]: any;
}
{
	return {
		"name": name,
		"version": "1.0.0",
		"private": true,
		"workspaces": [
			"packages/*",
		],
		"scripts": {
			"lerna:publish": "ynpx --quiet lerna -- publish",
			"lerna:publish:yes": "ynpx --quiet lerna -- publish --yes --bump patch",
			"prepublishOnly:lockfile": "ynpx --quiet sync-lockfile",
			"prepare:fix-ws-links": "ynpx --quiet @yarn-tool/fix-ws-links",
			"ncu": "yarn run ncu:root && yarn run ncu:ws",
			"ncu:root": "yarn-tool -- ncu -u",
			"ncu:ws": "yarn-tool -- ws exec yarn-tool ncu -- -u",
			"sort-package-json": "yarn run sort-package-json:root && yarn run sort-package-json:ws",
			"sort-package-json:root": "yarn-tool -- sort",
			"sort-package-json:ws": "yarn-tool -- ws exec yarn-tool sort",
			"test": "yarn-tool -- ws run test",
		},
		"devDependencies": {
			"@bluelovers/tsconfig": "^1.0.19",
			"@types/node": "*",
		},
		"peerDependencies": {
			"lerna": "*",
			"yarn": "*",
			"@bluelovers/conventional-changelog-bluelovers": "*",
		},
		"resolutions": {},
	};
}

export function getDefaultTsconfig()
{
	return {
		extends: "@bluelovers/tsconfig/esm/mapfile.json",
	}
}
