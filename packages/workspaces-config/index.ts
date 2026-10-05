/**
 * 解析與分類 workspaces 設定的核心模組
 * Core module for parsing and classifying workspaces configuration
 *
 * 從 package.json 讀取 `workspaces` 欄位，正規化兩種設定格式，
 * 並將樣式分類為靜態路徑與 glob 前綴，供 monorepo 初始化工具使用。
 * Reads the `workspaces` field from package.json, normalizes both configuration formats,
 * and classifies patterns into static paths and glob prefixes for monorepo scaffolding tools.
 *
 * Created by user on 2018/5/14/014.
 *
 * @packageDocumentation
 */

import findPkg from 'find-pkg-ws';
import { readJSONSync } from 'fs-extra';
import { join, posix } from 'path';

/**
 * workspaces 的物件格式設定
 * Object-format workspaces configuration
 */
export type WorkspacesConfig = {
	/** 套件樣式列表 / List of package patterns */
	packages?: WorkspacesConfigArray,
	/** Yarn 1 的 nohoist 設定，原樣保留 / Yarn 1 nohoist setting, preserved as-is */
	nohoist?: Array<string>,
};

/**
 * workspaces 的樣式陣列（陣列格式）
 * Array of workspace patterns (array format)
 */
export type WorkspacesConfigArray = Array<string>;

/**
 * 讀取指定目錄所屬 package.json 的 workspaces 設定
 * Read the workspaces configuration of the package.json owning the given directory
 *
 * @param {string} [cwd] - 起始目錄，預設為目前目錄 / Starting directory, defaults to current working directory
 * @returns {WorkspacesConfig} 正規化後的 workspaces 設定 / Normalized workspaces configuration
 * @throws {RangeError} 找不到 package.json 時拋出，代表該目錄不屬於任何套件
 *                     Thrown when no package.json is found, meaning the directory does not belong to any package
 *
 * @example
 * getConfig(); // => { packages: ['packages/*'] }
 */
export function getConfig(cwd?: string)
{
	/**
	 * 向上尋找最近的 package.json；找不到時不能繼續，否則無法得知 workspaces 設定
	 * Search upward for the nearest package.json; without it there is no way to know the workspaces configuration
	 */
	let file = findPkg(cwd);

	if (!file)
	{
		throw new RangeError();
	}

	let pkg = readJSONSync(file);

	return parseWorkspaces(pkg.workspaces);
}

/**
 * 將兩種 workspaces 格式正規化為物件格式
 * Normalize both workspaces formats into the object format
 *
 * 陣列格式會被包成 `{ packages: [...] }`，其餘情況原樣回傳，
 * 讓下游函式只需處理一種結構。
 * Array format is wrapped as `{ packages: [...] }` and everything else is returned as-is,
 * so downstream functions only deal with a single shape.
 *
 * @param {WorkspacesConfig|WorkspacesConfigArray} workspaces - 任一格式的 workspaces 設定 / Workspaces configuration in either format
 * @returns {WorkspacesConfig} 物件格式的設定 / Configuration in object format
 */
export function parseWorkspaces(workspaces: WorkspacesConfig | WorkspacesConfigArray)
{
	/**
	 * 以 Array.isArray 判斷格式，避免依賴欄位存在與否造成誤判
	 * Use Array.isArray to detect the format instead of relying on field presence, which could misclassify input
	 */
	let ws = Array.isArray(workspaces) ? {
		packages: workspaces,
	}: workspaces;

	return ws as WorkspacesConfig;
}

/**
 * parseStaticPackagesPaths 的回傳結構
 * Return structure of parseStaticPackagesPaths
 */
export interface IParseStaticPackagesPathsReturnType
{
	/** 所有片段皆為純名稱的靜態路徑，如 `packages/foo` / Static paths whose segments are all plain names, e.g. `packages/foo` */
	static: string[];
	/** 前綴樣式的最上層名稱，如 `packages` / Top-level name of a prefix pattern, e.g. `packages` */
	prefixRoot: string[];
	/** 前綴樣式的完整路徑，如 `packages` 或 `@scope/pkg` / Full path of a prefix pattern, e.g. `packages` or `@scope/pkg` */
	prefix: string[];
	/** 前綴去掉第一段後的路徑，單段前綴時為空字串 / Prefix minus its first segment, empty string for a single-segment prefix */
	prefixSub: string[];
	/** 原始樣式列表，不論是否可解析皆會收錄 / Original patterns, collected whether or not they could be parsed */
	all: string[];
}

