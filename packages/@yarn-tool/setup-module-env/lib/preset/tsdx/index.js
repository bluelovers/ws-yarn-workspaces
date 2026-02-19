"use strict";
/**
 * tsdx 專案設定模組
 * tsdx project setup module
 *
 * 此模組提供設定 tsdx 專案的核心功能，包括更新 package.json、
 * 設定靜態檔案映射以及主要設定函式。
 * This module provides core functionality for setting up tsdx projects,
 * including updating package.json, configuring static file mappings,
 * and the main setup function.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultCopyStaticFilesTsdx = void 0;
exports.updatePackageJson = updatePackageJson;
exports.setup = setup;
const scripts_1 = require("@yarn-tool/pkg-entry-util/lib/field/scripts");
const fix_1 = require("./fix");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
/**
 * 更新 package.json 以符合 tsdx 專案標準
 * Update package.json to conform to tsdx project standards
 *
 * 此函式會設定以下內容：
 * This function configures the following:
 *
 * - scripts: test, posttest, build, build:dts:bundle, build:tsdx 等
 *   scripts: test, posttest, build, build:dts:bundle, build:tsdx, etc.
 *
 * - main/module/types: 設定輸出檔案路徑
 *   main/module/types: configure output file paths
 *
 * - exports: 設定模組匯出映射
 *   exports: configure module export mappings
 *
 * - keywords: 添加 tsdx 標識關鍵字
 *   keywords: add tsdx identifier keyword
 *
 * @param pkg - 要更新的 package.json 物件 / package.json object to update
 * @param config - 設定選項 (可選) / configuration options (optional)
 * @returns 更新後的 package.json 物件 / Updated package.json object
 */
function updatePackageJson(pkg, config) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    var _q, _r, _s, _t, _u, _v, _w, _x, _y;
    // 確保 scripts 欄位存在
    // Ensure scripts field exists
    (_a = pkg.scripts) !== null && _a !== void 0 ? _a : (pkg.scripts = {});
    // 如果 test 腳本未指定或為空，清除並設定預設值
    // If test script is not specified or empty, clear and set default
    if ((0, scripts_1.scriptsEntryIsNoTestSpecified)(pkg.scripts["test"])) {
        pkg.scripts["test"] = void 0;
    }
    // 設定預設的 test 腳本為 jest
    // Set default test script to jest
    (_b = (_q = pkg.scripts)["test"]) !== null && _b !== void 0 ? _b : (_q["test"] = "jest --passWithNoTests" /* EnumScriptsEntry.JEST_TEST */);
    // 設定 posttest 腳本，在測試後執行 build
    // Set posttest script to run build after tests
    (_c = (_r = pkg.scripts)["posttest"]) !== null && _c !== void 0 ? _c : (_r["posttest"] = "yarn run build");
    // 如果 build 腳本不包含 tsdx build，則設定新的 build 腳本
    // If build script doesn't include tsdx build, set new build script
    if (!((_d = pkg.scripts["build"]) === null || _d === void 0 ? void 0 : _d.includes('run build:tsdx'))) {
        pkg.scripts["build"] = "yarn run build:tsdx && yarn run build:dts:bundle";
    }
    // 設定 TypeScript 宣告檔案打包腳本
    // Set TypeScript declaration file bundling script
    (_e = (_s = pkg.scripts)["build:dts:bundle"]) !== null && _e !== void 0 ? _e : (_s["build:dts:bundle"] = "ynpx @bluelovers/dts-bundle-generator -o ./dist/index.d.ts ./src/index.ts --no-banner --inline-declare-global & echo build:dts:bundle" /* EnumScriptsEntry.BUILD_DTS_BUNDLE */);
    // 設定 tsdx build 腳本，目標為 node 環境
    // Set tsdx build script targeting node environment
    (_f = (_t = pkg.scripts)["build:tsdx"]) !== null && _f !== void 0 ? _f : (_t["build:tsdx"] = "ynpx @bluelovers/tsdx build --target node");
    // 設定複製宣告檔案的腳本 (Windows 語法)
    // Set declaration file copy script (Windows syntax)
    (_g = (_u = pkg.scripts)["build:dts:copy"]) !== null && _g !== void 0 ? _g : (_u["build:dts:copy"] = "copy .\\src\\index.d.ts .\\dist\\index.d.ts & echo build:dts");
    // 設定 TypeScript 宣告檔案輸出腳本
    // Set TypeScript declaration file emit script
    (_h = (_v = pkg.scripts)["build:dts:tsc:emit"]) !== null && _h !== void 0 ? _h : (_v["build:dts:tsc:emit"] = "tsc --emitDeclarationOnly --declaration --noEmit false");
    // 組合完整的 dts 建置腳本
    // Compose complete dts build script
    (_j = (_w = pkg.scripts)["build:dts:tsc"]) !== null && _j !== void 0 ? _j : (_w["build:dts:tsc"] = [
        'yarn run build:dts:copy',
        'yarn run build:dts:tsc:emit',
        'yarn run build:dts:copy',
    ].join(' && '));
    // 設定模組入口點
    // Set module entry points
    pkg.main = "dist/index.cjs";
    pkg.module = "dist/index.esm.mjs";
    pkg.types = pkg.typings = "dist/index.d.ts";
    // 設定 unpkg CDN 入口點
    // Set unpkg CDN entry point
    (_k = pkg.unpkg) !== null && _k !== void 0 ? _k : (pkg.unpkg = "dist/index.umd.production.min.cjs");
    // 設定 exports 欄位，定義模組匯出映射
    // Set exports field, defining module export mappings
    (_l = pkg.exports) !== null && _l !== void 0 ? _l : (pkg.exports = {});
    (_m = (_x = pkg.exports)['.']) !== null && _m !== void 0 ? _m : (_x['.'] = {});
    pkg.exports['.'].types = "./dist/index.d.ts";
    pkg.exports['.'].import = "./dist/index.esm.mjs";
    pkg.exports['.'].require = "./dist/index.cjs";
    // 允許直接存取 src 目錄下的檔案
    // Allow direct access to files under src directory
    pkg.exports['./src/*'] = './src/*';
    // 匯出 package.json 本身
    // Export package.json itself
    (_o = (_y = pkg.exports)['./package.json']) !== null && _o !== void 0 ? _o : (_y['./package.json'] = './package.json');
    // 確保 keywords 欄位存在
    // Ensure keywords field exists
    (_p = pkg.keywords) !== null && _p !== void 0 ? _p : (pkg.keywords = []);
    // 添加 tsdx 標識關鍵字（如果尚未存在）
    // Add tsdx identifier keyword if not already present
    if (!pkg.keywords.includes("create-by-tsdx" /* EnumTsdx.keyword */)) {
        pkg.keywords.push("create-by-tsdx" /* EnumTsdx.keyword */);
    }
    // 呼叫 fixTsdxPackage 進行額外的修復
    // Call fixTsdxPackage for additional fixes
    (0, fix_1.fixTsdxPackage)(pkg, config);
    return pkg;
}
/**
 * 預設的靜態檔案複製映射表
 * Default static file copy mapping table
 *
 * 定義需要複製到目標專案的靜態檔案，每個項目為 [目標路徑, 來源路徑, ?來源檔名] 的格式。
 * Defines static files that need to be copied to the target project,
 * each entry follows [targetPath, sourcePath, ?sourceFileName] format.
 */
