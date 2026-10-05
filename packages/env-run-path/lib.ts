import { resolve, delimiter } from "path";
import { findRoot } from '@yarn-tool/find-root';
import { findBinPathCore } from './core';
import { IOptionsGetRunPathCore, IOptionsFindBinPath, ProcessEnv } from './index';
import { envPathKey, processEnv as _processEnv, IPathDelimiter } from '@yarn-tool/env-path';

/**
 * 從 cwd 向上搜尋所有 node_modules/.bin 目錄。
 * 先以 findRoot 推斷專案根目錄，據此推導 stopPath 與預設 cwd，
 * 讓呼叫端不必自行處理 monorepo 的根目錄差異。
 *
 * Search upward from cwd for every node_modules/.bin directory.
 * Uses findRoot to infer the project root, deriving stopPath and the default cwd from it,
 * so callers need not handle monorepo root differences themselves.
 *
 * @param options 搜尋選項 / search options
 * @returns result 為存在的 bin 目錄、history 為所有檢查過的目錄 / result = existing bin dirs, history = all dirs checked
 */
export function findBinPath(options: IOptionsFindBinPath = {})
{
	let {
		cwd = process.cwd(),
		stopPath,
	} = options;

	/**
	 * 未指定 cwd、stopPath 為 boolean、或完全未給 stopPath 時，
	 * 需要先用 findRoot 取得專案根目錄才能決定搜尋範圍
	 *
	 * When cwd is unset, stopPath is a boolean, or stopPath is omitted entirely,
	 * findRoot must run first to obtain the project root before deciding the search range
	 */
	if (!options.cwd || typeof stopPath === 'boolean' || !stopPath)
	{
		let rootData = findRoot({
			cwd,
		});

		/**
		 * true/null（未給）時以專案根目錄為終點；false 則清空 stopPath 表示一路搜到根
		 *
		 * true/null (omitted) stops at the project root; false clears stopPath to search all the way up
		 */
		if (stopPath === true || stopPath == null)
		{
			stopPath = [rootData.root]
		}
		else if (!stopPath)
		{
			stopPath = [];
		}

		/**
		 * 呼叫端未指定 cwd 時改用 findRoot 找到的套件目錄，
		 * 確保 monorepo 子套件從自己的目錄開始搜尋
		 *
		 * When the caller did not specify cwd, use the package dir found by findRoot,
		 * ensuring monorepo subpackages start searching from their own directory
		 */
		if (!options.cwd)
		{
			cwd = rootData.pkg;
		}
	}

	let { history, result } = findBinPathCore({
		...options,
		cwd,
		stopPath,
	});

	return {
		result,
		history,
	}
}

/**
 * 取得 Node.js 可執行檔所在目錄。
 * execPath 可能是相對路徑，故先以 cwd resolve 再取父目錄。
 *
 * Get the directory containing the Node.js executable.
 * execPath may be relative, so it is resolved against cwd before taking the parent directory.
 *
 * @param options 需含 cwd 與 execPath / requires cwd and execPath
 * @returns 可執行檔目錄 / the executable's directory
 */
export function getExePath(options: IOptionsGetRunPathCore)
{
	let {
		cwd = process.cwd(),
		execPath = process.execPath,
	} = options;

	return resolve(cwd, execPath, '..')
}

/**
 * 執行路徑的核心計算：解析 PATH 鍵名、原始 PATH 與 bin 目錄清單。
 * 不負責合併策略，供 processRunPath 與 processRunPathEnv 共用同一份邏輯。
 *
 * Core run-path computation: resolves the PATH key, the original PATH, and the bin directory list.
 * Excludes merge strategy; shared by processRunPath and processRunPathEnv to keep one source of logic.
 *
 * @param options 核心選項 / core options
 * @returns pathKey、envPath、binPaths、execPath、delimiter、processEnv / the resolved run-path data
 */
export function processRunPathCore<P = ProcessEnv>(options: IOptionsGetRunPathCore<P> = {})
{
	/**
	 * options.processEnv 優先，否則回退 process.env；
	 * 以雙重 as 繞過 P 與 ProcessEnv 的型別落差，維持泛型回傳
	 *
	 * options.processEnv wins, otherwise falls back to process.env;
	 * the double cast bridges the P vs ProcessEnv type gap while keeping the generic return
	 */
	let processEnv = (options.processEnv || _processEnv()) as any as P;
	/**
	 * 不硬編碼 'PATH'：Windows 可能是 Path 等大小寫變體
	 *
	 * Do not hardcode 'PATH': Windows may use casing variants such as Path
	 */
	const pathKey = envPathKey(processEnv);

	let {
		cwd = process.cwd(),
		execPath = process.execPath,
		envPath = processEnv[pathKey],
	} = options;

	let { result } = findBinPath(options);

	const execPathDir = getExePath({
		cwd,
		execPath,
	});

	return {
		pathKey,
		envPath,
		binPaths: result,
		execPath: execPathDir,
		delimiter: delimiter as IPathDelimiter,
		processEnv,
	};
}
