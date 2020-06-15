#!/usr/bin/env node

import findYarnWorkspaceRoot from 'find-yarn-workspace-root2';
import yargs from 'yargs';
import crossSpawn from 'cross-spawn-extra';
import { ensureDirSync, CopyOptionsSync, copySync } from 'fs-extra';
import { resolve, join, relative } from 'path';
import getConfig, { parseStaticPackagesPaths } from 'workspaces-config';
import PackageJsonLoader from 'npm-package-json-loader';
import { IPackageJson } from '@ts-type/package-dts';
import { updateNotifier } from '@yarn-tool/update-notifier';
import pkg = require( './package.json' );
import { copyStaticFiles, defaultCopyStaticFiles, getTargetDir } from './lib';
import setupToYargs from './lib/yargs-setting';
import { findRoot } from '@yarn-tool/find-root';
import { npmHostedGitInfo } from '@yarn-tool/pkg-git-info';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import lodashTemplate from 'lodash/template';
import { writeReadme } from './lib/writeReadme';

//updateNotifier(__dirname);

let cli = setupToYargs(yargs);

let argv = cli.argv._;

//console.dir(cli.argv);

let cwd = resolve(cli.argv.cwd || process.cwd());

let rootData = findRoot({
	cwd,
	skipCheckWorkspace: cli.argv.skipCheckWorkspace,
});

let hasWorkspace: string = rootData.ws;

let workspacePrefix: string;
let workspacesConfig: ReturnType<typeof parseStaticPackagesPaths>

if (hasWorkspace)
{
	workspacesConfig = parseStaticPackagesPaths(getConfig(hasWorkspace));

	if (workspacesConfig.prefix.length)
	{
		workspacePrefix = workspacesConfig.prefix[0];
	}
}

let { targetDir, targetName } = getTargetDir({
	inputName: argv.length && argv[0],
	cwd,
	targetName: cli.argv.name || null,
	hasWorkspace,
	workspacePrefix,
	workspacesConfig,
});

ensureDirSync(targetDir);

let flags = Object.keys(cli.argv)
	.reduce(function (a, f)
	{
		if (f === 'silent' || f === 'y' || f === 'yes')
		{

		}
		else if (/^[a-z]$/.test(f) && cli.argv[f])
		{
			a.push(f);
		}

		return a;
	}, [])
	.join('')
;

let args = [
	'init',
	(flags && '-' + flags),
	cli.argv.createModule,
	cli.argv.yes && '-y',
].filter(v => v);

//console.log(args);

let old_pkg_name: string;
let oldExists = existsSync(join(targetDir, 'package.json'));
let old_pkg: IPackageJson;

if (!targetName)
{
	try
	{
		old_pkg = new PackageJsonLoader(join(targetDir, 'package.json'))?.data;

		old_pkg_name = old_pkg.name
	}
	catch (e)
	{

	}
}

let cp = crossSpawn.sync(cli.argv.npmClient, args, {
	stdio: 'inherit',
	cwd: targetDir,
});

