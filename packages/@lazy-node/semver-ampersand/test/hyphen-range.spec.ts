/**
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
 * @see https://github.com/npm/node-semver/tree/main?tab=readme-ov-file#advanced-range-syntax
 */
import { satisfies } from '../index';
import semverSatisfies from 'semver/functions/satisfies';
import hyphenRangeTestCases, { labelRangeTestCaseCategory } from './fixtures/hyphen-range';

describe('satisfies with hyphen range', () =>
{

	/**
	 * 測試連字號範圍的各種案例
	 * Test various hyphen range cases
	 */
	describe('hyphen range test cases', () =>
	{
		hyphenRangeTestCases.forEach(({ range, equivalentRange, versions }) =>
		{
			describe(`range: "${range}" (equivalent to "${equivalentRange}")`, () =>
			{
				versions.forEach(({ version, expected, category }) =>
				{
					// 取得分類標籤，若無則使用原始分類值
					// Get category label, or use raw category value if not found
					const categoryLabel = labelRangeTestCaseCategory[category] ?? category;

					describe(`${categoryLabel}: ${version}`, () =>
					{
						/**
						 * 測試 semver-ampersand 的 satisfies 函數
						 * Test semver-ampersand's satisfies function
						 */
						it(`semver-ampersand satisfies should return ${expected}`, () =>
						{
							expect(satisfies(version, range)).toBe(expected);
						});

						/**
						 * 測試原版 semver 的 satisfies 函數
						 * Test original semver's satisfies function
						 */
						it(`original semver satisfies should return ${expected}`, () =>
						{
							expect(semverSatisfies(version, equivalentRange)).toBe(expected);
						});

						/**
						 * 驗證 semver-ampersand 與原版 semver 結果一致
						 * Verify semver-ampersand and original semver have same result
						 */
						it('semver-ampersand and original semver should have same result', () =>
						{
							const ampersandResult = satisfies(version, range);
							const originalResult = semverSatisfies(version, equivalentRange);
							expect(ampersandResult).toBe(originalResult);
						});

						/**
						 * 驗證原版 semver 的連字號範圍與等效範圍結果一致
						 * Verify original semver's hyphen range and equivalent range have same result
						 */
						it(`original semver satisfies range should be equivalent to equivalentRange`, () =>
						{
							const hyphenResult = semverSatisfies(version, range);
							const equivalentResult = semverSatisfies(version, equivalentRange);
							expect(hyphenResult).toBe(equivalentResult);
						});

						/**
						 * 驗證 semver-ampersand 的連字號範圍與等效範圍結果一致
						 * Verify semver-ampersand's hyphen range and equivalent range have same result
						 */
						it(`semver-ampersand satisfies range should be equivalent to equivalentRange`, () =>
						{
							const hyphenResult = satisfies(version, range);
							const equivalentResult = satisfies(version, equivalentRange);
							expect(hyphenResult).toBe(equivalentResult);
						});
					});
				});
			});
		});
	});

	/**
	 * 驗證連字號範圍與等效範圍的行為一致性
	 * Verify hyphen range and equivalent range have consistent behavior
	 */
	describe('hyphen range equivalence verification', () =>
	{
		hyphenRangeTestCases.forEach(({ range, equivalentRange }) =>
		{
			it(`"${range}" should be equivalent to "${equivalentRange}"`, () =>
			{
				// 測試幾個代表性版本，確認連字號範圍與等效範圍行為一致
				// Test several representative versions to confirm hyphen range and equivalent range have consistent behavior
				const testVersions = ['0.0.1', '1.0.0', '1.5.0', '2.0.0', '2.5.0', '3.0.0', '10.0.0'];

				testVersions.forEach(version =>
				{
					const hyphenResult = satisfies(version, range);
					const equivalentResult = semverSatisfies(version, equivalentRange);
					expect(hyphenResult).toBe(equivalentResult);
				});
			});
		});
	});

});
