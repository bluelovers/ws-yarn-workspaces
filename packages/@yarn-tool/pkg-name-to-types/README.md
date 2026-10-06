# @yarn-tool/pkg-name-to-types

Convert npm package names into their matching `@types` package names.

將 npm 套件名稱 (Package Name) 轉換為對應的 `@types` 型別套件名稱 (Type Package Name)。

## Features

- `pkgNameToTypes` — 將套件名稱轉為 `@types/...` 名稱，並支援範圍 (Scope) 套件與版本 (Version) 後綴
- `extractName` — 從各式套件名稱規格（含 `name@version`）萃取裸名稱
- `escapePackageName` — 將 scope 中的特殊字元轉為 `__`，產出可用於型別名稱的字串
- `isNamespacedName` — 判斷字串是否為合法的 namespaced 套件名稱
- 重新匯出 `parseArgvPkgName` 與常用正規表示式 (Regular Expression)，方便直接使用

## Installation

```bash
yarn add @yarn-tool/pkg-name-to-types
yarn-tool add @yarn-tool/pkg-name-to-types
yt add @yarn-tool/pkg-name-to-types
```

## Usage

```ts
import pkgNameToTypes, { extractName, escapePackageName, isNamespacedName } from '@yarn-tool/pkg-name-to-types';

// 一般套件
pkgNameToTypes('foo');
// => '@types/foo'

// 帶 scope 的套件（scope 會被轉義為 `__`）
pkgNameToTypes('@yarn-tool/pkg-name-to-types');
// => '@types/yarn-tool__pkg-name-to-types'

// 搭配版本號
pkgNameToTypes('foo@1.2.3', true);
// => '@types/foo1.2.3'

// 萃取裸名稱
extractName('@yarn-tool/pkg-name-to-types@3.0.9');
// => 'pkg-name-to-types'

// 轉義 scope 特殊字元
escapePackageName('@yarn-tool/pkg-name-to-types');
// => 'yarn-tool__pkg-name-to-types'

isNamespacedName('@yarn-tool/pkg-name-to-types'); // => true
isNamespacedName('foo@1.2.3'); // => false（含版本號不屬於 namespaced name）
```

## API Documentation

### `pkgNameToTypes(packageName: string, includeVersion?: boolean): string`

本套件的預設匯出 (Default Export)。將套件名稱轉為 `@types/` 名稱。

- 先以 `parseArgvPkgName` 解析出 `name`、`namespace`、`version`
- 有 scope 時，scope 經 `escapePackageName` 轉義後以 `__` 接上裸名稱
- `includeVersion` 為 `true` 且解析出版本時，才把版本接在名稱後方（依賴 npm 對 `@types/name` 的版本比對慣例）

### `extractName(packageName: string): string`

回傳 `parseArgvPkgName(packageName).name`，即不含 scope 與版本的裸名稱。

### `escapePackageName(packageName: string): string`

移除開頭的 `@`，並把第一個 `/` 或 `\` 替換為 `__`，讓結果可安全用於型別名稱 (Type Identifier)。

### `isNamespacedName(packageName: string): boolean`

以 `reNamespacedName` 判斷是否為「可選 scope + 裸名稱」的形式；含版本號的字串會回傳 `false`。

### 重新匯出 (Re-export)

| 匯出 | 說明 |
| --- | --- |
| `sep` | scope 與名稱的連接分隔字串，固定為 `'__'` |
| `reNamespacedName` | 匹配「可選 scope + 裸名稱」的正規表示式 |
| `reNamespacedNameWithVersion` | 在上述基礎上允許 `@version` 後綴 |
| `parseArgvPkgName` | 自 `@yarn-tool/npm-package-arg-util` 轉發，解析套件名稱規格 (Spec) |

## Configuration

本套件無設定檔，行為僅由 `pkgNameToTypes` 的 `includeVersion` 參數控制：

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `includeVersion` | `boolean?` | `false` | 是否將解析到的版本號接到 `@types` 名稱後方 |
