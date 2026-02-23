# @lazy-node/semver-* 套件說明

> 三個互補的 semver 工具庫 / Three complementary semver utility libraries

## 概述 / Overview

`@lazy-node/semver-*` 系列套件提供了一系列互補的語義化版本（Semantic Versioning）處理工具，擴展了標準 `semver` 套件的功能，滿足更多進階使用場景。

The `@lazy-node/semver-*` packages provide a set of complementary Semantic Versioning utility tools that extend the standard `semver` package with additional functionality for advanced use cases.

## 套件關係圖 / Package Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        semver (peer dependency)                  │
│                    標準語義化版本處理核心                          │
└───────────────────────────┬─────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  semver-part  │   │  semver-parse │   │semver-ampersand│
│               │   │               │   │               │
│  版本部分比較  │   │  版本解析/字串化│   │  Ampersand範圍 │
│               │   │               │   │               │
│ - compare     │   │ - parse       │   │ - satisfies   │
│ - eq/gt/lt    │   │ - stringify   │   │ - validRange  │
│ - parseVersions│   │ - parseRange  │   │ - Range class │
└───────────────┘   └───────────────┘   └───────────────┘
```

## 套件詳細說明 / Package Details

### 1. @lazy-node/semver-part

> **版本部分比較工具 / Version Part Comparison Utilities**

**用途 / Purpose:**
比較 semver 版本號的部分字串（如 `major.minor` 或 `minor.patch`），而不需要完整的 semver 版本字串。特別適用於版本差異分析。

Compare parts of semver version strings without requiring complete versions. Particularly useful for version difference analysis.

**核心功能 / Core Features:**
- 🔄 **版本部分比較** - 支援不完整版本字串的比較
- 📊 **版本差異分析** - 找出版本變更的位置和方向
- 🛠️ **版本部分轉換** - 將版本分割或合併為部分

**主要 API:**
```typescript
import { compare, eq, gt, lt, parseVersions } from '@lazy-node/semver-part';

// 比較版本部分
compare('1.2', '1.3'); // -1
gt('1.3', '1.2'); // true

// 解析版本差異
parseVersions('1.2.3', '2.0.0');
// { index: 0 } - major 不同
```

**適用場景 / Use Cases:**
- 版本升級類型偵測（major/minor/patch）
- 部分版本比較
- 版本變更追蹤

---

### 2. @lazy-node/semver-parse

> **簡易 semver 解析與字串化工具 / Simple Semver Parsing & Stringification**

**用途 / Purpose:**
提供輕量級的 semver 解析功能，將版本字串解析為結構化物件，並支援版本範圍的解析與字串化。這是標準 `semver` 套件的補充工具。

Provide lightweight semver parsing, converting version strings to structured objects, with support for range parsing and stringification.

**核心功能 / Core Features:**
- 🔍 **版本解析** - 將版本字串解析為結構化物件
- 📝 **版本字串化** - 將版本物件轉換為版本字串
- 🎯 **範圍解析** - 解析版本範圍字串
- 🛠️ **合併與替換** - 合併版本物件或替換版本部分

**主要 API:**
```typescript
import { parse, stringify, parseRange, stringifyRange } from '@lazy-node/semver-parse';

// 解析版本
const semver = parse('>=1.2.3-beta.1+build.123');
// { operator: '>=', major: '1', minor: '2', patch: '3', ... }

// 字串化版本
stringify(semver); // '1.2.3-beta.1+build.123'

// 解析範圍
parseRange('>=1.2.3 <2.0.0');
```

**與 semver 的差異 / Differences from semver:**

| 功能 | `semver` | `@lazy-node/semver-parse` |
|------|----------|---------------------------|
| 解析版本字串 | 返回複雜物件 | 返回簡單結構化物件 |
| 解析範圍字串 | 僅驗證 | 返回詳細結構 |
| 字串化範圍 | 不提供 | ✅ |
| 合併版本物件 | 不提供 | ✅ |

---

### 3. @lazy-node/semver-ampersand

> **支援 Ampersand (`&`) 語法的 semver 範圍處理 / Semver Range with Ampersand Support**

**用途 / Purpose:**
擴展標準 semver 的範圍處理功能，支援使用 `&` 符號來表示「且」的條件。這在處理 yarn/npm workspaces 的依賴版本時特別有用。

Extend standard semver range handling with `&` symbol support for "AND" conditions, particularly useful for yarn/npm workspaces.

**核心功能 / Core Features:**
- 🔗 **Ampersand 支援** - 使用 `&` 符號組合多個版本條件
- ✅ **satisfies** - 檢查版本是否符合範圍
- 🔍 **maxSatisfying/minSatisfying** - 找出最大/最小符合版本
- 🏗️ **Range 類別** - 增強版的 semver.Range

**主要 API:**
```typescript
import { satisfies, validRange, Range } from '@lazy-node/semver-ampersand';

