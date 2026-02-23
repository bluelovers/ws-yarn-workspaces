/**
 * 多個版本範圍 - 不合法測試資料
 * Multiple Version Range - Invalid Test Fixtures
 *
 * 此檔案包含用於 parseRange() / parseSimpleSemVerRange() 的不合法測試案例
 * This file contains invalid test cases for parseRange() / parseSimpleSemVerRange()
 *
 * 這些案例應該返回空陣列或部分解析結果
 * These cases should return empty array or partial results
 *
 * @packageDocumentation
 */

import { IFixturesEntryMultipleVersionRange } from "../../lib/types";

/**
 * 不合法的多個版本範圍測試案例
 * Invalid multiple version range test cases
 *
 * 每個案例包含：
 * Each case contains:
 * - input: 輸入字串 / Input string
 * - description: 描述為何不合法 / Description of why it's invalid
 * - reason: 原因說明 / Reason explanation
 */
export const invalidMultipleVersionRangeFixtures: IFixturesEntryMultipleVersionRange[] = [
  // ========================================
  // 空值與空白 / Empty and Whitespace
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
    description: '全字母版本（非萬用字元格式）/ All letter version (not wildcard format)',
    reason: '版本部分必須是數字或有效萬用字元 / Version parts must be numeric or valid wildcards',
  },

  // ========================================
  // 不完整版本 / Incomplete Versions
  // ========================================
  {
    input: '1',
    description: '僅主版本號 / Major version only',
    reason: '需要至少兩部分版本 / Requires at least two-part version',
  },
  {
    input: '1.',
    description: '缺少 minor / Missing minor',
    reason: '點後需要版本部分 / Version part required after dot',
  },

  // ========================================
  // 無效運算子組合 / Invalid Operator Combinations
  // ========================================
  {
    input: '||',
    description: '僅 OR 運算子 / OR operator only',
    reason: '運算子需要版本 / Operator requires version',
  },
  {
    input: '|| 1.0.0',
    description: '開頭的 OR 運算子 / Leading OR operator',
    reason: 'OR 運算子前需要版本 / Version required before OR operator',
  },
  {
    input: '1.0.0 ||',
    description: '結尾的 OR 運算子 / Trailing OR operator',
    reason: 'OR 運算子後需要版本 / Version required after OR operator',
  },
  {
    input: '-',
    description: '僅範圍運算子 / Range operator only',
    reason: '範圍運算子需要兩個版本 / Range operator requires two versions',
  },
  {
    input: '- 1.0.0',
    description: '開頭的範圍運算子 / Leading range operator',
    reason: '範圍運算子前需要版本 / Version required before range operator',
  },
  {
    input: '1.0.0 -',
    description: '結尾的範圍運算子 / Trailing range operator',
    reason: '範圍運算子後需要版本 / Version required after range operator',
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
  // 預發布/建置格式錯誤 / Pre-release/Build Format Errors
  // ========================================
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
  // 不支援的語法 / Unsupported Syntax
  // ========================================
  {
    input: '1.0.0 && 2.0.0',
    description: 'AND 運算子（不支援）/ AND operator (not supported)',
    reason: '不支援 && 運算子，使用空格表示 AND / && operator not supported, use space for AND',
  },
  {
    input: '!1.0.0',
    description: 'NOT 運算子（不支援）/ NOT operator (not supported)',
    reason: '不支援 ! 運算子 / ! operator not supported',
  },
  {
    input: '(1.0.0)',
    description: '括號分組（不支援）/ Parentheses grouping (not supported)',
    reason: '不支援括號分組 / Parentheses grouping not supported',
  },
  {
    input: '[1.0.0, 2.0.0]',
    description: '方括號範圍（不支援）/ Square bracket range (not supported)',
    reason: '不支援方括號範圍語法 / Square bracket range syntax not supported',
  },

  // ========================================
  // 特殊字元 / Special Characters
  // ========================================
  {
    input: '1.0.0$beta',
    description: '使用 $ 作為分隔符 / Using $ as separator',
    reason: '無效的字元 / Invalid character',
  },
  {
    input: '1.0.0#beta',
    description: '使用 # 作為分隔符 / Using # as separator',
    reason: '無效的字元 / Invalid character',
  },
  {
    input: '1.0.0%beta',
    description: '使用 % 作為分隔符 / Using % as separator',
    reason: '無效的字元 / Invalid character',
  },

  // ========================================
  // 重複運算子 / Duplicate Operators
  // ========================================
  {
    input: '>>1.0.0',
    description: '重複大於運算子 / Duplicate greater than operator',
    reason: '無效的運算子組合 / Invalid operator combination',
  },
  {
    input: '<<1.0.0',
    description: '重複小於運算子 / Duplicate less than operator',
    reason: '無效的運算子組合 / Invalid operator combination',
  },
  {
    input: '~~1.0.0',
    description: '重複波浪運算子 / Duplicate tilde operator',
    reason: '無效的運算子組合 / Invalid operator combination',
  },
  {
    input: '^^1.0.0',
    description: '重複插入運算子 / Duplicate caret operator',
    reason: '無效的運算子組合 / Invalid operator combination',
  },

  // ========================================
  // 混合無效格式 / Mixed Invalid Formats
  // ========================================
  {
    input: '1.0.0 || a.b.c',
    description: '有效版本 OR 無效版本 / Valid version OR invalid version',
    reason: '部分版本無效 / Part of version is invalid',
  },
  {
    input: '>=1.0.0 <',
    description: '缺少版本的小於運算子 / Less than operator without version',
    reason: '運算子後需要版本 / Version required after operator',
  },
  {
    input: '>= <2.0.0',
    description: '缺少版本的大於等於運算子 / GTE operator without version',
    reason: '運算子後需要版本 / Version required after operator',
  },
];

export default invalidMultipleVersionRangeFixtures;
