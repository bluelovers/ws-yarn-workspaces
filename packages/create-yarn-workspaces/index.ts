/**
 * 創建 Workspaces 工具模組
 *
 * 提供初始化 Workspaces 專案結構的功能，
 * 包含 package.json 設定、
 * Lerna 整合、
 * 目錄創建與靜態檔案複製等功能。
 */

import { _createYarnWorkspaces, _precheckYarnWorkspaces, IOptions } from './lib/core';
import { _checkEnv, _checkInteractive, _confirmCheckEnv, _warnCheckEnv } from './lib/check-env';

export * from './lib/index';
export * from './lib/util';

/**
 * 創建 Workspaces 主函式（同步）
 *
 * 檢查並創建 Workspaces 專案結構，處理已存在 Package 與父層 Workspaces 的情況。
 * 不支援互動介面：環境檢查發現疑似錯誤路徑時僅印出警告並繼續執行。
 *
 * @param cwd - 工作目錄路徑
 * @param options - 配置選項
 * @returns 是否成功創建
 *
 * @deprecated 請改用 `createYarnWorkspacesAsync` 以獲得更好的互動體驗
 */
export function createYarnWorkspaces(cwd?: string, options: IOptions = {})
{
	const precheck = _precheckYarnWorkspaces(cwd, options);

	if (!precheck.ok)
	{
		return false;
	}

	const report = _checkEnv(precheck.targetPath, precheck.options);

	if (report.suspicious)
	{
		/** sync 版本不支援互動介面：印出警告後繼續執行（原有邏輯機制）。 */
		_warnCheckEnv(report);
	}

	return _createYarnWorkspaces(precheck.targetPath, precheck.options);
}

/**
 * 創建 Workspaces 主函式（非同步）
 *
 * 與 {@link createYarnWorkspaces} 相同，但當 `options.interactive` 啟用且環境具備 TTY 時，
 * 會依環境檢查報告透過互動介面詢問是否繼續；
 * 未啟用互動介面（或不具備 TTY）時與同步版本相同，僅印出警告並繼續執行。
 *
 * @param cwd - 工作目錄路徑
 * @param options - 配置選項
 * @returns 是否成功創建；使用者在互動介面取消時回傳 false
 */
export async function createYarnWorkspacesAsync(cwd?: string, options: IOptions = {})
{
	const precheck = _precheckYarnWorkspaces(cwd, options);

	if (!precheck.ok)
	{
		return false;
	}

	const report = _checkEnv(precheck.targetPath, precheck.options);

	if (report.suspicious)
	{
		if (precheck.options.interactive && _checkInteractive())
		{
			/** 依 _checkEnv 結果詢問是否疑似在錯誤路徑執行、仍要繼續 */
			if (!await _confirmCheckEnv(report))
			{
				return false;
			}
		}
		else
		{
			/** 未啟用互動介面：印出警告但繼續執行（原有邏輯機制） */
			_warnCheckEnv(report);
		}
	}

	return _createYarnWorkspaces(precheck.targetPath, precheck.options);
}

/**
 * 預設導出創建函式
 */
export default createYarnWorkspaces;
