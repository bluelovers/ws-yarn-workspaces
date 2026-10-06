# @yarn-tool/pkg-list-to-types

Convert a list of npm package names into a deduplicated list of `@types` package names.

將一組 npm 套件名稱 (Package Name) 陣列轉換為去重 (Deduplicated) 後的 `@types` 型別套件名稱 (Type Package Name) 列表。

## Features

- `listToTypes` — 批次將套件名稱陣列轉為 `@types/...` 名稱
- 自動去重 (Deduplicate)：轉換後以 `array_unique_overwrite` 移除重複項目並保留原始順序
- 支援可選的版本 (Version) 處理，交由 `generatePackageArg` 依需附加
- 純函式 (Pure Function) 實作，不修改輸入陣列以外的狀態

## Installation

```bash
yarn add @yarn-tool/pkg-list-to-types
yarn-tool add @yarn-tool/pkg-list-to-types
yt add @yarn-tool/pkg-list-to-types
```

## Usage

```ts
import listToTypes from '@yarn-tool/pkg-list-to-types';

listToTypes(['foo', '@yarn-tool/pkg-name-util']);
// => ['@types/foo', '@types/yarn-tool__pkg-name-util']

// 重複項目會在轉換後被移除
listToTypes(['foo', 'foo', 'bar']);
// => ['@types/foo', '@types/bar']

// 需要版本資訊時傳入 includeVersion
listToTypes(['foo@1.2.3'], true);
```

## API Documentation

### `listToTypes(input: string[], includeVersion?: boolean): string[]`

本套件的預設匯出 (Default Export)。

| 參數 | 型別 | 說明 |
| --- | --- | --- |
| `input` | `string[]` | 待轉換的套件名稱（可含 scope 與版本規格） |
| `includeVersion?` | `boolean` | 是否把版本資訊一併處理，轉交 `generatePackageArg` 決定輸出格式 |

| 回傳 | 型別 | 說明 |
| --- | --- | --- |
| - | `string[]` | 轉換並去重後的 `@types` 名稱陣列 |

處理流程：

1. 以 `reduce` 逐項呼叫 `packageNameToTypes` 轉為 `@types` 名稱
2. 透過 `generatePackageArg(result, includeVersion)` 產出最終字串
3. 最後以 `array_unique_overwrite` 原地去重，回傳新陣列

## Configuration

本套件無設定檔，行為僅由 `listToTypes` 的參數控制：

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `includeVersion` | `boolean?` | `false` | 是否在轉換時保留／附加版本資訊 |