if (!cp.error)
{
	let pkg = new PackageJsonLoader(join(targetDir, 'package.json'));

	if (pkg.exists())
	{
		if (cli.argv.p && cli.argv.npmClient != 'yarn')
		{
			pkg.data.private = true;
		}

		// 防止 node- 被 npm 移除
		if (!cli.argv.yes && old_pkg_name && /^node-/.test(old_pkg_name) && ('node-' + pkg.data.name) === old_pkg_name)
		{
			pkg.data.name = old_pkg_name;
		}
		else if (cli.argv.yes && old_pkg_name && pkg.data.name != old_pkg_name)
		{
			pkg.data.name = old_pkg_name;
		}
		else if (targetName && pkg.data.name != targetName)
		{
			pkg.data.name = targetName;
		}

		if (pkg.data.name && /^@/.test(pkg.data.name) && !pkg.data.publishConfig)
		{
			//pkg.data.publishConfig = {};
		}

		if (!pkg.data.scripts)
		{
			pkg.data.scripts = {};
		}

		if (!pkg.data.homepage || !pkg.data.bugs || !pkg.data.repository)
		{
			try
			{
				let info = npmHostedGitInfo(targetDir);

				// @ts-ignore
				pkg.data.homepage = pkg.data.homepage || info.homepage

				if (hasWorkspace)
				{
					let u = new URL(pkg.data.homepage as string);

					u.pathname += '/tree/master/' + relative(hasWorkspace, targetDir);

					// @ts-ignore
					pkg.data.homepage = u.toString();
				}

				pkg.data.bugs = pkg.data.bugs || {
					url: info.bugs,
				}

				pkg.data.repository = pkg.data.repository || {
					"type": "git",
					url: info.repository,
				}
			}
			catch (e)
			{

			}
		}

		let sharedScript: IPackageJson['scripts'] = {
			"prepublishOnly:lockfile": "ynpx sync-lockfile",
			"prepublishOnly:check-bin": "ynpx @yarn-tool/check-pkg-bin",
			"prepublishOnly:update": "yarn run ncu && yarn run sort-package-json",
			"ncu": "ynpx yarn-tool -- ncu -u",
			"npm:publish": "npm publish",
			"npm:publish:lerna": "npx lerna publish --yes --bump patch",
			"sort-package-json": "ynpx yarn-tool -- sort",
			"prepublishOnly_": "yarn run prepublishOnly:update && yarn run prepublishOnly:check-bin && yarn run test",
			"postpublish_": `git commit -m "chore(release): publish" . & git push & echo postpublish`,
		}

		if (!oldExists)
		{
			Object
				.entries({
					"test:mocha": "npx mocha --require ts-node/register \"!(node_modules)/**/*.{test,spec}.{ts,tsx}\"",
					"test:jest": "jest --coverage",
					"lint": "npx eslint **/*.ts",
					"tsc:default": "tsc -p tsconfig.json",
					"tsc:esm": "tsc -p tsconfig.esm.json",
					"test": `echo "Error: no test specified" && exit 1`,
					...sharedScript,
				})
				.forEach(([k, v]) =>
				{
					if (pkg.data.scripts[k] == null)
					{
						pkg.data.scripts[k] = v;
					}
				})
			;
		}
		else
		{
			Object
				.entries(sharedScript)
				.forEach(([k, v]) =>
				{
					if (k.endsWith('_') && pkg.data.scripts[k.replace(/_+$/, '')] === v)
					{
						return;
					}

					if (pkg.data.scripts[k] == null)
					{
						pkg.data.scripts[k] = v;
					}
				})
			;

			if (old_pkg)
			{
				Object.keys(old_pkg)
					.forEach(key =>
					{
						if (!(key in pkg.data))
						{
							pkg.data[key] = old_pkg[key];
						}

					})
				;
			}
		}

		if (!oldExists)
		{
			const cpkg = require('./package.json');

			const findVersion = (name: string) =>
			{
				return cpkg.dependencies?.[name] || cpkg.devDependencies?.[name] || cpkg.peerDependencies?.[name] || "*"
			};

			pkg.data.devDependencies = pkg.data.devDependencies || {};

			pkg.data.devDependencies['@bluelovers/tsconfig'] = findVersion('@bluelovers/tsconfig');
			pkg.data.devDependencies['@types/node'] = findVersion('@types/node');
		}

		pkg.autofix();

		if (cli.argv.sort)
		{
			pkg.sort();
		}

		pkg.writeOnlyWhenLoaded();

		try
		{
			let copyOptions: CopyOptionsSync = {
				overwrite: false,
				preserveTimestamps: true,
				errorOnExist: false,
			};

			copySync(join(__dirname, 'lib/static'), targetDir, copyOptions);
		}
		catch (e)
		{

		}

		copyStaticFiles(defaultCopyStaticFiles, {
			cwd: targetDir,
		});

		(!oldExists) && writeReadme({
			file: join(targetDir, 'README.md'),
			variable: pkg.data,
		})

		/*
		fs.copySync(path.join(__dirname, 'lib/file/npmignore'), path.join(targetDir, '.npmignore'), copyOptions);

		fs.copySync(path.join(__dirname, 'lib/file/gitignore'), path.join(targetDir, '.gitignore'), copyOptions);

		if (!fs.pathExistsSync(path.join(targetDir, 'tsconfig.json')))
		{
			fs.copySync(path.join(__dirname, 'lib/file/tsconfig.json.tpl'), path.join(targetDir, 'tsconfig.json.tpl'), copyOptions);
		}
		 */

	}
}
else
{
	process.exitCode = 1;
}
