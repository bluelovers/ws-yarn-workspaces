# @yarn-tool/npm-package-arg-util

[![NPM version](https://img.shields.io/npm/v/@yarn-tool/npm-package-arg-util.svg)](https://www.npmjs.com/package/@yarn-tool/npm-package-arg-util)
[![License](https://img.shields.io/npm/l/@yarn-tool/npm-package-arg-util.svg)](https://github.com/bluelovers/ws-yarn-workspaces/blob/master/packages/@yarn-tool/npm-package-arg-util/LICENSE)

> A utility library for parsing and handling npm package arguments / 用於解析和處理 npm 套件參數的工具函式庫

A comprehensive utility library for parsing npm package arguments, providing enhanced functionality for yarn tools. This library wraps [npm-package-arg](https://github.com/npm/npm-package-arg) with additional features like type guards, version extraction, flexible validation options, and TypeScript @types package name conversion.

一個全面的 npm 套件參數解析工具函式庫，為 yarn 工具提供增強功能。此函式庫封裝了 [npm-package-arg](https://github.com/npm/npm-package-arg)，並提供額外功能如類型守衛、版本提取、靈活的驗證選項和 TypeScript @types 套件名稱轉換。

## Features / 功能特色

- 📦 **Package Argument Parsing** - Parse npm package arguments with validation / 解析 npm 套件參數並驗證
- 🔍 **Type Guards** - Runtime type checking for different package types / 針對不同套件類型的執行時類型檢查
- 📝 **Version Extraction** - Extract semver from various package formats / 從各種套件格式提取語意版本
- 🔄 **@types Conversion** - Convert package names to TypeScript @types format / 將套件名稱轉換為 TypeScript @types 格式
- ⚡ **Safe Parsing** - Try-parse without throwing errors / 嘗試解析但不拋出錯誤
- 🔧 **Flexible Validation** - Customizable validation options / 可自定義的驗證選項
- 🛡️ **TypeScript Support** - Full TypeScript type definitions / 完整的 TypeScript 類型定義

## Installation / 安裝

```bash
# Using yarn / 使用 yarn
yarn add @yarn-tool/npm-package-arg-util

# Using yarn-tool / 使用 yarn-tool
yarn-tool add @yarn-tool/npm-package-arg-util

# Using npm / 使用 npm
npm install @yarn-tool/npm-package-arg-util
```

## Usage / 使用方式

### Basic Parsing / 基本解析

```typescript
import npa, { npa2, npaTry, npaTry2 } from '@yarn-tool/npm-package-arg-util';

// Parse a package with version (legacy, strict name validation)
// 解析帶版本的套件（舊版，嚴格名稱驗證）
const result = npa('lodash@4.17.21');
console.log(result.name);    // 'lodash'
console.log(result.type);    // 'version'
console.log(result.rawSpec); // '4.17.21'

// Parse with flexible options (new version)
// 使用靈活選項解析（新版本）
const result2 = npa2('lodash@^4.17.0', {
  allowedType: ['version', 'range']
});

// Parse a scoped package / 解析範圍套件
const scoped = npa('@types/node@^18.0.0');
console.log(scoped.name);  // '@types/node'
console.log(scoped.scope); // 'types'

// Safe parsing without errors / 安全解析不拋出錯誤
const safe = npaTry('invalid-package-argument');
console.log(safe); // undefined if parsing fails / 如果解析失敗則為 undefined
```

### Validation Options / 驗證選項

```typescript
import { npa2, npaTry2 } from '@yarn-tool/npm-package-arg-util';
import type { IOptionsNpaUtil } from '@yarn-tool/npm-package-arg-util';

// Options for parsing
// 解析選項
const options: IOptionsNpaUtil = {
  // Base directory for resolving relative paths
  // 解析相對路徑的基礎目錄
  where: process.cwd(),
  
  // Whether to validate that result has a name
  // 是否驗證結果有名稱
  shouldHasName: true,
  
  // Array of allowed result types
  // 允許的結果類型陣列
  allowedType: ['version', 'range', 'tag'],
};

// Parse with options
// 使用選項解析
const result = npa2('lodash@^4.17.0', options);

// Parse GitHub repo without name validation
// 解析 GitHub 儲存庫但不驗證名稱
const gitRepo = npa2('user/repo#branch', {
  shouldHasName: false
});
```

### Type Guards / 類型守衛

```typescript
import { 
  isAliasResult, 
  isFileResult, 
  isRegistryResult, 
  isHostedGitResult, 
  isURLResult 
} from '@yarn-tool/npm-package-arg-util/lib/detect';

const result = npa('lodash@^4.17.0');

if (isRegistryResult(result)) {
  // TypeScript knows result is RegistryResult
  // TypeScript 知道 result 是 RegistryResult
  console.log('Package from npm registry / 來自 npm registry 的套件');
}

if (isHostedGitResult(result)) {
  // TypeScript knows result is HostedGitResult
  // TypeScript 知道 result 是 HostedGitResult
  console.log('Package from GitHub/GitLab / 來自 GitHub/GitLab 的套件');
}
```

### Version Extraction / 版本提取

```typescript
import { getSemverFromNpaResult } from '@yarn-tool/npm-package-arg-util';

const result = npa('lodash@^4.17.21');
const version = getSemverFromNpaResult(result);
console.log(version); // '^4.17.21'

// Works with aliases too / 也適用於別名
const alias = npa('my-lodash@npm:lodash@4.17.21');
const aliasVersion = getSemverFromNpaResult(alias);
console.log(aliasVersion); // '4.17.21'
```

### Package Name Parsing / 套件名稱解析

```typescript
import { parsePackageName } from '@yarn-tool/npm-package-arg-util/lib/parseArgvPkgName';

const parsed = parsePackageName('@types/node@^18.0.0');
console.log(parsed);
// {
//   type: 'range',
//   name: '@types/node',
//   scope: 'types',
//   subname: 'node',
//   semver: '^18.0.0',
//   result: ...
// }
```

### TypeScript @types Conversion / TypeScript @types 轉換

```typescript
import { packageNameToTypes } from '@yarn-tool/npm-package-arg-util/lib/packageNameToTypes';

// Convert simple package / 轉換簡單套件
const types1 = packageNameToTypes('lodash');
console.log(types1.name); // '@types/lodash'

// Convert scoped package (uses double underscore) / 轉換範圍套件（使用雙底線）
const types2 = packageNameToTypes('@next/typescript');
console.log(types2.name); // '@types/next__typescript'

// Package already @types / 已經是 @types 的套件
const types3 = packageNameToTypes('@types/node');
console.log(types3.name); // '@types/node'
```

### Generate Package Argument / 生成套件參數

```typescript
import { generatePackageArg } from '@yarn-tool/npm-package-arg-util/lib/generatePackageArg';

// Without version / 不含版本
const arg1 = generatePackageArg({ name: 'lodash' });
console.log(arg1); // 'lodash'

// With version / 含版本
const arg2 = generatePackageArg({ name: 'lodash', semver: '^4.17.0' }, true);
console.log(arg2); // 'lodash@^4.17.0'
```

## API Reference / API 參考

### Main Functions / 主要函數

| Function | Description |
|----------|-------------|
| `npa(arg, where?, options?)` | Parse npm package argument (legacy, strict name validation) / 解析 npm 套件參數（舊版，嚴格名稱驗證） |
| `npa2(arg, where?, options?)` | Parse npm package argument with flexible options / 使用靈活選項解析 npm 套件參數 |
| `npaTry(arg, where?, options?)` | Try parse without throwing (legacy) / 嘗試解析但不拋出錯誤（舊版） |
| `npaTry2(arg, where?, options?)` | Try parse without throwing (new) / 嘗試解析但不拋出錯誤（新版） |
| `getSemverFromNpaResult(result)` | Extract version from result / 從結果提取版本 |

### Options Interface / 選項介面

```typescript
interface IOptionsNpaUtil {
  /** Base directory for resolving relative paths / 解析相對路徑的基礎目錄 */
  where?: string;
  
  /** Whether to validate that result has a name / 是否驗證結果有名稱 */
  shouldHasName?: boolean;
  
  /** Array of allowed result types / 允許的結果類型陣列 */
  allowedType?: IResultType[];
  
  /** Custom npa function to use / 使用的自定義 npa 函數 */
  npa?: typeof _npa;
}
```

### Type Guards / 類型守衛

| Function | Description |
|----------|-------------|
| `isAliasResult(result)` | Check if alias package / 檢查是否為別名套件 |
| `isFileResult(result)` | Check if local file/directory / 檢查是否為本地檔案/目錄 |
| `isRegistryResult(result)` | Check if npm registry package / 檢查是否為 npm registry 套件 |
| `isHostedGitResult(result)` | Check if hosted git repo / 檢查是否為託管 git 儲存庫 |
| `isURLResult(result)` | Check if URL/remote / 檢查是否為 URL/遠端 |

### Utility Functions / 工具函數

| Function | Description |
|----------|-------------|
| `parsePackageName(name)` | Parse package name details / 解析套件名稱詳情 |
| `packageNameToTypes(name, prefix?)` | Convert to @types format / 轉換為 @types 格式 |
| `generatePackageArg(input, includeVersion?)` | Generate package argument / 生成套件參數 |

### Assertion Functions / 斷言函數

| Function | Description |
|----------|-------------|
| `assertNpaResultHasName(result)` | Assert result has a valid name / 斷言結果具有有效名稱 |
| `assertNpaResultByType(result, type)` | Assert result has specific type / 斷言結果具有特定類型 |
| `assertNpaResultAll(result, options?)` | Comprehensive validation / 全面驗證 |

## Supported Package Formats / 支援的套件格式

| Type | Example | Description |
|------|---------|-------------|
| `version` | `pkg@1.2.3` | Exact version / 精確版本 |
| `range` | `pkg@^1.0.0` | Version range / 版本範圍 |
| `tag` | `pkg@latest` | Dist-tag / 分發標籤 |
| `git` | `user/repo` | GitHub shorthand / GitHub 簡寫 |
| `git` | `git+https://...` | Git URL / Git URL |
| `file` | `./path/to/pkg` | Local file / 本地檔案 |
| `directory` | `./path/to/dir` | Local directory / 本地目錄 |
| `alias` | `pkg@npm:other@1.0.0` | Package alias / 套件別名 |
| `remote` | `https://...tar.gz` | Remote tarball / 遠端 tarball |

## Related Projects / 相關專案

- [npm-package-arg](https://github.com/npm/npm-package-arg) - The underlying parser / 底層解析器
- [@yarn-tool/pkg-name-util](../pkg-name-util) - Package name utilities / 套件名稱工具

## License / 授權

ISC © [bluelovers](https://github.com/bluelovers)