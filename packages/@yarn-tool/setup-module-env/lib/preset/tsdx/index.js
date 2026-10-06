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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    var _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
    /**
     * 確保 scripts 欄位存在
     * Ensure scripts field exists
     */
    (_a = pkg.scripts) !== null && _a !== void 0 ? _a : (pkg.scripts = {});
    /**
     * 如果 test 腳本未指定或為空，清除並設定預設值
     * If test script is not specified or empty, clear and set default
     *
     * 先設為 undefined 才能讓下一行的 ??= 生效，
     * 因為 "no test specified" 這類佔位字串並非 nullish
     * Setting it to undefined first lets the following ??= take effect,
     * because placeholder strings like "no test specified" are not nullish
     */
    if ((0, scripts_1.scriptsEntryIsNoTestSpecified)(pkg.scripts["test"])) {
        pkg.scripts["test"] = void 0;
    }
    /**
     * 設定預設的 test 腳本為 jest
     * Set default test script to jest
     */
    (_b = (_r = pkg.scripts)["test"]) !== null && _b !== void 0 ? _b : (_r["test"] = "tsx --test --test-update-snapshots test/**/*.node-spec.ts test/**/*.node-test.ts test/**/*.spec.ts test/**/*.test.ts" /* EnumScriptsEntry.NODE_TEST */);
    (_c = (_s = pkg.scripts)["test:node"]) !== null && _c !== void 0 ? _c : (_s["test:node"] = "tsx --test --test-update-snapshots test/**/*.node-spec.ts test/**/*.node-test.ts test/**/*.spec.ts test/**/*.test.ts" /* EnumScriptsEntry.NODE_TEST */);
    /**
     * 設定 posttest 腳本，在測試後執行 build
     * Set posttest script to run build after tests
     */
    (_d = (_t = pkg.scripts)["posttest"]) !== null && _d !== void 0 ? _d : (_t["posttest"] = "pnpm run build");
    /**
     * 如果 build 腳本不包含 tsdx build，則設定新的 build 腳本
     * If build script doesn't include tsdx build, set new build script
     *
     * 以 includes 檢查而非直接覆寫，避免破壞已含 tsdx build 的自訂腳本
     * Checks with includes instead of overwriting directly, so custom scripts already invoking tsdx build are preserved
     */
    if (!((_e = pkg.scripts["build"]) === null || _e === void 0 ? void 0 : _e.includes('run build:tsdx'))) {
        pkg.scripts["build"] = "node --run build:tsdx && node --run build:dts:bundle" /* EnumScriptsEntry.BUILD_TSDX_AND_DTS */;
    }
    /**
     * 設定 TypeScript 宣告檔案打包腳本
     * Set TypeScript declaration file bundling script
     */
    (_f = (_u = pkg.scripts)["build:dts:bundle"]) !== null && _f !== void 0 ? _f : (_u["build:dts:bundle"] = "ynpx @bluelovers/dts-bundle-generator -o ./dist/index.d.ts ./src/index.ts --no-banner --inline-declare-global & echo build:dts:bundle" /* EnumScriptsEntry.BUILD_DTS_BUNDLE */);
    /**
     * 設定 tsdx build 腳本，目標為 node 環境
     * Set tsdx build script targeting node environment
     */
    (_g = (_v = pkg.scripts)["build:tsdx"]) !== null && _g !== void 0 ? _g : (_v["build:tsdx"] = "ynpx @bluelovers/tsdx build --target node --name index" /* EnumScriptsEntry.BUILD_TSDX */);
    /**
     * 設定複製宣告檔案的腳本 (Windows 語法)
     * Set declaration file copy script (Windows syntax)
     */
    (_h = (_w = pkg.scripts)["build:dts:copy"]) !== null && _h !== void 0 ? _h : (_w["build:dts:copy"] = "copy .\\src\\index.d.ts .\\dist\\index.d.ts & echo build:dts" /* EnumScriptsEntry.BUILD_DTS_COPY */);
    /**
     * 設定 TypeScript 宣告檔案輸出腳本
     * Set TypeScript declaration file emit script
     */
    (_j = (_x = pkg.scripts)["build:dts:tsc:emit"]) !== null && _j !== void 0 ? _j : (_x["build:dts:tsc:emit"] = "tsc --emitDeclarationOnly --declaration --noEmit false" /* EnumScriptsEntry.BUILD_DTS_TSC_EMIT */);
    /**
     * 設定完整的 dts 建置腳本
     * Set complete dts build script
     */
    (_k = (_y = pkg.scripts)["build:dts:tsc"]) !== null && _k !== void 0 ? _k : (_y["build:dts:tsc"] = "node --run build:dts:tsc:emit & node --run build:dts:copy" /* EnumScriptsEntry.BUILD_DTS_TSC */);
    /**
     * 設定模組入口點
     * Set module entry points
     *
     * 這裡刻意直接賦值而非 ??=，確保與 tsdx 的實際輸出檔名保持一致
     * Assigned directly instead of via ??= to stay in sync with tsdx's actual output file names
     */
    pkg.main = "dist/index.cjs";
    pkg.module = "dist/index.esm.mjs";
    pkg.types = pkg.typings = "dist/index.d.ts";
    /**
     * 設定 unpkg CDN 入口點
     * Set unpkg CDN entry point
     */
    (_l = pkg.unpkg) !== null && _l !== void 0 ? _l : (pkg.unpkg = "dist/index.umd.production.min.cjs");
    /**
     * 設定 exports 欄位，定義模組匯出映射
     * Set exports field, defining module export mappings
     *
     * types/import/require 一律覆寫，因為必須與 main/module/types 的輸出檔名完全對應，
     * 否則 Node.js 的條件匯出會指向過期的舊檔
     * types/import/require are always overwritten because they must match the output names of
     * main/module/types exactly, otherwise Node.js conditional exports would point at stale files
     */
    (_m = pkg.exports) !== null && _m !== void 0 ? _m : (pkg.exports = {});
    (_o = (_z = pkg.exports)['.']) !== null && _o !== void 0 ? _o : (_z['.'] = {});
    pkg.exports['.'].types = "./dist/index.d.ts";
    pkg.exports['.'].import = "./dist/index.esm.mjs";
    pkg.exports['.'].require = "./dist/index.cjs";
    /**
     * 允許直接存取 src 目錄下的檔案
     * Allow direct access to files under src directory
     *
     * 直接覆寫而非 ??=，確保 wildcard 匯出格式始終一致
     * Overwritten rather than via ??= so the wildcard export format always stays consistent
     */
    pkg.exports['./src/*'] = './src/*';
    /**
     * 匯出 package.json 本身
     * Export package.json itself
     */
    (_p = (_0 = pkg.exports)['./package.json']) !== null && _p !== void 0 ? _p : (_0['./package.json'] = './package.json');
    /**
     * 確保 keywords 欄位存在
     * Ensure keywords field exists
     */
    (_q = pkg.keywords) !== null && _q !== void 0 ? _q : (pkg.keywords = []);
    /**
     * 添加 tsdx 標識關鍵字（如果尚未存在）
     * Add tsdx identifier keyword if not already present
     *
     * 重複的 keywords 會讓 isTsdxPackage 的判斷失去意義，故先檢查再加入
     * Duplicate keywords would undermine the check in isTsdxPackage, so it is added only when absent
     */
    if (!pkg.keywords.includes("create-by-tsdx" /* EnumTsdx.keyword */)) {
        pkg.keywords.push("create-by-tsdx" /* EnumTsdx.keyword */);
    }
    /**
     * 呼叫 fixTsdxPackage 進行額外的修復
     * Call fixTsdxPackage for additional fixes
     */
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
    /**
     * 根目錄的 tsconfig.json 設定檔
     * Root tsconfig.json configuration file
     */
    ['tsconfig.json', 'file/tsconfig.tsdx.json.tpl'],
    /**
     * 測試目錄的 tsconfig.json 設定檔
     * Test directory tsconfig.json configuration file
     */
    ['test/tsconfig.json', 'file/test/tsconfig.json.tpl'],
    /**
     * src 目錄下的 index.cts 檔案
     * index.cts file under src directory
     */
    ['src/index.cts', 'file/tsdx/index.cts'],
    /**
     * src 目錄的 tsconfig.json 設定檔
     * src directory tsconfig.json configuration file
     */
    ['src/tsconfig.json', 'file/tsdx/tsconfig.json.tpl'],
];
/**
 * 凍結的預設靜態檔案映射表
 * Frozen default static file mapping table
 *
 * 凍結是為了避免執行期意外改動全域預設值，影響其他套件的設定流程
 * Frozen to prevent accidental mutation of the global default, which would affect setup runs in other packages
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
    /**
     * 更新 package.json
     * Update package.json
     */
    pkg = updatePackageJson(pkg, config);
    /**
     * 合併預設與自訂的靜態檔案映射
     * Merge default and custom static file mappings
     *
     * 預設項排在前方，自訂項排在後方，讓呼叫端可用相同目標路徑覆寫預設值
     * Default entries come first and custom entries follow, so callers can override a default via the same target path
     */
    file_map = [
        ...exports.defaultCopyStaticFilesTsdx,
        ...file_map,
    ];
    /**
     * 確保 src 目錄存在
     * Ensure src directory exists
     *
     * tsdx 假定來源碼位於 src/，新專案若缺少此目錄會導致後續 build 失敗
     * tsdx assumes sources live under src/; a new project missing this directory would fail the subsequent build
     */
    (0, fs_extra_1.ensureDirSync)((0, path_1.resolve)(targetDir, 'src'));
    return {
        ...config,
        pkg,
        file_map,
    };
}
//# sourceMappingURL=index.js.map