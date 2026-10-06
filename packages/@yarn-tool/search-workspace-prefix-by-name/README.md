# @yarn-tool/search-workspace-prefix-by-name

> search workspace prefix by package name

依套件名稱（Package Name）找出其所屬的 workspace prefix（工作區前綴 glob），用於多個 workspace 規則並存的 monorepo（單一倉庫多套件專案）。

## Features

- 從 `workspaces-config` 解析出的多組 prefix 中，找出符合指定套件名稱的那一組
- 優先採用慣用的 `packages/*`，找不到再依序以 glob（萬用字元）比對各組 `prefixSub`
- 支援 `prefixSub` 為空字串的「根層套件」情況
- 無匹配時回傳預設 prefix，不拋出例外

## Installation

```bash
yarn add @yarn-tool/search-workspace-prefix-by-name
yarn-tool add @yarn-tool/search-workspace-prefix-by-name
yt add @yarn-tool/search-workspace-prefix-by-name
```

## Usage

```ts
import searchWorkspacePrefixByName from '@yarn-tool/search-workspace-prefix-by-name';
import { parseStaticPackagesPaths } from 'workspaces-config';

const workspacesConfig = parseStaticPackagesPaths(root);

const prefix = searchWorkspacePrefixByName({
  inputName: '@yarn-tool/utils',
  workspacesConfig,
});

console.log(prefix);
// => 'packages/*'
```

## API Documentation

### searchWorkspacePrefixByName(options)

依套件名稱搜尋所屬的 workspace prefix。

- `options.inputName: string` — 要查核的套件名稱（如 `@scope/pkg`）。
- `options.workspacesConfig: IParseStaticPackagesPathsReturnType` — 由 `workspaces-config` 解析出的 workspaces 設定，含 `prefix` 與 `prefixSub` 兩組平行陣列。
- 回傳 `string` — 匹配到的 prefix glob；找不到時回傳預設值（`packages/*` 或 `prefix[0]`）。

#### 比對規則

1. `prefix` 內含 `packages/*` 時直接採用它（慣用預設）。
2. 否則取 `prefix[0]` 作為預設值。
3. 當 `prefix` 有多組時，依序以 `prefixSub[i] + '/*'` 對 `inputName` 做 glob 比對，第一個命中者勝出。
4. `prefixSub[i]` 為空字串代表根層套件，命中時採用對應的 `prefix[i]`（此情況不 `break`，允許被更明確的匹配覆蓋）。

其餘參數 `cwd`、`targetName`、`hasWorkspace`、`workspacePrefix` 目前保留供呼叫端傳入但不參與運算（介面相容性用途）。

## Configuration

本套件不自行讀取設定檔，輸入完全來自 `workspaces-config` 的解析結果；請在呼叫前先以專案根目錄的 `package.json` 之 `workspaces` 欄位建立 `workspacesConfig`：

```ts
import { parseStaticPackagesPaths } from 'workspaces-config';

const workspacesConfig = parseStaticPackagesPaths(rootPath);
```
