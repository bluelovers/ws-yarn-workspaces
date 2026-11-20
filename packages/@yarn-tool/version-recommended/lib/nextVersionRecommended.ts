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
 * 該路徑只看 versionStyle、resetDailyIncrement、date 與 preid 系列選項。
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
	const { versionStyle, resetDailyIncrement, preid, defaultPreid, date } = options ?? {};

	/**
	 * 風格模式不依舊版本推斷 semver 預發行資訊：
	 * 風格版本第三段可能是 0005 這類前導零數字，semver.parse 會回傳 null，
	 * 且 identifierBase 也不影響風格版本的產生
	 */
	options = handleOptions(options, versionStyle ? void 0 : oldVersion, wsProject);

	/** 未指定且無法從舊版本推斷時才退回 patch：這是語意化版本的最小變更類型 */
	let bump = options.bump ?? 'patch';

	const newVersion = versionStyle
		? nextVersionByStyle(oldVersion, { versionStyle, resetDailyIncrement, preid, defaultPreid, date })
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
	const { versionStyle, resetDailyIncrement, preid, defaultPreid, date } = options;

	/** 預發行識別：preid 優先，defaultPreid 作為缺省值 */
	const preidValue = preid?.length ? preid : defaultPreid?.length ? defaultPreid : void 0;

	/**
	 * 以指定日期產生基準版本：每日遞增只在同一天計算，
	 * 必須先有基準版本才能判斷舊版本是否與它同日
	 */
	const freshVersion = dateToVersion({
		date,
		style: versionStyle,
		dailyIncrement: 1,
		disableDailyVersionSuffix: !!preidValue,
	});

	/**
	 * 預發行系列啟用時停用當日遞增後綴：
	 * `-n` 與 preid 的 `-xxx` 同時存在會讓版本號帶兩段連字號後綴，
	 * 停用後才能安全地附加 preid
	 */
	if (preidValue)
	{
		return `${freshVersion}-${preidValue}`;
	}

	const { priorityStyle, priorityResult: oldResult } = analyzeVersionStyles(oldVersion);
	const freshResult = analyzeVersionStyles(freshVersion).priorityResult;

	/** 舊版本須為同風格，才可能是「同一天的上一版」 */
	if (resetDailyIncrement || priorityStyle !== versionStyle)
	{
		return freshVersion;
	}

	/**
	 * 每日遞增只計算同一天：舊版本日期與基準日期不同時一律重新開始，
	 * 與 resetDailyIncrement 無關；同一天才遞增其當日計數。
	 * 不同時間的版本編號必然不同，時間段已足以區分同一天的多次發版
	 */
	const isSameDay = !!freshResult && !!oldResult
		&& freshResult.year === oldResult.year
		&& freshResult.month === oldResult.month
		&& freshResult.day === oldResult.day;

	return isSameDay ? incrementVersion(oldVersion) : freshVersion;
}
