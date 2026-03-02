/**
 * 工作區變更檢測模組
 * Workspace Change Detection Module
 *
 * 整合 Lerna 和 Git 來獲取工作區中已變更的套件列表
 * Integrates Lerna and Git to get list of changed packages in workspace
 *
 * Created by user on 2020/6/8.
 */

import { wsGitChanged } from './lib/git-changed';
import { lernaChanged } from './lib/lerna-changed';
import { IListableRowExtra, IListableRow } from 'ws-pkg-list';

/**
 * 重新匯出類型
 * Re-export types
 */
export type { IListableRowExtra }

/**
 * 匯出核心函數
 * Export core functions
 */
export { lernaChanged, wsGitChanged }

/**
 * 獲取工作區變更的套件列表（整合 Lerna 和 Git）
 * Get list of changed packages in workspace (integrates Lerna and Git)
 *
 * 同時使用兩種方式檢測變更：
 * - Lerna: 基於版本發布歷史檢測自上次發布後變更的套件
 * - Git: 基於暫存區變更檢測受影響的套件
 *
 * Uses two methods to detect changes:
 * - Lerna: Detects packages changed since last release based on version history
 * - Git: Detects affected packages based on staged changes
 *
 * @param {string} [cwd] - 工作目錄 / Working directory
 * @param {Object} [options] - 選項 / Options
 * @param {string} [options.gitBin] - Git 執行檔路徑 / Git binary path
 * @param {string} [options.lernaBin] - Lerna 執行檔路徑 / Lerna binary path
 * @returns {Object} 包含 cwd、Lerna 變更列表和 Git 暫存列表的物件
 *                   Object containing cwd, Lerna changed list, and Git staged list
 */
export function wsChanged(cwd?: string, options?: {
	gitBin?: string,
	lernaBin?: string,
})
{
	/**
	 * 獲取 Lerna 變更的套件
	 * Get Lerna changed packages
	 */
	let data1 = lernaChanged(cwd ?? process.cwd(), options)

	/**
	 * 獲取 Git 暫存區變更的套件
	 * Get Git staged packages
	 */
	let data2 = wsGitChanged(data1.cwd, options)

	/**
	 * 設定回傳的 cwd
	 * Set returned cwd
	 */
	cwd = data1.cwd;

	/**
	 * 返回合併結果
	 * Return combined results
	 */
	return {
		cwd,
		/**
		 * Lerna 檢測到的變更套件
		 * Packages changed according to Lerna
		 */
		changed: data1.list,
		/**
		 * Git 暫存區變更的套件
		 * Packages with staged changes in Git
		 */
		staged: data2.list,
	}
}

/**
 * 預設匯出函數
 * Default export function
 */
export default wsChanged