const _defaultCopyStaticFilesTsdx = [
    // 根目錄的 tsconfig.json 設定檔
    // Root tsconfig.json configuration file
    ['tsconfig.json', 'file/tsconfig.tsdx.json.tpl', 'tsconfig.json'],
    // 測試目錄的 tsconfig.json 設定檔
    // Test directory tsconfig.json configuration file
    ['test/tsconfig.json', 'file/test/tsconfig.json.tpl', 'test/tsconfig.json'],
    // src 目錄下的 index.cts 檔案
    // index.cts file under src directory
    ['src/index.cts', 'file/tsdx/index.cts'],
    // src 目錄的 tsconfig.json 設定檔
    // src directory tsconfig.json configuration file
    ['src/tsconfig.json', 'file/tsdx/tsconfig.json.tpl'],
];
/**
 * 凍結的預設靜態檔案映射表
 * Frozen default static file mapping table
 */
exports.defaultCopyStaticFilesTsdx = Object.freeze(_defaultCopyStaticFilesTsdx);
/**
 * 設定 tsdx 專案的主要函式
 * Main function for setting up tsdx project
 *
 * 此函式執行以下操作：
 * This function performs the following operations:
 *
 * 1. 更新 package.json 設定
 *    Update package.json configuration
 *
 * 2. 合併預設與自訂的靜態檔案映射
 *    Merge default and custom static file mappings
 *
 * 3. 確保 src 目錄存在
 *    Ensure src directory exists
 *
 * @template P - package.json 類型 / package.json type
 * @param config - 設定選項 / Configuration options
 * @returns 包含更新後設定的物件 / Object containing updated configuration
 */
function setup(config) {
    let { pkg, file_map, targetDir, } = config;
    // 更新 package.json
    // Update package.json
    pkg = updatePackageJson(pkg, config);
    // 合併預設與自訂的靜態檔案映射
    // Merge default and custom static file mappings
    file_map = [
        ...exports.defaultCopyStaticFilesTsdx,
        ...file_map,
    ];
    // 確保 src 目錄存在
    // Ensure src directory exists
    (0, fs_extra_1.ensureDirSync)((0, path_1.resolve)(targetDir, 'src'));
    return {
        ...config,
        pkg,
        file_map,
    };
}
//# sourceMappingURL=index.js.map