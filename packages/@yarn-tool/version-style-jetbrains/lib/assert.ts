import { EnumVersionStyle, IDateInfo } from './types';

/**
 * 驗證日期資訊是否完整
 * Validate date info completeness
 *
 * @param dateInfo - 日期資訊 / Date info
 * @returns 是否有效 / Whether valid
 */
export function isValidDateInfo(dateInfo: Partial<IDateInfo>): dateInfo is IDateInfo
{
	/**
	 * 逐欄位檢查而非僅檢查存在：month 限 1-12、day 限 1-31，
	 * 可在解析階段就攔下如「13 月」「0 日」這類格式正確但語意錯誤的輸入
	 *
	 * Field-by-field checks (not mere presence): month 1-12 and day 1-31 catch
	 * syntactically valid but semantically wrong inputs like "month 13" or day 0
	 */
	return (
		typeof dateInfo.year === 'number' &&
		typeof dateInfo.month === 'number' &&
		typeof dateInfo.day === 'number' &&
		dateInfo.year > 0 &&
		dateInfo.month >= 1 &&
		dateInfo.month <= 12 &&
		dateInfo.day >= 1 &&
		dateInfo.day <= 31
	);
}

/**
 * 斷言日期資訊有效，若無效則拋出錯誤
 * Assert date info is valid, throw error if invalid
 *
 * @param dateInfo - 日期資訊 / Date info
 * @throws RangeError 當日期資訊無效時 / Throws RangeError when date info is invalid
 */
export function _assertValidDateInfo(dateInfo: Partial<IDateInfo>): asserts dateInfo is IDateInfo
{
	/**
	 * 以例外中止而非回傳 false：此函式用於 parsed result 的驗證，
	 * 失敗代表內部解析已出錯，靜默通過會產生錯誤版本號
	 *
	 * Abort with an exception rather than returning false: this validates an
	 * internally parsed result, so a silent pass would yield a wrong version string
	 */
	if (!isValidDateInfo(dateInfo)) throw new RangeError(`Invalid DateInfo: year=${dateInfo.year}, month(1-12)=${dateInfo.month}, and day(1-31)=${dateInfo.day} must be valid numbers.`);
}

/**
 * 斷言日期資訊有效，若無效則拋出錯誤
 * Assert date info is valid, throw error if invalid
 *
 * @param dateInfo - 日期資訊 / Date info
 * @throws RangeError 當日期資訊無效時 / Throws RangeError when date info is invalid
 */
export function assertValidDateInfo(dateInfo: Partial<IDateInfo>): asserts dateInfo is IDateInfo
{
	/**
	 * 與 _assertValidDateInfo 行為相同，公開版本供外部使用；
	 * 失敗時以例外中止，避免錯誤日期流入版本號產生流程
	 *
	 * Same behavior as _assertValidDateInfo but exposed for external use;
	 * failure aborts so invalid dates never reach version generation
	 */
	if (!isValidDateInfo(dateInfo)) throw new RangeError(`Invalid DateInfo: year=${dateInfo.year}, month(1-12)=${dateInfo.month}, and day(1-31)=${dateInfo.day} must be valid numbers.`);
}

/**
 * 驗證季度是否有效
 * Validate quarter is valid
 *
 * @param quarter - 季度 / Quarter
 * @returns 是否有效 / Whether valid
 */
export function isValidQuarter(quarter: unknown): quarter is number
{
	return typeof quarter === 'number' && quarter >= 1 && quarter <= 4;
}

/**
 * 驗證季度是否有效，若無效則拋出錯誤
 * Assert quarter is valid, throw error if invalid
 *
 * @param quarter - 季度 / Quarter
 */
export function assertValidQuarter(quarter: unknown): asserts quarter is number
{
	/**
	 * 季度只允許整數 1-4；超出範圍通常代表年份編碼解析錯誤（末位非季度）
	 *
	 * Quarter must be an integer 1-4; out-of-range values usually mean the
	 * year-code parsing was wrong (last digit was not a quarter)
	 */
	if (!isValidQuarter(quarter))
	{
		throw new RangeError(`Invalid Quarter: quarter(1-4)=${quarter} must be a valid number.`);
	}
}

/**
 * 從版本樣式判斷是否為 JetBrains 短年份樣式
 * Determine if style is JetBrains short year style
 *
 * @param style - 版本樣式 / Version style
 * @returns 是否為 JetBrains 樣式 / Whether it is JetBrains style
 */
export function _isJetbrainsStyleFromStyle(style: EnumVersionStyle): style is EnumVersionStyle.JetbrainsShort | EnumVersionStyle.JetbrainsShortMD
{
	return style === EnumVersionStyle.JetbrainsShort || style === EnumVersionStyle.JetbrainsShortMD;
}

/**
 * 從版本樣式判斷是否使用月日合併格式
 * Determine if style uses month-day combined format
 *
 * @param style - 版本樣式 / Version style
 * @returns 是否使用 MD 格式 / Whether using MD format
 */
export function _isMDCombinedFromStyle(style: EnumVersionStyle): style is EnumVersionStyle.JetbrainsShortMD | EnumVersionStyle.StandardFullMD
{
	return style === EnumVersionStyle.JetbrainsShortMD || style === EnumVersionStyle.StandardFullMD;
}
