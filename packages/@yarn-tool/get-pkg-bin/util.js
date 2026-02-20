"use strict";
/**
 * Created by user on 2020/2/16.
 *
 * 工具函數模組
 * Utility functions module
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageBins = getPackageBins;
exports.handlePackageBins = handlePackageBins;
exports.firstPackageBin = firstPackageBin;
exports.getPackageInfo = getPackageInfo;
const tslib_1 = require("tslib");
const upath2_1 = require("upath2");
const resolve_package_1 = require("@yarn-tool/resolve-package");
tslib_1.__exportStar(require("./lib/types"), exports);
/**
 * 從 package.json 取得 bin 定義
 * Get bin definitions from package.json
 *
 * @description
 * 解析 package.json 的 bin 欄位，支援字串和物件兩種格式。
 * Parses the bin field in package.json, supporting both string and object formats.
 *
 * @param pkg - package.json 物件 / package.json object
 * @returns bin 名稱與路徑的對應物件 / Object mapping bin names to paths
 *
 * @example
 * ```typescript
 * // 字串格式 bin
 * getPackageBins({ name: 'my-cli', bin: './cli.js' });
 * // { 'my-cli': './cli.js' }
 *
 * // 物件格式 bin
 * getPackageBins({ name: 'my-cli', bin: { 'my-cli': './cli.js', 'my-tool': './tool.js' } });
 * // { 'my-cli': './cli.js', 'my-tool': './tool.js' }
 * ```
 */
function getPackageBins(pkg) {
    if (pkg.bin != null) {
        // 字串格式：bin 名稱為套件名稱 / String format: bin name is the package name
        if (typeof pkg.bin === 'string') {
            return {
                [pkg.name]: pkg.bin,
            };
        }
        else {
            // 物件格式：直接返回 / Object format: return as-is
            return {
                ...pkg.bin,
            };
        }
    }
}
/**
 * 處理 bin 路徑，解析為標準化格式
 * Handle bin paths, resolving to normalized format
 *
 * @description
 * 將 bin 路徑正規化。若提供 resolveFn，則使用該函數解析路徑；
 * 否則只進行格式正規化。
 * Normalizes bin paths. If resolveFn is provided, uses it to resolve paths;
 * otherwise only performs format normalization.
 *
 * @typeParam K - bin 名稱類型 / bin name type
 * @param bins - bin 名稱與路徑的對應物件 / Object mapping bin names to paths
 * @param resolveFn - 路徑解析函數（可選）/ Path resolution function (optional)
 * @returns 處理後的 bin 物件 / Processed bin object
 */
function handlePackageBins(bins, resolveFn) {
    const _cwd = '.' + upath2_1.sep;
    return Object.entries(bins)
        // FIXME: https://github.com/microsoft/TypeScript/issues/45064
        .reduce((a, [k, bin]) => {
        // 若有提供解析函數，先解析路徑 / Resolve path if resolveFn is provided
        if (resolveFn) {
            bin = resolveFn(_cwd + bin);
        }
        // 正規化路徑 / Normalize path
        if (!(0, upath2_1.isAbsolute)((0, upath2_1.normalize)(bin))) {
            bin = _cwd + (0, upath2_1.normalize)(bin);
        }
        else {
            bin = (0, upath2_1.normalize)(bin);
        }
        a[k] = bin;
        return a;
    }, {});
}
/**
 * 取得第一個 bin 腳本路徑
 * Get the first bin script path
 *
 * @description
 * 從 bin 物件中取得第一個 bin 腳本的路徑。
 * Gets the path of the first bin script from the bin object.
 *
 * @param bins - bin 名稱與路徑的對應物件 / Object mapping bin names to paths
 * @returns 第一個 bin 的路徑，若無則為 undefined / Path of the first bin, or undefined if none
 */
function firstPackageBin(bins) {
    bins = bins || {};
    let keys = Object.keys(bins);
    if (keys.length) {
        return bins[keys[0]];
    }
}
/**
 * 從選項中取得套件資訊
 * Get package information from options
 *
 * @description
 * 根據選項配置取得套件的名稱、根目錄和 package.json 內容。
 * Gets the package name, root directory, and package.json content based on options.
 *
 * 支援與 @yarn-tool/require-resolve 相同的擴充選項（includeGlobal、includeCurrentDirectory、cwd）。
 * Supports the same extended options as @yarn-tool/require-resolve (includeGlobal, includeCurrentDirectory, cwd).
 *
 * @param options - 選項配置 / Options configuration
 * @returns 套件資訊物件 / Package information object
 * @throws TypeError 若未提供有效的 name 或 pkg / If valid name or pkg is not provided
 */
function getPackageInfo(options) {
    let { pkgRoot, pkg, name, paths, includeGlobal, includeCurrentDirectory, cwd } = options;
    // 若有提供 pkg，從中取得名稱 / If pkg is provided, get name from it
    if (pkg) {
        name = name || options.pkg.name;
    }
    else if (name) {
        // 若有提供 name，解析套件資訊 / If name is provided, resolve package info
        // 使用擴充選項 / Use extended options
        let data = (0, resolve_package_1.resolvePackage)(options.name, {
            paths,
            includeGlobal,
            includeCurrentDirectory,
            cwd,
        });
        pkg = data.pkg;
        pkgRoot = pkgRoot || data.pkgRoot;
    }
    else {
        throw new TypeError(`name or pkg is not valid`);
    }
    return {
        name,
        pkgRoot,
        pkg: pkg,
    };
}
//# sourceMappingURL=util.js.map