/**
 * Changelog 類型定義模組
 * Changelog Type Definitions Module
 *
 * 定義 conventional changelog 相關的介面和類型
 * Defines interfaces and types for conventional changelog
 *
 * Created by user on 2020/6/15.
 */
import { ITSRequireAtLeastOne } from 'ts-type';
/**
 * 預設的 Changelog 規範類型
 * Changelog preset types
 *
 * 支援的預設規範：angular, atom, codemirror 等
 * Supported presets: angular, atom, codemirror, etc.
 */
export type IChangelogPreset = string | "conventional-changelog-angular" | "@bluelovers/conventional-changelog-bluelovers";
/**
 * Changelog 類型
 * Changelog type
 *
 * - independent: 獨立版本模式 (每個套件有自己的版本)
 * - root: 根目錄模式 (所有套件共用一個版本)
 */
export type IType = "independent" | "root" | string;
/**
 * 基礎選項核心介面
 * Base options core interface
 */
export interface IOptionsBaseCore {
    /**
     * 使用的 Changelog 預設規範
     * Changelog preset to use
     */
    changelogPreset?: IChangelogPreset;
    /**
     * 工作區根目錄路徑
     * Workspace root path
     */
    rootPath?: string;
}
/**
 * 基礎選項介面
 * Base options interface
 */
export interface IOptionsBase extends IOptionsBaseCore {
    /**
     * 標籤前綴，預設為 'v'
     * Tag prefix, default is 'v'
     */
    tagPrefix?: string | 'v';
}
/**
 * 輸入選項類型
 * Input options type
 *
 * 至少需要設定 changelogPreset 或 rootPath 其中一個
     * At least one of changelogPreset or rootPath must be set
 */
export type IOptionsInput = IOptionsBase & ITSRequireAtLeastOne<IOptionsBaseCore>;
/**
 * 更新 Changelog 的選項
 * Options for updating changelog
 */
export type IOptionsUpdateChangelog = IOptionsInput & {
    /**
     * 指定版本號，若未提供則使用套件目前的版本
     * Specify version number, uses package current version if not provided
     */
    version?: string;
};
/**
 * 推薦版本的選項
 * Options for recommending version
 */
export type IOptionsRecommendVersion = IOptionsInput & {
    /**
     * 預發布版本識別碼 (如: alpha, beta, rc)
     * Prerelease identifier (e.g., alpha, beta, rc)
     */
    prereleaseId?: string;
};
/**
 * 帶有類型的選項
 * Options with type
 */
export type IOptionsWithType<T extends Record<any, any>> = T & {
    /**
     * Changelog 類型 (independent | root)
     * Changelog type (independent | root)
     */
    type?: IType;
};
/**
 * 更新 Changelog 的返回類型
 * Return type for updating changelog
 */
export interface IReturnTypeUpdateChangelog {
    /**
     * Changelog 檔案路徑
     * Changelog file path
     */
    logPath: string;
    /**
     * 新增的 Changelog 內容
     * New changelog entry content
     */
    newEntry: string;
    /**
     * 版本號
     * Version number
     */
    version: string;
}
