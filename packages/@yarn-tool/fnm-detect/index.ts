/**
 * Created by user on 2024/5/31.
 */

import { dirname, join, normalize } from "upath2";
import { ITSMergeBoth, ITSPartialPick, ITSPartialRecord, ITSTypeAndStringLiteral } from 'ts-type';
import { pathExists, pathExistsSync, realpathSync } from "fs-extra";
import { sortObjectKeys } from 'sort-object-keys2';

export type IDetectFnmByEnv = Record<string, string> & ITSPartialRecord<'FNM_DIR' | 'FNM_MULTISHELL_PATH', string>

const enum EnumDetectFnmBy
{
	execpath = 'execpath',
	env = 'env',
}

export type IEnumDetectFnmBy = ITSTypeAndStringLiteral<EnumDetectFnmBy>

export interface IDetectFnmByResult<T extends EnumDetectFnmBy = EnumDetectFnmBy>
{
	/** 是否偵測到 fnm 環境 */
	isFnm: boolean;

	/** FNM_DIR 環境變數 */
	fnmDir?: string;

	/** 解析出的 multishell 路徑 */
	multishellPath?: string;

	/** 偵測來源標記 */
	detectedBy: ITSTypeAndStringLiteral<T>;

	/** 解析真實路徑後的路徑（使用 realpathSync） */
	fnmPathReal?: string,

		/** aliases 路徑 */
	aliasesPath?: string;
	/** node-versions installation 路徑 */
	installationPath?: string;
}

export interface IDetectFnmByExecPathResult extends IDetectFnmByResult<EnumDetectFnmBy.execpath>
{

}

export interface IDetectFnmByEnvResult extends IDetectFnmByResult<EnumDetectFnmBy.env>
{
}

/**
 * @example
 * ```json
 * {
 * 	isFnm: true,
 * 	fnmPathType: 'fnm_multishells',
 * 	exists: true,
 * 	fnmPath: 'C:/Users/User/AppData/Local/fnm_multishells/20128_1771488837711',
 * 	fnmPathReal: 'C:/Users/User/AppData/Roaming/fnm/node-versions/v24.13.1/installation',
 * 	fnmDir: 'C:/Users/User/AppData/Roaming/fnm',
 * 	aliasDefaultPath: 'C:/Users/User/AppData/Roaming/fnm/aliases/default',
 * 	aliasDefaultPathReal: 'C:/Users/User/AppData/Roaming/fnm/node-versions/v24.13.1/installation',
 * 	installationPath: 'C:/Users/User/AppData/Roaming/fnm/node-versions/v24.13.1/installation',
 * 	multishellDir: 'C:/Users/User/AppData/Local/fnm_multishells',
 * 	multishellKey: '20128_1771488837711',
 * 	multishellPath: 'C:/Users/User/AppData/Local/fnm_multishells/20128_1771488837711',
 * 	version: 'v24.13.1'
 * }
 * ```
 */
export interface IDetectFnmByAllResult extends Omit<IDetectFnmByResult, 'detectedBy'>
{
	/** 偵測來源陣列 */
	detectedBy: IEnumDetectFnmBy[];
}

export const enum EnumDetectFnmPathType
{
	fnm_multishells = 'fnm_multishells',
	aliases = 'aliases',
	node_versions = 'node-versions',
}

/**
 * 偵測 fnm 路徑類型的核心函數
 * 根據路徑特徵判斷是 fnm_multishells、aliases 還是 node-versions
 *
 * @param normalizedFnmPath - 已正規化的 fnm 路徑
 * @param inDeep - 是否深入偵測（保留參數）
 * @returns 路徑類型資訊，包含 fnmPathType、fnmPath、fnmDir 等欄位
 */
export function _detectFnmPathTypeCore(normalizedFnmPath: string, inDeep?: boolean)
{
	if (normalizedFnmPath?.length)
	{
		let m: RegExpMatchArray;

		if (m = normalizedFnmPath.match(/((.+\/fnm_multishells)\/([^/]+))/))
		{
			return {
				fnmPathType: EnumDetectFnmPathType.fnm_multishells as const,
				fnmPath: m[1],
				multishellKey: m[3],
				multishellPath: m[1],
				multishellDir: m[2],
			}
		}
		else if (m = normalizedFnmPath.match(/((.+\/fnm)\/aliases\/([^/]+))/))
		{
			return {
				fnmPathType: EnumDetectFnmPathType.aliases as const,
				fnmPath: m[1],
				fnmDir: m[2],
				aliasesName: m[3],
				aliasesPath: m[1],
			}
		}
		else if (m = normalizedFnmPath.match(/((.+\/fnm)\/node-versions\/([^/]+)\/installation)/))
		{
			return {
				fnmPathType: EnumDetectFnmPathType.node_versions as const,
				fnmPath: m[1],
				fnmDir: m[2],
				version: m[3],
				installationPath: m[1],
			}
		}
	}
}

