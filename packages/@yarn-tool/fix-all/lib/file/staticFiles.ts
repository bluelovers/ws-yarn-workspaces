/**
 * @yarn-tool/fix-all/lib/file/staticFiles
 *
 * 靜態檔案選項的底層公用判定邏輯
 * Shared low-level decision logic for static file options
 *
 * 統一處理 noStaticFiles / addStaticFiles / resetStaticFiles 的優先順序，
 * 供 fix-all 與其他套件（npm-init2、create-yarn-workspaces 等）共用
 * Unified priority handling for noStaticFiles / addStaticFiles / resetStaticFiles,
 * shared by fix-all and other packages (npm-init2, create-yarn-workspaces, etc.)
 */
import { INpmAutoFixAll } from '../../index';

/**
 * 靜態檔案相關選項（可只帶其中部分欄位）
 * Static file related options (any subset of the fields)
 */
export type IStaticFilesOptionsLike = Pick<INpmAutoFixAll, 'addStaticFiles' | 'noStaticFiles' | 'resetStaticFiles'>;

/**
 * 判定 noStaticFiles 與 addStaticFiles 的結果
 * Resolve the result of noStaticFiles and addStaticFiles
 *
 * - noStaticFiles = true 時，addStaticFiles 視為 false
 *   When noStaticFiles is true, addStaticFiles is treated as false
 * - 兩者皆未指定時，退回 defaultValue
 *   Falls back to defaultValue when neither is specified
 *
 * @param {IStaticFilesOptionsLike} [options] - 選項物件 / Options object
 * @param {boolean} [defaultValue=false] - addStaticFiles 未指定時的預設值 / Default when addStaticFiles is not given
 * @returns {boolean} 是否要加入靜態檔案 / Whether to add static files
 */
export function _isAddStaticFiles(options?: IStaticFilesOptionsLike, defaultValue?: boolean)
{
	if (options?.noStaticFiles)
	{
		return false;
	}

	return options?.addStaticFiles ?? defaultValue;
}

/**
 * 判定 resetStaticFiles + 以上組合的結果
 * Resolve resetStaticFiles combined with the result above
 *
 * resetStaticFiles = true 時會強制觸發（優先於 noStaticFiles / addStaticFiles）
 * When resetStaticFiles is true it forces the add (takes precedence over noStaticFiles / addStaticFiles)
 *
 * @param {IStaticFilesOptionsLike} [options] - 選項物件 / Options object
 * @param {boolean} [defaultValue=false] - addStaticFiles 未指定時的預設值 / Default when addStaticFiles is not given
 * @returns {boolean} 是否要加入靜態檔案 / Whether to add static files
 */
export function _isAddStaticFilesOrReset(options?: IStaticFilesOptionsLike, defaultValue: boolean = false)
{
	return !!options?.resetStaticFiles || _isAddStaticFiles(options, defaultValue);
}
