#!/usr/bin/env node
"use strict";
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
var _a, _b, _c, _d, _e, _f, _g;
var _h, _j, _k;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const yargs_1 = tslib_1.__importDefault(require("yargs"));
const fs_extra_1 = require("fs-extra");
const upath2_1 = require("upath2");
const workspaces_config_1 = require("workspaces-config");
const npm_package_json_loader_1 = require("npm-package-json-loader");
const yargs_setting_1 = require("./lib/yargs-setting");
const find_root_1 = require("@yarn-tool/find-root");
const fs_1 = require("fs");
const writeReadme_1 = require("@yarn-tool/pkg-readme-tpl/lib/writeReadme");
const sort_package_json_scripts_1 = require("sort-package-json-scripts");
const workspaces_project_1 = require("@yarn-tool/workspaces-project");
const path_is_same_1 = require("path-is-same");
const node_modules_link_1 = require("@yarn-tool/node-modules-link");
const init_path_1 = require("@yarn-tool/init-path");
const path_1 = require("path");
const is_builtin_module_1 = require("@yarn-tool/is-builtin-module");
const initWithPreserveDeps_1 = require("./lib/initWithPreserveDeps");
const static_file_1 = require("@yarn-tool/static-file");
const logger_1 = require("debug-color2/logger");
const nameExistsInWorkspaces_1 = require("ws-pkg-list/lib/nameExistsInWorkspaces");
const pkg_hosted_info_1 = require("@yarn-tool/pkg-hosted-info");
const index_1 = require("@yarn-tool/setup-module-env/lib/preset/tsdx/index");
const dummy_1 = require("@yarn-tool/pkg-entry-util/lib/preset/scripts/dummy");
const root_scripts_1 = require("@yarn-tool/pkg-entry-util/lib/preset/scripts/root-scripts");
const pkg_scripts_1 = require("@yarn-tool/pkg-entry-util/lib/preset/scripts/pkg-scripts");
const write_package_json_1 = require("@yarn-tool/write-package-json");
const getRootCopyStaticFiles_1 = require("@yarn-tool/static-file/lib/root/getRootCopyStaticFiles");
const scripts_1 = require("@yarn-tool/pkg-entry-util/lib/field/scripts");
// 更新通知器（已停用）/ Update notifier (disabled)
//updateNotifier(__dirname);
/**
 * 避免 IDE 緩衝區問題的權宜之計
 * Workaround to avoid IDE buffer issues
 */
logger_1.consoleLogger.length;
/**
 * 設定 Yargs CLI 實例
 * Setup Yargs CLI instance
 */
let cli = (0, yargs_setting_1.setupToYargs)(yargs_1.default);
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
let cwd = (0, upath2_1.resolve)(cli.argv.cwd || process.cwd());
/**
 * 尋找專案根目錄資訊
 * Find project root information
 */
let rootData = (0, find_root_1.findRoot)({
    cwd,
    skipCheckWorkspace: cli.argv.skipCheckWorkspace,
});
/**
 * Workspaces 前綴路徑
 * Workspace prefix path
 */
let workspacePrefix;
/**
 * Workspaces 配置物件
 * Workspaces configuration object
 */
let workspacesConfig;
/**
 * Workspaces 專案實例
 * Workspaces project instance
 */
let wsProject;
/**
 * 如果有 Workspaces，解析配置並建立專案實例
 * If workspaces exist, parse configuration and create project instance
 */
if (rootData === null || rootData === void 0 ? void 0 : rootData.hasWorkspace) {
    workspacesConfig = (0, workspaces_config_1.parseStaticPackagesPaths)((0, workspaces_config_1.getConfig)(rootData.ws));
    // 取得第一個前綴作為預設前綴 / Get first prefix as default prefix
    if (workspacesConfig.prefix.length) {
        workspacePrefix = workspacesConfig.prefix[0];
    }
    wsProject = new workspaces_project_1.WorkspacesProject(rootData.ws);
}
/**
 * 取得目標目錄與名稱資訊
 * Get target directory and name information
 */
