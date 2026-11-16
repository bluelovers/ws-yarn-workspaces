/**
 * copyStaticFiles 參數產生器
 *
 * 抽離 fix-all 與 npm-init2 中重複的判定邏輯：
 * 依 rootData 決定複製目標目錄與 file_map，
 * 回傳可直接傳給 copyStaticFiles 的參數物件。
 *
 * @module copyStaticFilesByRootData
 */
import type { IFindRootReturnType } from '@yarn-tool/find-root';
import type { ICopyStaticFilesOptions, IStaticFiles } from './types';
import { getWsCopyStaticFiles } from './ws/wsCopyStaticFiles';
import { getRootCopyStaticFilesAuto } from './root/getRootCopyStaticFiles';
import { ITSPartialPick } from 'ts-type';

/**
 * getCopyStaticFilesOptionsByRootData 的選項
 *
 * 以 copyStaticFiles 的實際參數 ICopyStaticFilesOptions 為基礎，
 * 僅將必填的 cwd 改為可選（預設由 rootData 決定），
 * 其餘欄位（staticRoot、overwrite、file_map、ignoreFilesSnapshot）
 * 與回傳型別同源，保持與 ICopyStaticFilesOptions 的追蹤鏈。
 *
 * @template K - 目標檔案路徑類型
 */
export interface ICopyStaticFilesByRootDataOptions<K extends string = string>
	extends Partial<ICopyStaticFilesOptions<K>>, ITSPartialPick<IFindRootReturnType, 'hasWorkspace' | 'isRoot'>
{
	/**
	 * 覆寫複製目標目錄；未提供時 workspace 專案取 ws、其餘取 root
	 *
	 * 提供此欄位時 file_map 一律改以套件模式判定（npm-init2 以 targetDir 複製的情境）。
	 */
	cwd?: ICopyStaticFilesOptions<K>['cwd'];
}

/**
 * 依 rootData 產生 copyStaticFiles 的參數
 *
 * 判定規則（對應 fix-all 與 npm-init2 的既有用法）：
 *
 * 1. 目標目錄：未覆寫 cwd 時，有 workspace 取 ws、否則取 root
 * 2. file_map：未覆寫 cwd 且有 workspace 時使用 workspace 清單 (getWsCopyStaticFiles)，
 *    其餘使用套件清單 (getRootCopyStaticFilesAuto)，旗標 hasWorkspace / isRoot 可覆寫
 * 3. ignoreFilesSnapshot 僅在提供時帶入，未提供不產生該鍵
 *
 * 本函式只產生參數，不寫入任何檔案；是否啟用複製
 * （addStaticFiles / noStaticFiles / resetStaticFiles）仍由呼叫端以 _isAddStaticFilesOrReset 決定。
 *
 * @param {ICopyStaticFilesRootData} rootData - 專案根目錄資訊
 * @param {ICopyStaticFilesByRootDataOptions} [opts] - 覆寫選項
 * @returns {ICopyStaticFilesOptions} 可直接傳給 copyStaticFiles 的參數物件
 *
 * @example
 * const options = getCopyStaticFilesOptionsByRootData(rootData, { ignoreFilesSnapshot });
 * copyStaticFiles(options);
 */
export function getCopyStaticFilesOptionsByRootData(rootData: IFindRootReturnType, opts?: ICopyStaticFilesByRootDataOptions): ICopyStaticFilesOptions
{
	const {
		cwd,
		file_map,
		ignoreFilesSnapshot,
		hasWorkspace = rootData.hasWorkspace,
		isRoot = rootData.isRoot,
		...rest
	} = opts ?? {};

	/**
	 * 是否由呼叫端指定目標目錄；
	 * true 代表複製目標是呼叫端自己的目錄（npm-init2 的 targetDir），
	 * 此時不適用「複製到 workspace 根目錄」的分支
	 */
	const cwdOverridden = cwd !== undefined;

	/**
	 * 有 workspace 時 fix-all 已先 refind，故目標即為 ws 根目錄
	 */
	const target = cwdOverridden ? cwd : (rootData.hasWorkspace ? rootData.ws : rootData.root);

	/**
	 * 目標為 workspace 根目錄時才使用 workspace 清單，否則用套件清單
	 */
	const map = file_map ?? (!cwdOverridden && rootData.hasWorkspace
		? getWsCopyStaticFiles()
		: getRootCopyStaticFilesAuto({ hasWorkspace, isRoot }));

	const options = {
		...rest,
		cwd: target,
		file_map: map,
		...(ignoreFilesSnapshot ? { ignoreFilesSnapshot } : {}),
	} satisfies ICopyStaticFilesOptions;

	return options;
}

