/**
 * Created by user on 2018/5/13/013.
 */

import findYarnWorkspaceRoot from 'find-yarn-workspace-root2/core';
import { resolve, join, basename } from 'path';
import pkgDir from 'pkg-dir';
import console from 'debug-color2/logger';
import copyStaticFiles, { defaultCopyStaticFiles, IStaticFilesMapArray } from '@yarn-tool/static-file';
import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'fs-extra';
import sortPackageJson from 'sort-package-json3';
import { getDefaultPackageJson } from './lib';
import { isSamePath } from './lib/util';
import { ILernaJson } from '@ts-type/package-dts/lerna-json';
import { IPackageJson } from '@ts-type/package-dts/package-json';
import getWsCopyStaticFiles from './lib/wsCopyStaticFiles';

export * from './lib/index';
export * from './lib/util';

export interface IOptions
{
	cwd?: string,

	ignoreParentWorkspaces?: boolean,
	ignoreExistsPackage?: boolean,

	initPackageJson?<T extends Record<string, any> = {}>(current: IPackageJson): IPackageJson & T,

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

export function _createYarnWorkspaces(targetPath: string, options: IOptions = {})
{
	console.info(`create in target path "${targetPath}"`);

	let pkg: IPackageJson;

	let lerna: ILernaJson;

	{
		let file = join(targetPath, 'lerna.json');

		if (existsSync(file))
		{
			let json: ILernaJson = JSON.parse(readFileSync(file).toString());

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
		let json: IPackageJson = JSON.parse(readFileSync(file).toString());

		let workspaces: ILernaJson['packages'];

		if (json.workspaces && Object.keys(json.workspaces).length)
		{
			workspaces = json.workspaces;

			// https://yarnpkg.com/blog/2018/02/15/nohoist/
			// @ts-ignore
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

	/*
	if (!fs.existsSync(path.join(targetPath, 'tsconfig.json')))
	{
		fs.writeFileSync(path.join(targetPath, 'tsconfig.json'), JSON.stringify(getDefaultTsconfig(), null, 2));

		console.success(`create tsconfig.json`);
	}
	 */

	const file_map: IStaticFilesMapArray<string> = getWsCopyStaticFiles();

	copyStaticFiles({
		cwd: targetPath,
		file_map,
	});

	createDirByPackages(targetPath, packages);

	return true;
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
