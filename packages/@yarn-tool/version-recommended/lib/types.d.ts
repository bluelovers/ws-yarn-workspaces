/**
 * 版本推薦相關型別定義
 * Type definitions for version recommendation
 */
import { ReleaseType } from 'semver';
import { ITSPartialRecord } from 'ts-type/lib/type/record';
import { IdentifierBase } from 'semver/functions/inc';
/**
 * 版本推薦的回傳結果
 * Result of a version recommendation
 */
export interface INextVersionRecommended {
    /** 實際採用的 bump 類型（可能由選項推斷而來）/ The bump type actually used (possibly inferred from options) */
    bump: ReleaseType;
    /** 輸入的舊版本號 / The input old version */
    oldVersion: string;
    /** 推薦的新版本號 / The recommended new version */
    newVersion: string;
}
/**
 * 由舊版本預發行資訊偵測出的結果
 * Detection result derived from a version's pre-release info
 */
export interface IResultDetectPreid {
    /** 偵測出的 bump 類型，一定是預發行類型 / Detected bump type, always a pre-release type */
    bump: IPreReleaseType;
    /** 偵測出的 preid，可能為 undefined（交由 semver 沿用舊值）/ Detected preid, may be undefined (semver then reuses the old value) */
    preid: string;
    /** 數字識別的基準，false 表示不重置計數 / Numeric identifier base; false means do not reset the counter */
    identifierBase: IdentifierBase | false;
}
/**
 * 版本推薦選項
 * Version recommendation options
 *
 * 除了明確欄位外，也允許直接以 ReleaseType 名稱作為布林旗標
 * （如 `{ minor: true }`）指定 bump 類型。
 *
 * Besides the explicit fields, ReleaseType names may also be used as boolean
 * flags (e.g. `{ minor: true }`) to specify the bump type.
 */
export interface INextVersionRecommendedOptions extends ITSPartialRecord<ReleaseType, boolean> {
    /** 搜尋專案根目錄的起始路徑 / Starting path used to find the project root */
    cwd?: string;
    /** 明確指定的 bump 類型 / Explicitly specified bump type */
    bump?: ReleaseType;
    /** 預發行識別字串（如 beta）/ Pre-release identifier (e.g. "beta") */
    preid?: string;
    /** 預發行數字基準；false 表示沿用計數不重置 / Numeric base for pre-release; false keeps counting without reset */
    identifierBase?: IdentifierBase | 0 | 1 | false;
    /** 純數字 preid 時採用的預設值 / Fallback preid when the old pre-release segment is numeric */
    defaultPreid?: string;
}
/** 非預發行的 bump 類型 / Non pre-release bump types */
export type IBaseReleaseType<T extends ReleaseType = ReleaseType> = Exclude<T, `pre${string}`>;
/** 預發行的 bump 類型 / Pre-release bump types */
export type IPreReleaseType<T extends ReleaseType = ReleaseType> = Extract<T, `pre${string}`>;
/**
 * 所有可作為旗標使用的 ReleaseType；
 * 順序即為 handleOptions 掃描旗標的優先順序
 *
 * Every ReleaseType usable as a flag; the order is the priority
 * used by handleOptions when scanning flags
 */
export declare const releaseTypes: ReleaseType[];
