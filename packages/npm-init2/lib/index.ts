/**
 * Created by user on 2018/11/28/028.
 */

import crossSpawn = require('cross-spawn-extra');
import JSON5 = require('json5');

import _validateNpmPackageName = require('validate-npm-package-name');
import fs = require('fs-extra');
import path = require('path');

import _copyStaticFiles, { defaultCopyStaticFiles } from '@yarn-tool/static-file';

export function npmVersion(npmClient?: string, cwd?: string)
{
	let args = [
		'version',
	];

	npmClient = npmClient || 'npm';

	if (npmClient === 'yarn')
	{
		args = [
			'versions',
		]
	}

	let cp = crossSpawn.sync(npmClient, args, {
		cwd,
		stripAnsi: true,
	});

	if (cp.error)
	{
		throw cp.error
	}

	let output = cp.stdout.toString()
		.replace(/^yarn versions [^\n]+$/gm, '')
		.replace(/^Done in [^\n]+$/gm, '')
		.replace(/^\s+|\s+$/g, '')
	;

	let json = JSON5.parse(output);

	return json
}

export function getTargetDir(options: {
	inputName: string,
	cwd: string,

	targetName?: string,
	hasWorkspace?: string,
	workspacePrefix?: string,
})
{
	let targetDir: string;
	let targetName: string = options.targetName || null;
	let { inputName, cwd, hasWorkspace, workspacePrefix } = options;

	if (hasWorkspace && !workspacePrefix)
	{
		throw new RangeError(`can't found workspace prefix`);
	}

	if (targetName)
	{
		validateNpmPackageName(targetName, true);
	}

	if (inputName)
	{
		targetName = targetName || inputName;

		let ret = validateNpmPackageName(inputName, true);
		let name = inputName;

		let basePath: string;

		if (hasWorkspace)
		{
			basePath = path.join(hasWorkspace, workspacePrefix);
		}
		else
		{
			basePath = cwd;
		}

		if (ret.scopedPackagePattern)
		{
			name = name
				.replace(/[\/\\]+/g, '_')
				.replace(/^@/g, '')
			;

			if (!fs.pathExistsSync(path.join(basePath, ret.subname)))
			{
				name = ret.subname;
			}
		}

		targetDir = path.resolve(basePath, name);

	}
	else
	{
		targetDir = cwd;
	}

	return {
		targetDir,
		targetName,
		cwd,
	}
}

const scopedPackagePattern = new RegExp('^(?:@([^/]+?)[/])?([^/]+?)$');

export function validateNpmPackageName(name: string, throwErr?: boolean)
{
	let ret: {
		validForNewPackages: boolean,
		validForOldPackages: boolean,
		scopedPackagePattern: boolean,
		warnings?: string[],
		errors?: string[],

		name: string,
		user?: string,
		subname?: string,

	} = _validateNpmPackageName(name);

	ret.name = name;

	if (!ret.errors || !ret.errors.length)
	{
		const nameMatch = name.match(scopedPackagePattern);

		if (nameMatch)
		{
			ret.scopedPackagePattern = true;

			ret.user = nameMatch[1];
			ret.subname = nameMatch[2];
		}
		else
		{
			ret.scopedPackagePattern = false;
		}
	}
	else if (throwErr)
	{
		throw new RangeError(ret.errors.concat(ret.warnings || []).join(' ; '));
	}

	return ret;
}

export { defaultCopyStaticFiles }

export function copyStaticFiles(file_map: Record<string, string> | [string, string, string?][], options: {
	cwd: string,
	staticRoot?: string,
	overwrite?: boolean,
})
{
	return _copyStaticFiles({
		...options,
		file_map,
	});
}
