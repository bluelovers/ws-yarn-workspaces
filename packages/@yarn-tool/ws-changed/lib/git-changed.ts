/**
 * Git Changed 模組
 * Git Changed Module
 *
 * 基於 Git 暫存區變更檢測工作區中受影響的套件
 * Detects affected packages in workspace based on Git staged changes
 */

import { wsPkgListableFromPaths } from 'ws-pkg-list/lib/listable';
import { wsGitDiffStagedDir } from './git-util';
import getConfig from 'workspaces-config';
import micromatch from 'micromatch';
import globRegex from 'glob-regex';
import { array_unique_overwrite } from 'array-hyper-unique';
import { normalizeListableExtra } from 'ws-pkg-list/lib/util';
import { IListableRowExtra, IListableRow } from 'ws-pkg-list';

/**
 * 從 Git 暫存區變更中提取套件前綴
 * Extract package prefixes from Git staged changes
 *
 * @param {string} [cwd] - 工作目錄 / Working directory
 * @param {Object} [options] - 選項 / Options
 * @param {string} [options.gitBin] - Git 執行檔路徑 / Git binary path
 * @returns {Object} 包含 cwd 和套件前綴列表的物件 / Object containing cwd and package prefix list
 */
export function wsGitChangedPrefix(cwd?: string, options?: {
	gitBin?: string,
})
{
	/**
	 * 獲取暫存區變更的目錄
	 * Get staged directories
	 */
	let data = wsGitDiffStagedDir(cwd ?? process.cwd(), options)

	/**
	 * 獲取工作區設定
	 * Get workspace config
	 */
	let config = getConfig(data.cwd);

	/**
	 * 將套件 glob 模式轉換為正規表示式
	 * Convert package glob patterns to regex
	 */
	let source = config.packages.map(p =>
	{
		let re = globRegex(p)
		let source = re.source.replace(/\$$/, '');
		return source
	}).join('|');

	/**
	 * 建立匹配套件路徑的正規表示式
	 * Create regex for matching package paths
	 */
	let re = new RegExp(`(${source})`, 'i');

	/**
	 * 從變更目錄中提取套件前綴
	 * Extract package prefixes from changed directories
	 */
	let list = data.list
		.map(p => {
		return re.exec(p)?.[0]
	})
		.filter(r => r?.length)
	;

	/**
	 * 去重處理
	 * Deduplication
	 */
	array_unique_overwrite(list)

	return {
		cwd: data.cwd,
		list,
	}
}

/**
 * 獲取 Git 暫存區變更影響的套件列表
 * Get list of packages affected by Git staged changes
 *
 * @param {string} cwd - 工作目錄 / Working directory
 * @param {Object} [options] - 選項 / Options
 * @param {string} [options.gitBin] - Git 執行檔路徑 / Git binary path
 * @returns {Object} 包含 cwd 和套件列表的物件 / Object containing cwd and package list
 */
export function wsGitChanged(cwd: string, options?: {
	gitBin?: string,
})
{
	/**
	 * 獲取變更的套件前綴
	 * Get changed package prefixes
	 */
	let data = wsGitChangedPrefix(cwd, options);

	/**
	 * 根據前綴獲取完整的套件資訊
	 * Get full package info from prefixes
	 */
	let list = wsPkgListableFromPaths(data.list, data.cwd) as IListableRowExtra[]

	/**
	 * 標準化套件列表資訊
	 * Normalize package list info
	 */
	list = normalizeListableExtra(list, data.cwd)

	return {
		cwd: data.cwd,
		list,
	}
}

/**
 * 預設匯出函數
 * Default export function
 */
export default wsGitChanged
