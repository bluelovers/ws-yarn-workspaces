#!/usr/bin/env node

/**
 * NPM/Yarn 專案初始化 CLI 工具
 * NPM/Yarn Project Initialization CLI Tool
 * 
 * 提供互動式命令列介面來初始化新的 Node.js 專案，支援：
 * - 一般專案與 Monorepo Workspaces 專案
 * - 自動設定 package.json 欄位與腳本
 * - 整合 TypeScript、Jest、TSDX 等開發工具
 * - 自動生成 README.md 與配置檔案
 * 
 * Provides interactive CLI for initializing new Node.js projects, supporting:
 * - Regular projects and Monorepo Workspaces projects
 * - Automatic package.json field and script configuration
 * - Integration with TypeScript, Jest, TSDX and other dev tools
 * - Auto-generation of README.md and configuration files
 */

import yargs from 'yargs';
import { ensureDirSync, pathExistsSync } from 'fs-extra';
import { join, parse, relative, resolve } from 'upath2';
import { getConfig, parseStaticPackagesPaths } from 'workspaces-config';
import { PackageJsonLoader } from 'npm-package-json-loader';
import { IPackageJson } from '@ts-type/package-dts';
import { setupToYargs } from './lib/yargs-setting';
import { findRoot } from '@yarn-tool/find-root';
import { existsSync } from 'fs';
import { writeReadme } from '@yarn-tool/pkg-readme-tpl/lib/writeReadme';
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
import { fillDummyScripts } from '@yarn-tool/pkg-entry-util/lib/preset/scripts/dummy';
import { defaultRootScripts } from '@yarn-tool/pkg-entry-util/lib/preset/scripts/root-scripts';
import { defaultPkgNotOldExists } from '@yarn-tool/pkg-entry-util/lib/preset/scripts/pkg-scripts';
import { outputPackageJSONSync } from '@yarn-tool/write-package-json';
import { getRootCopyStaticFilesAuto } from '@yarn-tool/static-file/lib/root/getRootCopyStaticFiles';
import { EnumScriptsEntry, scriptsEntryIsNoTestSpecified } from '@yarn-tool/pkg-entry-util/lib/field/scripts';

// 更新通知器（已停用）/ Update notifier (disabled)
//updateNotifier(__dirname);

/**
 * 避免 IDE 緩衝區問題的權宜之計
 * Workaround to avoid IDE buffer issues
 */
console.length;

/**
 * 設定 Yargs CLI 實例
 * Setup Yargs CLI instance
 */
let cli = setupToYargs(yargs);

/**
 * 取得命令列位置參數
 * Get command line positional arguments
 */
let argv = cli.argv._;

// 除錯輸出（已停用）/ Debug output (disabled)
//console.dir(cli.argv);

/**
 * 解析工作目錄
 * Resolve working directory
 */
let cwd = resolve(cli.argv.cwd || process.cwd());

/**
 * 尋找專案根目錄資訊
 * Find project root information
 */
let rootData = findRoot({
	cwd,
	skipCheckWorkspace: cli.argv.skipCheckWorkspace,
});

/**
 * Workspaces 前綴路徑
 * Workspace prefix path
 */
let workspacePrefix: string;

/**
 * Workspaces 配置物件
 * Workspaces configuration object
 */
let workspacesConfig: ReturnType<typeof parseStaticPackagesPaths>

/**
 * Workspaces 專案實例
 * Workspaces project instance
 */
let wsProject: WorkspacesProject;

/**
 * 如果有 Workspaces，解析配置並建立專案實例
 * If workspaces exist, parse configuration and create project instance
 */
if (rootData?.hasWorkspace)
{
	workspacesConfig = parseStaticPackagesPaths(getConfig(rootData.ws));

	// 取得第一個前綴作為預設前綴 / Get first prefix as default prefix
	if (workspacesConfig.prefix.length)
	{
		workspacePrefix = workspacesConfig.prefix[0];
	}

	wsProject = new WorkspacesProject(rootData.ws)
}

/**
 * 取得目標目錄與名稱資訊
 * Get target directory and name information
 */
let { targetDir, targetName, scopedPackagePattern } = getTargetDir({
	// @ts-ignore
	inputName: argv.length && argv[0],
	cwd,
	targetName: cli.argv.name || null,
	hasWorkspace: rootData?.ws,
	workspacePrefix,
	workspacesConfig,
});

/**
 * 確保目標目錄存在
 * Ensure target directory exists
 */
ensureDirSync(targetDir);

