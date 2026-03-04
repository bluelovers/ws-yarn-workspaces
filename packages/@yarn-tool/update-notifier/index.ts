/**
 * 更新通知工具
 * Update notifier utility
 *
 * 此模組提供在 CLI 工具中檢查並通知使用者有新版本可用的功能
 * This module provides functionality to check and notify users of new versions in CLI tools
 *
 * @module @yarn-tool/update-notifier
 */

import { NotifyOptions, Settings } from 'update-notifier';
import { join } from 'path';
import { isCI } from 'ci-info';
import { isNpx } from '@yarn-tool/is-npx';

/**
 * Update Notifier 模組型別
 * Update Notifier module type
 */
export type IUpdateNotifier = typeof import('update-notifier');

/**
 * Update Notifier 物件型別
 * Update Notifier object type
 */
export type IUpdateNotifierObject = ReturnType<IUpdateNotifier>;

/**
 * 判斷是否應該檢查更新
 * Determine if should check for updates
 *
 * 在以下情況下會跳過檢查：
 * - 在 CI 環境中執行
 * - 設定了 NO_UPDATE_NOTIFIER 環境變數
 * - NODE_ENV 為 test
 * - 在 NPX/YPX 環境中執行
 *
 * Skips check in the following conditions:
 * - Running in CI environment
 * - NO_UPDATE_NOTIFIER environment variable is set
 * - NODE_ENV is test
 * - Running in NPX/YPX environment
 *
 * @param {string} __dirname - 套件目錄路徑 / Package directory path
 * @returns {boolean} 是否應該檢查更新 / Whether should check for updates
 */
export function shouldCheckMaybe(__dirname: string): boolean
{
	return !(isCI || 'NO_UPDATE_NOTIFIER' in process.env || process.env['NODE_ENV'] === 'test' || isNpx({
		__dirname,
	}))
}

export {
	/**
	 * 判斷是否應該檢查更新（已棄用，請使用 shouldCheckMaybe）
	 * Determine if should check for updates (deprecated, use shouldCheckMaybe instead)
	 *
	 * @deprecated 請使用 {@link shouldCheckMaybe} / Please use {@link shouldCheckMaybe}
	 */
	shouldCheckMaybe as notNpxMaybe
}

/**
 * 處理並標準化 updateNotifier 選項
 * Process and normalize updateNotifier options
 *
 * @param {string | string[]} __dirname - 套件目錄路徑或路徑片段陣列 / Package directory path or path segments array
 * @param {boolean} [force] - 是否強制檢查 / Whether to force check
 * @param {Settings & NotifyOptions} [inputNoticeOptions] - 傳入的通知選項 / Input notification options
 * @returns {Object} 處理後的選項物件 / Processed options object
 * @returns {string} returns.__dirname - 標準化後的目錄路徑 / Normalized directory path
 * @returns {boolean} returns.force - 是否強制檢查 / Whether to force check
 * @returns {Settings & NotifyOptions} returns.inputNoticeOptions - 傳入的通知選項 / Input notification options
 * @returns {boolean} returns.doCheck - 是否應該執行檢查 / Whether should perform check
 */
export function handleOptions(__dirname: string | string[], force?: boolean, inputNoticeOptions?: Settings & NotifyOptions)
{
	// 如果傳入陣列，將其組合成完整路徑 / If array passed, join into full path
	if (Array.isArray(__dirname))
	{
		__dirname = join(...__dirname);
	}

	return {
		__dirname,
		force,
		inputNoticeOptions,
		doCheck: force || !force && shouldCheckMaybe(__dirname),
	} as const
}

/**
 * 建立更新通知器
 * Create update notifier
 *
 * 此函式會檢查套件是否有新版本，並在適當時機通知使用者
 * This function checks if the package has a new version and notifies users at appropriate times
 *
 * @param {string | string[]} __dirname - 套件目錄路徑或路徑片段陣列 / Package directory path or path segments array
 * @param {boolean} [force] - 是否強制檢查（忽略環境限制）/ Whether to force check (ignore environment restrictions)
 * @param {Settings & NotifyOptions} [inputNoticeOptions] - 通知選項 / Notification options
 * @returns {IUpdateNotifierObject | null} Update Notifier 物件或 null / Update Notifier object or null
 *
 * @example
 * ```typescript
 * import { updateNotifier } from '@yarn-tool/update-notifier';
 *
 * // 基本用法
 * const notifier = updateNotifier(__dirname);
 *
 * // 強制檢查
 * const notifier = updateNotifier(__dirname, true);
 *
 * // 自訂選項
 * const notifier = updateNotifier(__dirname, false, {
 *   updateCheckInterval: 1000 * 60 * 60 * 24, // 每天檢查一次
 * });
 * ```
 */
export function updateNotifier(__dirname: string | string[], force?: boolean, inputNoticeOptions?: Settings & NotifyOptions): IUpdateNotifierObject
{
	const opts = handleOptions(__dirname, force, inputNoticeOptions);

	// 如果需要檢查，建立並設定通知器 / If check needed, create and configure notifier
	if (opts.doCheck)
	{
		/** 通知選項 / Notification options */
		let noticeOptions: Settings & NotifyOptions = {
			/** 不在 npm script 中顯示通知 / Don't show notification in npm script */
			shouldNotifyInNpmScript: false,
			/** 更新檢查間隔（預設 7 天）/ Update check interval (default 7 days) */
			updateCheckInterval: 1000 * 60 * 60 * 24 * 7,
			...opts.inputNoticeOptions,
		};

		/** Update Notifier 模組 / Update Notifier module */
		const _updateNotifier = require('update-notifier') as IUpdateNotifier;

		/** 套件資訊 / Package info */
		const pkg = require(require('path').join(opts.__dirname, 'package.json'));

		/** Update Notifier 實例 / Update Notifier instance */
		const obj = _updateNotifier({
			...noticeOptions,
			pkg,
		});

		// 顯示通知（如果有的話）/ Show notification if any
		obj.notify(noticeOptions);

		return obj;
	}

	return null
}

/**
 * 預設匯出：updateNotifier 函式
 * Default export: updateNotifier function
 */
export default updateNotifier
