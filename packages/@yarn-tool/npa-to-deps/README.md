# @yarn-tool/npa-to-deps

Convert npm-package-arg (npa) parsing results to standardized dependency value objects.
將 npm-package-arg (npa) 解析結果轉換為標準化的依賴值物件。

## Features / 功能特點

- Handles various input types including git URLs, version tags, semver ranges, and local file paths / 處理各種輸入類型，包括 git URL、版本標籤、semver 範圍和本地檔案路徑
- Converts npm-package-arg results to standardized dependency objects / 將 npm-package-arg 結果轉換為標準化的依賴物件
- Supports options for preserving tags and ranges / 支援保留標籤和範圍的選項

## Installation / 安裝

```bash
yarn add @yarn-tool/npa-to-deps
yarn-tool add @yarn-tool/npa-to-deps
yt add @yarn-tool/npa-to-deps
```

## Usage / 使用方式

```typescript
import { npaToDepsValue, npaResultToDepsValue } from '@yarn-tool/npa-to-deps';
import { npa } from '@yarn-tool/npm-package-arg-util';

// Parse and convert in one step
// 一步完成解析和轉換
const deps = npaToDepsValue('lodash@^4.17.0');
// => { name: 'lodash', operator: '^', fetchQuery: true, result: ... }

// Keep the tag by passing options to npaResultToDepsValue
// 保留標籤：選項需傳給 npaResultToDepsValue
const tagResult = npa('lodash@latest');
const tagDeps = npaResultToDepsValue(tagResult, { preserveTag: true });
// => { name: 'lodash', semver: 'latest', result: ... }

// Convert existing npa result
// 轉換現有的 npa 結果
const result = npa('github:user/repo#branch');
const gitDeps = npaResultToDepsValue(result);
// => { name: 'repo', semver: 'github:user/repo#branch', result: ... }
```

## API Documentation / API 文件

### `npaToDepsValue<T>(arg: string, options?: IOptions): IDepsResult<T>`

Parse a package argument string and convert to dependency value.
解析套件參數字串並轉換為依賴值。

**Parameters / 參數:**
- `arg` - The package argument string to parse / 要解析的套件參數字串
- `options` - Parsing and conversion options / 解析和轉換選項
  - `where` - Base directory for resolving relative paths / 解析相對路徑的基礎目錄

> **注意 / Note:** 此函式目前僅會使用 `where`；`preserveTag` 與 `preserveRange` 請改用下方的 `npaResultToDepsValue`（詳見 Configuration 章節）。
> This function currently only uses `where`; use `npaResultToDepsValue` below for `preserveTag` / `preserveRange` (see the Configuration section).

**Returns / 返回:**
- Standardized dependency value object / 標準化的依賴值物件

### `npaResultToDepsValue<T>(result: T, options?: IOptions): IDepsResult<T>`

Convert an npm-package-arg result to a dependency value object.
將 npm-package-arg 結果轉換為依賴值物件。

**Parameters / 參數:**
- `result` - The npm-package-arg parsing result / npm-package-arg 解析結果
- `options` - Conversion options / 轉換選項

### `IDepsResult<T>` Interface

```typescript
interface IDepsResult<T> {
  name: string;         // Package name / 套件名稱
  semver?: string;      // Semantic version string / 語義化版本字串
  operator?: string;    // Version operator (^, ~, >=) / 版本運算子
  fetchQuery?: boolean; // Whether to fetch from registry / 是否從 registry 查詢
  result: T;            // Original npm-package-arg result / 原始結果
}
```

## Configuration / 設定

`npaToDepsValue` 與 `npaResultToDepsValue` 皆接受同一組選項物件 (Options)，用來控制解析與轉換的行為。
Both `npaToDepsValue` and `npaResultToDepsValue` accept the same options object to control parsing and conversion behavior.

> **注意 / Note:** `npaToDepsValue` 目前只會使用 `where`（傳給 npa 解析），`preserveTag` 與 `preserveRange` 需直接呼叫 `npaResultToDepsValue` 才會生效。
> `npaToDepsValue` currently only uses `where` (passed to npa parsing); call `npaResultToDepsValue` directly to apply `preserveTag` / `preserveRange`.

### `IOptions` Interface

```typescript
interface IOptions {
  where?: string;           // Base directory for resolving relative paths / 解析相對路徑的基礎目錄
  preserveTag?: boolean;    // Preserve tag instead of converting to ^ / 保留標籤而不是轉換為 ^
  preserveRange?: boolean;  // Preserve original range / 保留原始範圍
}
```

- `where` - Base directory for resolving relative paths / 解析相對路徑的基礎目錄
- `preserveTag` - Preserve tag instead of converting to ^ / 保留標籤而不是轉換為 ^
- `preserveRange` - Preserve original range instead of normalizing / 保留原始範圍而不是正規化

## Examples / 範例

### Git Repository / Git 儲存庫

```typescript
const result = npa('github:user/repo#branch');
npaResultToDepsValue(result);
// => { name: 'repo', semver: 'github:user/repo#branch', result: ... }
```

### Version Tag / 版本標籤

```typescript
// Default behavior - convert to ^
// 預設行為 - 轉換為 ^
npaToDepsValue('lodash@latest');
// => { name: 'lodash', operator: '^', fetchQuery: true, ... }

// Preserve tag - pass options to npaResultToDepsValue
// 保留標籤 - 選項傳給 npaResultToDepsValue
npaResultToDepsValue(npa('lodash@latest'), { preserveTag: true });
// => { name: 'lodash', semver: 'latest', ... }
```

### Semver Range / Semver 範圍

```typescript
npaToDepsValue('lodash@^4.17.0');
// => { name: 'lodash', operator: '^', fetchQuery: true, ... }

npaToDepsValue('lodash@>=4.0.0 <5.0.0');
// => { name: 'lodash', semver: '>=4.0.0 <5.0.0', ... }
```

### Exact Version / 精確版本

```typescript
npaToDepsValue('lodash@4.17.21');
// => { name: 'lodash', semver: '4.17.21', ... }
```

## Related / 相關專案

- [@yarn-tool/npm-package-arg-util](../npm-package-arg-util) - npm-package-arg utilities
- [@yarn-tool/normalize-deps-value](../normalize-deps-value) - Normalize dependency values
- [npm-package-arg 特殊輸入狀況說明](../../../docs/npm-package-arg-special-cases.md) - Special input cases (empty string, space, `*`) and how they are detected / npm-package-arg 特殊輸入（空字串、空格、`*`）的行為與偵測方式

## License / 授權

ISC
