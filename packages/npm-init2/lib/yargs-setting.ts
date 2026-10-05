/**
 * Created by user on 2019/5/16.
 */

/**
 * @fileoverview CLI option definitions for npm-init2
 * @description npm-init2 的命令列選項定義
 *
 * 選項集中在這裡註冊，主流程（index.ts）只讀取解析後的 argv，
 * 如此可單獨替換選項定義而不影響初始化邏輯。
 * Options are registered here while the main flow (index.ts) only reads the parsed argv, so the
 * option definitions can change without touching the initialization logic.
 *
 * @module npm-init2/lib/yargs-setting
 */

import yargs, { Arguments } from 'yargs';
import { Argv, Omit } from 'yargs';
import { setupToYargs as setupFixAllToYargs } from '@yarn-tool/fix-all/lib/util/yargs-setting';

/**
 * 設定 Yargs CLI 選項
 * Setup Yargs CLI options
 *
 * 繼承 @yarn-tool/fix-all 的共用選項
 * （overwriteHostedGitInfo / branch / resetStaticFiles / addStaticFiles / noStaticFiles）
 * Inherits shared options from @yarn-tool/fix-all
 * (overwriteHostedGitInfo / branch / resetStaticFiles / addStaticFiles / noStaticFiles)
 *
 * @param yargs - Yargs 實例 / Yargs instance
 */
export function setupToYargs<T>(yargs: Argv<T>)
{
	/**
	 * 註冊 npm-init2 的命令列選項，完成後再交給 @yarn-tool/fix-all 補上共用選項
	 * Register npm-init2's CLI options, then let @yarn-tool/fix-all append the shared options
	 */
	const _return = yargs
		.default({
			//input: process.cwd(),
		})
		.option('npmClient', {
			alias: ['N'],
			requiresArg: true,
			normalize: true,
			description: 'npm, yarn, ...etc',
			default: 'npm',
			type: 'string',
		})
		.option('yes', {
			alias: ['y', 'silent'],
//		requiresArg: true,
//		default: 'npm',
			type: 'boolean',
		})
		/**
		 * 只設定 defaultDescription 而未設定 default：
		 * 未傳入時 argv.cwd 保持 undefined，主流程得以區分「使用者明確指定」與「使用預設值」
		 *
		 * Only `defaultDescription` is set instead of `default`, so `argv.cwd` stays undefined
		 * when not passed and the main flow can distinguish an explicit path from the default
		 */
		.option('cwd', {
			alias: ['C'],
			requiresArg: true,
			normalize: true,
//		default: process.cwd(),
			defaultDescription: process.cwd(),
			type: 'string',
		})
		.option('skipCheckWorkspace', {
			alias: ['W'],
			type: 'boolean',
		})
		.option('force', {
			alias: ['f'],
			type: 'boolean',
		})
		/**
		 * 預設排序；yargs 會為布林選項自動產生 --noSort 反向旗標
		 * Sorted by default; yargs auto-generates the `--noSort` negation flag for boolean options
		 */
		.option('sort', {
			type: 'boolean',
			default: true,
		})
		.option('private', {
			alias: ['p'],
			type: 'boolean',
		})
		.option('createModule', {
			alias: ['m'],
			type: 'string',
		})
		.option('name', {
			type: 'string',
		})
		.option('copyStatic', {
			type: 'boolean',
		})
		.option('tsdx', {
			type: 'boolean',
		})
	;

	/**
	 * 繼承 @yarn-tool/fix-all 的共用靜態檔案選項
	 * Inherit shared static file options from @yarn-tool/fix-all
	 */
	return setupFixAllToYargs(_return);
}

/**
 * 預設匯出 setupToYargs，讓 `import setupToYargs from '...'` 可直接使用
 * Default-export setupToYargs so `import setupToYargs from '...'` works directly
 */
export default setupToYargs
