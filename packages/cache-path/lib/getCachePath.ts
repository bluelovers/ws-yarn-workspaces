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

	// 處理字串參數形式的呼叫
	// Handle string parameter form of calling
	if (typeof _options === 'string')
	{
		options = {
			...opt,
			name: _options,
		}
	}

	// 若無選項則使用空物件
	// Use empty object if no options
	options ??= {};

	// 取得快取根目錄
	// Get cache root directory
	let root = getCacheRoot(options);

	// 取得基礎目錄名稱，預設為 '.cache'
	// Get base directory name, default is '.cache'
	let { base = defaultBase } = options;
	let { name } = options;

	// 組合暫存目錄路徑
	// Compose temp directory path
	let tmpdir = join(root, base);

	//ensureDirSync(tmpdir);

	let dir: string;

	// 若有提供名稱，建立具名目錄
	// If name is provided, create named directory
	if (name?.length)
	{
		// 正規化名稱（可選擇雜湊）
		// Normalize name (optionally hash)
		name = normalizeName(name, options.hash);

		dir = join(tmpdir, name)
	}
	// 若無名稱且不要求隨機目錄，返回暫存目錄
	// If no name and random not required, return temp directory
	else if (!options.randomIfNoName)
	{
		dir = tmpdir;
	}
	// 若要求隨機目錄，使用 tmp 套件建立
	// If random directory is required, use tmp package to create
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

	// 若要求建立目錄，確保目錄存在
	// If create is requested, ensure directory exists
	if (options.create)
	{
		ensureDirSync(dir);
	}

	// 若要求返回 thunk 函數
	// If thunk function is requested
	if (options.thunk)
	{
		// @ts-ignore
		// 建立 thunk 函數，可組合路徑
		// Create thunk function for path composition
		let fn: ICachePathThunk = (...args: string[]) => path.join(dir, ...args);

		// @ts-ignore
		// 將目錄路徑附加到函數上
		// Attach directory path to function
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
			// 處理字串參數形式的呼叫
			// Handle string parameter form of calling
			if (typeof options === 'string')
			{
				options = {
					...opt,
					name: options,
				}
			}

			// 若無選項則使用空物件
			// Use empty object if no options
			options ??= {};

			// 非同步取得快取根目錄
			// Asynchronously get cache root directory
			let root = await getCacheRootAsync(options);

			// 取得基礎目錄名稱，預設為 '.cache'
			// Get base directory name, default is '.cache'
			let { base = defaultBase } = options;
			let { name } = options;

			// 組合暫存目錄路徑
			// Compose temp directory path
			let tmpdir = join(root, base);

			let dir: string;

			// 若有提供名稱，建立具名目錄
			// If name is provided, create named directory
			if (name?.length)
			{
				// 正規化名稱（可選擇雜湊）
				// Normalize name (optionally hash)
				name = normalizeName(name, options.hash);

				dir = join(tmpdir, name)
			}
			// 若無名稱且不要求隨機目錄，返回暫存目錄
			// If no name and random not required, return temp directory
			else if (!options.randomIfNoName)
			{
				dir = tmpdir;
			}
			// 若要求隨機目錄，使用 tmp 套件非同步建立
			// If random directory is required, use tmp package to create asynchronously
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
						// 處理錯誤
						// Handle error
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

			// 若要求建立目錄，非同步確保目錄存在
			// If create is requested, asynchronously ensure directory exists
			if (options.create)
			{
				await ensureDir(dir);
			}

			// 若要求返回 thunk 函數
			// If thunk function is requested
			if (options.thunk)
			{
				// @ts-ignore
				// 建立 thunk 函數，可組合路徑
				// Create thunk function for path composition
				let fn: ICachePathThunk = (...args: string[]) => path.join(dir, ...args);

				// @ts-ignore
				// 將目錄路徑附加到函數上
				// Attach directory path to function
				fn.dir = dir;

				return fn;
			}

			return dir;
		})
		;
}


