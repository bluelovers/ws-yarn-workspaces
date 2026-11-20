import { EnumVersionStyle, IParseVersionResult, IVersionStyleFlags } from './types';
import { ISeqVersionAny } from './types-seg';
import {
	_parseJetbrainsDateTime,
	_parseJetbrainsShort,
	_parseStandardFullVersion,
	_parseY2KDateTime,
} from './helpers';

/**
 * 版本風格分析結果
 */
export interface IVersionStyleAnalysis
{
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
 * 從解析旗標取得對應的版本樣式
 *
 * @param flags - 解析結果旗標
 * @returns 版本樣式
 */
export function _getStyleFromFlags(flags: IVersionStyleFlags): EnumVersionStyle
{
	const { isJetbrainsShort, isMDCombined, isDateTime, isY2KDateTime } = flags;

	/**
	 * 日期時間樣式必然同時為短年份與月日合併，故需優先判斷，
	 * 否則會被下方 2x2 矩陣誤判成 JetbrainsShortMD；
	 * 兩種時間樣式再以 isY2KDateTime 區分年份編碼 (2YY 與 YYQ)
	 */
	if (isDateTime)
	{
		return isY2KDateTime ? EnumVersionStyle.Y2KDateTime : EnumVersionStyle.JetbrainsDateTime;
	}

	/**
	 * 兩個布林旗標組成 2x2 矩陣，先判斷年份格式再判斷月日格式，
	 * 可避免四種樣式各寫一個條件
	 */
	if (isJetbrainsShort)
	{
		return isMDCombined ? EnumVersionStyle.JetbrainsShortMD : EnumVersionStyle.JetbrainsShort;
	}
	return isMDCombined ? EnumVersionStyle.StandardFullMD : EnumVersionStyle.StandardFull;
}

/**
 * 分析版本號符合的風格
 *
 * 依優先序逐一嘗試各風格解析器，回傳所有符合的風格與同時符合時採用的優先風格；
 * 優先序即解析規則的單一事實來源，`parseVersion` 也由此取得優先結果
 *
 * @param version - 版本號字串
 * @returns 風格分析結果
 */
export function analyzeVersionStyles(version: ISeqVersionAny): IVersionStyleAnalysis
{
	/**
	 * 各風格解析器，越前面優先權越高：
	 *
	 * 1. JetBrains 日期時間 (YYQ.MMDD.HHmm) 與 y2k 日期時間 (2YY.MMDD.HHmm) 同時符合時，JetBrains 優先
	 * 2. 時間樣式須第三段為合法時分，否則交回給遞增式樣式解析
	 * 3. 標準樣式以四位年份區隔，不會與三位年份編碼的樣式相撞
	 * 4. JetBrains 短樣式要求合法 YYQ 編碼，避免 4 位年份被誤判
	 *
	 * 以包裝函式延遲取用解析器，避免模組載入循環時在初始化階段讀到未就緒的函式
	 */
	const candidates: ReadonlyArray<(version: string) => IParseVersionResult | null> = [
		(v) => _parseJetbrainsDateTime(v),
		(v) => _parseY2KDateTime(v),
		(v) => _parseStandardFullVersion(v),
		(v) => _parseJetbrainsShort(v),
	];

	const matchedStyles: EnumVersionStyle[] = [];
	const matchedResults: Partial<Record<EnumVersionStyle, IParseVersionResult>> = {};
	let priorityStyle: EnumVersionStyle | null = null;
	let priorityResult: IParseVersionResult | null = null;

	for (const parse of candidates)
	{
		const result = parse(version);

		/** 不符合此風格即換下一個候選 */
		if (!result)
		{
			continue;
		}

		const style = _getStyleFromFlags(result);

		matchedStyles.push(style);
		matchedResults[style] ??= result;

		/** 優先風格取第一個符合者，其餘風格僅列入符合清單 */
		priorityStyle ??= style;
		priorityResult ??= result;
	}

	return {
		matchedStyles,
		matchedResults,
		priorityStyle,
		priorityResult,
	};
}
