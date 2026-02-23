/**
 * 多個版本範圍 - 合法測試資料
 * Multiple Version Range - Valid Test Fixtures
 *
 * 此檔案包含用於 parseRange() / parseSimpleSemVerRange() 的合法測試案例
 * This file contains valid test cases for parseRange() / parseSimpleSemVerRange()
 *
 * @packageDocumentation
 */

import { ISimpleSemVer } from '../../../lib/types';
import { IFixturesEntryMultipleVersionRange } from '../../lib/types';

/**
 * 合法的多個版本範圍測試案例
 * Valid multiple version range test cases
 *
 * 每個案例包含：
 * Each case contains:
 * - input: 輸入字串 / Input string
 * - description: 描述 / Description
 * - expected: 預期解析結果陣列 / Expected parsed result array
 */
export const validMultipleVersionRangeFixtures: IFixturesEntryMultipleVersionRange[] = [
  // ========================================
  // 單一版本（parseRange 也支援）/ Single Versions (parseRange also supports)
  // ========================================
  {
    input: '1.0.0',
    description: '單一版本 / Single version',
    expected: [
      {
        semver: '1.0.0',
        major: '1',
        minor: '0',
        patch: '0',
      },
    ],
  },
  {
    input: 'v1.0.0',
    description: '帶 v 前綴的單一版本 / Single version with v prefix',
    expected: [
      {
        semver: 'v1.0.0',
        major: '1',
        minor: '0',
        patch: '0',
      },
    ],
  },

  // ========================================
  // 單一運算子版本 / Single Operator Versions
  // ========================================
  {
    input: '< v2.0.0',
    description: '小於運算子 / Less than operator',
    expected: [
      {
        semver: '< v2.0.0',
        operator: '<',
        major: '2',
        minor: '0',
        patch: '0',
      },
    ],
  },
  {
    input: '~1.0.0',
    description: '波浪運算子 / Tilde operator',
    expected: [
      {
        semver: '~1.0.0',
        operator: '~',
        major: '1',
        minor: '0',
        patch: '0',
      },
    ],
  },
  {
    input: '^1.0.0',
    description: '插入運算子 / Caret operator',
    expected: [
      {
        semver: '^1.0.0',
        operator: '^',
        major: '1',
        minor: '0',
        patch: '0',
      },
    ],
  },
  {
    input: '~v1.0.0',
    description: '波浪運算子含 v 前綴 / Tilde with v prefix',
    expected: [
      {
        semver: '~v1.0.0',
        operator: '~',
        major: '1',
        minor: '0',
        patch: '0',
      },
    ],
  },
  {
    input: '~> 2.0.0',
    description: '~> 運算子（RubyGems 風格）/ ~> operator (RubyGems style)',
    expected: [
      {
        semver: '~> 2.0.0',
        operator: '~>',
        major: '2',
        minor: '0',
        patch: '0',
      },
    ],
  },

  // ========================================
  // OR 邏輯運算子 / OR Logical Operator
  // ========================================
  {
    input: '~1.0.0 || ~2.0.0',
    description: 'OR 邏輯運算子 / OR logical operator',
    expected: [
      {
        semver: '~1.0.0',
        operator: '~',
        major: '1',
        minor: '0',
        patch: '0',
      },
      {
        operator: '||',
      },
      {
        semver: '~2.0.0',
        operator: '~',
        major: '2',
        minor: '0',
        patch: '0',
      },
    ],
  },
  {
    input: '^1.0.0 || ^2.0.0',
    description: '插入運算子 OR 組合 / Caret OR combination',
    expected: [
      {
        semver: '^1.0.0',
        operator: '^',
        major: '1',
        minor: '0',
        patch: '0',
      },
      {
        operator: '||',
      },
      {
        semver: '^2.0.0',
        operator: '^',
        major: '2',
        minor: '0',
        patch: '0',
      },
    ],
  },
  {
    input: '>=1.2.3 || 0.5.0',
    description: '大於等於 OR 組合 / GTE OR combination',
    expected: [
      {
        semver: '>=1.2.3',
        operator: '>=',
        major: '1',
        minor: '2',
        patch: '3',
      },
      {
        operator: '||',
      },
      {
        semver: '0.5.0',
        major: '0',
        minor: '5',
        patch: '0',
      },
    ],
  },

  // ========================================
  // 範圍運算子（連字號）/ Hyphen Range Operator
  // ========================================
  {
    input: '1.0.0 - 2.0.0',
    description: '連字號範圍（完整版本）/ Hyphen range (full versions)',
    expected: [
      {
        semver: '1.0.0',
        major: '1',
        minor: '0',
        patch: '0',
      },
      {
        operator: '-',
      },
      {
        semver: '2.0.0',
        major: '2',
        minor: '0',
        patch: '0',
      },
    ],
  },

  // ========================================
  // 多條件組合 / Multiple Condition Combinations
  // ========================================
  {
    input: '>= 1.1.7 < 2.0.0',
    description: '大於等於且小於 / GTE and LT combination',
    expected: [
      {
        semver: '>= 1.1.7',
        operator: '>=',
        major: '1',
        minor: '1',
        patch: '7',
      },
      {
        semver: '< 2.0.0',
        operator: '<',
        major: '2',
        minor: '0',
        patch: '0',
      },
    ],
  },
  {
    input: '>=1.0.0 <2.0.0',
    description: '緊湊的多條件 / Compact multiple conditions',
    expected: [
      {
        semver: '>=1.0.0',
        operator: '>=',
        major: '1',
        minor: '0',
        patch: '0',
      },
      {
        semver: '<2.0.0',
        operator: '<',
        major: '2',
        minor: '0',
        patch: '0',
      },
    ],
  },
  {
    input: '>= 1.1.7 < 2.0.0 || 1.1.3',
    description: '複雜組合（AND + OR）/ Complex combination (AND + OR)',
    expected: [
      {
        semver: '>= 1.1.7',
        operator: '>=',
        major: '1',
        minor: '1',
        patch: '7',
      },
      {
        semver: '< 2.0.0',
        operator: '<',
        major: '2',
        minor: '0',
        patch: '0',
      },
      {
        operator: '||',
      },
      {
        semver: '1.1.3',
        major: '1',
        minor: '1',
        patch: '3',
      },
    ],
  },
  {
    input: '^1.2.0 || >=2.0.0 <3.0.0',
    description: '插入運算子 OR 範圍組合 / Caret OR range combination',
    expected: [
      {
        semver: '^1.2.0',
        operator: '^',
        major: '1',
        minor: '2',
        patch: '0',
      },
      {
        operator: '||',
      },
      {
        semver: '>=2.0.0',
        operator: '>=',
        major: '2',
        minor: '0',
        patch: '0',
      },
      {
        semver: '<3.0.0',
        operator: '<',
        major: '3',
        minor: '0',
        patch: '0',
      },
    ],
  },

  // ========================================
  // 預發布版本 / Pre-release Versions
  // ========================================
  {
    input: '1.0.0-rc1',
    description: '預發布版本 / Pre-release version',
    expected: [
      {
        semver: '1.0.0-rc1',
        major: '1',
        minor: '0',
        patch: '0',
        release: 'rc1',
      },
    ],
  },
  {
    input: '1.0.0-rc-2',
    description: '預發布版本含連字號 / Pre-release version with hyphen',
    expected: [
      {
        semver: '1.0.0-rc-2',
        major: '1',
        minor: '0',
        patch: '0',
        release: 'rc-2',
      },
    ],
  },
  {
    input: '>=1.0.0-alpha <1.0.0-beta',
    description: '預發布版本範圍 / Pre-release version range',
    expected: [
      {
        semver: '>=1.0.0-alpha',
        operator: '>=',
        major: '1',
        minor: '0',
        patch: '0',
        release: 'alpha',
      },
      {
        semver: '<1.0.0-beta',
        operator: '<',
        major: '1',
        minor: '0',
        patch: '0',
        release: 'beta',
      },
    ],
  },

  // ========================================
  // 建置元資料 / Build Metadata
  // ========================================
  {
    input: '2.0.0+build.1848',
    description: '建置元資料 / Build metadata',
    expected: [
      {
        semver: '2.0.0+build.1848',
        major: '2',
        minor: '0',
        patch: '0',
        build: 'build.1848',
      },
    ],
  },
  {
    input: '1.0.0-alpha+build.123',
    description: '預發布和建置元資料 / Pre-release and build metadata',
    expected: [
      {
        semver: '1.0.0-alpha+build.123',
        major: '1',
        minor: '0',
        patch: '0',
        release: 'alpha',
        build: 'build.123',
      },
    ],
  },

  // ========================================
  // 特殊格式 / Special Formats
  // ========================================
  {
    input: '>= 1.1.7 < 2.0.0 || 1.1.3',
    description: '完整範例（來自測試）/ Full example (from tests)',
    expected: [
      {
        semver: '>= 1.1.7',
        operator: '>=',
        major: '1',
        minor: '1',
        patch: '7',
      },
      {
        semver: '< 2.0.0',
        operator: '<',
        major: '2',
        minor: '0',
        patch: '0',
      },
      {
        operator: '||',
      },
      {
        semver: '1.1.3',
        major: '1',
        minor: '1',
        patch: '3',
      },
    ],
  },
];

