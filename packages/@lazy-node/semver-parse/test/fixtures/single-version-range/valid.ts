/**
 * 單一版本範圍 - 合法測試資料
 * Single Version Range - Valid Test Fixtures
 *
 * 此檔案包含用於 parse() / parseSimpleSemVer() 的合法測試案例
 * This file contains valid test cases for parse() / parseSimpleSemVer()
 *
 * @packageDocumentation
 */

import { ISimpleSemVerObject } from '../../../lib/types';
import { IFixturesEntrySingleVersionRange } from '../../lib/types';

/**
 * 合法的單一版本範圍測試案例
 * Valid single version range test cases
 *
 * 每個案例包含：
 * Each case contains:
 * - input: 輸入字串 / Input string
 * - expected: 預期解析結果（部分欄位） / Expected parsed result (partial fields)
 */
export const validSingleVersionRangeFixtures: IFixturesEntrySingleVersionRange[] = [
  // ========================================
  // 基本版本 / Basic Versions
  // ========================================
  {
    input: '1.0.0',
    description: '基本的三部分版本 / Basic three-part version',
    expected: {
      semver: '1.0.0',
      version: '1.0.0',
      major: '1',
      minor: '0',
      patch: '0',
    },
  },
  {
    input: '0.0.0',
    description: '全零版本 / All-zero version',
    expected: {
      semver: '0.0.0',
      version: '0.0.0',
      major: '0',
      minor: '0',
      patch: '0',
    },
  },
  {
    input: '10.20.30',
    description: '多位數版本 / Multi-digit version',
    expected: {
      semver: '10.20.30',
      version: '10.20.30',
      major: '10',
      minor: '20',
      patch: '30',
    },
  },
  {
    input: '999.999.999',
    description: '大數版本 / Large number version',
    expected: {
      semver: '999.999.999',
      version: '999.999.999',
      major: '999',
      minor: '999',
      patch: '999',
    },
  },

  // ========================================
  // v 前綴版本 / v-prefixed Versions
  // ========================================
  {
    input: 'v1.0.0',
    description: '帶 v 前綴的版本 / Version with v prefix',
    expected: {
      semver: 'v1.0.0',
      version: '1.0.0',
      major: '1',
      minor: '0',
      patch: '0',
    },
  },
  {
    input: 'v2.3.4',
    description: '帶 v 前綴的版本 / Version with v prefix',
    expected: {
      semver: 'v2.3.4',
      version: '2.3.4',
      major: '2',
      minor: '3',
      patch: '4',
    },
  },

  // ========================================
  // 預發布版本 / Pre-release Versions
  // ========================================
  {
    input: '1.0.0-alpha',
    description: '預發布版本 - alpha / Pre-release version - alpha',
    expected: {
      semver: '1.0.0-alpha',
      version: '1.0.0',
      major: '1',
      minor: '0',
      patch: '0',
      release: 'alpha',
    },
  },
  {
    input: '1.0.0-beta',
    description: '預發布版本 - beta / Pre-release version - beta',
    expected: {
      semver: '1.0.0-beta',
      version: '1.0.0',
      major: '1',
      minor: '0',
      patch: '0',
      release: 'beta',
    },
  },
  {
    input: '1.0.0-rc.1',
    description: '預發布版本 - rc.1 / Pre-release version - rc.1',
    expected: {
      semver: '1.0.0-rc.1',
      version: '1.0.0',
      major: '1',
      minor: '0',
      patch: '0',
      release: 'rc.1',
    },
  },
  {
    input: '1.0.0-alpha.1',
    description: '預發布版本 - alpha.1 / Pre-release version - alpha.1',
    expected: {
      semver: '1.0.0-alpha.1',
      version: '1.0.0',
      major: '1',
      minor: '0',
      patch: '0',
      release: 'alpha.1',
    },
  },
  {
    input: '1.0.0-0.3.7',
    description: '預發布版本 - 數字格式 / Pre-release version - numeric format',
    expected: {
      semver: '1.0.0-0.3.7',
      version: '1.0.0',
      major: '1',
      minor: '0',
      patch: '0',
      release: '0.3.7',
    },
  },
  {
    input: '1.0.0-x.7.z.92',
    description: '預發布版本 - 多部分 / Pre-release version - multi-part',
    expected: {
      semver: '1.0.0-x.7.z.92',
      version: '1.0.0',
      major: '1',
      minor: '0',
      patch: '0',
      release: 'x.7.z.92',
    },
  },
  {
    input: '1.0.0-beta.1+build.123',
    description: '預發布版本含建置元資料 / Pre-release with build metadata',
    expected: {
      semver: '1.0.0-beta.1+build.123',
      version: '1.0.0',
      major: '1',
      minor: '0',
      patch: '0',
      release: 'beta.1',
      build: 'build.123',
    },
  },

  // ========================================
  // 建置元資料 / Build Metadata
  // ========================================
  {
    input: '1.0.0+build',
    description: '建置元資料 / Build metadata',
    expected: {
      semver: '1.0.0+build',
      version: '1.0.0',
      major: '1',
      minor: '0',
      patch: '0',
      build: 'build',
    },
  },
  {
    input: '1.0.0+build.123',
    description: '建置元資料 - 多部分 / Build metadata - multi-part',
    expected: {
      semver: '1.0.0+build.123',
      version: '1.0.0',
      major: '1',
      minor: '0',
      patch: '0',
      build: 'build.123',
    },
  },
  {
    input: '1.0.0+build.abc.def',
    description: '建置元資料 - 多部分 / Build metadata - multi-part',
    expected: {
      semver: '1.0.0+build.abc.def',
      version: '1.0.0',
      major: '1',
      minor: '0',
      patch: '0',
      build: 'build.abc.def',
    },
  },
  {
    input: '2.0.0+build.1848',
    description: '建置元資料範例 / Build metadata example',
    expected: {
      semver: '2.0.0+build.1848',
      version: '2.0.0',
      major: '2',
      minor: '0',
      patch: '0',
      build: 'build.1848',
    },
  },

  // ========================================
  // 運算子版本 / Versions with Operators
  // ========================================
  {
    input: '>=1.0.0',
    description: '大於等於運算子 / Greater than or equal operator',
    expected: {
      semver: '>=1.0.0',
      operator: '>=',
      version: '1.0.0',
      major: '1',
      minor: '0',
      patch: '0',
    },
  },
  {
    input: '<=1.0.0',
    description: '小於等於運算子 / Less than or equal operator',
    expected: {
      semver: '<=1.0.0',
      operator: '<=',
      version: '1.0.0',
      major: '1',
      minor: '0',
      patch: '0',
    },
  },
  {
    input: '>1.0.0',
    description: '大於運算子 / Greater than operator',
    expected: {
      semver: '>1.0.0',
      operator: '>',
      version: '1.0.0',
      major: '1',
      minor: '0',
      patch: '0',
    },
  },
  {
    input: '<1.0.0',
    description: '小於運算子 / Less than operator',
    expected: {
      semver: '<1.0.0',
      operator: '<',
      version: '1.0.0',
      major: '1',
      minor: '0',
      patch: '0',
    },
  },
  {
    input: '=1.0.0',
    description: '等於運算子 / Equal operator',
    expected: {
      semver: '=1.0.0',
      operator: '=',
      version: '1.0.0',
      major: '1',
      minor: '0',
      patch: '0',
    },
  },
  {
    input: '^1.0.0',
    description: '插入運算子（相容版本）/ Caret operator (compatible version)',
    expected: {
      semver: '^1.0.0',
      operator: '^',
      version: '1.0.0',
      major: '1',
      minor: '0',
      patch: '0',
    },
  },
  {
    input: '~1.0.0',
    description: '波浪運算子（大約版本）/ Tilde operator (approximately version)',
    expected: {
      semver: '~1.0.0',
      operator: '~',
      version: '1.0.0',
      major: '1',
      minor: '0',
      patch: '0',
    },
  },

  // ========================================
  // 運算子含空格 / Operators with Space
  // ========================================
  {
    input: '>= 1.0.0',
    description: '大於等於運算子含空格 / Greater than or equal with space',
    expected: {
      semver: '>= 1.0.0',
      operator: '>=',
      version: '1.0.0',
      major: '1',
      minor: '0',
      patch: '0',
    },
  },
  {
    input: '< 1.0.0',
    description: '小於運算子含空格 / Less than with space',
    expected: {
      semver: '< 1.0.0',
      operator: '<',
      version: '1.0.0',
      major: '1',
      minor: '0',
      patch: '0',
    },
  },

  // ========================================
  // 運算子含 v 前綴 / Operators with v Prefix
  // ========================================
  {
    input: '>=v1.0.0',
    description: '運算子含 v 前綴 / Operator with v prefix',
    expected: {
      semver: '>=v1.0.0',
      operator: '>=',
      version: '1.0.0',
      major: '1',
      minor: '0',
      patch: '0',
    },
  },
  {
    input: '< v2.0.0',
    description: '運算子含空格和 v 前綴 / Operator with space and v prefix',
    expected: {
      semver: '< v2.0.0',
      operator: '<',
      version: '2.0.0',
      major: '2',
      minor: '0',
      patch: '0',
    },
  },
  {
    input: '~v1.0.0',
    description: '波浪運算子含 v 前綴 / Tilde with v prefix',
    expected: {
      semver: '~v1.0.0',
      operator: '~',
      version: '1.0.0',
      major: '1',
      minor: '0',
      patch: '0',
    },
  },
  {
    input: '^v1.0.0',
    description: '插入運算子含 v 前綴 / Caret with v prefix',
    expected: {
      semver: '^v1.0.0',
      operator: '^',
      version: '1.0.0',
      major: '1',
      minor: '0',
      patch: '0',
    },
  },

  // ========================================
  // 複合版本 / Complex Versions
  // ========================================
  {
    input: '1.0.6-1+build-623',
    description: '複合版本（含預發布和建置）/ Complex version with pre-release and build',
    expected: {
      semver: '1.0.6-1+build-623',
      version: '1.0.6',
      major: '1',
      minor: '0',
      patch: '6',
      release: '1',
      build: 'build-623',
    },
  },
  {
    input: '>=1.2.3-beta.1+build.123',
    description: '完整版本（運算子+預發布+建置）/ Full version with operator, pre-release and build',
    expected: {
      semver: '>=1.2.3-beta.1+build.123',
      operator: '>=',
      version: '1.2.3',
      major: '1',
      minor: '2',
      patch: '3',
      release: 'beta.1',
      build: 'build.123',
    },
  },
];

export default validSingleVersionRangeFixtures;
