# @lazy-node/semver-part

> 比較 semver 版本部分字串的工具庫 / Utility library for comparing semver version part strings

[![NPM version](https://img.shields.io/npm/v/@lazy-node/semver-part.svg)](https://www.npmjs.com/package/@lazy-node/semver-part)
[![License](https://img.shields.io/npm/l/@lazy-node/semver-part.svg)](https://github.com/bluelovers/ws-yarn-workspaces/blob/master/packages/@lazy-node/semver-part/LICENSE)

## 簡介 / Introduction

此模組提供比較 semver 版本號部分（如 `major.minor` 或 `minor.patch`）的功能，而不需要完整的 semver 版本字串。這在處理部分版本比較或版本差異分析時非常有用。

This module provides functionality to compare parts of semver version strings (e.g., `major.minor` or `minor.patch`) without requiring complete semver strings. This is useful when dealing with partial version comparisons or version difference analysis.

## 安裝 / Installation

```bash
# 使用 yarn / Using yarn
yarn add @lazy-node/semver-part

# 使用 yarn-tool / Using yarn-tool
yarn-tool add @lazy-node/semver-part

# 使用 npm / Using npm
npm install @lazy-node/semver-part
```

## 功能特色 / Features

- 🔄 **版本部分比較** - 支援不完整版本字串的比較 / Support for comparing incomplete version strings
- 📊 **版本差異分析** - 找出版本變更的位置和方向 / Find where and how versions changed
- 🛠️ **版本部分轉換** - 將版本分割或合併為部分 / Split or merge versions into parts
- ⚡ **輕量高效** - 基於 semver 套件的輕量封裝 / Lightweight wrapper based on semver package

## API 文件 / API Documentation

### 比較函數 / Comparison Functions

#### `compare(part1, part2, optionsOrLoose?)`

比較兩個版本部分，返回比較結果。

Compare two version parts and return the comparison result.

```typescript
import { compare } from '@lazy-node/semver-part';

compare('1.2.3', '1.3.0'); // -1 (1.2.3 < 1.3.0)
compare('1.3.0', '1.2.3'); // 1 (1.3.0 > 1.2.3)
compare('1.2.3', '1.2.3'); // 0 (相等)
compare('2.3', '2.4'); // -1 (自動補全為 0.2.3 vs 0.2.4)
```

**返回值 / Returns:** `1 | 0 | -1`
- `1`: 第一個版本較大 / First version is greater
- `0`: 版本相等 / Versions are equal
- `-1`: 第一個版本較小 / First version is less

#### `eq(part1, part2, optionsOrLoose?)`

檢查兩個版本部分是否相等。

Check if two version parts are equal.

```typescript
eq('1.2.3', '1.2.3'); // true
eq('1.2', '1.2.0'); // true (自動補全)
eq('1.2', '1.3'); // false
```

#### `gt(part1, part2, optionsOrLoose?)`

檢查第一個版本部分是否大於第二個。

Check if first version part is greater than second.

```typescript
gt('1.3', '1.2'); // true
gt('1.2', '1.3'); // false
```

#### `gte(part1, part2, optionsOrLoose?)`

檢查第一個版本部分是否大於或等於第二個。

Check if first version part is greater than or equal to second.

```typescript
gte('1.3', '1.2'); // true
gte('1.2', '1.2'); // true
gte('1.1', '1.2'); // false
```

#### `lt(part1, part2, optionsOrLoose?)`

檢查第一個版本部分是否小於第二個。

Check if first version part is less than second.

```typescript
lt('1.2', '1.3'); // true
lt('1.3', '1.2'); // false
```

#### `lte(part1, part2, optionsOrLoose?)`

檢查第一個版本部分是否小於或等於第二個。

Check if first version part is less than or equal to second.

```typescript
lte('1.2', '1.3'); // true
lte('1.2', '1.2'); // true
lte('1.3', '1.2'); // false
```

#### `neq(part1, part2, optionsOrLoose?)`

檢查兩個版本部分是否不相等。

Check if two version parts are not equal.

```typescript
neq('1.2', '1.3'); // true
neq('1.2', '1.2'); // false
```

#### `cmp(part1, operator, part2, optionsOrLoose?)`

使用指定運算子比較兩個版本部分。

Compare two version parts with specified operator.

```typescript
cmp('1.2', '>', '1.1'); // true
cmp('1.2', '<', '1.3'); // true
cmp('1.2', '=', '1.2'); // true
cmp('1.2', '>=', '1.2'); // true
```

**支援的運算子 / Supported Operators:** `'>' | '>=' | '<' | '<=' | '=' | '==' | '===' | '!=' | '!'`

#### `tryCompare(v1, v2, optionsOrLoose?)`

安全地比較兩個版本部分，失敗時返回 `undefined`。

Safely compare two version parts, returns `undefined` on failure.

```typescript
tryCompare('1.2', '1.3'); // -1
tryCompare('invalid', '1.2'); // undefined (不拋出異常)
```

### 解析函數 / Parsing Functions

#### `parseVersions(versionOld, versionNew)`

解析兩個版本並找出差異位置。

Parse two versions and find the difference position.

```typescript
parseVersions('1.2.3', '2.0.0');
// {
//   versionOld: '1.2.3',
//   versionNew: '2.0.0',
//   partsOld: ['1', '2', '3'],
//   partsNew: ['2', '0', '0'],
//   index: 0  // major 版本不同
// }

parseVersions('1.2.3', '1.3.0');
// { ..., index: 1 }  // minor 版本不同

parseVersions('1.2.3', '1.2.4');
// { ..., index: 2 }  // patch 版本不同
```

#### `parseVersionsAndCompare(versionOld, versionNew, optionsOrLoose?)`

解析兩個版本、找出差異位置並比較差異部分。

Parse two versions, find difference position and compare the differing parts.

```typescript
parseVersionsAndCompare('1.2.3', '1.3.0');
// {
//   versionOld: '1.2.3',
//   versionNew: '1.3.0',
//   partsOld: ['1', '2', '3'],
//   partsNew: ['1', '3', '0'],
//   index: 1,
//   comp: -1  // 新版本的 minor 較大
// }
```

### 工具函數 / Utility Functions

#### `versionToParts(version)`

將版本字串分割為版本部分陣列。

Split a version string into an array of version parts.

```typescript
versionToParts('1.2.3'); // ['1', '2', '3']
versionToParts('1.2.3-beta.1'); // ['1', '2', '3-beta.1']
versionToParts('1.2'); // ['1', '2']
```

#### `partsToVersion(parts)`

將版本部分陣列合併為版本字串。

Join version parts array into a version string.

```typescript
partsToVersion(['1', '2', '3']); // '1.2.3'
partsToVersion(['1', '2', '3', 'beta']); // '1.2.3.beta'
```

#### `_versionSafe(part)`

將部分版本安全地轉換為完整版本字串。

Safely convert a partial version to a full version string.

```typescript
_versionSafe('1.2.3'); // '1.2.3' (已是完整版本)
_versionSafe('2.3'); // '0.2.3' (補上 major)
_versionSafe('5'); // '0.0.5' (僅有 patch)
```

#### `_versionUnsafe(part, defaultValue?)`

將部分版本轉換為不安全的完整版本字串。

Convert a partial version to an unsafe full version string.

```typescript
_versionUnsafe('5'); // '0.0.5'
_versionUnsafe('5', '10'); // '0.0.5'
_versionUnsafe(undefined, '10'); // '0.0.10'
```

#### `_part(part1, part2)`

將兩個版本部分標準化為相同格式的完整版本。

Normalize two version parts to full versions of the same format.

```typescript
_part('1.2.3', '1.3.0'); // ['1.2.3', '1.3.0']
_part('2.3', '3.4'); // ['0.2.3', '0.3.4']
_part('5', '10'); // ['0.0.5', '0.0.10']
```

## 使用案例 / Use Cases

### 1. 版本升級偵測 / Version Upgrade Detection

```typescript
import { parseVersions } from '@lazy-node/semver-part';

function getUpgradeType(oldVersion: string, newVersion: string) {
  const { index } = parseVersions(oldVersion, newVersion);
  
  switch (index) {
    case 0: return 'major';
    case 1: return 'minor';
    case 2: return 'patch';
    default: return 'none';
  }
}

getUpgradeType('1.2.3', '2.0.0'); // 'major'
getUpgradeType('1.2.3', '1.3.0'); // 'minor'
getUpgradeType('1.2.3', '1.2.4'); // 'patch'
```

### 2. 部分版本比較 / Partial Version Comparison

```typescript
import { compare } from '@lazy-node/semver-part';

// 比較 minor.patch 部分 / Compare minor.patch parts
compare('2.3', '2.4'); // -1
compare('2.3', '3.0'); // -1
```

### 3. 安全的版本比較 / Safe Version Comparison

```typescript
import { tryCompare } from '@lazy-node/semver-part';

const versions = ['1.0.0', 'invalid', '2.0.0'];

versions.forEach((v, i) => {
  versions.slice(i + 1).forEach((v2) => {
    const result = tryCompare(v, v2);
    if (result !== undefined) {
      console.log(`${v} vs ${v2}: ${result}`);
    }
  });
});
```

## 相關套件 / Related Packages

- [`@lazy-node/semver-parse`](../semver-parse) - semver 解析工具 / Semver parsing utilities
- [`@lazy-node/semver-ampersand`](../semver-ampersand) - 支援 ampersand 的 semver 範圍處理 / Semver range handling with ampersand support
- [`semver`](https://www.npmjs.com/package/semver) - 語義化版本處理 / Semantic versioning

## 授權 / License

ISC © bluelovers

## 貢獻 / Contributing

歡迎提交 Issue 和 Pull Request！

Issues and Pull Requests are welcome!

請前往 [GitHub](https://github.com/bluelovers/ws-yarn-workspaces) 貢獻。