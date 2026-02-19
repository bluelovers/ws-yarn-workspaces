/**
 * @yarn-tool/fix-all/lib/pkg
 *
 * package.json 自動修復處理模組
 * package.json auto-fix processing module
 *
 * 處理 workspace 中每個套件的迭代與修復
 * Handles the iteration and fixing of each package in the workspace
 */
import { IOptionsPkgListable, normalizeListableRowExtra, wsPkgListable, wsPkgListableFromPaths } from 'ws-pkg-list';
import { IFindRootReturnType, newFakeRootData } from '@yarn-tool/find-root';
import { PackageJsonLoader } from 'npm-package-json-loader';
import { pkgExportsVerify } from '@yarn-tool/pkg-entry-util';
import { AggregateErrorExtra } from 'lazy-aggregate-error';
// @ts-ignore
import Bluebird from 'bluebird';
import { createProgressEstimator } from '../util/cli-progress';
import { consoleLogger } from 'debug-color2/logger';
import { console } from 'debug-color2';
import { ProgressEstimator } from 'progress-estimator';
import { fillPkgHostedInfo, IFillPkgHostedInfoOptions } from '@yarn-tool/pkg-hosted-info';
import { ITSRequiredPick } from 'ts-type/lib/type/record';
import { sortPackageJson } from 'sort-package-json3';
import { fixPkgDepsVersionsCore, ICache, ICacheInput } from '@yarn-tool/fix-ws-versions';
import { packageJsonDependenciesFields } from '@ts-type/package-dts/lib/package-json/types';
import { normalizeDepsValue } from '@yarn-tool/normalize-deps-value';
import { getRootCopyStaticFilesAuto } from '@yarn-tool/static-file/lib/root/getRootCopyStaticFiles';
import { copyStaticFiles } from '@yarn-tool/static-file';
import { defaultPkgScripts } from '@yarn-tool/pkg-entry-util/lib/preset/scripts/pkg-scripts';
import { pathIsSame } from 'path-is-same';
import { isDummyEchoMaybeOrEmpty } from '@yarn-tool/pkg-entry-util/lib/util/scripts/dummy';
import { EnumScriptsEntry } from '@yarn-tool/pkg-entry-util/lib/field/scripts';
import { isTsdxPackage } from '@yarn-tool/setup-module-env/lib/preset/tsdx/is-tsdx';
import { fixTsdxPackage } from '@yarn-tool/setup-module-env/lib/preset/tsdx/fix';
import { _resetStaticFiles } from '../file/reset';
import { INpmAutoFixAll } from '../../index';
import { join } from 'upath2';
import { existsSync, statSync } from 'fs-extra';
import { writeReadme } from '@yarn-tool/pkg-readme-tpl/lib/writeReadme';

/**
 * 處理套件列表項目的 handler 函數
 * Handler function for processing package list entries
 *
 * @param {string} cwd - 當前工作目錄 / Current working directory
 * @param {Parameters<IOptionsPkgListable["handler"]>} argv - Handler 參數 / Handler arguments
 * @returns {object} 處理後的項目物件 / Processed entry object
 */
export function _handler(cwd: string, ...argv: Parameters<IOptionsPkgListable["handler"]>)
{
	return {
		...normalizeListableRowExtra(argv[0], cwd),
		pkg: argv[1],
	}
}

/**
 * _handler 返回的項目類型
 * Entry type returned by _handler
 */
export type IEntry = ReturnType<typeof _handler>

/**
 * 執行每個套件修復的選項
 * Options for running each package fix
 *
 * 繼承自 IFillPkgHostedInfoOptions 和 INpmAutoFixAll 的必要屬性
 * Inherits required properties from IFillPkgHostedInfoOptions and INpmAutoFixAll
 *
 * @extends {ITSRequiredPick<IFillPkgHostedInfoOptions & INpmAutoFixAll, ...>}
 */
export interface IOptionsRunEachPackages extends ITSRequiredPick<IFillPkgHostedInfoOptions & INpmAutoFixAll, 'overwriteHostedGitInfo' | 'branch' | 'rootData' | 'hostedGitInfo' | 'resetStaticFiles'>
{

}

