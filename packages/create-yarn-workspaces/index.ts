/**
 * Created by user on 2018/5/13/013.
 */

import findYarnWorkspaceRoot from 'find-yarn-workspace-root2/core';
import { resolve, join, basename } from 'upath2';
import pkgDir from 'pkg-dir';
import { consoleLogger as console } from 'debug-color2/logger';
import { copyStaticFiles } from '@yarn-tool/static-file';
import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'fs-extra';
import { sortPackageJson } from 'sort-package-json3';
import { getDefaultPackageJson } from './lib';
import { isSamePath } from './lib/util';
import { ILernaJson } from '@ts-type/package-dts/lerna-json';
import { IPackageJson } from '@ts-type/package-dts/package-json';
import { getWsCopyStaticFiles } from '@yarn-tool/static-file/lib/ws/wsCopyStaticFiles';
import { findRootLazy } from '@yarn-tool/find-root';
import { normalize as pathNormalize } from 'upath2';

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

	cwd ??= process.cwd();

	const rootData = findRootLazy({
		cwd,
	});

	cwd = pathNormalize(rootData?.cwd ?? cwd);

	let root: string = rootData?.pkg;
	let ws: string = rootData?.ws;

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
		let bool: boolean = !isSamePath(targetPath, ws);

		console.warn(`detect exists workspace "${ws}"`);

		if (bool)
		{
			if (options.ignoreParentWorkspaces)
			{
				console.warn(`ignoreParentWorkspaces = true`);
				bool = false;
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

		Object.entries(getDefaultPackageJson(json.name))
			.forEach(([field, value]) => {

				if (field === 'scripts')
				{
					pkg.scripts ??= {};
					pkg.scripts = {
						...value,
						...pkg.scripts,
					}
				}
				else
				{
					pkg[field] ??= value
				}

			})
		;

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

	const file_map = getWsCopyStaticFiles();

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
