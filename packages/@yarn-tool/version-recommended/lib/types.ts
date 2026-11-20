import { ReleaseType } from 'semver';
import { ITSPartialRecord } from 'ts-type/lib/type/record';
import { IdentifierBase } from 'semver/functions/inc';

/**
 * 版本推薦的回傳結果
 */
export interface INextVersionRecommended
{
	/** 實際採用的 bump 類型（可能由選項推斷而來） */
	bump: ReleaseType;
	/** 輸入的舊版本號 */
	oldVersion: string;
	/** 推薦的新版本號 */
	newVersion: string;
}

/**
 * 由舊版本預發行資訊偵測出的結果
 */
export interface IResultDetectPreid
{
	/** 偵測出的 bump 類型，一定是預發行類型 */
	bump: IPreReleaseType;
	/** 偵測出的 preid，可能為 undefined（交由 semver 沿用舊值） */
	preid: string;
	/** 數字識別的基準，false 表示不重置計數 */
	identifierBase: IdentifierBase | false
}

/**
 * 版本推薦選項
 *
 * 除了明確欄位外，也允許直接以 ReleaseType 名稱作為布林旗標
 * （如 `{ minor: true }`）指定 bump 類型。
 */
export interface INextVersionRecommendedOptions extends ITSPartialRecord<ReleaseType, boolean>
{
	/** 搜尋專案根目錄的起始路徑 */
	cwd?: string;
	/** 明確指定的 bump 類型 */
	bump?: ReleaseType;
	/** 預發行識別字串（如 beta） */
	preid?: string;
	/** 預發行數字基準；false 表示沿用計數不重置 */
	identifierBase?: IdentifierBase | 0 | 1 | false
	/** 純數字 preid 時採用的預設值 */
	defaultPreid?: string,
}

/** 非預發行的 bump 類型 */
export type IBaseReleaseType<T extends ReleaseType = ReleaseType> = Exclude<T, `pre${string}`>
/** 預發行的 bump 類型 */
export type IPreReleaseType<T extends ReleaseType = ReleaseType> = Extract<T, `pre${string}`>

/**
 * 所有可作為旗標使用的 ReleaseType；
 * 順序即為 handleOptions 掃描旗標的優先順序
 */
export const releaseTypes: ReleaseType[] = [
	'major',
	'minor',
	'patch',
	'premajor',
	'preminor',
	'prepatch',
	'prerelease',
];
