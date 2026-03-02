# @yarn-tool/npa-to-deps

Convert npm-package-arg (npa) parsing results to standardized dependency value objects.
將 npm-package-arg (npa) 解析結果轉換為標準化的依賴值物件。

## Features / 功能特點

- Handles various input types including git URLs, version tags, semver ranges, and local file paths / 處理各種輸入類型，包括 git URL、版本標籤、semver 範圍和本地檔案路徑
- Converts npm-package-arg results to standardized dependency objects / 將 npm-package-arg 結果轉換為標準化的依賴物件
- Supports options for preserving tags and ranges / 支援保留標籤和範圍的選項

## Install / 安裝

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

// With preserveTag option
// 使用 preserveTag 選項
const tagDeps = npaToDepsValue('lodash@latest', { preserveTag: true });
// => { name: 'lodash', semver: 'latest', result: ... }

// Convert existing npa result
// 轉換現有的 npa 結果
const result = npa('github:user/repo#branch');
const gitDeps = npaResultToDepsValue(result);
// => { name: 'repo', semver: 'github:user/repo#branch', result: ... }
```

## API / API 文件

### `npaToDepsValue<T>(arg: string, options?: IOptions): IDepsResult<T>`

Parse a package argument string and convert to dependency value.
解析套件參數字串並轉換為依賴值。

**Parameters / 參數:**
- `arg` - The package argument string to parse / 要解析的套件參數字串
- `options` - Parsing and conversion options / 解析和轉換選項
  - `where` - Base directory for resolving relative paths / 解析相對路徑的基礎目錄
  - `preserveTag` - Preserve tag instead of converting to ^ / 保留標籤而不是轉換為 ^
  - `preserveRange` - Preserve original range instead of normalizing / 保留原始範圍而不是正規化

**Returns / 返回:**
- Standardized dependency value object / 標準化的依賴值物件

### `npaResultToDepsValue<T>(result: T, options?: IOptions): IDepsResult<T>`

Convert an npm-package-arg result to a dependency value object.
將 npm-package-arg 結果轉換為依賴值物件。

**Parameters / 參數:**
- `result` - The npm-package-arg parsing result / npm-package-arg 解析結果
- `options` - Conversion options / 轉換選項

### `IOptions` Interface

```typescript
interface IOptions {
  where?: string;           // Base directory for resolving relative paths
  preserveTag?: boolean;    // Preserve tag instead of converting to ^
  preserveRange?: boolean;  // Preserve original range
}
```

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

// Preserve tag
// 保留標籤
npaToDepsValue('lodash@latest', { preserveTag: true });
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

## License / 授權

ISC