let { targetDir, targetName, scopedPackagePattern } = (0, init_path_1.getTargetDir)({
    // @ts-ignore
    inputName: argv.length && argv[0],
    cwd,
    targetName: cli.argv.name || null,
    hasWorkspace: rootData === null || rootData === void 0 ? void 0 : rootData.ws,
    workspacePrefix,
    workspacesConfig,
});
/**
 * 確保目標目錄存在
 * Ensure target directory exists
 */
(0, fs_extra_1.ensureDirSync)(targetDir);
/**
 * 收集命令列標誌參數（單字母選項）
 * Collect command line flag arguments (single-letter options)
 */
let flags = Object.keys(cli.argv)
    .reduce(function (a, f) {
    // 跳過特定選項 / Skip specific options
    if (f === 'silent' || f === 'y' || f === 'yes') {
    }
    // 收集單字母標誌 / Collect single-letter flags
    else if (/^[a-z]$/.test(f) && cli.argv[f]) {
        a.push(f);
    }
    return a;
}, [])
    .join('');
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
const pkg_file_path = (0, upath2_1.join)(targetDir, 'package.json');
/**
 * 舊 Package 名稱（用於保留原名稱）
 * Old package name (for preserving original name)
 */
let old_pkg_name;
/**
 * 標記 Package.json 是否已存在
 * Flag indicating if package.json already exists
 */
const oldExists = (0, fs_1.existsSync)(pkg_file_path);
/**
 * 舊 Package.json 內容
 * Old package.json content
 */
let old_pkg;
/**
 * 驗證：已存在的 Package 不能指定新名稱
 * Validation: Existing packages cannot specify a new name
 */
if (oldExists && (targetName === null || targetName === void 0 ? void 0 : targetName.length)) {
    logger_1.consoleLogger.error(`對於已存在的 Package 而言，禁止同時指定名稱`, targetName);
    logger_1.consoleLogger.error(pkg_file_path);
    process.exit(1);
}
/**
 * 驗證：檢查名稱是否已在 Workspaces 中存在
 * Validation: Check if name already exists in workspaces
 */
if (!oldExists && (rootData === null || rootData === void 0 ? void 0 : rootData.hasWorkspace)) {
    if ((0, nameExistsInWorkspaces_1.nameExistsInWorkspaces)(targetName)) {
        logger_1.consoleLogger.error(`root:`, rootData.root);
        logger_1.consoleLogger.error(`目標名稱已存在於 Workspaces 內，請更換名稱:`, targetName);
        process.exit(1);
    }
}
/**
 * 處理內建模組名稱的特殊情況
 * Handle special case for builtin module names
 */
if (!oldExists && targetName && scopedPackagePattern && (0, is_builtin_module_1.isBuiltinModule)((0, path_1.basename)(targetDir))) {
    (0, write_package_json_1.outputPackageJSONSync)(pkg_file_path, {
        name: targetName,
    });
}
else if (!targetName) {
    /**
     * 嘗試讀取現有的 package.json
     * Try to read existing package.json
     */
    try {
        old_pkg = (_a = new npm_package_json_loader_1.PackageJsonLoader(pkg_file_path)) === null || _a === void 0 ? void 0 : _a.data;
        old_pkg_name = old_pkg.name;
    }
    catch (e) {
        // 忽略讀取錯誤 / Ignore read errors
    }
}
/**
 * 執行初始化並保留現有依賴項
 * Execute initialization while preserving existing dependencies
 */