/**
 * 偵測 fnm 路徑類型
 * 對外提供的介面，會先將路徑正規化後再呼叫核心函數
 *
 * @param normalizedFnmPath - fnm 路徑（會自動正規化）
 * @param inDeep - 是否深入偵測（保留參數）
 * @returns 路徑類型資訊
 */
export function detectFnmPathType(normalizedFnmPath: string, inDeep?: boolean)
{
	return _detectFnmPathTypeCore(normalize(normalizedFnmPath), inDeep);
}

/**
 * 'C:/Users/User/AppData/Roaming/fnm/node-versions/v24.13.1/installation'
 */
export function _toFnmPathNodeVersion(fnmDir: string, nodeVersion: string)
{
	return join(fnmDir, 'node-versions', nodeVersion, 'installation')
}

export const enum EnumDetectFnmPathAliases
{
	default = 'default',
	latest = 'latest',
	lts_latest = 'lts-latest',
}

export function toFnmPath(fnmPathType: ITSPartialPick<ReturnType<typeof detectFnmPathType>, 'fnmPathType' | 'fnmPath' | 'multishellKey' | 'fnmDir' | 'aliasesName' | 'version'>)
{
	switch (fnmPathType.fnmPathType)
	{
		case EnumDetectFnmPathType.fnm_multishells:
			return _toFnmPathMultishell(fnmPathType.fnmPath, fnmPathType.multishellKey);
		case EnumDetectFnmPathType.aliases:
			return _toFnmPathAliases(fnmPathType.fnmDir, fnmPathType.aliasesName);
		case EnumDetectFnmPathType.node_versions:
			return _toFnmPathNodeVersion(fnmPathType.fnmDir, fnmPathType.version);
	}
}

/**
 * 'C:/Users/User/AppData/Local/fnm_multishells/20128_1771488837711'
 */
export function _toFnmPathMultishell(fnmDir: string, name: string)
{
	return join(fnmDir, name)
}

/**
 * 'C:/Users/User/AppData/Roaming/fnm/aliases/default'
 */
export function _toFnmPathAliases(fnmDir: string, name: string | ITSTypeAndStringLiteral<EnumDetectFnmPathAliases>)
{
	return join(fnmDir, 'aliases', name)
}

export function _fillMergeRecord<T extends Record<string, any>, R extends Record<string, any>>(source: T, fillFrom: R)
{
	if (fillFrom)
	{
		for (const key in fillFrom)
		{
			// @ts-ignore
			if (fillFrom[key]) source[key] ??= fillFrom[key];
		}
	}

	return source as any as ITSMergeBoth<T, R>
}


/**
 * 依靠 process.execPath 偵測 fnm 環境
 * 偵測邏輯：檢查 process.execPath 是否包含 fnm 相關路徑
 * - fnm 的 execPath 通常會包含 "fnm_multishells"
 * - 或在 fnm 目錄下（如 node-versions, aliases）
 *
 * execPath:
 * 'C:/Users/User/AppData\/Local/fnm_multishells/7064_1771483456556/node.exe'
 *
 * @param execPath - Node.js 執行檔路徑（預設為 process.execPath）
 * @param nodeVersion - Node.js 版本（預設為 process.version）
 * @returns 偵測結果
 */
export function detectFnmByExecPath(execPath: string = process.execPath, nodeVersion: string = process.version)
{
	// 統一路徑風格（使用 upath2 轉換為 Unix 風格）
	const normalizedExecPath = normalize(execPath);

	// 使用 detectFnmPathType 解析路徑類型
	let fnmPathType = detectFnmPathType(normalizedExecPath);

	return sortDetectFnmByResult(_handleDetectFnmByResult(EnumDetectFnmBy.execpath, fnmPathType, nodeVersion));
}

/**
 * 處理偵測結果的共通函數
 * 根據路徑類型解析相關路徑資訊，並使用 realpathSync 取得真實路徑
 *
 * @param detectedBy - 偵測來源標記
 * @param fnmPathType - 偵測到的 fnm 路徑類型資訊
 * @param nodeVersion - Node.js 版本
 * @returns 完整的偵測結果
 */
