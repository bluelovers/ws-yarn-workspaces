/**
 * get-pkg-bin 模組
 * get-pkg-bin module
 *
 * 從 package.json 取得 bin 腳本路徑的工具庫。
 * A utility for getting bin script paths from package.json.
 */
import { IOptions } from './lib/types';
export * from './lib/types';
export * from './util';
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
export declare function normalizePackageBins(options: IOptions): Record<string, string>;
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
export declare function defaultPackageBin(options: IOptions, defaultKey?: string): string;
export default normalizePackageBins;
