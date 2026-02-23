/**
 * 單一版本範圍 - 不合法測試資料
 * Single Version Range - Invalid Test Fixtures
 *
 * 此檔案包含用於 parse() / parseSimpleSemVer() 的不合法測試案例
 * This file contains invalid test cases for parse() / parseSimpleSemVer()
 *
 * 這些案例應該返回 undefined 或拋出錯誤
 * These cases should return undefined or throw an error
 *
 * @packageDocumentation
 */

import { IFixturesEntrySingleVersionRange } from "../../lib/types";

/**
 * 不合法的單一版本範圍測試案例
 * Invalid single version range test cases
 *
 * 每個案例包含：
 * Each case contains:
 * - input: 輸入字串 / Input string
 * - description: 描述為何不合法 / Description of why it's invalid
 */
export const invalidSingleVersionRangeFixtures: IFixturesEntrySingleVersionRange[] = [
  // ========================================
  // 格式錯誤 / Format Errors
  // ========================================
  {
    input: 'a.b.c',
    description: '非數字版本部分 / Non-numeric version parts',
    reason: '版本部分必須是數字 / Version parts must be numeric',
  },
  {
    input: '1.a.0',
    description: '部分非數字 / Partially non-numeric',
    reason: 'minor 部分必須是數字 / minor part must be numeric',
  },
  {
    input: 'x.y.z',
    description: '全字母版本 / All letter version',
    reason: '版本部分必須是數字 / Version parts must be numeric',
  },

  // ========================================
  // 不完整版本 / Incomplete Versions
  // ========================================
  {
    input: '1',
    description: '僅主版本號 / Major version only',
    reason: '需要完整的三部分版本 / Requires complete three-part version',
  },
  {
    input: '1.0',
    description: '缺少 patch 版本 / Missing patch version',
    reason: '需要完整的三部分版本 / Requires complete three-part version',
  },
  {
    input: '.0.0',
    description: '缺少主版本號 / Missing major version',
    reason: '需要主版本號 / Requires major version',
  },
  {
    input: '1.',
    description: '缺少 minor 和 patch / Missing minor and patch',
    reason: '需要完整的三部分版本 / Requires complete three-part version',
  },
  {
    input: '1.0.',
    description: '缺少 patch / Missing patch',
    reason: '需要完整的三部分版本 / Requires complete three-part version',
  },

  // ========================================
  // 額外字元 / Extra Characters
  // ========================================
  {
    input: '1.0.0b',
    description: '版本後有額外字元 / Extra characters after version',
    reason: '版本後不應有額外字元（無分隔符）/ No extra characters after version (without separator)',
  },
  {
    input: '1.0.0-',
    description: '預發布標籤為空 / Empty pre-release tag',
    reason: '預發布標籤不能為空 / Pre-release tag cannot be empty',
  },
  {
    input: '1.0.0+',
    description: '建置元資料為空 / Empty build metadata',
    reason: '建置元資料不能為空 / Build metadata cannot be empty',
  },
  {
    input: '1.0.0+build-abc.',
    description: '建置元資料以點結尾 / Build metadata ends with dot',
    reason: '建置元資料不能以點結尾 / Build metadata cannot end with dot',
  },
  {
    input: '1.0.0-rc.',
    description: '預發布標籤以點結尾 / Pre-release tag ends with dot',
    reason: '預發布標籤不能以點結尾 / Pre-release tag cannot end with dot',
  },

  // ========================================
  // 空值與特殊值 / Empty and Special Values
  // ========================================
  {
    input: '',
    description: '空字串 / Empty string',
    reason: '輸入不能為空 / Input cannot be empty',
  },
  {
    input: '   ',
    description: '僅空白字元 / Whitespace only',
    reason: '輸入不能僅為空白 / Input cannot be whitespace only',
  },
  {
    input: 'v',
    description: '僅 v 前綴 / v prefix only',
    reason: 'v 前綴後需要版本號 / Version number required after v prefix',
  },
  {
    input: 'v1',
    description: 'v 前綴但不完整版本 / v prefix with incomplete version',
    reason: '需要完整的三部分版本 / Requires complete three-part version',
  },

  // ========================================
  // 多版本範圍（不適用於 parse）/ Multiple Ranges (Not applicable for parse)
  // ========================================
  {
    input: '>=1.0.0 <2.0.0',
    description: '多個版本條件 / Multiple version conditions',
    reason: 'parse() 僅支援單一版本範圍，請使用 parseRange() / parse() only supports single version range, use parseRange()',
  },
  {
    input: '^1.0.0 || ^2.0.0',
    description: 'OR 邏輯運算子 / OR logical operator',
    reason: 'parse() 不支援 || 運算子，請使用 parseRange() / parse() does not support || operator, use parseRange()',
  },
  {
    input: '1.0.0 - 2.0.0',
    description: '範圍運算子 / Range operator',
    reason: 'parse() 不支援 - 範圍運算子，請使用 parseRange() / parse() does not support - range operator, use parseRange()',
  },
  {
    input: '~1.0.0 || ~2.0.0',
    description: '多個波浪運算子 / Multiple tilde operators',
    reason: 'parse() 僅支援單一版本範圍，請使用 parseRange() / parse() only supports single version range, use parseRange()',
  },

  // ========================================
  // 萬用字元（不適用於 parse）/ Wildcards (Not applicable for parse)
  // ========================================
  {
    input: '1.x',
    description: 'x 萬用字元 / x wildcard',
    reason: 'parse() 不支援萬用字元，請使用 parseRange() / parse() does not support wildcards, use parseRange()',
  },
  {
    input: '1.*',
    description: '* 萬用字元 / * wildcard',
    reason: 'parse() 不支援萬用字元，請使用 parseRange() / parse() does not support wildcards, use parseRange()',
  },
  {
    input: '1.0.x',
    description: 'patch 萬用字元 / patch wildcard',
    reason: 'parse() 不支援萬用字元，請使用 parseRange() / parse() does not support wildcards, use parseRange()',
  },
  {
    input: '*',
    description: '單一萬用字元 / Single wildcard',
    reason: 'parse() 不支援萬用字元，請使用 parseRange() / parse() does not support wildcards, use parseRange()',
  },

  // ========================================
  // 不支援的運算子 / Unsupported Operators
  // ========================================
  {
    input: '||1.0.0',
    description: '開頭的 OR 運算子 / Leading OR operator',
    reason: '|| 不是有效的版本運算子 / || is not a valid version operator',
  },
  {
    input: '-1.0.0',
    description: '開頭的範圍運算子 / Leading range operator',
    reason: '- 不是有效的版本運算子 / - is not a valid version operator',
  },
  {
    input: '~>1.0.0',
    description: '~> 運算子（僅 parseRange 支援）/ ~> operator (parseRange only)',
    reason: 'parse() 不支援 ~> 運算子，請使用 parseRange() / parse() does not support ~> operator, use parseRange()',
  },

  // ========================================
  // 無效字元 / Invalid Characters
  // ========================================
  {
    input: '1.0.0@beta',
    description: '使用 @ 作為分隔符 / Using @ as separator',
    reason: '無效的分隔符，應使用 - 或 + / Invalid separator, should use - or +',
  },
  {
    input: '1_0_0',
    description: '使用底線分隔 / Using underscore separator',
    reason: '無效的分隔符，應使用 . / Invalid separator, should use .',
  },
  {
    input: '1,0,0',
    description: '使用逗號分隔 / Using comma separator',
    reason: '無效的分隔符，應使用 . / Invalid separator, should use .',
  },

  // ========================================
  // 負數版本 / Negative Versions
  // ========================================
  {
    input: '-1.0.0',
    description: '負數主版本號 / Negative major version',
    reason: '版本號不能為負數 / Version numbers cannot be negative',
  },
  {
    input: '1.-0.0',
    description: '負數次版本號 / Negative minor version',
    reason: '版本號不能為負數 / Version numbers cannot be negative',
  },

  // ========================================
  // 前導零 / Leading Zeros
  // ========================================
  // 注意：某些 semver 實作允許前導零，但嚴格的 semver 不允許
  // Note: Some semver implementations allow leading zeros, but strict semver does not
  // {
  //   input: '01.0.0',
  //   description: '主版本號有前導零 / Major version with leading zero',
  //   reason: '版本號不應有前導零 / Version numbers should not have leading zeros',
  // },
  // {
  //   input: '1.00.0',
  //   description: '次版本號有前導零 / Minor version with leading zero',
  //   reason: '版本號不應有前導零 / Version numbers should not have leading zeros',
  // },
];

export default invalidSingleVersionRangeFixtures;
