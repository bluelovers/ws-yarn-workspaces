/**
 * 類型定義模組 / Type definitions module
 *
 * Created by user on 2020/6/11.
 *
 * @packageDocumentation
 */
import { IStylesNameWithoutFn } from 'debug-color2/lib/types';
import { Console2 } from 'debug-color2';
import { IStylesColorNames } from 'debug-color2/lib/styles';
import { ICompareReturnType } from '@lazy-node/semver-part';
import { IChalk } from 'debug-color2';
/**
 * parseVersionsDiffCore 的回傳型別
 * Return type of parseVersionsDiffCore
 *
 * 同時包含 @lazy-node/semver-part 的差異分析結果與本套件的著色中繼資料。
 * Carries both the difference-analysis result from @lazy-node/semver-part and
 * the colorization metadata of this package.
 */
export interface IParseVersionsDiffCore {
    /**
     * major / minor / patch 三段的顏色配置
     * Color triplet for the major / minor / patch segments
     */
    _colors: [
        IStylesColorNames,
        IStylesColorNames,
        IStylesColorNames
    ];
    /**
     * 依差異段落索引從 _colors 取出的顏色
     * Color picked from `_colors` by the differing segment index
     */
    color: IStylesColorNames;
    /**
     * 被保留的 `^` / `~` 前綴；無前綴時為空字串
     * Preserved `^` / `~` prefix; empty string when there is none
     */
    leadingWildcard: string;
    /**
     * 差異段落之前的版本前綴（未著色）
     * Version prefix before the difference (never colorized)
     */
    result: string;
    /**
     * 連接前後兩段用的 `.`，差異不在中間段落時為空字串
     * Connecting `.` between the two halves; empty when the difference is not
     * in a middle segment
     */
    middot: string;
    /**
     * 從差異段落開始的其餘版本部分（著色目標）
     * Remainder of the version starting at the changed segment (the part that
     * gets colorized)
     */
    resultAppend: string;
    /**
     * 舊版本相對新版本的比較結果（1 | 0 | -1）
     * Comparison of the old version against the new one (1 | 0 | -1)
     */
    comp: ICompareReturnType;
    /** 舊版本字串 / Old version string */
    versionOld: string;
    /** 新版本字串 / New version string */
    versionNew: string;
    /** 舊版本的段落陣列 / Segments of the old version */
    partsOld: string[];
    /** 新版本的段落陣列 / Segments of the new version */
    partsNew: string[];
    /**
     * 差異發生的段落索引（0 = major、1 = minor、2 = patch；相同時為段落總數）
     * Segment index of the difference (0 = major, 1 = minor, 2 = patch; the
     * segment count when the versions are identical)
     */
    index: number;
}
/**
 * 共用的著色選項
 * Shared colorization options
 *
 * 由 IOptionsParseVersionsDiff 繼承，供需要 chalk/console 的 API 使用。
 * Extended by IOptionsParseVersionsDiff; used by the APIs that need
 * chalk/console.
 */
export interface IOptionsParseVersionsDiffPlus {
    /** 自行注入的 chalk 實例 / Injected chalk instance */
    chalk?: Pick<IChalk, IStylesNameWithoutFn>;
    /** 用來推導 chalk 的 debug-color2 console / debug-color2 console used to derive chalk */
    console?: Console2;
}
/**
 * 差異顯示選項
 * Difference display options
 *
 * 除共用選項外，另可自訂三段配色或關閉 ANSI 轉義。
 * On top of the shared options, allows customizing the color triplet or
 * disabling ANSI escapes.
 */
export interface IOptionsParseVersionsDiff extends IOptionsParseVersionsDiffPlus {
    /** major / minor / patch 三段各自的顏色 / Colors for the major / minor / patch segments */
    _colors?: [IStylesColorNames, IStylesColorNames, IStylesColorNames];
    /** 為 true 時輸出不含 ANSI 轉義的純文字 / When true, emit plain text without ANSI escapes */
    stripAnsi?: boolean;
}