/**
 * 執行單一套件修復的核心函數
 * Core function for fixing a single package
 *
 * 此函數負責對單一套件執行完整的修復流程，包括：
 * This function performs the complete fix process for a single package, including:
 * 1. 重置靜態檔案（如啟用）/ Reset static files (if enabled)
 * 2. 複製靜態檔案到套件目錄 / Copy static files to package directory
 * 3. 驗證套件匯出 / Verify package exports
 * 4. 填充託管 git 資訊 / Fill hosted git info
 * 5. 修復 tsdx 套件（如適用）/ Fix tsdx package (if applicable)
 * 6. 修復依賴版本 / Fix dependency versions
 * 7. 標準化依賴值 / Normalize dependency values
 * 8. 設定預設腳本 / Set default scripts
 * 9. 排序並寫入 package.json / Sort and write package.json
 *
 * @param {IEntry} row - 套件項目資料 / Package entry data
 * @param {IOptionsRunEachPackages} options - 修復操作的選項 / Options for the fix operation
 * @param {ICacheInput<IEntry>} cache - 依賴版本修復的快取 / Cache for dependency version fixing
 * @param {AggregateErrorExtra} err - 錯誤聚合器 / Error aggregator
 */
export function _runFixPackagesCore(row: IEntry, options: IOptionsRunEachPackages, cache: ICacheInput<IEntry>, err: AggregateErrorExtra)
{
	const {
		rootData,
		overwriteHostedGitInfo,
		hostedGitInfo,
		branch,
		resetStaticFiles,
	} = options;

	// 為套件建立假的根資料 / Create fake root data for the package
	const _rootDataFake = newFakeRootData(rootData, {
		pkg: row.location,
	});

	const { isRoot, isWorkspace } = _rootDataFake;

	// 載入 package.json / Load package.json
	const pkg = new PackageJsonLoader(row.manifestLocation);

	// 若選項啟用則重置靜態檔案 / Reset static files if option enabled
	if (resetStaticFiles)
	{
		_resetStaticFiles(_rootDataFake.pkg, {
			rootData: _rootDataFake,
		});
	}

	// 檢查 README.md 是否存在或檔案過小，若符合條件則標記需要生成
	// Check if README.md exists or file is too small, mark for generation if condition met
	const mdFile = join(row.location, 'README.md');
	let shouldWriteReadme = false;

	if (!existsSync(mdFile))
	{
		// README.md 不存在，需要生成 / README.md doesn't exist, needs generation
		shouldWriteReadme = true;
	}
	else
	{
		// 檢查檔案大小，若小於 1KB 則重新生成 / Check file size, regenerate if smaller than 1KB
		const stats = statSync(mdFile);
		if (stats.size < 1024)
		{
			shouldWriteReadme = true;
		}
	}

	// 複製靜態檔案到套件目錄 / Copy static files to package directory
	copyStaticFiles({
		cwd: row.location,
		file_map: getRootCopyStaticFilesAuto(_rootDataFake),
	});

	// 若 README.md 不存在或小於 1KB 則自動生成 / Auto-generate README.md if it doesn't exist or is smaller than 1KB
	if (shouldWriteReadme)
	{
		writeReadme({
			file: mdFile,
			variable: pkg.data,
		})
	}

	// 驗證套件匯出 / Verify package exports
	try
	{
		pkgExportsVerify(pkg.data, {
			cwd: row.location,
		});
	}
	catch (e)
	{
		err.push(e);
	}

	// 填充託管 git 資訊（homepage, repository, bugs）/ Fill hosted git info
	fillPkgHostedInfo(pkg.data, {
		targetDir: row.location,
		overwriteHostedGitInfo,
		hostedGitInfo,
		branch,
	});

	// 若適用則修復 tsdx 套件 / Fix tsdx package if applicable
	if (isTsdxPackage(pkg.data))
	{
		fixTsdxPackage(pkg.data, {
			rootData: _rootDataFake,
		});
	}

	// 修復依賴版本 / Fix dependency versions
	fixPkgDepsVersionsCore(pkg.data, cache);

	// 標準化依賴值 / Normalize dependency values
	packageJsonDependenciesFields
		.forEach(field => {

			Object.keys(pkg.data[field] ?? {})
				.forEach(name => {
					const _value = normalizeDepsValue(pkg.data[field][name]);
					pkg.data[field][name] = _value;
				})
			;

		})
	;

	// 設定預設腳本 / Set default scripts
	pkg.data.scripts = {
		...defaultPkgScripts(),
		...(pkg.data.scripts ?? {}),
	};

	// 處理根套件與非根套件 / Handle root vs non-root packages
	if (isRoot)
	{
		if (isWorkspace)
		{
			// Workspace 根套件 - 無特殊處理 / Workspace root - no special handling
		}
		else
		{
			// 單一套件根 - 無特殊處理 / Single package root - no special handling
		}
	}
	else
	{
		// 非根套件：修復 preversion 腳本並移除 packageManager
		// Non-root package: fix preversion script and remove packageManager
		if (!pkg.data.scripts['_preversion']?.length && isDummyEchoMaybeOrEmpty(pkg.data.scripts.preversion))
		{
			pkg.data.scripts.preversion = EnumScriptsEntry.preversion;
		}

		// 從非根套件移除 packageManager 欄位
		// Remove packageManager field from non-root packages
		if (pkg.data['packageManager'])
		{
			delete pkg.data['packageManager'];
		}
	}

	// 排序並寫入 package.json / Sort and write package.json
	pkg.data = sortPackageJson(pkg.data);

	pkg.autofix();
	pkg.write();
}