let { cp } = (0, initWithPreserveDeps_1.initWithPreserveDeps)({
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
if (!cp.error) {
    /**
     * 重新尋找根目錄（因為可能已建立新結構）
     * Re-find root directory (as new structure may have been created)
     */
    rootData = (0, find_root_1.findRoot)({
        cwd: targetDir,
        skipCheckWorkspace: cli.argv.skipCheckWorkspace,
    });
    /**
     * 驗證根目錄是否正確
     * Validate root directory
     */
    if (!(rootData === null || rootData === void 0 ? void 0 : rootData.root)) {
        logger_1.consoleLogger.error(`發生錯誤，初始化失敗`, targetName);
        logger_1.consoleLogger.error(targetDir);
        process.exit(1);
    }
    /**
     * 載入 package.json
     * Load package.json
     */
    let pkg = new npm_package_json_loader_1.PackageJsonLoader(pkg_file_path);
    /**
     * 如果 package.json 存在，進行詳細設定
     * If package.json exists, perform detailed configuration
     */
    if (pkg.exists()) {
        /**
         * 設定 private 標誌（非 yarn 時）
         * Set private flag (when not using yarn)
         */
        if (cli.argv['p'] && cli.argv.npmClient !== 'yarn') {
            pkg.data.private = true;
        }
        /**
         * 防止 node- 前綴被 npm 移除的處理
         * Handle preservation of node- prefix that npm might remove
         */
        if (!cli.argv.yes && old_pkg_name && /^node-/.test(old_pkg_name) && ('node-' + pkg.data.name) === old_pkg_name) {
            pkg.data.name = old_pkg_name;
        }
        else if (cli.argv.yes && old_pkg_name && pkg.data.name !== old_pkg_name) {
            pkg.data.name = old_pkg_name;
        }
        else if (targetName && pkg.data.name !== targetName) {
            pkg.data.name = targetName;
        }
        /**
         * 檢查 Scoped Package 的發布配置
         * Check publish configuration for scoped packages
         */
        if (pkg.data.name && /^@/.test(pkg.data.name) && !pkg.data.publishConfig) {
            //pkg.data.publishConfig = {};
        }
        /**
         * 初始化 scripts 欄位
         * Initialize scripts field
         */
        if (!pkg.data.scripts) {
            pkg.data.scripts = {};
        }
        /**
         * 填充 Package 託管資訊（repository、bugs、homepage 等）
         * Fill package hosting info (repository, bugs, homepage, etc.)
         */
        (0, pkg_hosted_info_1.fillPkgHostedInfo)(pkg.data, {
            targetDir,
            rootData,
        });
        /**
         * 設定 Package Manager（預設 Yarn）
         * Set Package Manager (default to Yarn)
         */
        // pkg.data.packageManager ??= "yarn@1.22.19";
        /**
         * 共享腳本範本
         * Shared script templates
         */
        let sharedScript = {
            "test": `echo "Error: no test specified"`,
        };
        /**
         * 填充虛擬佔位腳本
         * Fill dummy placeholder scripts
         */
        (0, dummy_1.fillDummyScripts)(sharedScript);
        /**
         * Pre-version 腳本序列
         * Pre-version script sequence
         */
        let preScripts = ["echo preversion"];
        /**
         * 設定 Root 專用的 prepublishOnly 腳本
         * Set prepublishOnly script for root projects
         */
        if (rootData.isRoot && !rootData.isWorkspace) {
            sharedScript.prepublishOnly = "yarn run preversion";
        }
        /**
         * 根據專案類型合併對應的腳本範本
         * Merge corresponding script templates based on project type
         */
        if (rootData.hasWorkspace) {
            // Workspaces 專案不添加額外根腳本
            // Workspace projects don't add extra root scripts
        }
        else if (rootData.isRoot) {
            sharedScript = {
                ...sharedScript,
                ...(0, root_scripts_1.defaultRootScripts)(),
            };
        }
        /**
         * 組合 Pre-version 腳本
         * Compose pre-version scripts
         */
        preScripts.push("yarn run test" /* EnumScriptsEntry.preversion */);
        sharedScript.preversion = preScripts.join(' && ');
        /**
         * 初始化 scripts 欄位（如果不存在）
         * Initialize scripts field if not exists
         */
        (_b = (_h = pkg.data).scripts) !== null && _b !== void 0 ? _b : (_h.scripts = {});
        /**
         * 處理新建立的 Package 腳本
         * Handle scripts for newly created packages
         */
        if (!oldExists) {
            /**
             * 如果現有腳本是預設的無測試提示，且我們有測試腳本，則刪除舊的
             * If existing script is default no-test message and we have a test script, remove old one
             */
            if ((0, scripts_1.scriptsEntryIsNoTestSpecified)((_c = pkg.data.scripts) === null || _c === void 0 ? void 0 : _c.test) && ((_d = sharedScript.test) === null || _d === void 0 ? void 0 : _d.length) > 0) {
                delete pkg.data.scripts.test;
            }
            /**
             * 如果根專案使用 Jest，設定對應的測試腳本
             * If root project uses Jest, set corresponding test script
             */
            if (_findDeps(wsProject === null || wsProject === void 0 ? void 0 : wsProject.manifest, '@types/jest') || _findDeps(wsProject === null || wsProject === void 0 ? void 0 : wsProject.manifest, 'jest') || _findDeps(wsProject === null || wsProject === void 0 ? void 0 : wsProject.manifest, 'ts-jest')) {
                sharedScript.test = "jest --passWithNoTests" /* EnumScriptsEntry.JEST_TEST */;
            }
            /**
             * 合併預設腳本到新 Package
             * Merge default scripts to new package
             */
            Object
                .entries({
                ...(0, pkg_scripts_1.defaultPkgNotOldExists)(),
                ...sharedScript,
            })
                .forEach(([k, v]) => {
                var _a;
                var _b;
                (_a = (_b = pkg.data.scripts)[k]) !== null && _a !== void 0 ? _a : (_b[k] = v);
            });
        }
        else {
            /**
             * 處理已存在的 Package 腳本
             * Handle scripts for existing packages
             */
            Object
                .entries(sharedScript)
                .forEach(([k, v]) => {
                var _a;
                var _b;
                /**
                 * 跳過尾隨底線標記的重複腳本
                 * Skip duplicate scripts marked with trailing underscores
                 */
                if (k.endsWith('_') && pkg.data.scripts[k.replace(/_+$/, '')] === v) {
                    return;
                }
                (_a = (_b = pkg.data.scripts)[k]) !== null && _a !== void 0 ? _a : (_b[k] = v);
            });
            /**
             * 處理 TypeScript 型別定義路徑
             * Handle TypeScript type definitions path
             */
            if (!pkg.data.types || !pkg.data.typings) {
                pkg.data.types = pkg.data.types || pkg.data.typings;
                /**
                 * 自動偵測型別定義檔案位置
                 * Auto-detect type definition file location
                 */
                if (pkg.data.main && !pkg.data.types) {
                    let file = (0, upath2_1.join)(targetDir, pkg.data.main);
                    let parsed = (0, upath2_1.parse)(file);
                    if (!(0, path_is_same_1.pathIsSame)(targetDir, parsed.dir) && (0, fs_extra_1.pathExistsSync)((0, upath2_1.join)(parsed.dir, parsed.name + '.d.ts'))) {
                        pkg.data.types = (0, upath2_1.relative)(targetDir, parsed.dir).replace(/^\.\//, '') + '/' + parsed.name + '.d.ts';
                    }
                }
                pkg.data.typings = pkg.data.types;
            }
            /**
             * 保留舊 Package.json 中未被覆蓋的欄位
             * Preserve fields from old package.json that weren't overwritten
             */
            if (old_pkg) {
                Object.keys(old_pkg)
                    .forEach(key => {
                    if (!(key in pkg.data)) {
                        pkg.data[key] = old_pkg[key];
                    }
                });
            }
        }
        /**
         * 為新 Package 添加預設依賴項
         * Add default dependencies for new packages
         */
        if (!oldExists) {
            const cpkg = require('./package.json');
            /**
             * 尋找依賴項版本的輔助函式
             * Helper function to find dependency version
             */
            const findVersion = (name) => {
                var _a, _b, _c;
                return ((_a = cpkg.dependencies) === null || _a === void 0 ? void 0 : _a[name]) || ((_b = cpkg.devDependencies) === null || _b === void 0 ? void 0 : _b[name]) || ((_c = cpkg.peerDependencies) === null || _c === void 0 ? void 0 : _c[name]) || "*";
            };
            // 初始化依賴項欄位 / Initialize dependency fields
            pkg.data.dependencies = pkg.data.dependencies || {};
            pkg.data.devDependencies = pkg.data.devDependencies || {};
            pkg.data.peerDependencies = pkg.data.peerDependencies || {};
            /**
             * 為 Root 專案添加開發依賴項
             * Add dev dependencies for root projects
             */
            if (rootData.isRoot) {
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
        if (wsProject && !rootData.isWorkspace) {
            const rootKeywords = wsProject.manifest.toJSON().keywords;
            if (!((_e = pkg.data.keywords) === null || _e === void 0 ? void 0 : _e.length) && (rootKeywords === null || rootKeywords === void 0 ? void 0 : rootKeywords.length)) {
                pkg.data.keywords = rootKeywords.slice();
            }
        }
        /**
         * 添加工具標記關鍵字
         * Add tool marker keyword
         */
        (_f = (_j = pkg.data).keywords) !== null && _f !== void 0 ? _f : (_j.keywords = []);
        pkg.data.keywords.push('create-by-yarn-tool');
        /**
         * 取得要複製的靜態檔案映射
         * Get static file mappings to copy
         */
        let file_map = (0, getRootCopyStaticFiles_1.getRootCopyStaticFilesAuto)({
            hasWorkspace: !!wsProject,
            isRoot: !wsProject,
        });
        /**
         * README.md 檔案路徑
         * README.md file path
         */
        const mdFile = (0, upath2_1.join)(targetDir, 'README.md');
        /**
         * 判斷是否需要生成 README
         * Determine if README needs to be generated
         */
        let existsReadme = !oldExists || !(0, fs_1.existsSync)(mdFile);
        /**
         * 如果啟用 TSDX，執行 TSDX 設定
         * If TSDX is enabled, execute TSDX setup
         */
        if (cli.argv.tsdx) {
            ({
                file_map,
                existsReadme,
            } = (0, index_1.setup)({
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
        pkg.data.scripts = (0, sort_package_json_scripts_1.sortPackageJsonScripts)(pkg.data.scripts);
        /**
         * 設定 sideEffects 為 false（優化 Tree Shaking）
         * Set sideEffects to false (optimize Tree Shaking)
         * @see https://juejin.cn/post/6844903640533041159
         */
        (_g = (_k = pkg.data).sideEffects) !== null && _g !== void 0 ? _g : (_k.sideEffects = false);
        /**
         * 自動修復 package.json 常見問題
         * Auto-fix common package.json issues
         */
        pkg.autofix();
        /**
         * 如果需要，對 package.json 進行排序
         * Sort package.json if requested
         */
        if (cli.argv.sort) {
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
        (0, static_file_1.copyStaticFiles)({
            cwd: targetDir,
            file_map,
        });
        /**
         * 生成 README.md（如果需要）
         * Generate README.md if needed
         */
        if (existsReadme) {
            (0, writeReadme_1.writeReadme)({
                file: mdFile,
                variable: pkg.data,
            });
        }
        /**
         * 將 Package 連結到 node_modules（Workspaces 專案）
         * Link package to node_modules (for workspace projects)
         */
        if (wsProject && !rootData.isWorkspace) {
            (0, node_modules_link_1.linkToNodeModules)({
                cwd: targetDir,
                sourcePackagePath: targetDir,
                overwrite: true,
            });
        }
    }
}
else {
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
function _findDeps(pkg, name) {
    var _a, _b, _c;
    pkg !== null && pkg !== void 0 ? pkg : (pkg = {});
    return (_b = (_a = pkg.dependencies) === null || _a === void 0 ? void 0 : _a[name]) !== null && _b !== void 0 ? _b : (_c = pkg.devDependencies) === null || _c === void 0 ? void 0 : _c[name];
}
//# sourceMappingURL=index.js.map