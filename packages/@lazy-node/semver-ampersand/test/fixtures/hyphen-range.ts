/**
 * 連字號範圍測試資料 / Hyphen Range Test Fixtures
 *
 * 測試連字號範圍 (Hyphen Range) 的 satisfies 功能
 * Test satisfies function with hyphen range syntax
 *
 * 連字號範圍 (Hyphen Ranges) 語法說明：
 * Hyphen Ranges (X.Y.Z - A.B.C) specify an inclusive set:
 *
 * - 完整版本範圍：`1.2.3 - 2.3.4` 等於 `>=1.2.3 <=2.3.4`
 *   1.2.3 - 2.3.4 => >=1.2.3 <=2.3.4
 *
 * - 第一個版本格式不完整時，缺失部分補為 0：
 *   If first version is partial, missing parts become 0:
 *   `1.2 - 2.3.4` 等於 `>=1.2.0 <=2.3.4`
 *
 * - 第二個版本格式不完整時，以它開頭的版本都接受：
 *   If second version is partial, it accepts versions starting with it:
 *   `1.2.3 - 2.3` 等於 `>=1.2.3 <2.4.0`
 *   `1.2.3 - 2` 等於 `>=1.2.3 <3.0.0`
 *
 * @see https://github.com/hongfanqie/node-semver
 * @see https://github.com/npm/node-semver/tree/main?tab=readme-ov-file#advanced-range-syntax
 */

import { ITSPartialRecord } from "ts-type";
import { ITSTypeAndStringLiteral } from "ts-type/lib/helper/string";

/**
 * 測試案例分類枚舉 / Test case category enum
 *
 * 用於標記版本相對於範圍的位置關係
 * Used to mark the position relationship between version and range
 */
export const enum EnumRangeTestCaseCategory
{
	/**
	 * 低於範圍 / Below range
	 * 版本號低於範圍下限，預期結果為 false
	 * Version is below the range lower bound, expected result is false
	 */
	below = 'below',

	/**
	 * 介於範圍 / Within range
	 * 版本號在範圍內，預期結果為 true
	 * Version is within the range, expected result is true
	 */
	within = 'within',

	/**
	 * 高於範圍 / Above range
	 * 版本號高於範圍上限，預期結果為 false
	 * Version is above the range upper bound, expected result is false
	 */
	above = 'above',

	/**
	 * 錯誤案例 / Error case
	 * 用於標記預期會拋出錯誤的測試案例
	 * Used to mark test cases that are expected to throw errors
	 */
	error = 'error',
}

/**
 * 測試案例分類標籤對照表 / Test case category label mapping
 *
 * 提供分類枚舉值對應的人類可讀標籤（雙語）
 * Provides human-readable labels (bilingual) for category enum values
 */
export const labelRangeTestCaseCategory = {
	/**
	 * 低於範圍的標籤 / Label for below range
	 */
	[EnumRangeTestCaseCategory.below]: '低於範圍 / Below range',

	/**
	 * 介於範圍的標籤 / Label for within range
	 */
	[EnumRangeTestCaseCategory.within]: '介於範圍 / Within range',

	/**
	 * 高於範圍的標籤 / Label for above range
	 */
	[EnumRangeTestCaseCategory.above]: '高於範圍 / Above range',
} as const satisfies ITSPartialRecord<EnumRangeTestCaseCategory, string>

/**
 * satisfies 範圍測試案例介面 / Satisfies range test case interface
 *
 * 定義單一範圍測試案例的結構，包含範圍、等效範圍和測試版本
 * Defines the structure of a single range test case, including range, equivalent range, and test versions
 */
export interface ISatisfiesRangeTestCase
{
	/**
	 * 連字號範圍輸入 / Hyphen range input
	 *
	 * 要測試的連字號範圍字串
	 * The hyphen range string to test
	 *
	 * @example '1.2.3 - 2.3.4'
	 */
	range: string;

