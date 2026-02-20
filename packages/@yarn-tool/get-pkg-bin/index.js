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
exports.defaultPackageBin = defaultPackageBin;
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
    let { pkgRoot, pkg, name } = (0, util_1.getPackageInfo)(options);
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
    let { pkgRoot, pkg, name } = (0, util_1.getPackageInfo)(options);
    let bins = normalizePackageBins({
        ...options,
        pkgRoot,
        pkg,
        name,
    });
    // 若未指定 defaultKey，從套件名稱推斷 / Infer defaultKey from package name if not specified
    if (defaultKey == null && typeof name === 'string') {
        defaultKey = name.split('/').pop();
    }
    // 優先返回名稱相符的 bin / Return matching bin name first
    if (typeof defaultKey === 'string' && defaultKey in bins) {
        return bins[defaultKey];
    }
    return (0, util_1.firstPackageBin)(bins);
}
exports.default = normalizePackageBins;
//# sourceMappingURL=index.js.map