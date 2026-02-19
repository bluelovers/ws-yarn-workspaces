"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._handler = _handler;
exports._runEachPackagesAsync = _runEachPackagesAsync;
exports._initPkgListableByRootData = _initPkgListableByRootData;
const tslib_1 = require("tslib");
/**
 * @yarn-tool/fix-all/lib/pkg
 *
 * package.json 自動修復處理模組
 * package.json auto-fix processing module
 *
 * 處理 workspace 中每個套件的迭代與修復
 * Handles the iteration and fixing of each package in the workspace
 */
const ws_pkg_list_1 = require("ws-pkg-list");
const find_root_1 = require("@yarn-tool/find-root");
const npm_package_json_loader_1 = require("npm-package-json-loader");
const pkg_entry_util_1 = require("@yarn-tool/pkg-entry-util");
const lazy_aggregate_error_1 = require("lazy-aggregate-error");
// @ts-ignore
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const cli_progress_1 = require("../util/cli-progress");
const logger_1 = require("debug-color2/logger");
const debug_color2_1 = require("debug-color2");
const pkg_hosted_info_1 = require("@yarn-tool/pkg-hosted-info");
const sort_package_json3_1 = require("sort-package-json3");
const fix_ws_versions_1 = require("@yarn-tool/fix-ws-versions");
const types_1 = require("@ts-type/package-dts/lib/package-json/types");
const normalize_deps_value_1 = require("@yarn-tool/normalize-deps-value");
const getRootCopyStaticFiles_1 = require("@yarn-tool/static-file/lib/root/getRootCopyStaticFiles");
const static_file_1 = require("@yarn-tool/static-file");
const pkg_scripts_1 = require("@yarn-tool/pkg-entry-util/lib/preset/scripts/pkg-scripts");
const dummy_1 = require("@yarn-tool/pkg-entry-util/lib/util/scripts/dummy");
const is_tsdx_1 = require("@yarn-tool/setup-module-env/lib/preset/tsdx/is-tsdx");
const fix_1 = require("@yarn-tool/setup-module-env/lib/preset/tsdx/fix");
const reset_1 = require("../file/reset");
/**
 * 處理套件列表項目的 handler 函數
 * Handler function for processing package list entries
 *
 * @param {string} cwd - 當前工作目錄 / Current working directory
 * @param {Parameters<IOptionsPkgListable["handler"]>} argv - Handler 參數 / Handler arguments
 * @returns {object} 處理後的項目物件 / Processed entry object
 */
