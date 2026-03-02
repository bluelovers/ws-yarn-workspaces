/**
 * Lerna Changed 模組
 * Lerna Changed Module
 *
 * 使用 Lerna 獲取工作區中已變更的套件列表
 * Uses Lerna to get list of changed packages in workspace
 */

import crossSpawn from 'cross-spawn-extra';
import console from 'debug-color2/logger';
import { IListableRow, IListableRowExtra } from 'ws-pkg-list';
import { normalize } from 'upath2';
import { findRoot } from '@yarn-tool/find-root';
import { normalizeListableExtra } from 'ws-pkg-list/lib/util';

/**
 * 獲取 Lerna 變更的套件列表
 * Get list of packages changed according to Lerna
 *
 * 執行 `lerna changed` 命令並解析輸出
 * Executes `lerna changed` command and parses output
 *
 * @param {string} [cwd] - 工作目錄 / Working directory
 * @param {Object} [options] - 選項 / Options
 * @param {string} [options.lernaBin] - Lerna 執行檔路徑 / Lerna binary path
 * @returns {Object} 包含 cwd 和變更套件列表的物件 / Object containing cwd and changed packages list
 */
export function lernaChanged(cwd?: string, options?: {
	lernaBin?: string,
})
{
	/**
	 * 查找工作區根目錄
	 * Find workspace root directory
	 */
	cwd = findRoot({
		cwd: cwd ?? process.cwd(),
		throwError: true,
	}).root;

	/**
	 * 執行 lerna changed 命令
	 * Execute lerna changed command
	 */
	let cp = crossSpawn.sync(options?.lernaBin ?? 'lerna', [
		'changed',
		'--loglevel=silent',
		'--json',
	], {
		cwd,
		stripAnsi: true,
	})

	/**
	 * 解析命令輸出
	 * Parse command output
	 */
	let out = cp.stdout.toString().trim();

	/**
	 * 解析 JSON 輸出為套件列表
	 * Parse JSON output to package list
	 */
	let list = (out.length ? JSON.parse(out) : []) as IListableRowExtra[];

	/**
	 * 標準化套件列表資訊
	 * Normalize package list info
	 */
	list = normalizeListableExtra(list, cwd)

	return {
		cwd,
		list,
	}
}

/**
 * 預設匯出函數
 * Default export function
 */
export default lernaChanged
