import { EnumVersionStyle, IParseVersionResult, IVersionStyleFlags } from './types';
import { ISeqVersionAny } from './types-seg';
/**
 * 版本風格分析結果
 */
export interface IVersionStyleAnalysis {
    /** 版本符合的所有風格，依解析優先序排列 */
    matchedStyles: EnumVersionStyle[];
    /** 符合的風格對應其解析結果，以風格為 key（僅收錄符合的風格） */
    matchedResults: Partial<Record<EnumVersionStyle, IParseVersionResult>>;
    /** 同時符合時採用的優先風格；全部不符合時為 null */
    priorityStyle: EnumVersionStyle | null;
    /** 優先風格的解析結果；全部不符合時為 null */
    priorityResult: IParseVersionResult | null;
}
/**
 * 風格分析選項
 */
export interface IVersionStyleAnalysisOptions {
    /**
     * 優先選用的風格清單
     *
     * 符合者會提到符合清單最前面（清單內依給定順序），優先風格隨之改變；
     * 未符合的風格不影響結果
     */
    prefer?: EnumVersionStyle[];
    /**
     * 排除的風格清單
     *
     * 即使符合也不列入 matchedStyles / matchedResults，也不可能成為優先風格；
     * 同時出現在 prefer 時以 exclude 為準
     */
    exclude?: EnumVersionStyle[];
}
/**
 * 從解析旗標取得對應的版本樣式
 *
 * @param flags - 解析結果旗標
 * @returns 版本樣式
 */
export declare function _getStyleFromFlags(flags: IVersionStyleFlags): EnumVersionStyle;
/**
 * 分析版本號符合的風格
 *
 * 依優先序逐一嘗試各風格解析器，回傳所有符合的風格與同時符合時採用的優先風格；
 * 解析優先序是規則的單一事實來源，`parseVersion` 也由此取得優先結果，
 * 需要依 `prefer` / `exclude` 重排或排除時，交給 `selectVersionStyles` 處理本函式的結果
 *
 * @param version - 版本號字串
 * @returns 風格分析結果
 */
export declare function analyzeVersionStyles(version: ISeqVersionAny): IVersionStyleAnalysis;
/**
 * 依優先選用 / 排除清單，從風格分析結果選出最終樣式
 *
 * 只整理 `analyzeVersionStyles` 的結果，不重新解析：
 *
 * 1. `exclude` 先過濾：被排除的風格即使符合也不列入，更不可能成為優先風格
 * 2. `prefer` 再重排：符合的優先風格提到最前面（清單內依給定順序），其餘保持原解析優先序
 * 3. 未符合的優先風格不佔位；兩張清單都沒給時原樣回傳
 *
 * @param analysis - `analyzeVersionStyles` 的分析結果
 * @param options - 選擇選項（優先選用 / 排除特定風格）
 * @returns 整理後的風格分析結果
 */
export declare function selectVersionStyles(analysis: IVersionStyleAnalysis, options?: IVersionStyleAnalysisOptions): IVersionStyleAnalysis;
