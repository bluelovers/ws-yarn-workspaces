/**
 * 基於日期的版本編號生成器核心模組
 *
 * 支援的版本格式:
 * - 261.1.1-1   => 2026年.一月.一號 - 當日第一版 (年=26+235)
 * - 261.101.1  => 2026年.一月一號.當日第一版 (年=26+235, 月日=101)
 * - 2026.101.1 => 2026年.一月一號.當日第一版 (年=2026, 月日=101)
 * - 2026.1.1-1  => 2026年.一月.一號 - 當日第一版 (年=2026, 月=1, 日=1)
 * - 226.1120.1744-1 => 2026年.11月20號.17:44 - 當日第一版 (年=2026 首個 2 + 26, 月日=1120, 時分=1744, 2100 起不支援)
 * - 226.1120.1744   => 同上但停用遞增後綴 (disableDailyVersionSuffix)
 * - 264.1120.1744-1 => 2026年Q4.11月20號.17:44 - 當日第一版 (年=26+季度, 月日=1120, 時分=1744)
 *
 * 時間樣式解析優先序: 與 y2k 格式同時符合時，JetBrains (YYQ) 格式優先
 */
import { EnumVersionStyle, IDateInput, IParseVersionResult, IVersionStyleOptions, IVersionStyleOptionsWithDateInfo } from './lib/types';
import { ISeqVersionAny } from './lib/types-seg';
import { IVersionStyleAnalysisOptions } from './lib/analyze';
export * from './lib/types';
export * from './lib/types-seg';
export { _handleVersionStyleOptions } from './lib/options';
export { analyzeVersionStyles, selectVersionStyles } from './lib/analyze';
export type { IVersionStyleAnalysis, IVersionStyleAnalysisOptions } from './lib/analyze';
/**
 * 解析版本號
 *
 * 以 `analyzeVersionStyles` 的結果經 `selectVersionStyles` 整理後的優先風格為準；
 * 優先序同時符合時的規則由分析核心決定，`prefer` / `exclude` 只重整其結果
 *
 * @param version - 版本號字串
 * @param options - 分析選項（優先選用 / 排除特定風格）
 * @returns 解析結果
 */
export declare function parseVersion(version: ISeqVersionAny, options?: IVersionStyleAnalysisOptions): IParseVersionResult | null;
/**
 * 將日期轉換為版本字串
 *
 * @param options - 選項
 * @returns 版本字串
 */
export declare function dateToVersion(options?: IVersionStyleOptions): string;
/**
 * 根據樣式將日期轉換為版本字串
 *
 * @param style - 版本樣式
 * @param options - 選項
 * @returns 版本字串
 */
export declare function dateToVersionByStyle(style: EnumVersionStyle, options: IVersionStyleOptionsWithDateInfo): string;
/**
 * 取得下一天版本號
 *
 * @param currentVersion - 目前版本號
 * @returns 新版本號
 */
export declare function getNextDayVersion(currentVersion: ISeqVersionAny): string;
/**
 * 遞增版本號的當日計數
 *
 * @param currentVersion - 目前版本號
 * @returns 遞增後的版本號
 */
export declare function incrementVersion(currentVersion: ISeqVersionAny): string;
/**
 * 檢查版本號是否為今天的日期
 *
 * @param version - 版本號
 * @param optionsOrDate - 選項或日期
 * @returns 是否為今天的版本
 */
export declare function isTodayVersion(version: ISeqVersionAny, optionsOrDate?: IVersionStyleOptions | IDateInput): boolean;
/**
 * 從現有版本號取得下個版本
 *
 * @param options - 選項
 * @returns 下一個版本號
 */
export declare function getNextVersion(options?: IVersionStyleOptions): string;
/**
 * 產生所有格式的版本號
 *
 * @param options - 選項
 * @returns 包含所有格式版本號的物件
 */
export declare function generateAllStyleVersions(options?: IVersionStyleOptions): Record<EnumVersionStyle, string>;
