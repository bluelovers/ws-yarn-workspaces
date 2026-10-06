# @yarn-tool/pkg-name-util

Utilities for formatting, stripping, and validating npm package names with scope.

用於格式化 (Format)、剝離與驗證 (Validate) 帶有範圍 (Scope) 的 npm 套件名稱 (Package Name) 的工具函式集合。

## Features

- `formatPackageName` — 將 scope 與 name 組合成完整的套件名稱，自動補上 `@` 前綴
- `stripScope` — 剝離套件名稱中的 scope，只保留裸名稱 (Bare Name)
- `assertScope` — 斷言 scope 格式合法，不合法時丟出 `TypeError`
- `validScope` — 以布林值回傳 scope 是否合法（不會丟出例外）
- 純函式 (Pure Function) 實作，無任何副作用 (Side Effect) 與外部依賴

## Installation

```bash
yarn add @yarn-tool/pkg-name-util
yarn-tool add @yarn-tool/pkg-name-util
yt add @yarn-tool/pkg-name-util
```

## Usage

```ts
import formatPackageName, { stripScope, validScope } from '@yarn-tool/pkg-name-util';

// 組合完整的套件名稱（scope 可帶或不帶 @ 前綴）
formatPackageName({ scope: '@yarn-tool', name: 'pkg-name-util' });
// => '@yarn-tool/pkg-name-util'

formatPackageName({ name: 'foo' });
// => 'foo'

// 剝離 scope，取得裸名稱
stripScope('@yarn-tool/pkg-name-util');
// => 'pkg-name-util'

// 驗證 scope 是否合法
validScope('@yarn-tool'); // => true
validScope('@bad scope'); // => false
```

## API Documentation

### `formatPackageName(data: IPackageNameInfo): string`

將 `IPackageNameInfo` 格式化為完整套件名稱。

- `data.name` 為必填，為空或缺少時丟出 `TypeError`
- `data.scope` 為選填；若有值會先經過 `assertScope` 驗證
- scope 第一個字元不是 `@` 時會自動補上 `@` 前綴
- 預設匯出 (Default Export) 即為此函式

### `IPackageNameInfo`

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `scope?` | `string` | 選填的範圍，可含或不含 `@` 前綴 |
| `name` | `string` | 必填的裸套件名稱 |

### `stripScope(packageName: string): string`

回傳 `/` 之後的名稱片段；若名稱不含 scope（無 `/`），則回傳原字串。

### `assertScope(scope: string, includeAtSign?: boolean): asserts scope is string`

斷言 scope 合法，不合法時丟出 `TypeError`。驗證規則：

- 去除開頭的 `@` 後不可為空
- 只允許 `\w`、`-`、`_` 字元（不可含有其他字元）
- 當傳入 `includeAtSign` 時，開頭的 `@` 存在與否必須與之相符

### `validScope(scope: string, includeAtSign?: boolean): scope is string`

`assertScope` 的非丟出 (Non-throwing) 版本，以 `try/catch` 包裹後回傳布林值。

## Configuration

本套件無執行期設定，但 `assertScope` / `validScope` 提供可選參數 `includeAtSign`：

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `includeAtSign` | `boolean?` | `undefined`（不檢查） | 指定 scope 是否必須以 `@` 開頭；傳入後不符即丟出 `TypeError` |
