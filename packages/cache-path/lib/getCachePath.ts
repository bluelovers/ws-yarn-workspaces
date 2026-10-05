/**
 * 快取路徑取得模組
 * Cache Path Getter Module
 *
 * 此模組提供取得快取目錄路徑的同步和非同步函數，
 * This module provides synchronous and asynchronous functions to get cache directory paths,
 * 支援自訂名稱、雜湊和隨機目錄功能。
 * supporting custom names, hashing, and random directory features.
 *
 * @module cache-path/lib/getCachePath
 */

import { IOptions, ICachePathThunk } from './types';
import { getCacheRoot, getCacheRootAsync } from './getCacheRoot';
import { normalizeName } from './normalizeName';
import path, { join } from "upath2";
import { ensureDirSync, ensureDir } from 'fs-extra';
import Bluebird from 'bluebird';
import { dirSync, dir as dirCB } from 'tmp';

/**
 * 快取根目錄下的預設基礎目錄名稱
 * Default base directory name at cache root
 */
export const defaultBase = '.cache';

/**
 * 取得快取目錄路徑（同步版本）
 * Get cache directory path (synchronous version)
 *
 * 此函數會根據選項配置，返回適當的快取目錄路徑。
 * This function returns an appropriate cache directory path based on options configuration.
 * 支援多種呼叫方式和配置選項。
 * Supports multiple calling styles and configuration options.
 *
 * @param {string | IOptions} [_options] - 快取名稱或選項配置 / Cache name or options configuration
 * @param {IOptions} [opt] - 額外的選項配置 / Additional options configuration
 * @returns {string | ICachePathThunk} 快取目錄路徑或 thunk 函數 / Cache directory path or thunk function
 *
 * @example
 * // 取得預設快取目錄 / Get default cache directory
 * const cacheDir = getCachePath();
 *
 * @example
 * // 取得具名快取目錄 / Get named cache directory
 * const cacheDir = getCachePath('my-cache');
 *
 * @example
 * // 取得 thunk 函數以便組合路徑 / Get thunk function for path composition
 * const cacheThunk = getCachePath({ name: 'my-cache', thunk: true });
 * const filePath = cacheThunk('subdir', 'file.txt');
 */
export function getCachePath(options: IOptions & {
	thunk: true,
}): ICachePathThunk
// @ts-ignore
export function getCachePath(name: string, options: IOptions & {
	thunk: true,
}): ICachePathThunk
export function getCachePath(name: string, options?: IOptions): string
export function getCachePath(options?: IOptions): string
export function getCachePath(_options: IOptions, opt?)
{
	let options: IOptions;

	/**
	 * 同步版本支援 `getCachePath('name')` 的字串簡寫，
	 * 字串須轉成 options 才能與其餘選項合併
	 * The sync version supports the `getCachePath('name')` string shorthand;
	 * the string must become options so it can merge with the rest
	 */
	if (typeof _options === 'string')
	{
		options = {
			...opt,
			name: _options,
		}
	}

	/**
	 * 參數完全省略時退回空物件，讓後面的解構一律有值
	 * When the argument is omitted entirely, fall back to an empty object so later destructuring always has a value
	 */
	options ??= {};

	/**
	 * 取得快取根目錄（內部會依 fnOrder 嘗試各種來源）
	 * Get the cache root directory (internally tries each source via fnOrder)
	 */
	let root = getCacheRoot(options);

	let { base = defaultBase } = options;
	let { name } = options;

	/**
	 * 組合暫存目錄路徑：root/base，稍後再接上 name
	 * Compose the temp directory path: root/base, with name appended later
	 */
	let tmpdir = join(root, base);

	//ensureDirSync(tmpdir);

	let dir: string;

	/**
	 * 有名稱時走具名子目錄：同一個快取根目錄可被多個套件共用，
	 * 名稱（或其雜湊）就是彼此的區隔
	 * With a name, use a named subdirectory: multiple packages may share one cache root,
	 * and the name (or its hash) is what keeps them apart
	 */
	if (name?.length)
	{
		/**
		 * 正規化名稱（可選擇雜湊），避免無效字元破壞路徑
		 * Normalize the name (optionally hashed) so invalid characters cannot break the path
		 */
		name = normalizeName(name, options.hash);

		dir = join(tmpdir, name)
	}
	/**
	 * 未指定名稱時直接回傳共用的 root/base；
	 * 這正是 `find-cache-dir` 式的「專案快取目錄」行為
	 * Without a name, return the shared root/base;
	 * this is exactly the `find-cache-dir`-style "project cache directory" behavior
	 */
	else if (!options.randomIfNoName)
	{
		dir = tmpdir;
	}
	/**
	 * 需要彼此隔離的暫存目錄時交給 tmp 建立，
	 * name 在此清空，讓 tmp 自行產生隨機名稱
	 * When isolated temp directories are needed, tmp creates them;
	 * name is cleared here so tmp generates its own random name
	 */
	else
	{
		name = void 0;

		dir = dirSync({
			...options,
			tmpdir,
			//keep: true,
			name,
		}).name;
	}

	/**
	 * 要求 create 時立即建立，讓呼叫端拿到路徑即可寫入
	 * When create is requested, build it now so callers can write as soon as they get the path
	 */
	if (options.create)
	{
		ensureDirSync(dir);
	}

	/**
	 * thunk 模式回傳函數而非字串，
	 * 呼叫端可在事後自行組合子路徑而不必再查一次根目錄
	 * In thunk mode a function is returned instead of a string,
	 * so callers can compose subpaths later without re-resolving the root
	 */
	if (options.thunk)
	{
		/**
		 * 建立 thunk 函數，可組合路徑
		 * Create thunk function for path composition
		 */
		// @ts-ignore
		let fn: ICachePathThunk = (...args: string[]) => path.join(dir, ...args);

		/**
		 * 將目錄路徑附加到函數上
		 * Attach directory path to function
		 */
		// @ts-ignore
		fn.dir = dir;

		return fn;
	}

	return dir;
}

