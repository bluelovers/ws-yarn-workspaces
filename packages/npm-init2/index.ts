#!/usr/bin/env node

import findYarnWorkspaceRoot from 'find-yarn-workspace-root2';
import yargs from 'yargs';
import crossSpawn from 'cross-spawn-extra';
import { ensureDirSync, CopyOptionsSync, copySync, pathExistsSync } from 'fs-extra';
import { resolve, join, relative } from 'upath2';
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
import sortPackageJsonScripts from 'sort-package-json-scripts';
import WorkspacesProject from '@yarn-tool/workspaces-project';
import { parse } from 'upath2';
import pathIsSame from 'path-is-same';


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
let isWorkspace = rootData.isWorkspace;

let workspacePrefix: string;
let workspacesConfig: ReturnType<typeof parseStaticPackagesPaths>

let wsProject: WorkspacesProject;

if (hasWorkspace)
{
	workspacesConfig = parseStaticPackagesPaths(getConfig(hasWorkspace));

	if (workspacesConfig.prefix.length)
	{
		workspacePrefix = workspacesConfig.prefix[0];
	}

	wsProject = new WorkspacesProject(hasWorkspace)
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
		if (cli.argv.p && cli.argv.npmClient !== 'yarn')
		{
			pkg.data.private = true;
		}

		// 防止 node- 被 npm 移除
		if (!cli.argv.yes && old_pkg_name && /^node-/.test(old_pkg_name) && ('node-' + pkg.data.name) === old_pkg_name)
		{
			pkg.data.name = old_pkg_name;
		}
		else if (cli.argv.yes && old_pkg_name && pkg.data.name !== old_pkg_name)
		{
			pkg.data.name = old_pkg_name;
		}
		else if (targetName && pkg.data.name !== targetName)
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
			"prepublishOnly:check-bin": "ynpx --quiet @yarn-tool/check-pkg-bin",
			"prepublishOnly:update": "yarn run ncu && yarn run sort-package-json",
			"ncu": "yarn-tool ncu -u",

			"sort-package-json": "yarn-tool sort",
			"test": `echo "Error: no test specified"`,

			"preversion": `echo preversion`,
		}

		let prepublishOnly = "yarn run prepublishOnly:check-bin && yarn run prepublishOnly:update && yarn run test";

		if (hasWorkspace)
		{
			prepublishOnly = "yarn run prepublishOnly:check-bin && yarn run test";

				sharedScript = {
				...sharedScript,
					"preversion": "yarn run prepublishOnly",
			}
		}
		else
		{
			sharedScript = {
				...sharedScript,
				"npm:publish": "npm publish",
				"npm:publish:lerna": "lerna publish --yes --bump patch",
				"postpublish:git:commit": `git commit -m "chore(release): publish" . & echo postpublish:git:commit`,
				"postpublish:git:tag": `ynpx --quiet @yarn-tool/tag`,
				"postpublish:changelog": `ynpx --quiet @yarn-tool/changelog && git add ./CHANGELOG.md`,
				"postpublish:git:push": `git push --follow-tags`,
				"postpublish_": `yarn run postpublish:changelog && yarn run postpublish:git:commit && yarn run postpublish:git:tag && yarn run postpublish:git:push`,
			}

			if (!oldExists)
			{
				sharedScript = {
					...sharedScript,
					"coverage": "nyc npm run test",
					"tsc:default": "tsc -p tsconfig.json",
					"tsc:esm": "tsc -p tsconfig.esm.json",
				}
			}
		}

		if (oldExists)
		{
			sharedScript.prepublishOnly_ = prepublishOnly
		}
		else
		{
			sharedScript.prepublishOnly = prepublishOnly
		}

		if (!oldExists)
		{
			if (pkg.data.scripts?.test === "echo \"Error: no test specified\" && exit 1" && sharedScript.test?.length > 0)
			{
				delete pkg.data.scripts.test
			}

			Object
				.entries({
					"test:mocha": "ynpx --quiet -p ts-node -p mocha mocha -- --require ts-node/register \"!(node_modules)/**/*.{test,spec}.{ts,tsx}\"",
					"test:jest": "ynpx --quiet jest -- --coverage",
					"lint": "ynpx --quiet eslint -- **/*.ts",

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

			if (!pkg.data.types || !pkg.data.typeings)
			{
				pkg.data.types = pkg.data.types || pkg.data.typeings;

				if (pkg.data.main && !pkg.data.types)
				{
					let file = join(targetDir, pkg.data.main)
					let parsed = parse(file);

					if (!pathIsSame(targetDir, parsed.dir) && pathExistsSync(join(parsed.dir, parsed.name + '.d.ts')))
					{
						pkg.data.types = relative(targetDir, parsed.dir).replace(/^\.\//, '') + '/' + parsed.name + '.d.ts'
					}
				}

				pkg.data.typeings = pkg.data.types;
			}

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

			pkg.data.dependencies = pkg.data.dependencies || {};
			pkg.data.devDependencies = pkg.data.devDependencies || {};
			pkg.data.peerDependencies = pkg.data.peerDependencies || {};

			if (!hasWorkspace || hasWorkspace && isWorkspace)
			{
				pkg.data.devDependencies['@bluelovers/tsconfig'] = findVersion('@bluelovers/tsconfig');
				pkg.data.devDependencies['@types/node'] = findVersion('@types/node');
			}
		}

		if (wsProject && !isWorkspace)
		{
			if (!pkg.data.keywords?.length && wsProject.manifest?.keywords?.length)
			{
				pkg.data.keywords = wsProject.manifest.keywords.slice()
			}
		}

		pkg.data.scripts = sortPackageJsonScripts(pkg.data.scripts);

		pkg.autofix();

		if (cli.argv.sort)
		{
			pkg.sort();
		}

		pkg.writeOnlyWhenLoaded();

		/*
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
		 */

		let mdFile = join(targetDir, 'README.md');

		if (!oldExists || !existsSync(mdFile))
		{
			writeReadme({
				file: join(targetDir, 'README.md'),
				variable: pkg.data,
			})
		}

		copyStaticFiles(defaultCopyStaticFiles, {
			cwd: targetDir,
		});

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
