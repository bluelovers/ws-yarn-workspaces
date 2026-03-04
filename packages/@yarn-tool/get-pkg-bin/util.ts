/**
 * Created by user on 2020/2/16.
 *
 * 工具函數模組
 * Utility functions module
 */

import type { IPackageJson } from '@ts-type/package-dts';
import { sep, isAbsolute, normalize } from 'upath2';
import { resolvePackage } from '@yarn-tool/resolve-package';

export * from './lib/types';
import { IPackageJsonLike, IOptions } from './lib/types';

/**
 * 從 package.json 取得 bin 定義
 * Get bin definitions from package.json
 *
 * @description
 * 解析 package.json 的 bin 欄位，支援字串和物件兩種格式：
 *
 * 1. 字串格式（簡化形式）：
 *    - 當套件只有一個 bin 腳本時使用
 *    - bin 名稱自動設為套件名稱（pkg.name）
 *    - 範例：{ "name": "my-cli", "bin": "./cli.js" }
 *    - 結果：{ "my-cli": "./cli.js" }
 *
 * 2. 物件格式（完整形式）：
 *    - 當套件有多個 bin 腳本時使用
 *    - 鍵為 bin 名稱，值為腳本路徑
 *    - 範例：{ "name": "my-cli", "bin": { "my-cli": "./cli.js", "my-tool": "./tool.js" } }
 *    - 結果：{ "my-cli": "./cli.js", "my-tool": "./tool.js" }
 *
 * 3. 無 bin 欄位：
 *    - 返回 undefined
 *
 * @param pkg - package.json 物件 / package.json object
 * @returns bin 名稱與路徑的對應物件，若無 bin 欄位則為 undefined / Object mapping bin names to paths, or undefined if no bin field
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
 *
 * // 無 bin 欄位
 * getPackageBins({ name: 'no-bin-package' });
 * // undefined
 * ```
 */
export function getPackageBins(pkg: IPackageJsonLike): Record<string, string>
{
	if (pkg.bin != null)
	{
		// 字串格式：bin 名稱為套件名稱 / String format: bin name is the package name
		if (typeof pkg.bin === 'string')
		{
			return {
				[pkg.name]: pkg.bin,
			}
		}
		else
		{
			// 物件格式：直接返回 / Object format: return as-is
			return {
				...pkg.bin,
			}
		}
	}
}

/**
 * 處理 bin 路徑，解析為標準化格式
 * Handle bin paths, resolving to normalized format
 *
 * @description
 * 將 bin 路徑正規化，處理流程：
 *
 * 1. 若提供 resolveFn，先使用該函數解析路徑（在相對路徑前加上 './'）
 * 2. 檢查路徑是否為絕對路徑：
 *    - 若不是絕對路徑，在正規化後的路徑前加上 './'
 *    - 若是絕對路徑，只進行正規化
 *
 * 此函數確保所有輸出的路徑都具有統一的格式，便於後續處理。
 *
 * @typeParam K - bin 名稱類型 / bin name type
 * @param bins - bin 名稱與路徑的對應物件 / Object mapping bin names to paths
 * @param resolveFn - 路徑解析函數（可選）/ Path resolution function (optional)
 * @returns 處理後的 bin 物件 / Processed bin object
 *
 * @example
 * ```typescript
 * // 無解析函數，僅正規化
 * handlePackageBins({ 'my-cli': 'cli.js' });
 * // { 'my-cli': './cli.js' }
 *
 * // 使用解析函數
 * handlePackageBins(
 *   { 'my-cli': 'cli.js' },
 *   (bin) => '/absolute/path/' + bin
 * );
 * // { 'my-cli': './absolute/path/cli.js' }
 * ```
 */
export function handlePackageBins<K extends string>(bins: Record<K, string>,
	resolveFn?: (bin: string, ...argv) => string,
)
{
	// 建立相對路徑前綴（'./' 或 '.\\'）
	// Create relative path prefix
	const _cwd = '.' + sep;

	return Object.entries(bins)
		// FIXME: https://github.com/microsoft/TypeScript/issues/45064
		.reduce((a, [k, bin]: [string, any]) =>
		{
			// 若有提供解析函數，先解析路徑 / Resolve path if resolveFn is provided
			// 注意：在 bin 前加上 './' 以確保正確解析
			if (resolveFn)
			{
				bin = resolveFn(_cwd + bin as string);
			}

			// 正規化路徑並檢查是否為絕對路徑
			// Normalize path and check if absolute
			const normalizedBin = normalize(bin);
			if (!isAbsolute(normalizedBin))
			{
				// 相對路徑：加上 './' 前綴
				bin = _cwd + normalizedBin;
			}
			else
			{
				// 絕對路徑：直接使用正規化後的路徑
				bin = normalizedBin;
			}

			a[k] = bin;
			return a
		}, {} as Record<K, string>)
}

/**
 * 取得第一個 bin 腳本路徑
 * Get the first bin script path
 *
 * @description
 * 從 bin 物件中取得第一個 bin 腳本的路徑。
 *
 * 注意：JavaScript 物件的鍵順序在 ES2015+ 中是有保障的（按插入順序），
 * 因此 "第一個" bin 是指在 bin 物件中定義的第一個鍵。
 *
 * 使用場景：
 * - 當無法確定套件的主要 bin 名稱時
 * - 作為 fallback 機制取得可用的 bin
 *
 * @param bins - bin 名稱與路徑的對應物件 / Object mapping bin names to paths
 * @returns 第一個 bin 的路徑，若無則為 undefined / Path of the first bin, or undefined if none
 *
 * @example
 * ```typescript
 * firstPackageBin({ 'cli': './cli.js', 'tool': './tool.js' });
 * // => './cli.js'
 *
 * firstPackageBin({});
 * // => undefined
 *
 * firstPackageBin(null);
 * // => undefined
 * ```
 */
