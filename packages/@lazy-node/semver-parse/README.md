# @lazy-node/semver-parse

> 簡易 semver 解析與字串化工具庫 / Lightweight semver parsing and stringification utilities

[![NPM version](https://img.shields.io/npm/v/@lazy-node/semver-parse.svg)](https://www.npmjs.com/package/@lazy-node/semver-parse)
[![License](https://img.shields.io/npm/l/@lazy-node/semver-parse.svg)](https://github.com/bluelovers/ws-yarn-workspaces/blob/master/packages/@lazy-node/semver-parse/LICENSE)

## 簡介 / Introduction

此模組提供輕量級的 semver 解析功能，可將版本字串解析為結構化物件，並支援版本範圍（range）的解析與字串化。這是 `semver` 套件的補充工具，提供了一些 `semver` 模組沒有提供的實用功能。

This module provides lightweight semver parsing functionality, converting version strings to structured objects, and supporting parsing and stringification of version ranges. It's a supplementary toolkit for the `semver` package, providing useful features not available in the mainstream `semver` module.

## 安裝 / Installation

```bash
# 使用 yarn / Using yarn
yarn add @lazy-node/semver-parse

# 使用 yarn-tool / Using yarn-tool
yarn-tool add @lazy-node/semver-parse
# yt 是 yarn-tool 的別名 / yt is an alias for yarn-tool
yt add @lazy-node/semver-parse

# 使用 pnpm / Using pnpm
pnpm add @lazy-node/semver-parse

# 使用 npm / Using npm
npm install @lazy-node/semver-parse
```

## 功能特色 / Features

- 🔍 **版本解析** - 將版本字串解析為結構化物件 / Parse version strings to structured objects
- 📝 **版本字串化** - 將版本物件轉換為版本字串 / Convert version objects to version strings
- 🎯 **範圍解析** - 解析版本範圍字串 / Parse version range strings
- 🔄 **範圍字串化** - 將範圍陣列轉換為範圍字串 / Convert range arrays to range strings
- 🛠️ **合併與替換** - 合併版本物件或替換版本部分 / Merge version objects or replace version parts

## 重要說明 / Important Notes

### 單一版本範圍 vs 多個版本範圍組合 / Single Version Range vs Multiple Range Combinations

本套件的函數分為兩類，請根據需求選擇正確的 API：

This package's functions are divided into two categories, please choose the correct API based on your needs:

#### 僅支援單一版本範圍 / Single Version Range Only

以下函數**僅支援單一版本範圍**，不支援多個版本範圍組合（如 `>=1.0.0 <2.0.0` 或 `^1.0.0 || ^2.0.0`）：

The following functions **only support single version range**, not multiple version range combinations (e.g., `>=1.0.0 <2.0.0` or `^1.0.0 || ^2.0.0`):

- `parse()` / `parseSimpleSemVer()` - 解析單一版本字串
- `stringify()` / `stringifySimpleSemVer()` - 字串化單一版本物件
- `stringifyFull()` - 字串化單一版本物件（含運算子）
- `mergeSimpleSemVer()` - 合併單一版本物件
- `replaceSimpleSemVerVersion()` - 替換單一版本部分
- `SimpleSemVer` 類別 - 封裝單一版本物件

#### 支援多個版本範圍組合 / Multiple Range Combinations Supported

以下函數**支援多個版本範圍組合**：

The following functions **support multiple version range combinations**:

- `parseRange()` / `parseSimpleSemVerRange()` - 解析版本範圍字串（支援 `||`、`<`、`>` 等組合）
- `stringifyRange()` / `stringifySimpleSemVerRange()` - 字串化版本範圍陣列

## API 文件 / API Documentation

### 核心函數 / Core Functions

#### `parse(semverString)`

將 semver 字串解析為結構化物件。

Parse a semver string into a structured object.

> ⚠️ **注意**：此函數僅支援單一版本範圍。若需解析多個版本範圍組合，請使用 `parseRange()`。
>
> ⚠️ **Note**: This function only supports single version range. For multiple range combinations, use `parseRange()`.

```typescript
import { parse } from '@lazy-node/semver-parse';

const semver = parse('>=1.2.3-beta.1+build.123');
// {
//   semver: '>=1.2.3-beta.1+build.123',
//   operator: '>=',
//   version: '1.2.3-beta.1+build.123',
//   major: '1',
//   minor: '2',
//   patch: '3',
//   release: 'beta.1',
//   build: 'build.123'
// }

parse('1.0.6-1+build-623');
// {
//   semver: '1.0.6-1+build-623',
//   version: '1.0.6',
//   major: '1',
//   minor: '0',
//   patch: '6',
//   release: '1',
//   build: 'build-623'
// }
```

#### `stringify(semverObject)`

將 semver 物件轉換為版本字串（不含運算子）。

Convert a semver object to a version string (without operator).

```typescript
import { stringify } from '@lazy-node/semver-parse';

stringify({
  major: '1',
  minor: '0',
  patch: '6',
  release: '1',
  build: 'build-623'
});
// '1.0.6-1+build-623'
```

#### `stringifyFull(semverObject)`

將 semver 物件轉換為完整的版本字串（包含運算子）。

Convert a semver object to a full version string (with operator).

```typescript
import { stringifyFull } from '@lazy-node/semver-parse';

stringifyFull({
  operator: '>=',
  major: '1',
  minor: '2',
  patch: '3',
  release: 'beta.1'
});
// '>=1.2.3-beta.1'
```

#### `parseRange(rangeString)`

解析版本範圍字串為 semver 物件陣列。

Parse a range string into an array of semver objects.

> ✅ **此函數支援多個版本範圍組合**（如 `>=1.0.0 <2.0.0` 或 `^1.0.0 || ^2.0.0`）。
>
> ✅ **This function supports multiple version range combinations** (e.g., `>=1.0.0 <2.0.0` or `^1.0.0 || ^2.0.0`).

```typescript
import { parseRange } from '@lazy-node/semver-parse';

parseRange('>= 1.1.7 < 2.0.0 || 1.1.3');
// [
//   {
//     semver: '>= v1.1.7',
//     operator: '>=',
//     major: 1,
//     minor: 1,
//     patch: 7
//   },
//   {
//     semver: '< v2.0.0',
//     operator: '<',
//     major: 2,
//     minor: 0,
//     patch: 0
//   },
//   {
//     operator: '||'
//   },
//   {
//     semver: 'v1.1.3',
//     operator: '=',
//     major: 1,
//     minor: 1,
//     patch: 3
//   }
// ]
```

#### `stringifyRange(rangeArray)`

將 semver 物件陣列轉換為範圍字串。

Convert an array of semver objects to a range string.

```typescript
import { stringifyRange } from '@lazy-node/semver-parse';

stringifyRange([
  { semver: '>= v1.1.7', operator: '>=', major: 1, minor: 1, patch: 7 },
  { semver: '< v2.0.0', operator: '<', major: 2, minor: 0, patch: 0 },
  { operator: '||' },
  { semver: 'v1.1.3', operator: '=', major: 1, minor: 1, patch: 3 }
]);
// '>= v1.1.7 < v2.0.0 || v1.1.3'
```

### 額外功能 / Additional Functions

#### `mergeSimpleSemVer(target, source)`

合併兩個 SimpleSemVer 物件。

Merge two SimpleSemVer objects.

> ⚠️ **注意**：此函數僅支援單一版本範圍。
>
> ⚠️ **Note**: This function only supports single version range.

```typescript
import { mergeSimpleSemVer } from '@lazy-node/semver-parse/lib/mergeSimpleSemVer';

const target = { major: '1', minor: '0', patch: '0' };
const source = { minor: '2', patch: '3' };

mergeSimpleSemVer(target, source);
// { major: '1', minor: '2', patch: '3' }
```

#### `replaceSimpleSemVerVersion(obj, version)`

替換 SimpleSemVer 物件的版本部分。

Replace the version part of a SimpleSemVer object.

> ⚠️ **注意**：此函數僅支援單一版本範圍。
>
> ⚠️ **Note**: This function only supports single version range.

```typescript
import { replaceSimpleSemVerVersion } from '@lazy-node/semver-parse/lib/replaceSimpleSemVerVersion';

const semver = { operator: '>=', major: '1', minor: '0', patch: '0' };
replaceSimpleSemVerVersion(semver, '2.3.4');
// { operator: '>=', major: '2', minor: '3', patch: '4' }
```

### 類型定義 / Type Definitions

#### `ISimpleSemVerObject`

```typescript
interface ISimpleSemVerObject {
  operator?: '~' | '^' | '>=' | '<=' | '=' | '-' | '||' | '~>' | string;
  version?: string;
  semver?: string;
  major?: string;
  minor?: string;
  patch?: string;
  release?: string;
  build?: string;
}
```

## 使用案例 / Use Cases

### 1. 版本字串解析 / Version String Parsing

```typescript
import { parse, stringify } from '@lazy-node/semver-parse';

const version = parse('1.2.3-beta.1+build.123');
console.log(`Major: ${version.major}, Minor: ${version.minor}, Patch: ${version.patch}`);
// Major: 1, Minor: 2, Patch: 3

console.log(stringify(version)); // '1.2.3-beta.1+build.123'
```

### 2. 版本範圍處理 / Version Range Handling

```typescript
import { parseRange, stringifyRange } from '@lazy-node/semver-parse';

const range = parseRange('^1.2.0 || >=2.0.0 <3.0.0');

// 分析或修改範圍 / Analyze or modify range
range.forEach(item => {
  if (item.operator === '^') {
    console.log(`Caret range detected: ${item.semver}`);
  }
});

// 字串化 / Stringify
const rangeString = stringifyRange(range);
```

### 3. 版本物件合併 / Version Object Merging

```typescript
import { parse, mergeSimpleSemVer, stringify } from '@lazy-node/semver-parse';

const baseVersion = parse('1.0.0');
const updateVersion = { minor: '2', patch: '5' };

const merged = mergeSimpleSemVer(baseVersion, updateVersion);
console.log(stringify(merged)); // '1.2.5'
```

### 4. 建構版本範圍 / Building Version Ranges

```typescript
import { stringifyRange } from '@lazy-node/semver-parse';

const customRange = [
  { operator: '>=', major: '1', minor: '0', patch: '0' },
  { operator: '<', major: '2', minor: '0', patch: '0' }
];

const rangeString = stringifyRange(customRange);
// '>=1.0.0 <2.0.0'
```

## 與 semver 套件的差異 / Differences from semver Package

| 功能 / Feature | `semver` | `@lazy-node/semver-parse` |
|---------------|----------|---------------------------|
| 解析版本字串 / Parse version string | `semver.parse()` 返回複雜物件 | 返回簡單的結構化物件 |
| 解析範圍字串 / Parse range string | `semver.validRange()` 僅驗證 | `parseRange()` 返回詳細結構 |
| 字串化範圍 / Stringify range | 不提供 | `stringifyRange()` |
| 合併版本物件 / Merge version objects | 不提供 | `mergeSimpleSemVer()` |
| 替換版本部分 / Replace version part | 不提供 | `replaceSimpleSemVerVersion()` |

## 相關套件 / Related Packages

- [`@lazy-node/semver-part`](../semver-part) - 版本部分比較工具 / Version part comparison utilities
- [`@lazy-node/semver-ampersand`](../semver-ampersand) - 支援 ampersand 的 semver 範圍處理 / Semver range handling with ampersand support
- [`semver`](https://www.npmjs.com/package/semver) - 語義化版本處理 / Semantic versioning

## 授權 / License

Apache-2.0 © AJ ONeal

## 貢獻 / Contributing

歡迎提交 Issue 和 Pull Request！

Issues and Pull Requests are welcome!

請前往 [GitHub](https://github.com/bluelovers/ws-yarn-workspaces) 貢獻。

## 靈感來源 / Inspiration

此專案基於 [semver-utils](https://github.com/coolaj86/semver-utils)，並增加了 TypeScript 支援和更多功能。

This project is based on [semver-utils](https://github.com/coolaj86/semver-utils), with TypeScript support and additional features.