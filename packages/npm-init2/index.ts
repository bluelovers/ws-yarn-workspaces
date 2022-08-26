#!/usr/bin/env node

import yargs from 'yargs';
import { ensureDirSync, outputJSONSync, pathExistsSync } from 'fs-extra';
import { join, parse, relative, resolve } from 'upath2';
import { getConfig, parseStaticPackagesPaths } from 'workspaces-config';
import { PackageJsonLoader } from 'npm-package-json-loader';
import { IPackageJson } from '@ts-type/package-dts';
import { setupToYargs } from './lib/yargs-setting';
import { findRoot } from '@yarn-tool/find-root';
import { existsSync } from 'fs';
import { writeReadme } from './lib/writeReadme';
import { sortPackageJsonScripts } from 'sort-package-json-scripts';
import { WorkspacesProject } from '@yarn-tool/workspaces-project';
import { pathIsSame } from 'path-is-same';
import { linkToNodeModules } from '@yarn-tool/node-modules-link';
import { getTargetDir } from '@yarn-tool/init-path';
import { basename } from 'path';
import { isBuiltinModule } from '@yarn-tool/is-builtin-module';
import { initWithPreserveDeps } from './lib/initWithPreserveDeps';
import { IStaticFilesMapArray } from '@yarn-tool/static-file/lib/types';
import { defaultCopyStaticFiles, defaultCopyStaticFilesRootOnly } from '@yarn-tool/static-file/lib/const';
import { copyStaticFiles } from '@yarn-tool/static-file';
import { consoleLogger as console } from 'debug-color2/logger';
import { nameExistsInWorkspaces } from 'ws-pkg-list/lib/nameExistsInWorkspaces';
import { fillPkgHostedInfo } from '@yarn-tool/pkg-hosted-info';
import { setup as setupTsdx } from '@yarn-tool/setup-module-env/lib/preset/tsdx/index';
import { fillDummyScripts } from '@yarn-tool/pkg-entry-util/lib/preset/dummy';
import { defaultRootScripts } from '@yarn-tool/pkg-entry-util/lib/preset/root-scripts';
import { defaultPkgNotOldExists } from '@yarn-tool/pkg-entry-util/lib/preset/pkg-scripts';
import { outputPackageJSONSync } from '@yarn-tool/write-package-json';
import { getRootCopyStaticFilesAuto } from '@yarn-tool/static-file/lib/root/getRootCopyStaticFiles';
import { EnumScriptsEntry, scriptsEntryIsNoTestSpecified } from '@yarn-tool/pkg-entry-util/lib/field/scripts';

//updateNotifier(__dirname);

// avoid buf for idea
console.length;

let cli = setupToYargs(yargs);

let argv = cli.argv._;

//console.dir(cli.argv);

let cwd = resolve(cli.argv.cwd || process.cwd());

let rootData = findRoot({
	cwd,
	skipCheckWorkspace: cli.argv.skipCheckWorkspace,
});

let workspacePrefix: string;
let workspacesConfig: ReturnType<typeof parseStaticPackagesPaths>

let wsProject: WorkspacesProject;

if (rootData?.hasWorkspace)
{
	workspacesConfig = parseStaticPackagesPaths(getConfig(rootData.ws));

	if (workspacesConfig.prefix.length)
	{
		workspacePrefix = workspacesConfig.prefix[0];
	}

	wsProject = new WorkspacesProject(rootData.ws)
}

