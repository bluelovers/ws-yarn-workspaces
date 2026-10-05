import { buildDiff } from './lib/diff-service';
import { buildDiffTable } from './lib/formatter';
import { IOptionsParseVersionsDiff } from '@yarn-tool/semver-diff';
import { ITSValueOrArray } from 'ts-type/lib/type/base';
import { _buildDiffTableCore, _handleDiffTable } from './lib/formatter/buildDiffTable002';

export { buildDiff }
export { buildDiffTable }

/**
 * 計算兩（多）份 `yarn.lock` 之間的差異並回傳表格文字。
 * Compute the diff between two (or many) `yarn.lock` files and return it as a table string.
 *
 * 拆成 `buildDiff`（比對）與 `_buildDiffTableCore`／`_handleDiffTable`（渲染）兩個階段，
 * 是為了讓只想要差異節點、或想要自行排版的呼叫端可以跳過渲染階段。
 * Splitting the work into `buildDiff` (comparison) and `_buildDiffTableCore` / `_handleDiffTable`
 * (rendering) lets callers who only need the diff nodes, or who want custom layout, skip the
 * rendering stage.
 *
 * @param yarnlock_old 舊的 lockfile 內容，可為多份 / Old lockfile content, possibly multiple files
 * @param yarnlock_new 新的 lockfile 內容，可為多份 / New lockfile content, possibly multiple files
 * @param options 表格與上色選項 / Table and colorization options
 * @returns 差異表格文字；無差異時回傳空字串 / Diff table text, or an empty string when there is no diff
 */
export function yarnLockDiff(yarnlock_old: ITSValueOrArray<Buffer | string>,
	yarnlock_new: ITSValueOrArray<Buffer | string>,
	options?: IOptionsParseVersionsDiff
): string
{
	return _handleDiffTable(_yarnLockDiffCore(yarnlock_old, yarnlock_new, options), options)
}

/**
 * `yarnLockDiff` 的中間階段：只負責產生尚未序列化的表格結果。
 * The intermediate stage of `yarnLockDiff`: only produces the not-yet-serialized table result.
 *
 * 保留此函式是因為 `_ok` / `formatedDiff` 在序列化後就取不到，
 * 進階用法（例如自訂欄寬或二次加工）需要直接存取 `table` 物件。
 * Exposed because `_ok` / `formatedDiff` are lost after serialization; advanced usage such as
 * custom column widths or secondary processing needs the raw `table` object.
 *
 * @param options 缺少 `options` 會讓上色選擇退回環境偵測，因此這裡刻意不給預設值
 *                Without `options` the colorization choice falls back to environment detection,
 *                which is why no default is supplied here
 */
export function _yarnLockDiffCore(yarnlock_old: ITSValueOrArray<Buffer | string>, yarnlock_new: ITSValueOrArray<Buffer | string>, options: IOptionsParseVersionsDiff)
{
	const diff = buildDiff(yarnlock_old, yarnlock_new)

	return _buildDiffTableCore(diff, options)
}

/**
 * 預設匯出指向萬用入口 `yarnLockDiff`，
 * 讓 `import yarnLockDiff from '@yarn-tool/yarnlock-diff'` 與具名匯入行為一致。
 * The default export points at the all-in-one entry `yarnLockDiff`, so
 * `import yarnLockDiff from '@yarn-tool/yarnlock-diff'` behaves the same as the named import.
 */
export default yarnLockDiff
