/**
 * 處理 package.json exports 欄位的工具模組
 * Utility module for handling package.json exports field
 */
import { IPackageJson } from '@ts-type/package-dts/package-json';
import { PackageExportsEntry, PackageExportsFallback } from '@ts-type/package-dts/types/package.json';
import { pathExistsSync } from 'fs-extra';
import { findRootLazy } from '@yarn-tool/find-root';
import { resolvePackage, resolvePackageRoot } from '@yarn-tool/resolve-package';

/**
 * 在 exports 物件中添加 package.json entry 的核心函數
 * Core function to add package.json entry in exports object
 *
 * 確保 exports 包含 './package.json' 入口點，讓外部可以匯入 package.json
 * Ensure exports includes './package.json' entry point for external package.json import
 *
 * @template T - exports 欄位類型 / exports field type
 * @param {T} pkgExports - package.json 的 exports 物件 / exports object from package.json
 * @returns {T} 修正後的 exports 物件 / Corrected exports object
 */
export function _pkgExportsAddPJsonEntryCore<T extends IPackageJson["exports"]>(pkgExports: T)
{
	if (typeof pkgExports === 'object')
	{
		// 若 './package.json' entry 不存在則添加
		// Add './package.json' entry if not exists
		pkgExports['./package.json'] ??= './package.json';
	}

	return pkgExports
}

/**
 * 在 package.json 的 exports 欄位中添加 package.json entry
 * Add package.json entry to exports field in package.json
 *
 * @template T - package.json 類型 / package.json type
 * @param {T} pkg - package.json 物件 / package.json object
 * @returns {T} 修正後的 package.json 物件 / Corrected package.json object
 */
export function pkgExportsAddPJsonEntry<T extends IPackageJson>(pkg: T)
{
	_pkgExportsAddPJsonEntryCore(pkg.exports);

	return pkg
}

/**
 * 判斷是否為有效的 package exports entry
 * Determine if it's a valid package exports entry
 *
 * 檢查 entry 是否以 './' 開頭且值不為空
 * Check if entry starts with './' and value is not empty
 *
 * @param {string} entry - exports 的鍵名 / exports key name
 * @param {PackageExportsEntry | PackageExportsFallback} value - exports 的值 / exports value
 * @returns {boolean} 是否為有效的 PackageExportsEntry / Whether it's a valid PackageExportsEntry
 */
export function _isPackageExportsEntry(entry: string | keyof keyof IPackageJson["exports"],
	value: PackageExportsEntry | PackageExportsFallback,
): value is PackageExportsEntry
{
	return entry.startsWith('./') && !!(value ?? false)
}

/**
 * 驗證 package exports 路徑是否存在
 * Verify if package exports paths exist
 *
 * 檢查 exports 中定義的所有檔案路徑是否存在於檔案系統中
 * Check if all file paths defined in exports exist in the file system
 *
 * @template T - package.json 類型 / package.json type
 * @param {T} pkg - package.json 物件 / package.json object
 * @param {object} options - 選項 / Options
 * @param {string} options.cwd - 當前工作目錄 / Current working directory
 * @returns {null} 無返回值 / No return value
 * @throws {Error} 當 exports 路徑不存在時拋出錯誤 / Throws error when exports paths don't exist
 */
export function pkgExportsVerify<T extends IPackageJson>(pkg: T, options?: {
	cwd?: string,
})
{
	if (typeof pkg.exports === 'object')
	{
		// 尋找套件根目錄
		// Find package root directory
		const rootData = findRootLazy({
			cwd: options?.cwd,
		});

		if (!rootData.isWorkspace && rootData.pkg)
		{
			const list: string[] = [];

			// 遍歷所有 exports entry 檢查路徑
			// Iterate all exports entries to check paths
			Object.entries(pkg.exports)
				.forEach(([entry, value]) =>
				{
					if (_isPackageExportsEntry(entry, value))
					{
						const _ = resolvePackage(rootData.pkg);

						// 將值轉換為陣列並檢查每個檔案路徑
						// Convert value to array and check each file path
						([typeof value === 'string' ? value : Object.values(value)] as string[])
							.flat()
							.forEach(file =>
							{
								/**
								 * 跳過包含萬用字元 '*' 的路徑檢查
								 * Skip path check for wildcard '*' patterns
								 */
								if (file.includes?.('*'))
								{
									return;
								}

								const bool = pathExistsSync(_.resolveLocation(file));

								if (!bool)
								{
									list.push(`path of '${entry}' does not exist: '${file}'`);
								}

							})
						;
					}
				})
			;

			// 若有錯誤則拋出包含詳細資訊的錯誤
			// Throw error with details if there are any issues
			if (list.length > 0)
			{
				let err = new Error(`Invalid package exports: ${rootData.pkg}\n${list.slice().map(v => ` - ${v}`).join('\n')}`);

				// @ts-ignore - 附加錯誤詳細資訊 / Attach error details
				err.list = list;
				// @ts-ignore - 附加根目錄資訊 / Attach root data
				err.rootData = rootData;
				// @ts-ignore - 附加 exports 資訊 / Attach exports info
				err.pkgExports = pkg.exports;

				throw err;
			}
		}

	}

	return null as null
}