let { targetDir, targetName, scopedPackagePattern } = getTargetDir({
	// @ts-ignore
	inputName: argv.length && argv[0],
	cwd,
	targetName: cli.argv.name || null,
	hasWorkspace: rootData?.ws,
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

const pkg_file_path = join(targetDir, 'package.json');

let old_pkg_name: string;
const oldExists = existsSync(pkg_file_path);
let old_pkg: IPackageJson;

if (oldExists && targetName?.length)
{
	console.error(`對於已存在的 Package 而言，禁止同時指定名稱`, targetName);
	console.error(pkg_file_path);
	process.exit(1);
}

if (!oldExists && rootData?.hasWorkspace)
{
	if (nameExistsInWorkspaces(targetName))
	{
		console.error(`root:`, rootData.root)
		console.error(`目標名稱已存在於 Workspaces 內，請更換名稱:`, targetName);
		process.exit(1);
	}
}

if (!oldExists && targetName && scopedPackagePattern && isBuiltinModule(basename(targetDir)))
{
	outputPackageJSONSync(pkg_file_path, {
		name: targetName,
	})
}
else if (!targetName)
{
	try
	{
		old_pkg = new PackageJsonLoader(pkg_file_path)?.data;

		old_pkg_name = old_pkg.name
	}
	catch (e)
	{

	}
}

let { cp } = initWithPreserveDeps({
	npmClient: cli.argv.npmClient,
	args,
	cwd: targetDir,
	old_pkg,
	pkg_file_path,
});

if (!cp.error)
{
	rootData = findRoot({
		cwd: targetDir,
		skipCheckWorkspace: cli.argv.skipCheckWorkspace,
	});

	if (!rootData?.root)
	{
		console.error(`發生錯誤，初始化失敗`, targetName);
		console.error(targetDir);
		process.exit(1);
	}

	let pkg = new PackageJsonLoader(pkg_file_path);

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

		fillPkgHostedInfo(pkg.data, {
			targetDir,
			rootData,
		});

		pkg.data.packageManager ??= "yarn@1.22.19";

		let sharedScript: IPackageJson['scripts'] = {
			"prepublishOnly:update": "yarn run ncu && yarn run sort-package-json",
			"ncu": "yarn-tool ncu -u",
			"sort-package-json": "yarn-tool sort",
			"test": `echo "Error: no test specified"`,
			"tsc:showConfig": "ynpx get-current-tsconfig -p",
		};

		fillDummyScripts(sharedScript);

		let preScripts: string[] = ["echo preversion"];

		/*
		if (rootData.isRoot || rootData.hasWorkspace && !wsProject.manifest.scripts?.['prepublishOnly:check-bin'])
		{
			preScripts.push('yarn run prepublishOnly:check-bin');
		}
		 */

		if (rootData.isRoot && !rootData.isWorkspace)
		{
			sharedScript.prepublishOnly = "yarn run preversion"
		}

		if (rootData.hasWorkspace)
		{

		}
		else if (rootData.isRoot)
		{
			sharedScript = {
				...sharedScript,
				...defaultRootScripts(),
			}

			if (!oldExists)
			{
				sharedScript = {
					...sharedScript,
					"tsc:default": "tsc -p tsconfig.json",
					"tsc:esm": "tsc -p tsconfig.esm.json",
				}
			}
		}

		if (!oldExists)
		{
			sharedScript.coverage = "yarn run test -- --coverage"
		}

		preScripts.push(EnumScriptsEntry.preversion);
		sharedScript.preversion = preScripts.join(' && ')

		pkg.data.scripts ??= {};

		if (!oldExists)
		{

			if (scriptsEntryIsNoTestSpecified(pkg.data.scripts?.test) && sharedScript.test?.length > 0)
			{
				delete pkg.data.scripts!.test
			}

			if (_findDeps(wsProject?.manifest, '@types/jest') || _findDeps(wsProject?.manifest, 'jest') || _findDeps(wsProject?.manifest, 'ts-jest'))
			{
				sharedScript.test = EnumScriptsEntry.JEST_TEST;
			}

			Object
				.entries({
					...defaultPkgNotOldExists(),
					...sharedScript,
				})
				.forEach(([k, v]) =>
				{
					pkg.data.scripts[k] ??= v;
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

					pkg.data.scripts[k] ??= v;
				})
			;

			if (!pkg.data.types || !pkg.data.typings)
			{
				pkg.data.types = pkg.data.types || pkg.data.typings;

				if (pkg.data.main && !pkg.data.types)
				{
					let file = join(targetDir, pkg.data.main)
					let parsed = parse(file);

					if (!pathIsSame(targetDir, parsed.dir) && pathExistsSync(join(parsed.dir, parsed.name + '.d.ts')))
					{
						pkg.data.types = relative(targetDir, parsed.dir).replace(/^\.\//, '') + '/' + parsed.name + '.d.ts'
					}
				}

				pkg.data.typings = pkg.data.types;
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

		/*
		console.dir({
			sharedScript,
			scripts: pkg.data.scripts,
			oldExists,
			rootData,
			preScripts,
		})
		 */

		if (!oldExists)
		{
			const cpkg = require('./package.json') as IPackageJson;

			const findVersion = (name: string) =>
			{
				return cpkg.dependencies?.[name] || cpkg.devDependencies?.[name] || cpkg.peerDependencies?.[name] || "*"
			};

			pkg.data.dependencies = pkg.data.dependencies || {};
			pkg.data.devDependencies = pkg.data.devDependencies || {};
			pkg.data.peerDependencies = pkg.data.peerDependencies || {};

			if (rootData.isRoot)
			{
				pkg.data.devDependencies['@bluelovers/tsconfig'] = findVersion('@bluelovers/tsconfig');
				pkg.data.devDependencies['@types/node'] = findVersion('@types/node');
			}

			pkg.data.dependencies['tslib'] = findVersion('tslib');
		}

		if (wsProject && !rootData.isWorkspace)
		{
			const rootKeywords = wsProject.manifest.toJSON().keywords;

			if (!pkg.data.keywords?.length && rootKeywords?.length)
			{
				pkg.data.keywords = rootKeywords.slice()
			}
		}

		pkg.data.keywords ??= [];
		pkg.data.keywords.push('create-by-yarn-tool');

		let file_map = getRootCopyStaticFilesAuto({
			hasWorkspace: !!wsProject,
			isRoot: !wsProject,
		});

		let mdFile = join(targetDir, 'README.md');

		let existsReadme = !oldExists || !existsSync(mdFile);

		if (cli.argv.tsdx)
		{
			({
				file_map,
				existsReadme,
			} = setupTsdx({
				targetDir,
				rootData,
				pkg: pkg.data,
				file_map,
				mdFile,
				existsReadme,
				oldExists,
			}));
		}

		pkg.data.scripts = sortPackageJsonScripts(pkg.data.scripts);

		/**
		 * https://juejin.cn/post/6844903640533041159
		 */
		pkg.data.sideEffects ??= false;

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

		copyStaticFiles({
			cwd: targetDir,
			file_map,
		})

		if (existsReadme)
		{
			writeReadme({
				file: join(targetDir, 'README.md'),
				variable: pkg.data,
			})
		}

		if (wsProject && !rootData.isWorkspace)
		{
			linkToNodeModules({
				cwd: targetDir,
				sourcePackagePath: targetDir,
				overwrite: true,
			})
		}

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

function _findDeps(pkg: IPackageJson, name: string)
{
	pkg ??= {};
	return pkg.dependencies?.[name] ?? pkg.devDependencies?.[name]
}