	/**
	 * 等效的標準範圍 / Equivalent standard range
	 *
	 * 連字號範圍轉換後的標準 semver 範圍表示法
	 * The standard semver range notation after converting from hyphen range
	 *
	 * @example '>=1.2.3 <=2.3.4'
	 */
	equivalentRange: string;

	/**
	 * 測試案例描述 / Test case description
	 *
	 * 說明此測試案例的特殊情況或注意事項
	 * Explains special cases or notes for this test case
	 */
	description?: string;

	/**
	 * 測試版本與預期結果 / Test versions with expected results
	 *
	 * 要測試的版本列表及其預期結果
	 * List of versions to test and their expected results
	 *
	 * 建議每組 versions 測試以 5 個版本為限，包含低於/介於/高於的測試
	 * Recommended to limit each versions group to 5 versions, including below/within/above tests
	 */
	versions: {
		/**
		 * 版本號 / Version string
		 *
		 * 要測試的 semver 版本字串
		 * The semver version string to test
		 */
		version: string;

		/**
		 * 預期結果 / Expected result
		 *
		 * satisfies 函數應返回的布林值
		 * The boolean value that satisfies function should return
		 */
		expected: boolean;

		/**
		 * 預期結果理由 / Expected result reason
		 *
		 * 說明為何預期此結果的原因
		 * Explains the reason for the expected result
		 */
		expectedReason?: string;

		/**
		 * 分類 / Category
		 *
		 * 版本相對於範圍的位置分類
		 * The position category of the version relative to the range
		 *
		 * 可能值：'below' | 'within' | 'above' | 'error'
		 * Possible values: 'below' | 'within' | 'above' | 'error'
		 */
		category: ITSTypeAndStringLiteral<EnumRangeTestCaseCategory>;
	}[];
}

/**
 * 連字號範圍測試案例集合 / Hyphen Range Test Case Collection
 *
 * 包含多組連字號範圍測試案例，用於驗證 satisfies 函數的正確性
 * Contains multiple hyphen range test cases to verify the correctness of satisfies function
 *
 * 每組 versions 測試以 5 個版本為限，包含低於/介於/高於的測試
 * Each versions group is limited to 5 versions, including below/within/above tests
 *
 * @see https://github.com/hongfanqie/node-semver
 * @see https://github.com/npm/node-semver/tree/main?tab=readme-ov-file#advanced-range-syntax
 */
