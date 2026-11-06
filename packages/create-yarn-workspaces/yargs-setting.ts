/**
 * Yargs 命令列參數設定模組
 *
 * 提供 Workspaces 初始化相關的命令列參數設定與驗證
 *
 * @author user
 * @since 2019/5/16
 */

import yargs from 'yargs';
import { Argv, Omit } from 'yargs';
import { setupToYargs as setupFixAllToYargs } from '@yarn-tool/fix-all/lib/util/yargs-setting';

/**
 * 設定 Workspaces 初始化相關的 Yargs 選項
 *
 * 配置命令列參數，包含：
 * - name: Package 名稱
 * - ignoreExistsPackage: 忽略已存在的 Package
 * - ignoreParentWorkspaces: 忽略父層 Workspaces
 * - debug: 啟用除錯模式
 * - interactive: 啟用互動介面
 *
 * @template T - Yargs 參數類型 / Yargs argument type
 * @param yargs - Yargs 實例 / Yargs instance
 * @returns 配置後的 Yargs 實例 / Configured Yargs instance
 */
export function setupWorkspacesInitToYargs<T extends any>(yargs: Argv<T>)
{
	const _return = setupFixAllToYargs(yargs)
		.default({
			//input: process.cwd(),
		})
		/**
		 * Package 名稱選項
		 */
		.option('name', {
			alias: ['n'],
			requiresArg: true,
			normalize: true,
			type: 'string',
		})
		/**
		 * 忽略已存在 Package 選項
		 */
		.option('ignoreExistsPackage', {
			boolean: true,
			alias: ['i'],
		})
		/**
		 * 忽略父層 Workspaces 選項
		 */
		.option('ignoreParentWorkspaces', {
			boolean: true,
		})
		/**
		 * 除錯模式選項
		 */
		.option('debug', {
			boolean: true,
		})
		/**
		 * 互動介面選項
		 *
		 * 預設啟用，可用 --no-interactive 關閉；
		 * 環境不具備 TTY 時自動退回警告並繼續執行。
		 */
		.option('interactive', {
			boolean: true,
			default: true,
		})
	;

	return _return;
}

/**
 * 預設導出設定函式
 * Default export of setup function
 */
export default setupWorkspacesInitToYargs
