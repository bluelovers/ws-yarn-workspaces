import { sync as globSync } from 'fast-glob';
import { consoleLogger as console } from 'debug-color2/logger';
import * as p from '@clack/prompts';
import type { IOptions } from './core';

/**
 * `_checkEnv` 的環境檢查報告
 */
export interface ICheckEnvReport
{
	/** 被檢查的工作目錄 */
	cwd: string,

	/** 已存在的 package.json 相對路徑（cwd 根目錄與第一層子目錄） */
	files: string[],

	/** 是否疑似在錯誤的路徑執行（任一處已存在 package.json） */
	suspicious: boolean,
}

/**
 * 檢查目標目錄與其子目錄是否已存在 package.json
 *
 * 掃描 cwd 根目錄與第一層子目錄（排除 node_modules），
 * 產出可供警告輸出或互動介面顯示的報告。
 *
 * @param cwd - 要檢查的目錄
 * @param options - 配置選項（保留供呼叫端傳遞，目前未使用）
 * @returns 環境檢查報告
 */
export function _checkEnv(cwd: string, options: IOptions = {}): ICheckEnvReport
{
	const files = globSync([
		'package.json',
		'*/package.json',
		'!node_modules/**',
		'!node_modules',
	], {
		cwd,
		onlyFiles: true,
		objectMode: false,
		deep: 2,
	}).sort();

	return {
		cwd,
		files,
		/** 任一處已存在 package.json 即視為疑似在錯誤的路徑執行 */
		suspicious: !!files.length,
	};
}

/**
 * 以警告方式列出環境檢查報告並繼續執行
 *
 * 未啟用互動介面時的路徑：只印出警告，維持原有邏輯機制繼續創建。
 *
 * @param report - 環境檢查報告
 */
export function _warnCheckEnv(report: ICheckEnvReport)
{
	_printCheckEnvReport(report);

	console.warn(`continue anyway`);
}

/**
 * 列出環境檢查報告，並透過 @clack/prompts 詢問是否繼續
 *
 * @param report - 環境檢查報告
 * @returns 使用者選擇繼續時回傳 true；取消或非布林回應（如 Ctrl+C）回傳 false
 */
export async function _confirmCheckEnv(report: ICheckEnvReport): Promise<boolean>
{
	p.intro(`create-yarn-workspaces`);

	_printCheckEnvReport(report);

	const ret = await p.confirm({
		message: `detected existing package.json, continue anyway?`,
		initialValue: false,
	});

	/** 取消（Ctrl+C / 非布林回應）時不繼續創建 */
	if (typeof ret !== 'boolean')
	{
		p.outro(`cancelled`);

		return false;
	}

	p.outro(ret ? `continue` : `cancelled`);

	return ret;
}

/**
 * 列出報告中的既有 package.json，供警告與互動介面共用同一份輸出
 */
function _printCheckEnvReport(report: ICheckEnvReport)
{
	console.warn(`detected existing package.json in "${report.cwd}", possible wrong path`);

	report.files.forEach(function (file)
	{
		console.warn(` - ${file}`);
	});
}

/**
 * 檢測是否具備互動能力
 */
export function _checkInteractive()
{
	return process.stdout.isTTY && process.stdin.isTTY;
}
