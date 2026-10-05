import { EnumKinds, IDiffNode } from '@bluelovers/deep-diff';
import { IComputedPackage } from '../diff-service/types';
import { _formatVersion } from './formatVersion';
import { _diffArray } from './diffArray002';
import { colorizeDiff, IOptionsParseVersionsDiff } from '@yarn-tool/semver-diff';
import { createDependencyTable } from '@yarn-tool/table/lib/core';
import { chalkByConsoleMaybe, IChalk } from 'debug-color2'
import stripAnsi from 'strip-ansi';

/**
 * 把差異節點渲染成終端機表格文字。
 * Render diff nodes into terminal table text.
 *
 * @param diff `buildDiff` 產生的差異節點 / Diff nodes produced by `buildDiff`
 * @param options 表格與上色選項 / Table and colorization options
 * @returns 表格文字；無差異時回傳空字串 / Table text, or an empty string when there is no diff
 */
export function buildDiffTable(diff: IDiffNode<IComputedPackage, IComputedPackage>[],
	options?: IOptionsParseVersionsDiff,
): string
{
	return _handleDiffTable(_buildDiffTableCore(diff, options), options)
}

/**
 * 把中間結果序列化為最終字串，並在必要時移除色碼。
 * Serialize the intermediate result into the final string, stripping colors when requested.
 *
 * @param result `_buildDiffTableCore` 的回傳值 / The value returned by `_buildDiffTableCore`
 * @param options 選項；`stripAnsi` 為 `true` 時輸出不含 ANSI / Options; when `stripAnsi` is
 *                `true` the output contains no ANSI codes
 * @returns 表格字串；無差異時為空字串 / The table string, empty when there is no diff
 */
export function _handleDiffTable(result: ReturnType<typeof _buildDiffTableCore>,
	options: IOptionsParseVersionsDiff,
): string
{
	const {
		_ok,
		table,
	} = result;

	/**
	 * 先序列化再決定是否回傳：無差異時回傳 `''`，
	 * 可避免呼叫端印出只有標題列的空表格。
	 * Serialize first and decide afterwards: returning `''` when there is no diff keeps the
	 * caller from printing a table that contains only the header row.
	 */
	let output = _ok ? table.toString() : '';

	if (options?.stripAnsi === true)
	{
		output = stripAnsi(output);
	}

	return _ok ? output : '';
}

/**
 * 建立表格物件與格式化後的列資料，不做序列化。
 * Build the table object and the formatted rows without serializing them.
 *
 * 回傳未序列化的 `table` 是刻意的：`_handleDiffTable` 需要它，
 * 其他呼叫端也可能要先調整欄寬或再排版再轉成字串。
 * Returning the unserialized `table` is intentional: `_handleDiffTable` needs it, and other
 * callers may want to adjust column widths or re-layout before stringifying.
 *
 * @param diff `buildDiff` 產生的差異節點 / Diff nodes produced by `buildDiff`
 * @param options 表格與上色選項 / Table and colorization options
 * @returns `_ok`（是否有差異）、`table` 與以套件名為鍵的 `formatedDiff` /
 *          `_ok` (whether any diff exists), the `table`, and `formatedDiff` keyed by package name
 */