// Ampersand 語法
satisfies('1.2.3', '>=1.0.0 & <2.0.0'); // true

// 標準 semver 語法也支援
satisfies('1.2.3', '>=1.0.0 <2.0.0'); // true

// 使用 Range 類別
const range = new Range('>=1.0.0 & <2.0.0');
range.test('1.5.0'); // true
```

**Ampersand 語法說明:**
```typescript
// 標準 semver 語法（空格表示「且」）
'>=1.0.0 <2.0.0'

// Ampersand 語法（更明確的表達）
'>=1.0.0 & <2.0.0'

// 混合使用
'>=1.0.0 & <2.0.0 || >=3.0.0'
```

---

## 選擇指南 / Selection Guide

```
                    需求類型
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
   比較版本部分      解析版本字串     處理版本範圍
        │               │               │
        ▼               ▼               ▼
  ┌───────────┐   ┌───────────┐   ┌───────────┐
  │semver-part│   │semver-parse│   │semver-    │
  │           │   │           │   │ampersand  │
  └───────────┘   └───────────┘   └───────────┘
        │               │               │
        │               │               │
        ▼               ▼               ▼
   版本差異分析     版本物件操作     Workspaces
   部分版本比較     範圍解析/字串化   依賴版本處理
```

### 依需求選擇 / Choose by Requirement

| 需求 | 推薦套件 |
|------|----------|
| 比較不完整的版本字串 | `@lazy-node/semver-part` |
| 找出版本變更位置（major/minor/patch） | `@lazy-node/semver-part` |
| 解析版本字串為結構化物件 | `@lazy-node/semver-parse` |
| 將版本物件轉換回字串 | `@lazy-node/semver-parse` |
| 解析版本範圍 | `@lazy-node/semver-parse` |
| 使用 `&` 語法的版本範圍 | `@lazy-node/semver-ampersand` |
| Workspaces 依賴版本處理 | `@lazy-node/semver-ampersand` |

---

## 安裝 / Installation

```bash
# 安裝單一套件
yarn add @lazy-node/semver-part
yarn add @lazy-node/semver-parse
yarn add @lazy-node/semver-ampersand

# 或安裝全部
yarn add @lazy-node/semver-part @lazy-node/semver-parse @lazy-node/semver-ampersand
```

---

## 互通性 / Interoperability

這三個套件可以一起使用，互相配合：

```typescript
import { parseVersions, compare } from '@lazy-node/semver-part';
import { parse, stringify } from '@lazy-node/semver-parse';
import { satisfies, Range } from '@lazy-node/semver-ampersand';

// 組合使用範例
const oldVersion = '1.2.3';
const newVersion = '2.0.0';

// 1. 分析版本差異
const { index } = parseVersions(oldVersion, newVersion);
console.log(`變更類型: ${['major', 'minor', 'patch'][index]}`);

// 2. 解析版本
const parsed = parse(newVersion);

// 3. 檢查版本是否符合範圍
const range = new Range('>=2.0.0 & <3.0.0');
console.log(`符合範圍: ${range.test(newVersion)}`);
```

---

## 授權 / License

- `@lazy-node/semver-part` - ISC
- `@lazy-node/semver-parse` - Apache-2.0
- `@lazy-node/semver-ampersand` - ISC

---

## 相關連結 / Related Links

- [GitHub Repository](https://github.com/bluelovers/ws-yarn-workspaces)
- [semver (npm)](https://www.npmjs.com/package/semver)
- [Semantic Versioning Specification](https://semver.org/)