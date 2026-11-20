/**
 * 核心版本推薦邏輯
 */
import { inc as semverIncrement, ReleaseType } from 'semver';
import {
	analyzeVersionStyles,
	dateToVersion,
	EnumVersionStyle,
	incrementVersion,
} from '@yarn-tool/version-style-jetbrains';
import { INextVersionRecommended, INextVersionRecommendedOptions, INextVersionRecommendedOptionsWithStyle } from './types';
import { handleOptions } from './handleOptions';
import { WorkspacesProject } from '@yarn-tool/workspaces-project';
import { ITSRequiredWith } from 'ts-type';

/**
 * 依舊版本與選項計算推薦的新版本號
 *
 * 設計意圖：bump 類型若未明確指定，交給 handleOptions 依舊版本的
 * 預發行資訊與 workspaces 設定推斷，而非一律使用 patch。
 * 指定 versionStyle 時新版本改交給 version-style-jetbrains 產生，
 * 該路徑只看 versionStyle、resetDailyIncrement 與 preid 系列選項。
 *
 * @param oldVersion - 舊版本號
 * @param options - 推薦選項
 * @param wsProject - workspaces 專案實例，提供預設 bump
 */
export function nextVersionRecommended(oldVersion: string,
	options?: INextVersionRecommendedOptions,
	wsProject?: WorkspacesProject,
): INextVersionRecommended
{
	const { versionStyle, resetDailyIncrement, preid, defaultPreid } = options ?? {};

	/**
	 * 風格模式不依舊版本推斷 semver 預發行資訊：
	 * 風格版本第三段可能是 0005 這類前導零數字，semver.parse 會回傳 null，
	 * 且 identifierBase 也不影響風格版本的產生
	 */
	options = handleOptions(options, versionStyle ? void 0 : oldVersion, wsProject);

	/** 未指定且無法從舊版本推斷時才退回 patch：這是語意化版本的最小變更類型 */
	let bump = options.bump ?? 'patch';

	const newVersion = versionStyle
		? nextVersionByStyle(oldVersion, { versionStyle, resetDailyIncrement, preid, defaultPreid })
		: semverIncrement(oldVersion, bump, options.preid, options.identifierBase as any);

	return {
		bump,
		oldVersion,
		newVersion,
	}
}

/**
 * 以 version-style-jetbrains 風格產生新版本
 *
 * @param oldVersion - 舊版本號
 * @param options - 風格選項（versionStyle 必填）
 * @returns 風格版本字串
 */
function nextVersionByStyle(
	oldVersion: string,
	options: INextVersionRecommendedOptionsWithStyle,
): string
{
	const { versionStyle, resetDailyIncrement, preid, defaultPreid } = options;

	/** 預發行識別：preid 優先，defaultPreid 作為缺省值 */
	const preidValue = preid?.length ? preid : defaultPreid?.length ? defaultPreid : void 0;

	/**
	 * 預發行系列啟用時停用當日遞增後綴：
	 * `-n` 與 preid 的 `-xxx` 同時存在會讓版本號帶兩段連字號後綴，
	 * 停用後才能安全地附加 preid；此路徑一律以當日日期時間重新產生，
	 * 讓時間推進成為預發行版本的進度來源
	 */
	if (preidValue)
	{
		return `${dateToVersion({
			style: versionStyle,
			dailyIncrement: 1,
			disableDailyVersionSuffix: true,
		})}-${preidValue}`;
	}

	/**
	 * 舊版本已是同風格且未要求重設：沿用其日期與時間遞增當日計數，
	 * 讓同一天的多次發版持續累加
	 */
	if (!resetDailyIncrement && analyzeVersionStyles(oldVersion).priorityStyle === versionStyle)
	{
		return incrementVersion(oldVersion);
	}

	/**
	 * 舊版本非此風格、或要求重設遞增號：
	 * 以指定風格產生當日新版本，遞增號從 1 重新開始
	 */
	return dateToVersion({ style: versionStyle, dailyIncrement: 1 });
}
