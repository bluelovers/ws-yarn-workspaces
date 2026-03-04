"use strict";
/**
 * get-pkg-bin 模組
 * get-pkg-bin module
 *
 * 從 package.json 取得 bin 腳本路徑的工具庫。
 * A utility for getting bin script paths from package.json.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePackageBins = normalizePackageBins;
exports._normalizePackageBinsCore = _normalizePackageBinsCore;
exports.defaultPackageBin = defaultPackageBin;
exports._defaultPackageBinCore = _defaultPackageBinCore;
exports._findDefaultPackageBinByBins = _findDefaultPackageBinByBins;
const tslib_1 = require("tslib");
const upath2_1 = require("upath2");
const util_1 = require("./util");
tslib_1.__exportStar(require("./lib/types"), exports);
tslib_1.__exportStar(require("./util"), exports);
/**
 * 正規化套件的 bin 腳本路徑
 * Normalize package bin script paths
 *
 * @description
 * 從 package.json 的 bin 欄位取得所有 bin 腳本，並解析為絕對路徑。
 * Gets all bin scripts from the package.json bin field and resolves them to absolute paths.
 *
 * 支援與 @yarn-tool/require-resolve 相同的擴充選項（includeGlobal、includeCurrentDirectory、cwd）。
 * Supports the same extended options as @yarn-tool/require-resolve (includeGlobal, includeCurrentDirectory, cwd).
 *
 * @param options - 選項配置 / Options configuration
 * @returns 包含 bin 名稱與對應路徑的物件 / Object containing bin names and their paths
 *
 * @example
 * ```typescript
 * import { normalizePackageBins } from '@yarn-tool/get-pkg-bin';
 *
 * // 使用套件名稱
 * const bins = normalizePackageBins({ name: 'ts-node' });
 * // { 'ts-node': '/path/to/ts-node/dist/bin.js', 'ts-script': '/path/to/ts-node/dist/script.js' }
 *
 * // 使用全域路徑搜尋
 * const bins = normalizePackageBins({
 *   name: 'typescript',
 *   includeGlobal: true,
 * });
 *
 * // 使用 pkgRoot + pkg
 * const bins = normalizePackageBins({
 *   pkg: { name: 'my-cli', bin: './cli.js' },
 *   pkgRoot: '/path/to/package',
 *   usePathResolve: true,
 * });
 * // { 'my-cli': './cli.js' }
 * ```
 */
function normalizePackageBins(options) {
    const pkgInfo = (0, util_1.getPackageInfo)(options);
    return _normalizePackageBinsCore(options, pkgInfo);
}
/**
 * 正規化套件 bin 腳本路徑的核心函數
 * Core function for normalizing package bin script paths
 *
 * @description
 * 此函數是 normalizePackageBins 的核心實作，處理 bin 路徑的解析與正規化。
 * 根據 options.usePathResolve 選擇不同的路徑解析策略。
 *
 * 解析策略：
 * - usePathResolve = true: 使用 upath2.resolve 進行相對路徑解析
 * - usePathResolve = false（預設）: 使用 require.resolve 進行模組解析
 *
 * @param options - 選項配置 / Options configuration
 * @param pkgInfo - 套件資訊（由 getPackageInfo 取得）/ Package info from getPackageInfo
 * @returns 包含 bin 名稱與對應路徑的物件 / Object containing bin names and their paths
 *
 * @internal
 */
function _normalizePackageBinsCore(options, pkgInfo) {
    let { pkgRoot, pkg, name } = pkgInfo;
    // 從 package.json 取得 bin 定義，若無則使用空物件
    // Get bin definitions from package.json, fallback to empty object
    let bins = (0, util_1.getPackageBins)(pkg) || {};
    if (pkgRoot != null) {
        // 根據 usePathResolve 選擇解析方式 / Choose resolution method based on usePathResolve
        const resolveFn = (options.usePathResolve) ? ((bin) => (0, upath2_1.resolve)(pkgRoot, bin)) : ((bin) => require.resolve(bin, {
            paths: [
                pkgRoot,
            ],
        }));
        return (0, util_1.handlePackageBins)(bins, resolveFn);
    }
    // 無 pkgRoot 時，僅進行路徑格式正規化
    // When no pkgRoot, only perform path format normalization
    return (0, util_1.handlePackageBins)(bins);
}
/**
 * 取得套件的預設 bin 腳本路徑
 * Get the default bin script path of a package
 *
 * @description
 * 取得套件的主要 bin 腳本。如果 bin 名稱與套件名稱相符，則返回該腳本；
 * 否則返回第一個 bin 腳本。
 * Gets the primary bin script of a package. If a bin name matches the package name,
 * returns that script; otherwise returns the first bin script.
 *
 * 支援與 @yarn-tool/require-resolve 相同的擴充選項（includeGlobal、includeCurrentDirectory、cwd）。
 * Supports the same extended options as @yarn-tool/require-resolve (includeGlobal, includeCurrentDirectory, cwd).
 *
 * @param options - 選項配置 / Options configuration
 * @param defaultKey - 預設的 bin 名稱（可選）/ Default bin name (optional)
 * @returns bin 腳本的絕對路徑 / Absolute path to the bin script
 *
 * @example
 * ```typescript
 * import { defaultPackageBin } from '@yarn-tool/get-pkg-bin';
 *
 * // 取得 ts-node 的預設 bin
 * const binPath = defaultPackageBin({ name: 'ts-node' });
 * // '/path/to/ts-node/dist/bin.js'
 *
 * // 使用全域路徑搜尋
 * const binPath = defaultPackageBin({
 *   name: 'typescript',
 *   includeGlobal: true,
 * });
 *
 * // 指定預設的 bin 名稱
 * const binPath = defaultPackageBin({ name: 'some-package' }, 'cli');
 * ```
 */