export function _handleDetectFnmByResult<T extends EnumDetectFnmBy>(detectedBy: T, fnmPathType: ReturnType<typeof detectFnmPathType>, nodeVersion?: string)
{

	// 從 execPath 判斷是否為 fnm 環境
	const isFnm = !!fnmPathType?.fnmPathType;

	let fnmPathReal: string;
	let exists: boolean = null;
	let aliasDefaultPath: string;
	let aliasDefaultPathReal: string;

	// 根據路徑類型進行處理
	if (isFnm === true)
	{
		let fnmPathType2: ReturnType<typeof detectFnmPathType>;

		// 使用 realpathSync 解析真實路徑
		try {
			fnmPathReal = normalize(realpathSync(fnmPathType.fnmPath));
			fnmPathType2 = _detectFnmPathTypeCore(fnmPathReal);

			fnmPathType.fnmDir ??= fnmPathType2.fnmDir;
		} catch { }

		switch (fnmPathType.fnmPathType)
		{
			case EnumDetectFnmPathType.fnm_multishells:

				break;

			case EnumDetectFnmPathType.node_versions:

				break;

			case EnumDetectFnmPathType.aliases:

				break;
		}

		if (fnmPathType2 && fnmPathType2.fnmPathType !== fnmPathType.fnmPathType)
		{
			_fillMergeRecord(fnmPathType, fnmPathType2);
		}

		if (fnmPathType2?.fnmPathType !== EnumDetectFnmPathType.node_versions)
		{
			// 從 fnmPathType.fnmDir 計算 installationPath
			// fnmPathType.fnmDir: C:\Users\User\AppData\Roaming\fnm
			if (fnmPathType.fnmDir && nodeVersion)
			{
				fnmPathType2 = _detectFnmPathTypeCore(_toFnmPathNodeVersion(fnmPathType.fnmDir, nodeVersion));

				_fillMergeRecord(fnmPathType, fnmPathType2);
			}
		}

		exists = pathExistsSync(fnmPathReal);
		aliasDefaultPath = (fnmPathType.fnmDir) && _toFnmPathAliases(fnmPathType.fnmDir, EnumDetectFnmPathAliases.default);

		try {
			aliasDefaultPathReal = normalize(realpathSync(aliasDefaultPath));
		} catch { }
	}

	return _fillMergeRecord({
		isFnm,
		detectedBy,
		fnmPathReal,
		exists,
		aliasDefaultPath,
		aliasDefaultPathReal,
	}, fnmPathType);
}




/**
 * 依靠環境變數偵測 fnm 環境
 * 偵測邏輯：檢查 FNM_DIR 或 FNM_MULTISHELL_PATH 環境變數是否存在
 *
 * @returns 偵測結果
 */
export function detectFnmByEnv(env: IDetectFnmByEnv = process.env, nodeVersion: string = process.version)
{
	// 使用 detectFnmPathType 解析路徑類型
	let fnmPathType = detectFnmPathType(env.FNM_MULTISHELL_PATH);

	if (!fnmPathType && env.FNM_DIR && nodeVersion)
	{
		fnmPathType = detectFnmPathType(_toFnmPathNodeVersion(env.FNM_DIR, nodeVersion));
	}

	return sortDetectFnmByResult(_handleDetectFnmByResult(EnumDetectFnmBy.env, fnmPathType, nodeVersion));
}



/**
 * 對偵測結果進行排序
 * 將結果物件的 key 按照指定順序排列，方便閱讀
 *
 * @param result - 偵測結果物件
 * @returns 排序後的結果物件
 */
export function sortDetectFnmByResult<T>(result: T)
{
	return sortObjectKeys(result, {
		keys: [
			'isFnm',
			'detectedBy',
			'fnmPathType',
			'exists',
			'fnmPath',
			'fnmPathReal',
			'fnmDir',
		],
	});
}

export type IDetectFnmByAllInput = {
	execPath: string,
	env: IDetectFnmByEnv,
	version: string,
}

/**
 * 同時使用 execpath 與 env 偵測 fnm 環境
 * 結合兩種偵測方式，並回傳得知是來自 execpath 或者 env
 *
 * @returns 偵測結果，包含偵測來源資訊
 */
export function detectFnmByAll(pc: IDetectFnmByAllInput = process)
{
	// 使用 Part 1 的函數進行 execpath 偵測
	const execPathResult = detectFnmByExecPath(pc.execPath);

	// 使用 Part 2 的函數進行 env 偵測
	const envResult = detectFnmByEnv(pc.env);

	let merged: ReturnType<typeof detectFnmByExecPath & typeof envResult>;

	// 收集偵測來源
	const detectedBy: IEnumDetectFnmBy[] = [];
	if (execPathResult.isFnm) {
		detectedBy.push(execPathResult.detectedBy);

		// @ts-ignore
		merged ??= _fillMergeRecord(execPathResult, envResult);
	}
	if (envResult.isFnm) {
		detectedBy.push(envResult.detectedBy);

		// @ts-ignore
		merged ??= _fillMergeRecord(envResult, execPathResult);
	}

	// @ts-ignore
	merged ??= execPathResult || envResult

	// 最終判斷
	const isFnm = execPathResult.isFnm || envResult.isFnm;

	return sortDetectFnmByResult(_fillMergeRecord({
		isFnm,
		detectedBy,
	}, merged));
}

export default detectFnmByExecPath
