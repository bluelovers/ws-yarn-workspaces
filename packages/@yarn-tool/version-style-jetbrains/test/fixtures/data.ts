/**
 * Created by user on 2026/3/9.
 */

import { EnumVersionStyle, IVersionStyleOptionsWithDateInfo } from '../../lib/index';

/**
 * 測試用日期：2026年1月1日 (Q1)
 * Test date: January 1, 2026 (Q1)
 */
export const TEST_DATE_Q1 = new Date(2026, 0, 1);
/**
 * 測試用日期：2026年6月15日 (Q2)
 * Test date: June 15, 2026 (Q2)
 */
export const TEST_DATE_Q2 = new Date(2026, 5, 15);
/**
 * 測試用日期：2026年3月8日 (Q1)
 * Test date: March 8, 2026 (Q1)
 */
export const TEST_DATE_MARCH_8 = new Date(2026, 2, 8);
/**
 * 測試用基礎選項 (含 year, month, day)
 * Test base options (with year, month, day)
 */
export const TEST_BASE_OPTIONS: IVersionStyleOptionsWithDateInfo = {
	year: 2026,
	month: 1,
	day: 1,
	dailyIncrement: 1,
};
/**
 * Q2 測試用選項
 * Q2 test options
 */
export const TEST_Q2_OPTIONS: IVersionStyleOptionsWithDateInfo = {
	year: 2026,
	month: 6,
	day: 15,
	dailyIncrement: 1,
};
/**
 * 測試用日期資訊對應表
 * Test date info mapping table
 */
export const TEST_DATE_INFO: Record<string, {
	date: Date;
	options: IVersionStyleOptionsWithDateInfo;
	quarter: number
}> = {
	Q1_JAN_1: { date: TEST_DATE_Q1, options: TEST_BASE_OPTIONS, quarter: 1 },
	Q2_JUN_15: { date: TEST_DATE_Q2, options: TEST_Q2_OPTIONS, quarter: 2 },
	Q1_MAR_8: { date: TEST_DATE_MARCH_8, options: { year: 2026, month: 3, day: 8, dailyIncrement: 1 }, quarter: 1 },
};
/**
 * dateToVersionByStyle 預期結果映射
 * Expected results for dateToVersionByStyle
 */
export const EXPECTED_DATE_TO_VERSION: Record<EnumVersionStyle, string> = {
	[EnumVersionStyle.JetbrainsShort]: '261.1.1-1',
	[EnumVersionStyle.JetbrainsShortMD]: '261.101.1',
	[EnumVersionStyle.StandardFull]: '2026.1.1-1',
	[EnumVersionStyle.StandardFullMD]: '2026.101.1',
};
/**
 * Q2 dateToVersionByStyle 預期結果映射
 * Q2 expected results for dateToVersionByStyle
 */
export const EXPECTED_DATE_TO_VERSION_Q2: Record<EnumVersionStyle, string> = {
	[EnumVersionStyle.JetbrainsShort]: '262.6.15-1',
	[EnumVersionStyle.JetbrainsShortMD]: '262.615.1',
	[EnumVersionStyle.StandardFull]: '2026.6.15-1',
	[EnumVersionStyle.StandardFullMD]: '2026.615.1',
};
/**
 * 解析 JetbrainsShort 格式的預期結果
 * Expected result for parsing JetbrainsShort format
 */
export const PARSE_EXPECTED_JETBRAINS_SHORT = {
	year: 2026,
	month: 1,
	day: 1,
	dailyVersion: 1,
	isJetbrainsShort: true,
	isMDCombined: false,
};
/**
 * 解析 JetbrainsShortMD 格式的預期結果
 * Expected result for parsing JetbrainsShortMD format
 */
export const PARSE_EXPECTED_JETBRAINS_SHORT_MD = {
	year: 2026,
	month: 1,
	day: 1,
	dailyVersion: 1,
	isJetbrainsShort: true,
	isMDCombined: true,
};
/**
 * 解析 StandardFull 格式的預期結果
 * Expected result for parsing StandardFull format
 */
export const PARSE_EXPECTED_STANDARD_FULL = {
	year: 2026,
	month: 1,
	day: 1,
	dailyVersion: 1,
	isJetbrainsShort: false,
	isMDCombined: false,
};
/**
 * 解析 StandardFullMD 格式的預期結果
 * Expected result for parsing StandardFullMD format
 */
export const PARSE_EXPECTED_STANDARD_FULL_MD = {
	year: 2026,
	month: 1,
	day: 1,
	dailyVersion: 1,
	isJetbrainsShort: false,
	isMDCombined: true,
};
/**
 * 驗證 getQuarterFromMonth 的測試資料
 * Test data for getQuarterFromMonth
 */
export const QUARTER_TEST_CASES = [
	{ month: 1, expected: 1 },
	{ month: 2, expected: 1 },
	{ month: 3, expected: 1 },
	{ month: 4, expected: 2 },
	{ month: 5, expected: 2 },
	{ month: 6, expected: 2 },
	{ month: 7, expected: 3 },
	{ month: 8, expected: 3 },
	{ month: 9, expected: 3 },
	{ month: 10, expected: 4 },
	{ month: 11, expected: 4 },
	{ month: 12, expected: 4 },
];
/**
 * 驗證 getJetbrainsYearCode 的測試資料
 * Test data for getJetbrainsYearCode
 */