/**
 * 非同步執行每個套件的修復操作
 * Run fix operations on each package asynchronously
 *
 * 對每個套件執行以下操作：
 * Performs the following operations on each package:
 * 1. 驗證套件匯出 / Verify package exports
 * 2. 填充託管 git 資訊 / Fill hosted git info
 * 3. 修復 tsdx 套件（如適用）/ Fix tsdx package (if applicable)
 * 4. 修復依賴版本 / Fix dependency versions
 * 5. 標準化依賴值 / Normalize dependency values
 * 6. 設定預設腳本 / Set default scripts
 * 7. 排序並寫入 package.json / Sort and write package.json
 *
 * @param {IEntry[]} list - 套件項目列表 / List of package entries
 * @param {IOptionsRunEachPackages} options - 修復操作的選項 / Options for the fix operation
 * @returns {Bluebird<void>} Promise 物件 / Promise object
 */
export function _runEachPackagesAsync(list: IEntry[],
	options: IOptionsRunEachPackages,
)
{
	let logger: ProgressEstimator;
	// 依賴版本修復的快取 / Cache for dependency version fixing
	let cache: ICacheInput<IEntry> = {} as any;

	return Bluebird.resolve(list)
		.tap((listable) =>
		{
			// 建立進度估計器 / Create progress estimator
			logger = createProgressEstimator(options.rootData.root);

			consoleLogger.info(`auto check/fix packages`);

			cache.listable = listable;

		})
		.mapSeries(async (row) =>
		{
			// 錯誤收集器 / Error aggregator for collecting errors
			const err = new AggregateErrorExtra();

			const promiseLogger = logger((async () =>
			{

				_runFixPackagesCore(row, options, cache, err);

			})().catch(e => {
				e.row = row;
				err.push(e);
			}), row.name)

			return promiseLogger
				.catch(e => {
					e.row = row;
					err.push(e);
				})
				.then(() =>
				{
					// 若有錯誤則記錄 / Log errors if any
					if (err.length)
					{
						console.error(err);
					}
				})
		})
		;
}

/**
 * 從根資料初始化套件列表
 * Initialize package list from root data
 *
 * 根據 workspace 或單一套件模式返回要處理的套件列表
 * Returns list of packages to process based on workspace or single package mode
 *
 * @param {Pick<IFindRootReturnType, 'root' | 'hasWorkspace'>} rootData - 根資料物件 / Root data object
 * @returns {IEntry[]} 套件項目列表 / List of package entries
 */
export function _initPkgListableByRootData(rootData: Pick<IFindRootReturnType, 'root' | 'hasWorkspace'>)
{
	let cwd = rootData.root;

	// Workspace 模式：取得 workspace 中的所有套件
	// Workspace mode: get all packages in workspace
	if (rootData.hasWorkspace)
	{
		return wsPkgListable(cwd, {
			handler(...argv)
			{
				return _handler(cwd, ...argv)
			},
		})
	}

	// 單一套件模式：僅返回根套件
	// Single package mode: return only the root package
	return wsPkgListableFromPaths([
		cwd,
	], cwd, {
		handler(...argv)
		{
			return _handler(cwd, ...argv)
		},
	})
}