export function firstPackageBin(bins: Record<string, string>): string
{
	// 防禦式處理：若 bins 為 null/undefined，使用空物件
	// Defensive: use empty object if bins is null/undefined
	bins = bins || {};
	let keys = Object.keys(bins);

	// 若存在任何鍵，返回第一個 bin 的路徑
	// Return first bin path if any keys exist
	if (keys.length)
	{
		return bins[keys[0]]
	}

	// 無 bin 時返回 undefined（隱式）
	// Return undefined implicitly when no bins
}

/**
 * 從選項中取得套件資訊
 * Get package information from options
 *
 * @description
 * 根據選項配置取得套件的名稱、根目錄和 package.json 內容。
 *
 * 解析邏輯：
 * 1. 若提供 `pkg`（package.json 物件）：
 *    - 從 pkg.name 取得套件名稱（若 options.name 未提供）
 *    - pkgRoot 保持不變（由呼叫者提供或為 undefined）
 *
 * 2. 若提供 `name`（套件名稱）：
 *    - 使用 resolvePackage 解析套件位置
 *    - 支援與 @yarn-tool/require-resolve 相同的擴充選項
 *      - paths: 額外的模組搜尋路徑
 *      - includeGlobal: 是否包含全域 node_modules
 *      - includeCurrentDirectory: 是否包含當前目錄
 *      - cwd: 當前工作目錄
 *    - 取得 pkgRoot（套件根目錄）和 pkg（package.json 內容）
 *
 * 3. 若兩者皆未提供：
 *    - 拋出 TypeError
 *
 * @param options - 選項配置 / Options configuration
 * @returns 套件資訊物件 / Package information object
 * @throws TypeError 若未提供有效的 name 或 pkg / If valid name or pkg is not provided
 *
 * @example
 * ```typescript
 * // 使用套件名稱解析
 * getPackageInfo({ name: 'ts-node', includeGlobal: true });
 * // => { name: 'ts-node', pkgRoot: '/path/to/ts-node', pkg: { ... } }
 *
 * // 使用 package.json 物件
 * getPackageInfo({ pkg: { name: 'my-cli', bin: './cli.js' } });
 * // => { name: 'my-cli', pkgRoot: undefined, pkg: { ... } }
 *
 * // 兩者都提供（name 作為備用）
 * getPackageInfo({ name: 'override-name', pkg: { name: 'pkg-name', ... } });
 * // => { name: 'override-name', ... }
 * ```
 */
export function getPackageInfo(options: IOptions)
{
	let { pkgRoot, pkg, name, paths, includeGlobal, includeCurrentDirectory, cwd } = options;

	// 若有提供 pkg，從中取得名稱 / If pkg is provided, get name from it
	if (pkg)
	{
		// 優先使用 options.name，若無則使用 pkg.name
		name = name || options.pkg.name;
	}
	else if (name)
	{
		// 若有提供 name，解析套件資訊 / If name is provided, resolve package info
		// 使用擴充選項 / Use extended options
		let data = resolvePackage(options.name, {
			paths,
			includeGlobal,
			includeCurrentDirectory,
			cwd,
		});
		pkg = data.pkg;
		// 若未提供 pkgRoot，使用解析出的 pkgRoot
		pkgRoot = pkgRoot || data.pkgRoot;
	}
	else
	{
		// 兩者皆未提供，拋出錯誤
		throw new TypeError(`name or pkg is not valid`)
	}

	return {
		name,
		pkgRoot,
		pkg: pkg as IPackageJson,
	}
}

/**
 * getPackageInfo 的回傳類型
 * Return type of getPackageInfo
 */
export type IGetPackageInfoResult = ReturnType<typeof getPackageInfo>;

/**
 * 處理預設 bin 名稱
 * Handle the default bin name
 *
 * @description
 * 根據套件資訊處理預設的 bin 名稱：
 *
 * 1. 若已提供有效的 defaultKey（非空字串），直接返回
 * 2. 若未提供，從套件名稱推斷：
 *    - 移除 scope（例如 @scope/pkg-name → pkg-name）
 *    - 使用套件名稱的最後一部分
 *
 * 此函數用於找出與套件名稱相符的 bin，這是 npm/yarn 的常見慣例。
 *
 * @param pkgInfo - 套件資訊（由 getPackageInfo 取得）/ Package info from getPackageInfo
 * @param defaultKey - 預設的 bin 名稱（可選）/ Default bin name (optional)
 * @returns 處理後的 bin 名稱，或 undefined / Processed bin name, or undefined
 *
 * @example
 * ```typescript
 * // 使用提供的 defaultKey
 * _handleDefaultKey({ name: 'my-package', ... }, 'custom-bin');
 * // => 'custom-bin'
 *
 * // 從無 scope 的套件名稱推斷
 * _handleDefaultKey({ name: 'my-package', ... }, undefined);
 * // => 'my-package'
 *
 * // 從有 scope 的套件名稱推斷
 * _handleDefaultKey({ name: '@scope/my-package', ... }, undefined);
 * // => 'my-package'
 * ```
 */
export function _handleDefaultKey(pkgInfo: IGetPackageInfoResult, defaultKey?: string)
{
	// 若未指定 defaultKey，從套件名稱推斷 / Infer defaultKey from package name if not specified
	// 處理 scope 套件：@scope/pkg-name → pkg-name
	if (!defaultKey?.length && typeof pkgInfo.name === 'string')
	{
		defaultKey = pkgInfo.name.split('/').pop();
	}

	return defaultKey
}