export const hyphenRangeTestCases: ISatisfiesRangeTestCase[] = [
	/**
	 * 測試案例 1：完整版本範圍（同 patch 級別）
	 * Test case 1: Complete version range (same patch level)
	 *
	 * `1.2.7 - 1.2.15` 等於 `>=1.2.7 <=1.2.15`
	 */
	{
		range: '1.2.7 - 1.2.15',
		equivalentRange: '>=1.2.7 <=1.2.15',
		versions: [
			// 低於範圍下限 / Below range lower bound
			{ version: '1.2.6', expected: false, category: 'below' },
			// 範圍下限（邊界值）/ Range lower bound (boundary value)
			{ version: '1.2.7', expected: true, category: 'within' },
			// 範圍內部 / Within range
			{ version: '1.2.9', expected: true, category: 'within' },
			// 範圍上限（邊界值）/ Range upper bound (boundary value)
			{ version: '1.2.15', expected: true, category: 'within' },
			// 高於範圍上限 / Above range upper bound
			{ version: '1.2.16', expected: false, category: 'above' },
		],
	},

	/**
	 * 測試案例 2：完整版本範圍（跨 minor 版本）
	 * Test case 2: Complete version range (cross minor version)
	 *
	 * `1.2.3 - 2.3.4` 等於 `>=1.2.3 <=2.3.4`
	 */
	{
		range: '1.2.3 - 2.3.4',
		equivalentRange: '>=1.2.3 <=2.3.4',
		versions: [
			// 低於範圍下限 / Below range lower bound
			{ version: '1.2.2', expected: false, category: 'below' },
			// 範圍下限（邊界值）/ Range lower bound (boundary value)
			{ version: '1.2.3', expected: true, category: 'within' },
			// 範圍內部 / Within range
			{ version: '1.5.0', expected: true, category: 'within' },
			// 範圍上限（邊界值）/ Range upper bound (boundary value)
			{ version: '2.3.4', expected: true, category: 'within' },
			// 高於範圍上限 / Above range upper bound
			{ version: '2.3.5', expected: false, category: 'above' },
		],
	},

	/**
	 * 測試案例 3：第二個版本格式不完整（僅 major.minor）
	 * Test case 3: Second version is partial (major.minor only)
	 *
	 * `1.2.3 - 2.3` 等於 `>=1.2.3 <2.4.0`
	 * 如果第二個版本格式不完整，則以它開頭的版本都接受
	 * If second version is partial, it accepts versions starting with it
	 */
	{
		range: '1.2.3 - 2.3',
		equivalentRange: '>=1.2.3 <2.4.0',
		description: '如果第二個版本格式不完整，則以它開頭的版本都接受',
		versions: [
			// 低於範圍下限 / Below range lower bound
			{ version: '1.2.2', expected: false, category: 'below' },
			// 範圍下限（邊界值）/ Range lower bound (boundary value)
			{ version: '1.2.3', expected: true, category: 'within' },
			// 範圍內部 / Within range
			{ version: '2.0.0', expected: true, category: 'within' },
			// 範圍上限前一刻 / Just before range upper bound
			{ version: '2.3.9', expected: true, category: 'within' },
			// 高於範圍上限 / Above range upper bound
			{ version: '2.4.0', expected: false, category: 'above' },
		],
	},

	/**
	 * 測試案例 4：第二個版本格式不完整（僅 major）
	 * Test case 4: Second version is partial (major only)
	 *
	 * `1.2.3 - 2` 等於 `>=1.2.3 <3.0.0`
	 * 如果第二個版本格式不完整，則以它開頭的版本都接受
	 * If second version is partial, it accepts versions starting with it
	 */
	{
		range: '1.2.3 - 2',
		equivalentRange: '>=1.2.3 <3.0.0',
		description: '如果第二個版本格式不完整，則以它開頭的版本都接受',
		versions: [
			// 低於範圍下限 / Below range lower bound
			{ version: '1.2.2', expected: false, category: 'below' },
			// 範圍下限（邊界值）/ Range lower bound (boundary value)
			{ version: '1.2.3', expected: true, category: 'within' },
			// 範圍內部 / Within range
			{ version: '2.0.0', expected: true, category: 'within' },
			// 範圍上限前一刻 / Just before range upper bound
			{ version: '2.9.9', expected: true, category: 'within' },
			// 高於範圍上限 / Above range upper bound
			{ version: '3.0.0', expected: false, category: 'above' },
		],
	},

	/**
	 * 測試案例 5：第一個版本格式不完整
	 * Test case 5: First version is partial
	 *
	 * `1.2 - 2.3.4` 等於 `>=1.2.0 <=2.3.4`
	 * 第一個版本格式不完整，缺失部分補為 0
	 * First version is partial, missing parts become 0
	 */
	{
		range: '1.2 - 2.3.4',
		equivalentRange: '>=1.2.0 <=2.3.4',
		description: '第一個版本格式不完整，缺失部分補為 0',
		versions: [
			// 低於範圍下限 / Below range lower bound
			{ version: '1.1.9', expected: false, category: 'below' },
			// 範圍下限（邊界值）/ Range lower bound (boundary value)
			{ version: '1.2.0', expected: true, category: 'within' },
			// 範圍內部 / Within range
			{ version: '1.5.0', expected: true, category: 'within' },
			// 範圍上限（邊界值）/ Range upper bound (boundary value)
			{ version: '2.3.4', expected: true, category: 'within' },
			// 高於範圍上限 / Above range upper bound
			{ version: '2.3.5', expected: false, category: 'above' },
		],
	},
];

export default hyphenRangeTestCases;