/**
 * 收集命令列標誌參數（單字母選項）
 * Collect command line flag arguments (single-letter options)
 */
let flags = Object.keys(cli.argv)
	.reduce(function (a, f)
	{
		// 跳過特定選項 / Skip specific options
		if (f === 'silent' || f === 'y' || f === 'yes')
		{

		}
		// 收集單字母標誌 / Collect single-letter flags
		else if (/^[a-z]$/.test(f) && cli.argv[f])
		{
			a.push(f);
		}

		return a;
	}, [])
	.join('')
;

/**
 * 建構 npm init 命令參數
 * Build npm init command arguments
 */
let args = [
	'init',
	(flags && '-' + flags),
	cli.argv.createModule,
	cli.argv.yes && '-y',
].filter(v => v);

// 輸出命令參數（已停用）/ Output command arguments (disabled)
//console.log(args);

/**
 * Package.json 檔案路徑
 * Package.json file path
 */
const pkg_file_path = join(targetDir, 'package.json');

/**
 * 舊 Package 名稱（用於保留原名稱）
 * Old package name (for preserving original name)
 */
let old_pkg_name: string;

/**
 * 標記 Package.json 是否已存在
 * Flag indicating if package.json already exists
 */
const oldExists = existsSync(pkg_file_path);

/**
 * 舊 Package.json 內容
 * Old package.json content
 */
let old_pkg: IPackageJson;

/**
 * 驗證：已存在的 Package 不能指定新名稱
 * Validation: Existing packages cannot specify a new name
 */
if (oldExists && targetName?.length)
{
	console.error(`對於已存在的 Package 而言，禁止同時指定名稱`, targetName);
	console.error(pkg_file_path);
	process.exit(1);
}

/**
 * 驗證：檢查名稱是否已在 Workspaces 中存在
 * Validation: Check if name already exists in workspaces
 */
if (!oldExists && rootData?.hasWorkspace)
{
	if (nameExistsInWorkspaces(targetName))
	{
		console.error(`root:`, rootData.root)
		console.error(`目標名稱已存在於 Workspaces 內，請更換名稱:`, targetName);
		process.exit(1);
	}
}

/**
 * 處理內建模組名稱的特殊情況
 * Handle special case for builtin module names
 */
if (!oldExists && targetName && scopedPackagePattern && isBuiltinModule(basename(targetDir)))
{
	outputPackageJSONSync(pkg_file_path, {
		name: targetName,
	})
}
else if (!targetName)
{
	/**
	 * 嘗試讀取現有的 package.json
	 * Try to read existing package.json
	 */
	try
	{
		old_pkg = new PackageJsonLoader(pkg_file_path)?.data;

		old_pkg_name = old_pkg.name
	}
	catch (e)
	{
		// 忽略讀取錯誤 / Ignore read errors
	}
}

/**
 * 執行初始化並保留現有依賴項
 * Execute initialization while preserving existing dependencies
 */
let { cp } = initWithPreserveDeps({
	npmClient: cli.argv.npmClient,
	args,
	cwd: targetDir,
	old_pkg,
	pkg_file_path,
});

/**
 * 如果初始化成功，繼續後續設定
 * If initialization succeeded, continue with further configuration
 */