/**
 * 將 workspaces 樣式分類為靜態路徑與 glob 前綴
 * Classify workspace patterns into static paths and glob prefixes
 *
 * 判定關鍵在於「第一個無法通過名稱檢查的片段」：
 * 全部片段皆有效代表這是可直接對應資料夾的靜態路徑；
 * 只有前半段有效則代表其餘為 glob，該有效前半段即為前綴。
 * The key is the first segment that fails the name check: all-valid segments mean a static folder path,
 * while only a valid leading portion means the rest is a glob and that portion is the prefix.
 *
 * @param {WorkspacesConfig|WorkspacesConfigArray} workspaces - 任一格式的 workspaces 設定 / Workspaces configuration in either format
 * @returns {IParseStaticPackagesPathsReturnType} 分類結果 / Classification result
 *
 * @example
 * parseStaticPackagesPaths(['packages/*']);
 * // => { static: [], prefixRoot: ['packages'], prefix: ['packages'], prefixSub: [''], all: ['packages/*'] }
 *
 * @example
 * parseStaticPackagesPaths(['packages/foo']);
 * // => { static: ['packages/foo'], prefixRoot: [], prefix: [], prefixSub: [], all: ['packages/foo'] }
 */
export function parseStaticPackagesPaths(workspaces: WorkspacesConfig | WorkspacesConfigArray): IParseStaticPackagesPathsReturnType
{
	/**
	 * 先正規化，確保陣列格式與物件格式走同一條剖析路徑
	 * Normalize first so both formats go through the same parsing path
	 */
	workspaces = parseWorkspaces(workspaces);

	/**
	 * 以 reduce 累積五個分類桶，單次走訪即可完成分類
	 * Accumulate the five classification buckets in a single pass via reduce
	 */
	return (workspaces.packages || [])
		.reduce(function (a, row)
		{
			/**
			 * 儲存目前樣式中「通過名稱檢查」的連續片段
			 * Store the leading segments of the pattern that pass the name check
			 */
			let b: string[] = [];

			/**
			 * 同時接受 `/` 與 `\`，讓 Windows 與 POSIX 樣式都能剖析
			 * Accept both `/` and `\` so Windows and POSIX style patterns both parse
			 */
			let ls = row.split(/[\\\/]/);

			ls
				.every(function (v)
				{
					/**
					 * 片段需為純名稱（可帶 scoped 的 `@` 前綴、英數字、底線、連字號）；
					 * `*`、`**`、`.` 等會在此被擋下
					 * A segment must be a plain name (optional scoped `@`, word chars, dashes);
					 * `*`, `**`, `.` and friends are rejected here
					 */
					let bool = /^@?[\w\-]+$/.test(v);

					if (bool)
					{
						b.push(v);
					}

					/**
					 * 回傳 false 會中斷 every，保留「只取第一個無效片段之前」的語意
					 * Returning false aborts every, preserving the "stop at the first invalid segment" behaviour
					 */
					return bool;
				})
			;

			if (b.length)
			{
				/**
				 * 片段數不同代表後方還有未解析的 glob，屬於前綴樣式；
				 * 片段數相同則代表整條路徑皆為靜態路徑
				 * A differing segment count means unresolved globs remain (prefix pattern);
				 * equal counts mean the whole path is static
				 */
				if (b.length != ls.length)
				{
					a.prefixRoot.push(b[0]);
					a.prefix.push(posix.join(...b));

					let p = posix.join(...b.slice(1));

					/**
					 * 單段前綴（如 `packages/*`）的 slice(1) 會得到 `.`，
					 * 轉為空字串比保留 `.` 更便於後續以路徑方式組合
					 * A single-segment prefix (e.g. `packages/*`) yields `.` from slice(1);
					 * converting it to an empty string is easier to rejoin as a path later
					 */
					a.prefixSub.push(p === '.' ? '' : p);
				}
				else
				{
					a.static.push(posix.join(...b));
				}
			}

			/**
			 * 不論是否解析成功都收進 all，確保呼叫者仍可取得原始樣式清單
			 * Collect into all regardless of parse success so callers always see the original pattern list
			 */
			a.all.push(row);

			return a;
		}, {
			static: [] as string[],
			prefixRoot: [] as string[],
			prefix: [] as string[],
			prefixSub: [] as string[],

			all: [] as string[],
		})
	;
}

/**
 * 轉發 find-pkg-ws，讓使用者不需額外安裝即可取得尋找 package.json 的能力
 * Re-export find-pkg-ws so consumers can locate package.json without an extra dependency
 */
export { findPkg }

/**
 * 預設匯出讀取設定的入口函式，`require('workspaces-config')` 即可直接呼叫
 * Default-exports the config reader so `require('workspaces-config')` can call it directly
 */
export default getConfig