function defaultPackageBin(options, defaultKey) {
    const pkgInfo = (0, util_1.getPackageInfo)(options);
    return _defaultPackageBinCore(options, pkgInfo, defaultKey);
}
/**
 * 取得套件預設 bin 腳本路徑的核心函數
 * Core function for getting the default bin script path of a package
 *
 * @description
 * 此函數是 defaultPackageBin 的核心實作，流程如下：
 * 1. 呼叫 _normalizePackageBinsCore 取得所有 bin 的正規化路徑
 * 2. 透過 _handleDefaultKey 處理預設 bin 名稱（從套件名稱推斷或使用者指定）
 * 3. 呼叫 _findDefaultPackageBinByBins 尋找最終的 bin 路徑
 *
 * @param options - 選項配置 / Options configuration
 * @param pkgInfo - 套件資訊（由 getPackageInfo 取得）/ Package info from getPackageInfo
 * @param defaultKey - 預設的 bin 名稱（可選）/ Default bin name (optional)
 * @returns bin 腳本的絕對路徑 / Absolute path to the bin script
 *
 * @internal
 */
function _defaultPackageBinCore(options, pkgInfo, defaultKey) {
    // 合併 options 與 pkgInfo 後取得所有 bin 的正規化路徑
    // Get normalized paths for all bins by merging options and pkgInfo
    const bins = _normalizePackageBinsCore(options, pkgInfo);
    // 處理預設 bin 名稱：若未指定，從套件名稱推斷
    // Handle default key: infer from package name if not specified
    defaultKey = (0, util_1._handleDefaultKey)(pkgInfo, defaultKey);
    return _findDefaultPackageBinByBins(bins, defaultKey);
}
/**
 * 從 bins 物件中尋找預設的 bin 腳本路徑
 * Find the default bin script path from bins object
 *
 * @description
 * 尋找邏輯：
 * 1. 若 defaultKey 存在且對應的 bin 存在於 bins 中，返回該 bin 路徑
 * 2. 否則返回 bins 中的第一個 bin（透過 firstPackageBin）
 *
 * 此函數允許使用者指定優先使用的 bin 名稱，適用於套件有多個 bin 的情況。
 *
 * @param bins - bin 名稱與路徑的對應物件 / Object mapping bin names to paths
 * @param defaultKey - 預設的 bin 名稱（可選）/ Default bin name (optional)
 * @returns bin 腳本路徑，若無則為 undefined / Bin script path, or undefined if none
 *
 * @example
 * ```typescript
 * const bins = { 'my-cli': './cli.js', 'my-tool': './tool.js' };
 *
 * // 指定存在的 bin 名稱
 * _findDefaultPackageBinByBins(bins, 'my-tool');
 * // => './tool.js'
 *
 * // 指定不存在的 bin 名稱，返回第一個
 * _findDefaultPackageBinByBins(bins, 'not-exist');
 * // => './cli.js'
 *
 * // 不指定，返回第一個
 * _findDefaultPackageBinByBins(bins);
 * // => './cli.js'
 * ```
 */
function _findDefaultPackageBinByBins(bins, defaultKey) {
    // 優先返回名稱相符的 bin / Return matching bin name first
    if (typeof defaultKey === 'string' && defaultKey in bins) {
        return bins[defaultKey];
    }
    // 若無相符名稱，返回第一個 bin / Return first bin if no match
    return (0, util_1.firstPackageBin)(bins);
}
exports.default = normalizePackageBins;
//# sourceMappingURL=index.js.map