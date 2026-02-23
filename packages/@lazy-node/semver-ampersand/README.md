# @lazy-node/semver-ampersand

> 支援 ampersand (&) 語法的 semver 範圍處理工具庫 / Semver range handling utilities with ampersand (&) syntax support

[![NPM version](https://img.shields.io/npm/v/@lazy-node/semver-ampersand.svg)](https://www.npmjs.com/package/@lazy-node/semver-ampersand)
[![License](https://img.shields.io/npm/l/@lazy-node/semver-ampersand.svg)](https://github.com/bluelovers/ws-yarn-workspaces/blob/master/packages/@lazy-node/semver-ampersand/LICENSE)

## 簡介 / Introduction

此模組擴展了標準 `semver` 套件的範圍處理功能，支援使用 `&` 符號來表示「且」的條件。這在處理 yarn 或 npm workspaces 的依賴版本時特別有用，因為某些情境下需要更明確的版本範圍表達方式。

This module extends the standard `semver` package's range handling with support for the `&` symbol to represent "AND" conditions. This is particularly useful when handling dependency versions in yarn or npm workspaces, where more explicit version range expressions are sometimes needed.

## 安裝 / Installation

```bash
# 使用 yarn / Using yarn
yarn add @lazy-node/semver-ampersand

# 使用 yarn-tool / Using yarn-tool
yarn-tool add @lazy-node/semver-ampersand

# 使用 npm / Using npm
npm install @lazy-node/semver-ampersand
```

## 功能特色 / Features

- 🔗 **Ampersand 支援** - 使用 `&` 符號組合多個版本條件 / Use `&` symbol to combine multiple version conditions
- ✅ **satisfies** - 檢查版本是否符合範圍 / Check if version satisfies range
- 🔍 **maxSatisfying / minSatisfying** - 找出最大/最小符合版本 / Find max/min satisfying version
- 📝 **validRange** - 驗證範圍字串是否有效 / Validate if range string is valid
- 🔄 **simplifyRange** - 簡化版本範圍 / Simplify version range
- 🏗️ **Range 類別** - 類似 semver.Range 的增強版 / Enhanced Range class similar to semver.Range

## Ampersand (`&`) 語法說明 / Ampersand (`&`) Syntax Explanation

標準 semver 使用空格來表示「且」的條件，例如 `>=1.0.0 <2.0.0`。此模組額外支援使用 `&` 符號，讓範圍表達更明確：

Standard semver uses spaces to represent "AND" conditions, e.g., `>=1.0.0 <2.0.0`. This module additionally supports the `&` symbol for more explicit range expressions:

```typescript
// 標準 semver 語法 / Standard semver syntax
'>=1.0.0 <2.0.0'

// Ampersand 語法（功能相同）/ Ampersand syntax (functionally equivalent)
'>=1.0.0 & <2.0.0'
```

## API 文件 / API Documentation

### `satisfies(version, range, options?)`

檢查版本是否符合指定的範圍。

Check if a version satisfies the specified range.

```typescript
import { satisfies } from '@lazy-node/semver-ampersand';

// 標準 semver 範圍 / Standard semver range
satisfies('1.2.3', '>=1.0.0 <2.0.0'); // true
satisfies('2.0.0', '>=1.0.0 <2.0.0'); // false

// 使用 ampersand / Using ampersand
satisfies('1.2.3', '>=1.0.0 & <2.0.0'); // true
satisfies('1.2.3', '^1.0.0 & >=1.2.0'); // true

// 多條件組合 / Multiple conditions
satisfies('1.2.3', '>=1.0.0 & <2.0.0 || >=3.0.0'); // true
```

### `validRange(range, options?)`

驗證範圍字串是否有效，返回規範化後的範圍或 `null`。

Validate if a range string is valid, returns normalized range or `null`.

```typescript
import { validRange } from '@lazy-node/semver-ampersand';

validRange('>=1.0.0 & <2.0.0'); // true (返回規範化的範圍)
validRange('invalid-range'); // null
validRange('>=1.0.0 & invalid'); // null
```

### `maxSatisfying(versions, range, options?)`

從版本陣列中找出符合範圍的最大版本。

Find the maximum version that satisfies the range from an array of versions.

```typescript
import { maxSatisfying } from '@lazy-node/semver-ampersand';

const versions = ['1.0.0', '1.2.3', '2.0.0', '2.1.0'];
maxSatisfying(versions, '>=1.0.0 & <2.0.0'); // '1.2.3'
maxSatisfying(versions, '^2.0.0'); // '2.1.0'
```

### `minSatisfying(versions, range, options?)`

從版本陣列中找出符合範圍的最小版本。

Find the minimum version that satisfies the range from an array of versions.

```typescript
import { minSatisfying } from '@lazy-node/semver-ampersand';

const versions = ['1.0.0', '1.2.3', '2.0.0', '2.1.0'];
minSatisfying(versions, '>=1.0.0 & <2.0.0'); // '1.0.0'
minSatisfying(versions, '^2.0.0'); // '2.0.0'
```

### `simplifyRange(versions, range, options?)`

簡化版本範圍。

Simplify version range.

```typescript
import { simplifyRange } from '@lazy-node/semver-ampersand';

const versions = ['1.0.0', '1.0.1', '1.0.2'];
simplifyRange(versions, '>=1.0.0 & <2.0.0');
```

### `handleAmpersandAndSpaces(range)`

處理範圍字串中的 ampersand 和空格。

Handle ampersand and spaces in range string.

```typescript
import { handleAmpersandAndSpaces } from '@lazy-node/semver-ampersand';

handleAmpersandAndSpaces('>=1.0.0 & <2.0.0');
// 返回處理後的範圍字串
```

### `Range` 類別 / `Range` Class

增強版的 semver Range 類別，支援 ampersand 語法。

Enhanced semver Range class with ampersand syntax support.

```typescript
import { Range } from '@lazy-node/semver-ampersand';

const range = new Range('>=1.0.0 & <2.0.0');

// 測試版本是否符合 / Test if version satisfies
range.test('1.2.3'); // true
range.test('2.0.0'); // false

// 存取範圍結構 / Access range structure
console.log(range.set); // 比較器集合

// 格式化輸出 / Format output
console.log(range.toString()); // '>=1.0.0 <2.0.0'
```

### 選項 / Options

```typescript
interface IOptions extends semver.Options, semver.RangeOptions {
  /**
   * 停用 ampersand 處理 / Disable ampersand handling
   */
  noAmpersand?: boolean;
  
  /**
   * 啟用不安全優化 / Enable unsafe optimization
   */
  unsafeOptimize?: boolean;
}
```

## 使用案例 / Use Cases

### 1. Workspaces 版本管理 / Workspace Version Management

```typescript
import { satisfies, validRange } from '@lazy-node/semver-ampersand';

const workspaceDeps = {
  'package-a': '>=1.0.0 & <2.0.0',
  'package-b': '^2.0.0 & >=2.1.0',
};

Object.entries(workspaceDeps).forEach(([pkg, range]) => {
  if (validRange(range)) {
    console.log(`${pkg}: ${range} is valid`);
  }
});
```

### 2. 依賴版本檢查 / Dependency Version Checking

```typescript
import { satisfies, maxSatisfying } from '@lazy-node/semver-ampersand';

const installedVersions = {
  'lodash': '4.17.21',
  'axios': '1.2.0',
};

const requiredRanges = {
  'lodash': '>=4.0.0 & <5.0.0',
  'axios': '^1.0.0',
};

Object.entries(requiredRanges).forEach(([pkg, range]) => {
  const version = installedVersions[pkg];
  if (version && !satisfies(version, range)) {
    console.log(`${pkg}@${version} does not satisfy ${range}`);
  }
});
```

### 3. 版本選擇 / Version Selection

```typescript
import { maxSatisfying, minSatisfying } from '@lazy-node/semver-ampersand';

const availableVersions = [
  '1.0.0', '1.1.0', '1.2.0', 
  '2.0.0', '2.1.0', '3.0.0'
];

const range = '>=1.0.0 & <3.0.0';

console.log('Latest compatible:', maxSatisfying(availableVersions, range));
// '2.1.0'

console.log('Earliest compatible:', minSatisfying(availableVersions, range));
// '1.0.0'
```

### 4. 複雜範圍處理 / Complex Range Handling

```typescript
import { Range, simplifyRange } from '@lazy-node/semver-ampersand';

// 複雜的版本需求 / Complex version requirements
const complexRange = '>=1.0.0 & <2.0.0 || >=3.0.0 & <4.0.0';

const range = new Range(complexRange);

// 檢查多個版本 / Check multiple versions
['1.5.0', '2.5.0', '3.5.0'].forEach(version => {
  console.log(`${version}: ${range.test(version)}`);
  // 1.5.0: true
  // 2.5.0: false
  // 3.5.0: true
});
```

## 與 semver 套件的差異 / Differences from semver Package

| 功能 / Feature | `semver` | `@lazy-node/semver-ampersand` |
|---------------|----------|-------------------------------|
| 標準範圍語法 / Standard range syntax | ✅ | ✅ |
| Ampersand (`&`) 語法 / Ampersand syntax | ❌ | ✅ |
| 空格表示「且」/ Space as "AND" | ✅ | ✅ |
| Range 類別 / Range class | ✅ | ✅ (擴展版) |
| 快取機制 / Caching | ✅ | ✅ |

## 相關套件 / Related Packages

- [`@lazy-node/semver-part`](../semver-part) - 版本部分比較工具 / Version part comparison utilities
- [`@lazy-node/semver-parse`](../semver-parse) - semver 解析工具 / Semver parsing utilities
- [`semver`](https://www.npmjs.com/package/semver) - 語義化版本處理 / Semantic versioning

## 授權 / License

ISC © bluelovers

## 貢獻 / Contributing

歡迎提交 Issue 和 Pull Request！

Issues and Pull Requests are welcome!

請前往 [GitHub](https://github.com/bluelovers/ws-yarn-workspaces) 貢獻。