export function _buildDiffTableCore(diff: IDiffNode<IComputedPackage, IComputedPackage>[],
	options?: IOptionsParseVersionsDiff,
)
{
	// @ts-ignore
	let chalk: IChalk = options?.chalk ?? chalkByConsoleMaybe(options?.console);
	/**
	 * `_ok` 一開始為 `false`：只有真的走過至少一個差異節點才會翻正，
	 * 讓「完全相同」與「有差異但格式化失敗」都能回傳空輸出。
	 * `_ok` starts as `false` and only flips after at least one diff node is processed, so both
	 * "identical inputs" and "diff present but nothing formatted" yield empty output.
	 */
	let _ok = false;

	/**
	 * 把 chalk 回填進新的 options 物件再往下傳，
	 * 讓 `colorizeDiff` 與本函式使用同一個上色實例，避免色彩來源不一致。
	 * Chalk is written back into a fresh options object and passed down so `colorizeDiff` and
	 * this function share one colorizer instead of disagreeing about where color comes from.
	 */
	options = {
		...options,
		chalk,
	}

	/**
	 * 中間欄位刻意留空字串作為箭頭欄，並把四欄對齊設為
	 * left / center / center / center：套件名對齊左側較好閱讀，版本欄置中可突顯變動。
	 * The middle column is intentionally an empty string reserved for the arrow, and alignment
	 * is left/center/center/center: package names read better left-aligned while centered
	 * version columns make the change stand out.
	 */
	const table = createDependencyTable({
		colAligns: ['left', 'center', 'center', 'center'],
		head: [
			chalk.bold.reset('package name'),
			chalk.bold.reset('old version(s)'),
			'',
			chalk.bold.reset('new version(s)'),
		],
	});

	let formatedDiff: {
		[k: string]: [string, string, string, string];
	} = {};

	/**
	 * 佔位符與箭頭先建好並重複使用：它們在每一列都會出現，
	 * 放在迴圈外可避免大量重複呼叫 chalk 造成的開銷。
	 * The placeholder and the arrow are created once and reused because they appear on every
	 * row; building them outside the loop avoids repeated chalk calls on large diffs.
	 */
	const NONE = chalk.red('-');
	const ARROW = chalk.gray('→');

	/**
	 * 先映射成列資料再一次性 `push`：同一個套件的多筆變動會因為
	 * `formatedDiff[path]` 的覆寫而合併成一列，表格不會重複出現相同套件名。
	 * Mapping into rows before a single `push` merges multiple changes for one package —
	 * overwriting `formatedDiff[path]` keeps the package name from repeating in the table.
	 */
	diff
		.map(packageDiff =>
		{
			//const path: string = packageDiff.path.find(() => true);
			/**
			 * deep-diff 對物件頂層的變動只會有一層 path，
			 * 因此直接取 `[0]`；保留上方被註解的 `find(() => true)` 作為舊寫法備註。
			 * deep-diff produces a single-element path for top-level object changes, so `[0]`
			 * is taken directly; the commented-out `find(() => true)` above is kept as a note of
			 * the previous approach.
			 */
			const path: string = packageDiff.path[0] as any;

			_ok = true;

			let _arr: [string, string, string, string];

			/**
			 * 四種 `kind` 各自對應一種表格語意：
			 * 陣列變動顯示省略號、刪除整列標紅、編輯用黃色並對新版本上色、新增整列標綠。
			 * Each of the four kinds maps to one table meaning: an array change shows ellipsis,
			 * a removal is red, an edit is yellow with the new version colorized, and an
			 * addition is green.
			 *
			 * 未覆蓋的 `kind` 會讓 `_arr` 保持 `undefined`，
			 * 由下方的 `_arr && ...` 過濾掉，避免把不認識的變動印成空白列。
			 * An uncovered `kind` leaves `_arr` as `undefined`, which the `_arr && ...` guard
			 * below filters out so unknown changes do not become blank rows.
			 */
			switch (packageDiff.kind)
			{
				case EnumKinds.DiffArray:

					let diffArray = _diffArray(packageDiff, chalk);

					_arr = [path, chalk.gray(diffArray[0]), ARROW, chalk.gray(diffArray[1])];

					break;
				case EnumKinds.DiffDeleted:

					_arr = [chalk.red(path), chalk.red(_formatVersion(packageDiff.lhs)), ARROW, NONE];

					break;
				case EnumKinds.DiffEdit:

					let lhs0 = _formatVersion(packageDiff.lhs);
					let rhs0 = _formatVersion(packageDiff.rhs);

					let lhs = chalk.yellow(lhs0);
					let rhs = chalk.yellow(colorizeDiff(lhs0, rhs0, options));

					_arr = [chalk.yellow(path), lhs, ARROW, rhs];

					break;
				case EnumKinds.DiffNew:

					_arr = [chalk.green(path), NONE, ARROW, chalk.green(_formatVersion(packageDiff.rhs))];

					break;
			}

			/**
			 * `_arr &&` 是型別收窄兼防禦：只有 switch 真的產出列時才寫入，
			 * 否則 `undefined` 會被 `Object.values` 帶進 `table.push` 造成例外。
			 * `_arr &&` both narrows the type and guards defensively: a row is only written when
			 * the switch actually produced one, otherwise `undefined` would reach `table.push`
			 * via `Object.values` and throw.
			 */
			_arr && (formatedDiff[path] = _arr);

		})
	;

	table.push(...Object.values(formatedDiff));

	return {
		_ok,
		table,
		formatedDiff,
	}
}
