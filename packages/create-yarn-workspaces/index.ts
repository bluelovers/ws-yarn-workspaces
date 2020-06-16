/**
 * Created by user on 2018/5/13/013.
 */

import findYarnWorkspaceRoot from 'find-yarn-workspace-root2';
import { resolve, join, basename, relative } from 'path';
import pkgDir from 'pkg-dir';
import console from 'debug-color2/logger';
import copyStaticFiles, { defaultCopyStaticFiles, IStaticFilesMapArray } from '@yarn-tool/static-file';
import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'fs-extra';
import sortPackageJson from 'sort-package-json3';

export interface IOptions
{
	cwd?: string,

	ignoreParentWorkspaces?: boolean,
	ignoreExistsPackage?: boolean,

	initPackageJson?<T = any>(current: ReturnType<typeof getDefaultPackageJson>): ReturnType<typeof getDefaultPackageJson> | ReturnType<typeof getDefaultPackageJson> & T,

	debug?: boolean,
}

export function createYarnWorkspaces(cwd?: string, options: IOptions = {})
{
	if (cwd && typeof cwd != 'string')
	{
		options = cwd;
		cwd = options.cwd;
	}

	if (!cwd)
	{
		cwd = process.cwd();
	}

	cwd = resolve(cwd);

	let root: string = pkgDir.sync(cwd);

	let ws: string;

	try
	{
		// @FIXME 一個奇怪的BUG 不使用 try 的話 在 NPX 底下就會出現無訊息的停止
		ws = findYarnWorkspaceRoot(root);
	}
	catch (e)
	{
		console.log(e.toString());

		ws = null;
	}

	let targetPath = resolve(root || cwd);

	options.debug && console.debug({
		targetPath,
		ws,
		options,
	});

	if (!options.ignoreExistsPackage && root)
	{
		console.error(`already have package at "${root}", or use ignoreExistsPackage for overwrite it`);

		return false;
	}
	else if (root)
	{
		console.warn(`ignore exists package "${root}"`);
	}

	if (ws)
	{
		let bool: boolean = true;

		console.warn(`detect exists workspace "${ws}"`);

		if (options.ignoreParentWorkspaces)
		{
			bool = isSamePath(targetPath, ws);

			if (!bool)
			{
				console.warn(`ignoreParentWorkspaces = true`);
			}
			else
			{
				console.error(`target path already is workspace`);
			}
		}

		if (bool)
		{
			return false;
		}
	}

	return _createYarnWorkspaces(targetPath);
}

export function isSamePath(p1: string, p2: string)
{
	if (p1 === p2)
	{
		return true;
	}
	else if (!p1 || !p2)
	{
		return false;
	}

	let s = relative(p1, p2);
	return (s === '.' || s === '');
}

