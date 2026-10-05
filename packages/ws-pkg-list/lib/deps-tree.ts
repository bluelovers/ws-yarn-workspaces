/**
 * Created by user on 2020/6/13.
 */

import { IListableRowExtra, IOptionsPkgListable, IListableRowWithDeps, IListableRowExtraWithDeps } from './types';
import IPackageJson from '@ts-type/package-dts';
import { normalizeListableRowExtra, listableToRecord } from './util';
import { findRoot } from '@yarn-tool/find-root';
import { wsPkgListable } from './listable';

/**
 * 取得含各種依賴欄位的套件列清單（含相對於根目錄的 prefix）。
 * Build a list of package rows that includes dependency fields and a `prefix` relative to the root.
 *
 * @param cwd 起始目錄，會向上尋找工作區根目錄；找不到時拋出錯誤。Starting directory; walks up to the workspace root, throwing when not found.
 * @param options 可提供 handler 自訂每列，會在內建處理之後被呼叫。Optional `handler` to customize each row; it runs after the built-in processing.
 * @returns 含依賴欄位的列清單。Rows carrying the dependency fields.
 */
export function wsPkgDepsListable<R extends IListableRowExtraWithDeps>(cwd?: string,
	options?: IOptionsPkgListable<R>,
): R[]
{
	// 依賴分析必須以工作區根目錄為基準；throwError:true 讓找不到根目錄時立即失敗而非靜默產生空結果。
	// Dependency analysis must be rooted at the workspace root; `throwError:true` fails fast instead of silently returning empty results.
	cwd = findRoot({
		cwd: cwd ?? process.cwd(),
		throwError: true,
	}).root;

	// 將四種依賴欄位抄進列上；package.json 未宣告的欄位保持 undefined，不強制補空物件。
	// Copy the four dependency fields onto the row; fields absent in `package.json` stay `undefined` rather than being forced to empty objects.
	let _handler = (row: IListableRowWithDeps, pkg: IPackageJson) =>
	{
		row.dependencies = pkg.dependencies;
		row.devDependencies = pkg.devDependencies;
		row.optionalDependencies = pkg.optionalDependencies;
		row.peerDependencies = pkg.peerDependencies;

		return row;
	};

	// 先正規化路徑並加上 prefix，再附加依賴欄位，確保 handler 看到的是完整資料。
	// Normalize paths and attach `prefix` before adding dependencies, so the handler always sees complete data.
	let handler = (row: IListableRowWithDeps, pkg: IPackageJson) =>
	{
		return _handler(normalizeListableRowExtra(row, cwd), pkg)
	}

	// 使用者自訂 handler 應在內建處理之後執行，使其能覆寫依賴欄位或進一步加工。
	// The user-supplied handler runs after the built-in one so it can override dependency fields or post-process further.
	if (options?.handler)
	{
		let _handler_old = options.handler;
		let _old = handler;

		handler = (row: IListableRowWithDeps, pkg: IPackageJson) =>
		{
			return _handler_old(_old(row, pkg), pkg)
		}
	}

	// 以 any 逸出泛型約束：實際回傳型別由 R 決定，交由呼叫端的轉型負責任。
	// Escape the generic constraint with `any`: the actual return type is decided by `R`, leaving the cast to the caller.
	return wsPkgListable<any>(cwd, {
		...options,
		handler,
	}) as any
}

/**
 * 取得含依賴資訊的套件列，並轉成以套件名稱為鍵的記錄（Record）。
 * Build dependency-bearing rows and convert them into a record keyed by package name.
 *
 * @param cwd 起始目錄，會向上尋找工作區根目錄。Starting directory; walks up to the workspace root.
 * @param options 可提供 handler 自訂每列。Optional `handler` to customize each row.
 * @returns 以 name 為鍵的依賴列記錄。A record of dependency rows keyed by `name`.
 */
export function wsPkgDepsListableRecord<R extends IListableRowExtraWithDeps>(cwd?: string,
	options?: IOptionsPkgListable<R>,
)
{
	return listableToRecord(wsPkgDepsListable(cwd, options))
}

export default wsPkgDepsListableRecord
