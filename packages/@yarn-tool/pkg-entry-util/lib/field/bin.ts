/**
 * 處理 package.json entry 相關欄位的工具模組
 * Utility module for handling package.json entry-related fields
 */
import { IPackageJson } from '@ts-type/package-dts/package-json';
import { existsSync } from 'fs-extra';
import { join, posix } from 'upath2';

/**
 * 修復 bin 欄位的路徑
 * Fix the path of bin field
 *
 * 檢查 bin 檔案是否存在於根目錄，若不存在則檢查是否在 bin/ 子目錄中
 * Check if bin file exists in root directory, if not, check if it's in bin/ subdirectory
 *
 * @param {string} bin - bin 欄位的原始路徑 / Original path from bin field
 * @param {string} root - 套件根目錄路徑 / Package root directory path
 * @returns {string | null} 修正後的路徑或 null（若無需修正）/ Corrected path or null (if no fix needed)
 */
export function fixBinPath(bin: string, root: string)
{
	// 檢查檔案是否存在於指定路徑，若不存在但存在於 bin/ 子目錄則返回修正路徑
	// Check if file exists at specified path, if not but exists in bin/ subdirectory, return corrected path
	if (
		!existsSync(join(root, bin))
		&& existsSync(join(root, 'bin', bin))
	)
	{
		return join('.', 'bin', bin);
	}

	return null;
}

/**
 * 修復 package.json 的 bin 欄位路徑
 * Fix bin field paths in package.json
 *
 * 支援字串格式與物件格式的 bin 欄位，自動修正不正確的路徑
 * Supports both string and object format bin fields, automatically corrects incorrect paths
 *
 * @template T - package.json 類型 / package.json type
 * @param {T} pkg - package.json 物件 / package.json object
 * @param {string} root - 套件根目錄路徑 / Package root directory path
 * @returns {T} 修正後的 package.json 物件 / Corrected package.json object
 */
export function fixPkgBinField<T extends IPackageJson>(pkg: T, root: string)
{
	if (pkg.bin)
	{
		// 處理字串格式的 bin 欄位
		// Handle string format bin field
		if (typeof pkg.bin === 'string')
		{
			let bin_new = fixBinPath(pkg.bin, root);

			if (bin_new)
			{
				// @ts-ignore
				pkg.bin = bin_new;
			}
		}
		// 處理物件格式的 bin 欄位（多個執行檔）
		// Handle object format bin field (multiple executables)
		else if (typeof pkg.bin === 'object' && !Array.isArray(pkg.bin))
		{
			Object.keys(pkg.bin)
				.forEach(function (key)
				{
					if (typeof pkg.bin[key] === 'string')
					{
						let bin_new = fixBinPath(pkg.bin[key], root);

						if (bin_new)
						{
							pkg.bin[key] = bin_new;
						}
					}
				})
			;
		}
	}

	return pkg
}