export function _createYarnWorkspaces(targetPath: string, options: IOptions = {})
{
	console.info(`create in target path "${targetPath}"`);

	let pkg: ReturnType<typeof getDefaultPackageJson>;

	let lerna;

	{
		let file = join(targetPath, 'lerna.json');

		if (existsSync(file))
		{
			let json = JSON.parse(readFileSync(file).toString());

			if (json.packages && !Object.keys(json.packages).length)
			{
				json.packages = undefined;
			}

			lerna = json;
		}
	}

	let packages = lerna && lerna.packages || [
		"packages/*",
	];

	let file = join(targetPath, 'package.json');

	if (!existsSync(file))
	{
		let name = basename(targetPath);

		if (!existsSync(targetPath))
		{
			mkdirSync(targetPath);
		}

		pkg = Object.assign(getDefaultPackageJson(name), {
			name,
			workspaces: packages,
		});

		if (options.initPackageJson)
		{
			let ret = options.initPackageJson(pkg);

			if (ret)
			{
				pkg = ret;
			}
		}
	}
	else
	{
		let json = JSON.parse(readFileSync(file).toString());

		let workspaces;

		if (json.workspaces && Object.keys(json.workspaces).length)
		{
			workspaces = json.workspaces;

			// https://yarnpkg.com/blog/2018/02/15/nohoist/
			packages = workspaces.packages || workspaces;
		}
		else
		{
			workspaces = packages;
		}

		pkg = Object.assign(json, {
			"private": true,
			"workspaces": workspaces,
		});

		pkg.resolutions = pkg.resolutions || {};
	}

	let s = JSON.stringify(sortPackageJson(pkg), null, 2);
	writeFileSync(file, s);

	console.success(`create workspace package.json`);

	if (lerna && (packages != lerna.packages || lerna.npmClient !== 'yarn' || lerna.useWorkspaces !== true))
	{
		let file = join(targetPath, 'lerna.json');

		lerna.packages = packages;
		lerna.npmClient = 'yarn';
		lerna.useWorkspaces = true;

		let s = JSON.stringify(sortPackageJson(lerna), null, 2);
		writeFileSync(file, s);

		console.info(`update lerna.json`);
	}
	else if (0 && !lerna)
	{
		let file = join(targetPath, 'lerna.json');

		lerna = {
			"packages": packages,
			"command": {
				"publish": {
					"ignoreChanges": ["node_modules"],
					"message": "chore(release): publish"
				}
			},
			"npmClient": "yarn",
			"useWorkspaces": true,
			"version": "independent",
		};

		let s = JSON.stringify(sortPackageJson(lerna), null, 2);
		writeFileSync(file, s);

		console.success(`create lerna.json`);
	}

	/*
	if (!fs.existsSync(path.join(targetPath, 'tsconfig.json')))
	{
		fs.writeFileSync(path.join(targetPath, 'tsconfig.json'), JSON.stringify(getDefaultTsconfig(), null, 2));

		console.success(`create tsconfig.json`);
	}
	 */

	let file_map: IStaticFilesMapArray<string> = [
		['tsconfig.json', 'file/tsconfig.json.tpl'],
		['lerna.json', 'file/lerna.json.tpl'],
		...defaultCopyStaticFiles,
	]

	copyStaticFiles({
		cwd: targetPath,
		file_map,
	});

	createDirByPackages(targetPath, packages);

	return true;
}

export function getDefaultTsconfig()
{
	return {
		extends: "@bluelovers/tsconfig/esm/esModuleInterop"
	}
}

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
			"packages/*"
		],
		"scripts": {
			"lerna:publish": "ynpx --quiet lerna -- publish",
			"lerna:publish:yes": "ynpx --quiet lerna -- publish --yes --bump patch",
			"prepublishOnly:lockfile": "ynpx --quiet sync-lockfile",
			"prepare:fix-ws-links": "ynpx --quiet @yarn-tool/fix-ws-links",
			"ncu": "yarn run ncu:root && yarn run ncu:ws",
			"ncu:root": "ynpx --quiet yarn-tool -- ncu -u",
			"ncu:ws": "ynpx --quiet yarn-tool -- ws exec yarn-tool ncu -- -u",
			"sort-package-json": "yarn run sort-package-json:root && yarn run sort-package-json:ws",
			"sort-package-json:root": "ynpx --quiet yarn-tool -- sort",
			"sort-package-json:ws": "ynpx --quiet yarn-tool -- ws exec yarn-tool sort",
			"test": "ynpx --quiet yarn-tool -- ws run test"
		},
		"devDependencies": {
			"@bluelovers/tsconfig": "^1.0.19",
			"@types/node": "*",
		},
		"peerDependencies": {
			"lerna": "*",
			"yarn": "*",
			"@bluelovers/conventional-changelog-bluelovers": "*"
		},
		"resolutions": {}
	};
}

export function createDirByPackages(cwd: string, packages: string[])
{
	return packages.some(function (value)
	{
		let bool: boolean;

		let s = value.split(/[\/\\]/)[0];

		if (!/[!?\*{}\[\]]/.test(s))
		{
			let dir = join(cwd, s);

			if (!existsSync(dir))
			{
				mkdirSync(dir);
			}

			return true;
		}

		return bool;
	})
}

export default createYarnWorkspaces;