function _handler(cwd, ...argv) {
    return {
        ...(0, ws_pkg_list_1.normalizeListableRowExtra)(argv[0], cwd),
        pkg: argv[1],
    };
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
function _runEachPackagesAsync(list, options) {
    const { rootData, overwriteHostedGitInfo, hostedGitInfo, branch, resetStaticFiles, } = options;
    let logger;
    // 依賴版本修復的快取 / Cache for dependency version fixing
    let cache = {};
    return bluebird_1.default.resolve(list)
        .tap((listable) => {
        // 建立進度估計器 / Create progress estimator
        logger = (0, cli_progress_1.createProgressEstimator)(rootData.root);
        logger_1.consoleLogger.info(`auto check/fix packages`);
        cache.listable = listable;
    })
        .mapSeries(async (row) => {
        // 錯誤收集器 / Error aggregator for collecting errors
        const err = new lazy_aggregate_error_1.AggregateErrorExtra();
        const promiseLogger = logger((async () => {
            var _a, _b;
            // 為套件建立假的根資料 / Create fake root data for the package
            const _rootDataFake = (0, find_root_1.newFakeRootData)(rootData, {
                pkg: row.location,
            });
            const { isRoot, isWorkspace } = _rootDataFake;
            // 載入 package.json / Load package.json
            const pkg = new npm_package_json_loader_1.PackageJsonLoader(row.manifestLocation);
            // 若選項啟用則重置靜態檔案 / Reset static files if option enabled
            if (resetStaticFiles) {
                (0, reset_1._resetStaticFiles)(_rootDataFake.pkg, {
                    rootData: _rootDataFake,
                });
            }
            // 複製靜態檔案到套件目錄 / Copy static files to package directory
            const file_map = (0, getRootCopyStaticFiles_1.getRootCopyStaticFilesAuto)(_rootDataFake);
            (0, static_file_1.copyStaticFiles)({
                cwd: row.location,
                file_map,
            });
            // 驗證套件匯出 / Verify package exports
            try {
                (0, pkg_entry_util_1.pkgExportsVerify)(pkg.data, {
                    cwd: row.location,
                });
            }
            catch (e) {
                err.push(e);
            }
            // 填充託管 git 資訊（homepage, repository, bugs）/ Fill hosted git info
            (0, pkg_hosted_info_1.fillPkgHostedInfo)(pkg.data, {
                targetDir: row.location,
                overwriteHostedGitInfo,
                hostedGitInfo,
                branch,
            });
            // 若適用則修復 tsdx 套件 / Fix tsdx package if applicable
            if ((0, is_tsdx_1.isTsdxPackage)(pkg.data)) {
                (0, fix_1.fixTsdxPackage)(pkg.data, {
                    rootData: _rootDataFake,
                });
            }
            // 修復依賴版本 / Fix dependency versions
            (0, fix_ws_versions_1.fixPkgDepsVersionsCore)(pkg.data, cache);
            // 標準化依賴值 / Normalize dependency values
            types_1.packageJsonDependenciesFields
                .forEach(field => {
                var _a;
                Object.keys((_a = pkg.data[field]) !== null && _a !== void 0 ? _a : {})
                    .forEach(name => {
                    const _value = (0, normalize_deps_value_1.normalizeDepsValue)(pkg.data[field][name]);
                    pkg.data[field][name] = _value;
                });
            });
            // 設定預設腳本 / Set default scripts
            pkg.data.scripts = {
                ...(0, pkg_scripts_1.defaultPkgScripts)(),
                ...((_a = pkg.data.scripts) !== null && _a !== void 0 ? _a : {}),
            };
            // 處理根套件與非根套件 / Handle root vs non-root packages
            if (isRoot) {
                if (isWorkspace) {
                    // Workspace 根套件 - 無特殊處理 / Workspace root - no special handling
                }
                else {
                    // 單一套件根 - 無特殊處理 / Single package root - no special handling
                }
            }
            else {
                // 非根套件：修復 preversion 腳本並移除 packageManager
                // Non-root package: fix preversion script and remove packageManager
                if (!((_b = pkg.data.scripts['_preversion']) === null || _b === void 0 ? void 0 : _b.length) && (0, dummy_1.isDummyEchoMaybeOrEmpty)(pkg.data.scripts.preversion)) {
                    pkg.data.scripts.preversion = "yarn run test" /* EnumScriptsEntry.preversion */;
                }
                // 從非根套件移除 packageManager 欄位
                // Remove packageManager field from non-root packages
                if (pkg.data['packageManager']) {
                    delete pkg.data['packageManager'];
                }
            }
            // 排序並寫入 package.json / Sort and write package.json
            pkg.data = (0, sort_package_json3_1.sortPackageJson)(pkg.data);
            pkg.autofix();
            pkg.write();
        })().catch(e => {
            e.row = row;
            err.push(e);
        }), row.name);
        return promiseLogger
            .catch(e => {
            e.row = row;
            err.push(e);
        })
            .then(() => {
            // 若有錯誤則記錄 / Log errors if any
            if (err.length) {
                debug_color2_1.console.error(err);
            }
        });
    });
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
function _initPkgListableByRootData(rootData) {
    let cwd = rootData.root;
    // Workspace 模式：取得 workspace 中的所有套件
    // Workspace mode: get all packages in workspace
    if (rootData.hasWorkspace) {
        return (0, ws_pkg_list_1.wsPkgListable)(cwd, {
            handler(...argv) {
                return _handler(cwd, ...argv);
            },
        });
    }
    // 單一套件模式：僅返回根套件
    // Single package mode: return only the root package
    return (0, ws_pkg_list_1.wsPkgListableFromPaths)([
        cwd,
    ], cwd, {
        handler(...argv) {
            return _handler(cwd, ...argv);
        },
    });
}
//# sourceMappingURL=index.js.map