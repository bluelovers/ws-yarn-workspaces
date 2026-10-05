/**
 * Created by user on 2020/6/5.
 */
import { readPackages } from './readpkg';
import { workspacesPackagesList } from './listpkg';
import { IListableRow, IReadPackage, IOptionsPkgListable } from './types';
import IPackageJson from '@ts-type/package-dts';

/**
 * 將 readPackages() 的索引結果轉換為列（Row）清單。
 * Convert the index produced by `readPackages()` into a list of rows.
 *
 * @param readed 以套件名稱為鍵的已讀取資料。The read packages keyed by package name.
 * @param options 可提供 handler 自訂每列。Optional `handler` to customize each row.
 * @returns 轉換後的列清單；handler 回傳值會經過必要欄位檢查。The converted rows; values returned by `handler` are validated for required fields.
 */
export function wsPkgListableFromReaded<R extends IListableRow = IListableRow, T = IPackageJson>(readed: {
	[k: string]: IReadPackage<T>,
}, options?: IOptionsPkgListable<R>)
{
	const { handler } = options ?? {};

	return Object.values(readed)
		.map((data) => {

			// 從讀取結果取出必要欄位組成基礎列；private 經 !! 轉成布林值以符合 IListableRow。
			// Derive the required fields into a base row; coerce `private` to a boolean to satisfy `IListableRow`.
			const { name, fullpath: location } = data;
			let { version } = data.config;

			let row: IListableRow = {
				name,
				version,
				private: !!data.config.private,
				location,
				manifestLocation: data.manifestLocation,
			};

			// handler 可回傳 undefined 或缺少必要欄位；在此攔截並拋出 TypeError，避免下游拿到殘缺的列。
			// The handler may return `undefined` or omit required fields; intercept here and throw a `TypeError` so downstream code never receives an incomplete row.
			if (handler)
			{
				row = handler?.(row, data.config as any)

				if (typeof row === 'undefined' || typeof row.name === 'undefined' || typeof row.version === 'undefined' || typeof row.private === 'undefined' || typeof row.location === 'undefined')
				{
					throw new TypeError(`handler return not invalid data`)
				}
			}

			return row
		}) as R[]
	;
}

/**
 * 從一組套件路徑建立列清單，內部會先 readPackages() 再轉換。
 * Build a list of rows from package paths, internally calling `readPackages()` first.
 *
 * @param paths 套件資料夾路徑清單。List of package folder paths.
 * @param cwd 解析相對路徑的基準目錄，預設為 process.cwd()。Base directory for resolving relative paths; defaults to `process.cwd()`.
 * @param options 可提供 handler 自訂每列。Optional `handler` to customize each row.
 */
export function wsPkgListableFromPaths<R extends IListableRow = IListableRow>(paths: string[], cwd?: string, options?: IOptionsPkgListable<R>): R[]
{
	cwd = cwd ?? process.cwd();

	return wsPkgListableFromReaded(readPackages(paths, cwd), options)
}

/**
 * 一次完成「找工作區 → 列出套件 → 轉成列」的常用流程。
 * Convenience wrapper that locates the workspace, lists its packages, and converts them into rows in one call.
 *
 * @param cwd 工作區根目錄，預設為 process.cwd()。Workspace root; defaults to `process.cwd()`.
 * @param options 可提供 handler 自訂每列。Optional `handler` to customize each row.
 */
export function wsPkgListable<R extends IListableRow = IListableRow>(cwd?: string, options?: IOptionsPkgListable<R>)
{
	cwd = cwd ?? process.cwd();

	return wsPkgListableFromPaths(workspacesPackagesList(cwd), cwd, options)
}

export default wsPkgListable