export const validMultipleVersionRangeFixturesWildcards: IFixturesEntryMultipleVersionRange[] = [
  // ========================================
  // 範圍運算子（連字號）/ Hyphen Range Operator
  // ========================================
  {
    input: '1.0.0 - 1.0.x',
    description: '連字號範圍 / Hyphen range',
    expected: [
      {
        semver: '1.0.0',
        major: '1',
        minor: '0',
        patch: '0',
      },
      {
        operator: '-',
      },
      {
        semver: '1.0.x',
        major: '1',
        minor: '0',
        patch: 'x',
      },
    ],
  },
  // ========================================
  // 萬用字元 / Wildcards
  // ========================================
  {
    input: '1.*',
    description: '星號萬用字元 / Asterisk wildcard',
    expected: [
      {
        semver: '1.*',
        major: '1',
        minor: '*',
      },
    ],
  },
  {
    input: '1.x',
    description: 'x 萬用字元 / x wildcard',
    expected: [
      {
        semver: '1.x',
        major: '1',
        minor: 'x',
      },
    ],
  },
  {
    input: '1.0.x',
    description: 'patch 萬用字元 / patch wildcard',
    expected: [
      {
        semver: '1.0.x',
        major: '1',
        minor: '0',
        patch: 'x',
      },
    ],
  },
  {
    input: '1.0.*',
    description: 'patch 星號萬用字元 / patch asterisk wildcard',
    expected: [
      {
        semver: '1.0.*',
        major: '1',
        minor: '0',
        patch: '*',
      },
    ],
  },
  {
    input: '*',
    description: '單一星號萬用字元 / Single asterisk wildcard',
    expected: [
      {
        semver: '*',
        major: undefined,
      },
    ],
  },
  {
    input: 'x',
    description: '單一 x 萬用字元 / Single x wildcard',
    expected: [
      {
        semver: 'x',
        major: undefined,
      },
    ],
  },
];

export default validMultipleVersionRangeFixtures;
