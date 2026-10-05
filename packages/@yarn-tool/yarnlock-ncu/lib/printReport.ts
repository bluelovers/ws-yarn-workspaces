import { IYarnLockUpdateReport } from './types';
import { createDependencyTable } from '@yarn-tool/table/lib/core';
import { colorizeDiff, IOptionsParseVersionsDiff } from '@yarn-tool/semver-diff';
import { IChalk, chalkByConsoleMaybe } from 'debug-color2';
import { _formatVersion } from '@yarn-tool/yarnlock-diff/lib/formatter/formatVersion';

/**
 * 將更新報告轉為依賴表格 (dependency table) 文字，供終端機輸出使用。
 *
 * Turns the update report into a dependency table string for terminal output.
 *
 * @param report updateYarnLockTag 產生的更新報告 / the report produced by updateYarnLockTag
 * @param options 可選的著色與 console 設定 / optional colorize and console settings
 * @returns 有更新時回傳表格字串，否則回傳空字串 /
 * the table string when there are updates, otherwise an empty string
 */
export function printReport(report: IYarnLockUpdateReport, options?: {
	chalk?,
	console?,
})
{
	/**
	 * 未指定 chalk 時從 console 推斷色彩能力，
	 * 讓函式在一般終端機與無色環境下都能直接使用。
	 *
	 * Falls back to inferring color support from console so the function works
	 * in both regular terminals and color-less environments.
	 */
	// @ts-ignore
	let chalk: IChalk = options?.chalk ?? chalkByConsoleMaybe(options?.console);

	/**
	 * 以置中對齊的欄位排列新舊版本，使箭頭兩側的版本差異易於比對。
	 *
	 * Centered columns keep the version difference around the arrow easy to compare.
	 */
	const table = createDependencyTable({
		colAligns: ['left', 'center', 'center', 'center'],
		head: [
			chalk.bold.reset('package'),
			chalk.bold.reset('old version'),
			'',
			chalk.bold.reset('new version'),
		]
	});

	/**
	 * 先以原始鍵值收集格式化後的列，可避免重複項目並維持輸出順序。
	 *
	 * Collecting formatted rows by their raw key first avoids duplicates and keeps output order stable.
	 */
	let formatedDiff: {
		[k: string]: [string, string, string, string];
	} = {};

	/**
	 * 沒有任何可列印的更新時回傳空字串，讓呼叫端可直接略過輸出。
	 *
	 * Returns an empty string when there is nothing to print, so callers can skip output entirely.
	 */
	let _ok = false;
	const ARROW = chalk.gray('→');

	/**
	 * 逐一處理被移除的項目：著色舊版本與版本差異，組成表格列。
	 *
	 * Process each removed entry: colorize the old version and the diff, then build the table row.
	 */
	Object.entries(report?.removed ?? {})
		.forEach(([path, {
			from,
			to,
		}]) => {

			_ok = true;

			let lhs0 = _formatVersion(from);
			let rhs0 = _formatVersion(to);

			/**
			 * 舊版本固定紅色、新版本依差異著色，讓升級幅度一眼可辨。
			 *
			 * The old version stays red while the new version is colorized by the diff magnitude.
			 */
			let lhs = chalk.red(lhs0);
			let rhs = chalk.yellow(colorizeDiff(lhs0, rhs0, options));

			let _arr: [string, string, string, string];
			_arr = [chalk.yellow(path), lhs, ARROW, rhs];

			_arr?.length > 0 && (formatedDiff[path] = _arr);
		})
	;

	table.push(...Object.values(formatedDiff))

	/**
	 * 空表格沒有列印價值，回傳空字串比空白字串更容易判斷。
	 *
	 * An empty table is not worth printing, so an empty string is easier to detect than whitespace.
	 */
	return _ok ? table.toString() : '';
}