if (!cp.error)
{
	/**
	 * 重新尋找根目錄（因為可能已建立新結構）
	 * Re-find root directory (as new structure may have been created)
	 */
	rootData = findRoot({
		cwd: targetDir,
		skipCheckWorkspace: cli.argv.skipCheckWorkspace,
	});

	/**
	 * 驗證根目錄是否正確
	 * Validate root directory
	 */
	if (!rootData?.root)
	{
		console.error(`發生錯誤，初始化失敗`, targetName);
		console.error(targetDir);
		process.exit(1);
	}

	/**
	 * 載入 package.json
	 * Load package.json
	 */
	let pkg = new PackageJsonLoader(pkg_file_path);

	/**
	 * 如果 package.json 存在，進行詳細設定
	 * If package.json exists, perform detailed configuration
	 */
	if (pkg.exists())
	{
		/**
		 * 設定 private 標誌（非 yarn 時）
		 * Set private flag (when not using yarn)
		 */
		if (cli.argv['p'] && cli.argv.npmClient !== 'yarn')
		{
			pkg.data.private = true;
		}

		/**
		 * 防止 node- 前綴被 npm 移除的處理
		 * Handle preservation of node- prefix that npm might remove
		 */
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

		/**
		 * 檢查 Scoped Package 的發布配置
		 * Check publish configuration for scoped packages
		 */
		if (pkg.data.name && /^@/.test(pkg.data.name) && !pkg.data.publishConfig)
		{
			//pkg.data.publishConfig = {};
		}

		/**
		 * 初始化 scripts 欄位
		 * Initialize scripts field
		 */
		if (!pkg.data.scripts)
		{
			pkg.data.scripts = {};
		}

		/**
		 * 填充 Package 託管資訊（repository、bugs、homepage 等）
		 * Fill package hosting info (repository, bugs, homepage, etc.)
		 */
		fillPkgHostedInfo(pkg.data, {
			targetDir,
			rootData,
		});

		/**
		 * 設定 Package Manager（預設 Yarn）
		 * Set Package Manager (default to Yarn)
		 */
		pkg.data.packageManager ??= "yarn@1.22.19";

		/**
		 * 共享腳本範本
		 * Shared script templates
		 */
		let sharedScript: IPackageJson['scripts'] = {
			"test": `echo "Error: no test specified"`,
		};

		/**
		 * 填充虛擬佔位腳本
		 * Fill dummy placeholder scripts
		 */
		fillDummyScripts(sharedScript);

		/**
		 * Pre-version 腳本序列
		 * Pre-version script sequence
		 */
		let preScripts: string[] = ["echo preversion"];

		/**
		 * 設定 Root 專用的 prepublishOnly 腳本
		 * Set prepublishOnly script for root projects
		 */
		if (rootData.isRoot && !rootData.isWorkspace)
		{
			sharedScript.prepublishOnly = "yarn run preversion"
		}

		/**
		 * 根據專案類型合併對應的腳本範本
		 * Merge corresponding script templates based on project type
		 */
		if (rootData.hasWorkspace)
		{
			// Workspaces 專案不添加額外根腳本
			// Workspace projects don't add extra root scripts
		}
		else if (rootData.isRoot)
		{
			sharedScript = {
				...sharedScript,
				...defaultRootScripts(),
			}
		}

		/**
		 * 組合 Pre-version 腳本
		 * Compose pre-version scripts
		 */
		preScripts.push(EnumScriptsEntry.preversion);
		sharedScript.preversion = preScripts.join(' && ')

		/**
		 * 初始化 scripts 欄位（如果不存在）
		 * Initialize scripts field if not exists
		 */
		pkg.data.scripts ??= {};

		/**
		 * 處理新建立的 Package 腳本
		 * Handle scripts for newly created packages
		 */
		if (!oldExists)
		{
			/**
			 * 如果現有腳本是預設的無測試提示，且我們有測試腳本，則刪除舊的
			 * If existing script is default no-test message and we have a test script, remove old one
			 */
			if (scriptsEntryIsNoTestSpecified(pkg.data.scripts?.test) && sharedScript.test?.length > 0)
			{
				delete pkg.data.scripts!.test
			}

			/**
			 * 如果根專案使用 Jest，設定對應的測試腳本
			 * If root project uses Jest, set corresponding test script
			 */
			if (_findDeps(wsProject?.manifest, '@types/jest') || _findDeps(wsProject?.manifest, 'jest') || _findDeps(wsProject?.manifest, 'ts-jest'))
			{
				sharedScript.test = EnumScriptsEntry.JEST_TEST;
			}

			/**
			 * 合併預設腳本到新 Package
			 * Merge default scripts to new package
			 */
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
			/**
			 * 處理已存在的 Package 腳本
			 * Handle scripts for existing packages
			 */
			Object
				.entries(sharedScript)
				.forEach(([k, v]) =>
				{
					/**
					 * 跳過尾隨底線標記的重複腳本
					 * Skip duplicate scripts marked with trailing underscores
					 */
					if (k.endsWith('_') && pkg.data.scripts[k.replace(/_+$/, '')] === v)
					{
						return;
					}

					pkg.data.scripts[k] ??= v;
				})
			;

			/**
			 * 處理 TypeScript 型別定義路徑
			 * Handle TypeScript type definitions path
			 */
			if (!pkg.data.types || !pkg.data.typings)
			{
				pkg.data.types = pkg.data.types || pkg.data.typings;

				/**
				 * 自動偵測型別定義檔案位置
				 * Auto-detect type definition file location
				 */
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

			/**
			 * 保留舊 Package.json 中未被覆蓋的欄位
			 * Preserve fields from old package.json that weren't overwritten
			 */
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

		/**
		 * 為新 Package 添加預設依賴項
		 * Add default dependencies for new packages
		 */
		if (!oldExists)
		{
			const cpkg = require('./package.json') as IPackageJson;

			/**
			 * 尋找依賴項版本的輔助函式
			 * Helper function to find dependency version
			 */
			const findVersion = (name: string) =>
			{
				return cpkg.dependencies?.[name] || cpkg.devDependencies?.[name] || cpkg.peerDependencies?.[name] || "*"
			};

			// 初始化依賴項欄位 / Initialize dependency fields
			pkg.data.dependencies = pkg.data.dependencies || {};
			pkg.data.devDependencies = pkg.data.devDependencies || {};
			pkg.data.peerDependencies = pkg.data.peerDependencies || {};

			/**
			 * 為 Root 專案添加開發依賴項
			 * Add dev dependencies for root projects
			 */
			if (rootData.isRoot)
			{
				pkg.data.devDependencies['@bluelovers/tsconfig'] = findVersion('@bluelovers/tsconfig');
				pkg.data.devDependencies['@types/node'] = findVersion('@types/node');
			}

			// 添加 tslib 作為執行時依賴 / Add tslib as runtime dependency
			pkg.data.dependencies['tslib'] = findVersion('tslib');
		}

		/**
		 * 繼承 Root 專案的關鍵字
		 * Inherit keywords from root project
		 */
		if (wsProject && !rootData.isWorkspace)
		{
			const rootKeywords = wsProject.manifest.toJSON().keywords;

			if (!pkg.data.keywords?.length && rootKeywords?.length)
			{
				pkg.data.keywords = rootKeywords.slice()
			}
		}

		/**
		 * 添加工具標記關鍵字
		 * Add tool marker keyword
		 */
		pkg.data.keywords ??= [];
		pkg.data.keywords.push('create-by-yarn-tool');

		/**
		 * 取得要複製的靜態檔案映射
		 * Get static file mappings to copy
		 */
		let file_map = getRootCopyStaticFilesAuto({
			hasWorkspace: !!wsProject,
			isRoot: !wsProject,
		});

		/**
		 * README.md 檔案路徑
		 * README.md file path
		 */
		const mdFile = join(targetDir, 'README.md');

		/**
		 * 判斷是否需要生成 README
		 * Determine if README needs to be generated
		 */
		let existsReadme = !oldExists || !existsSync(mdFile);

		/**
		 * 如果啟用 TSDX，執行 TSDX 設定
		 * If TSDX is enabled, execute TSDX setup
		 */
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

		/**
		 * 排序 package.json 中的腳本
		 * Sort scripts in package.json
		 */
		pkg.data.scripts = sortPackageJsonScripts(pkg.data.scripts);

		/**
		 * 設定 sideEffects 為 false（優化 Tree Shaking）
		 * Set sideEffects to false (optimize Tree Shaking)
		 * @see https://juejin.cn/post/6844903640533041159
		 */
		pkg.data.sideEffects ??= false;

		/**
		 * 自動修復 package.json 常見問題
		 * Auto-fix common package.json issues
		 */
		pkg.autofix();

		/**
		 * 如果需要，對 package.json 進行排序
		 * Sort package.json if requested
		 */
		if (cli.argv.sort)
		{
			pkg.sort();
		}

		/**
		 * 只在有載入資料時寫入檔案
		 * Only write file when data was loaded
		 */
		pkg.writeOnlyWhenLoaded();

		/**
		 * 複製靜態範本檔案
		 * Copy static template files
		 */
		copyStaticFiles({
			cwd: targetDir,
			file_map,
		})

		/**
		 * 生成 README.md（如果需要）
		 * Generate README.md if needed
		 */
		if (existsReadme)
		{
			writeReadme({
				file: mdFile,
				variable: pkg.data,
			})
		}

		/**
		 * 將 Package 連結到 node_modules（Workspaces 專案）
		 * Link package to node_modules (for workspace projects)
		 */
		if (wsProject && !rootData.isWorkspace)
		{
			linkToNodeModules({
				cwd: targetDir,
				sourcePackagePath: targetDir,
				overwrite: true,
			})
		}

	}
}
else
{
	/**
	 * 初始化失敗，設定錯誤退出碼
	 * Initialization failed, set error exit code
	 */
	process.exitCode = 1;
}

/**
 * 在 Package 中尋找指定依賴項
 * Find specified dependency in package
 * 
 * @param pkg - Package.json 物件 / Package.json object
 * @param name - 依賴項名稱 / Dependency name
 * @returns 是否找到 / Whether found
 */
function _findDeps(pkg: IPackageJson, name: string)
{
	pkg ??= {};
	return pkg.dependencies?.[name] ?? pkg.devDependencies?.[name]
}