/**
 * 取得快取目錄路徑（非同步版本）
 * Get cache directory path (asynchronous version)
 *
 * 此函數是非同步版本的 getCachePath，返回 Bluebird Promise。
 * This function is the asynchronous version of getCachePath, returning a Bluebird Promise.
 * 適用於需要非同步檔案操作的場景。
 * Suitable for scenarios requiring asynchronous file operations.
 *
 * @param {string | IOptions} [options] - 快取名稱或選項配置 / Cache name or options configuration
 * @param {IOptions} [opt] - 額外的選項配置 / Additional options configuration
 * @returns {Bluebird<string | ICachePathThunk>} 快取目錄路徑或 thunk 函數的 Promise / Promise of cache directory path or thunk function
 *
 * @example
 * const cacheDir = await getCachePathAsync('my-cache');
 * console.log(cacheDir); // 快取目錄路徑 / Cache directory path
 */
export function getCachePathAsync(options: IOptions & {
	thunk: true,
}): Bluebird<ICachePathThunk>
// @ts-ignore
export function getCachePathAsync(name: string, options: IOptions & {
	thunk: true,
}): Bluebird<ICachePathThunk>
export function getCachePathAsync(name: string, options?: IOptions): Bluebird<string>
export function getCachePathAsync(options?: IOptions): Bluebird<string>
export function getCachePathAsync(options: IOptions, opt?)
{
	return Bluebird.resolve()
		.then(async function ()
		{
			/**
			 * 與同步版本相同，支援字串簡寫形式
			 * Same as the sync version: supports the string shorthand form
			 */
			if (typeof options === 'string')
			{
				options = {
					...opt,
					name: options,
				}
			}

			/**
			 * 參數完全省略時退回空物件，讓後面的解構一律有值
			 * When the argument is omitted entirely, fall back to an empty object so later destructuring always has a value
			 */
			options ??= {};

			/**
			 * 非同步取得快取根目錄（來源函式可能需要執行指令）
			 * Asynchronously get the cache root (source finders may need to run commands)
			 */
			let root = await getCacheRootAsync(options);

			let { base = defaultBase } = options;
			let { name } = options;

			/**
			 * 組合暫存目錄路徑：root/base
			 * Compose the temp directory path: root/base
			 */
			let tmpdir = join(root, base);

			let dir: string;

			/**
			 * 有名稱時走具名子目錄，與同步版本行為一致
			 * With a name, use a named subdirectory — behavior matches the sync version
			 */
			if (name?.length)
			{
				/**
				 * 正規化名稱（可選擇雜湊）
				 * Normalize the name (optionally hashed)
				 */
				name = normalizeName(name, options.hash);

				dir = join(tmpdir, name)
			}
			/**
			 * 未指定名稱時回傳共用的 root/base
			 * Without a name, return the shared root/base
			 */
			else if (!options.randomIfNoName)
			{
				dir = tmpdir;
			}
			/**
			 * 隨機目錄改用 tmp 的非同步 API，
			 * 避免同步阻塞事件迴圈（這是與同步版本的主要差異）
			 * Random directories use tmp's async API instead,
			 * so the event loop is not blocked — the main difference from the sync version
			 */
			else
			{
				name = void 0;

				dir = await new Bluebird((resolve, reject) =>
				{
					dirCB({
						...options,
						tmpdir,
						//keep: true,
						name,
					}, (err, ret) =>
					{
						/**
						 * tmp 以 callback 回報錯誤，這裡轉成 Promise 的拒絕，
						 * 讓呼叫端能以 try/catch 或 .catch() 統一處理
						 * tmp reports errors via callback; convert to a Promise rejection
						 * so callers can handle them uniformly with try/catch or .catch()
						 */
						if (err)
						{
							reject(err)
						}
						else
						{
							resolve(ret)
						}
					})
				}).then(ret =>
				{
					return ret as string
				})
			}

			/**
			 * 要求 create 時非同步建立目錄
			 * When create is requested, create the directory asynchronously
			 */
			if (options.create)
			{
				await ensureDir(dir);
			}

			/**
			 * thunk 模式回傳函數而非字串，行為與同步版本一致
			 * Thunk mode returns a function instead of a string; behavior matches the sync version
			 */
			if (options.thunk)
			{
				/**
				 * 建立 thunk 函數，可組合路徑
				 * Create thunk function for path composition
				 */
				// @ts-ignore
				let fn: ICachePathThunk = (...args: string[]) => path.join(dir, ...args);

				/**
				 * 將目錄路徑附加到函數上
				 * Attach directory path to function
				 */
				// @ts-ignore
				fn.dir = dir;

				return fn;
			}

			return dir;
		})
		;
}