export const JETBRAINS_YEAR_CODE_TEST_CASES = [
	{ year: 2026, quarter: 1, expected: 261 },
	{ year: 2026, quarter: 2, expected: 262 },
	{ year: 2026, quarter: 3, expected: 263 },
	{ year: 2026, quarter: 4, expected: 264 },
	{ year: 2027, quarter: 1, expected: 271 },
];
/**
 * isValidDateInfo 測試資料
 * Test data for isValidDateInfo
 */
export const VALID_DATE_INFO_TEST_CASES = [
	// 有效日期 / Valid dates
	{ input: { year: 2026, month: 1, day: 1 }, expected: true },
	{ input: { year: 2026, month: 1, day: 31 }, expected: true },
	{ input: { year: 2026, month: 12, day: 31 }, expected: true },
	// 無效月份 / Invalid months
	{ input: { year: 2026, month: 0, day: 1 }, expected: false },
	{ input: { year: 2026, month: 13, day: 1 }, expected: false },
	// 無效日期 / Invalid days
	{ input: { year: 2026, month: 1, day: 0 }, expected: false },
	{ input: { year: 2026, month: 1, day: 32 }, expected: false },
	// 無效年份 / Invalid years
	{ input: { year: 0, month: 1, day: 1 }, expected: false },
	{ input: { year: -1, month: 1, day: 1 }, expected: false },
	// 缺少欄位 / Missing fields
	{ input: { month: 1, day: 1 }, expected: false },
	{ input: { year: 2026, day: 1 }, expected: false },
	{ input: { year: 2026, month: 1 }, expected: false },
];
/**
 * dateToVersionByStyle 測試資料
 * Test data for dateToVersionByStyle
 */
export const DATE_TO_VERSION_STYLE_TEST_CASES: Array<{
	style: EnumVersionStyle;
	dateInfo: IVersionStyleOptionsWithDateInfo;
	expected: string;
}> = [
	// 基本樣式 / Basic styles
	{ style: EnumVersionStyle.JetbrainsShort, dateInfo: TEST_BASE_OPTIONS, expected: '261.1.1-1' },
	{ style: EnumVersionStyle.JetbrainsShortMD, dateInfo: TEST_BASE_OPTIONS, expected: '261.101.1' },
	{ style: EnumVersionStyle.StandardFull, dateInfo: TEST_BASE_OPTIONS, expected: '2026.1.1-1' },
	{ style: EnumVersionStyle.StandardFullMD, dateInfo: TEST_BASE_OPTIONS, expected: '2026.101.1' },
	// 不同月份和日期 / Different months and days
	{
		style: EnumVersionStyle.StandardFullMD,
		dateInfo: { year: 2026, month: 3, day: 8, dailyIncrement: 1 },
		expected: '2026.308.1',
	},
	// 不同季度 / Different quarters
	{ style: EnumVersionStyle.JetbrainsShortMD, dateInfo: TEST_Q2_OPTIONS, expected: '262.615.1' },
	// 遞增版本 / Increment version
	{
		style: EnumVersionStyle.JetbrainsShort,
		dateInfo: { year: 2026, month: 1, day: 1, dailyIncrement: 2 },
		expected: '261.1.1-2',
	},
];
/**
 * dateToVersionByStyle 禁用日版本後綴測試資料
 * Test data for dateToVersionByStyle with disableDailyVersionSuffix
 */
export const DATE_TO_VERSION_DISABLE_SUFFIX_TEST_CASES: Array<{
	style: EnumVersionStyle;
	dateInfo: IVersionStyleOptionsWithDateInfo;
	expected: string;
}> = [
	{
		style: EnumVersionStyle.JetbrainsShort,
		dateInfo: { ...TEST_BASE_OPTIONS, disableDailyVersionSuffix: true },
		expected: '261.1.1',
	},
	{
		style: EnumVersionStyle.StandardFull,
		dateInfo: { ...TEST_BASE_OPTIONS, disableDailyVersionSuffix: true },
		expected: '2026.1.1',
	},
	// MD 格式應該忽略 disableDailyVersionSuffix
	{
		style: EnumVersionStyle.JetbrainsShortMD,
		dateInfo: { ...TEST_BASE_OPTIONS, disableDailyVersionSuffix: true },
		expected: '261.101.1',
	},
	{
		style: EnumVersionStyle.StandardFullMD,
		dateInfo: { ...TEST_BASE_OPTIONS, disableDailyVersionSuffix: true },
		expected: '2026.101.1',
	},
];
/**
 * parseVersion 測試資料
 * Test data for parseVersion
 */
export const PARSE_VERSION_TEST_CASES = [
	{ version: '261.1.1-1', expected: PARSE_EXPECTED_JETBRAINS_SHORT },
	{ version: '261.101.1', expected: PARSE_EXPECTED_JETBRAINS_SHORT_MD },
	{
		version: '262.615.1',
		expected: { year: 2026, month: 6, day: 15, dailyVersion: 1, isJetbrainsShort: true, isMDCombined: true },
	},
	{ version: '2026.1.1-1', expected: PARSE_EXPECTED_STANDARD_FULL },
	{ version: '2026.101.1', expected: PARSE_EXPECTED_STANDARD_FULL_MD },
	{ version: '2026.1.1', expected: PARSE_EXPECTED_STANDARD_FULL },
	{ version: 'invalid', expected: null },
];
/**
 * incrementVersion 測試資料
 * Test data for incrementVersion
 */
export const INCREMENT_VERSION_TEST_CASES = [
	{ version: '261.1.1-1', expected: '261.1.1-2' },
	{ version: '261.101.1', expected: '261.101.2' },
	{ version: '2026.101.1', expected: '2026.101.2' },
];
