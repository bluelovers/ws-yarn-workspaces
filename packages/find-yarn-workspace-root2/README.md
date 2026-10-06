# find-yarn-workspace-root2

[![Build Status](https://travis-ci.org/square/find-yarn-workspace-root.svg?branch=master)](https://travis-ci.org/square/find-yarn-workspace-root)

用於尋找 Yarn workspace 根目錄 (Workspace Root) 的演算法，擷取自 yarnpkg.com，並加強為 `find-yarn-workspace-root` 的增強版本。

當前版本：`1.2.55`

## Features

- 從指定目錄（預設為當前工作目錄）向上遍歷 (Traverse) 目錄樹，找出宣告 `workspaces` 的 `package.json` 所在目錄
- 同時支援 Yarn workspaces 的兩種配置格式：陣列格式與物件格式
- 使用 [micromatch](https://github.com/micromatch/micromatch) 進行 glob 模式 (Pattern) 匹配，確認起始目錄確實落在 workspace 範圍內
- 找不到 workspace 根目錄時回傳 `null`，不會丟出例外
- 演算法改編自 Yarn 原始碼，行為與 Yarn 官方判斷一致
- 提供同步 API，並附帶 `readPackageJSON`、`extractWorkspaces`、`isMatchWorkspaces` 等輔助函式

## Installation

```bash
yarn add find-yarn-workspace-root2
```

或使用 npm：

```bash
npm install find-yarn-workspace-root2
```

## Usage

```js
const findWorkspaceRoot = require('find-yarn-workspace-root2');

const workspaceRoot = findWorkspaceRoot(__dirname); // Absolute path or null
```

在 TypeScript 中也可直接匯入具名函式：

```ts
import { findWorkspaceRoot } from 'find-yarn-workspace-root2/core';

findWorkspaceRoot('/path/to/project');
```

若起始目錄本身即為 workspace 根目錄，會回傳該目錄的絕對路徑；若起始目錄不屬於任何 workspace，則回傳 `null`。

## API Documentation

### findWorkspaceRoot(initial?: string): string | null

主入口函式，從 `initial` 開始向上尋找 workspace 根目錄。

| 參數 | 型別 | 說明 |
| --- | --- | --- |
| `initial` | `string?` | 起始搜尋目錄，未提供時使用 `process.cwd()` |

| 回傳值 | 說明 |
| --- | --- |
| `string` | workspace 根目錄的絕對路徑 |
| `null` | 找不到 `package.json`，或路徑不符合 `workspaces` 模式 |

### 其他輔助 API（自 `find-yarn-workspace-root2/core` 匯入）

| 函式 | 說明 |
| --- | --- |
| `checkWorkspaces(current, initial)` | 檢查 `current` 是否為有效的 workspace 根目錄，回傳 `{ done, found, relativePath }` |
| `isMatchWorkspaces(relativePath, workspaces)` | 判斷相對路徑是否符合 `workspaces` 的 glob 模式，回傳 `boolean` |
| `extractWorkspaces(manifest)` | 自 `package.json` 內容中取出 `workspaces` 的 `packages` 陣列，無配置時回傳 `null` |
| `readPackageJSON(dir)` | 讀取並解析指定目錄下的 `package.json`，檔案不存在時回傳 `null` |

這些輔助函式同時被附加為 `findWorkspaceRoot` 的靜態屬性，例如 `findWorkspaceRoot.extractWorkspaces(manifest)`。

## Configuration

本套件本身沒有需設定的選項，行為完全取決於目標專案 `package.json` 的 `workspaces` 設定。

Yarn 支援兩種格式，本套件皆可辨識：

```json
{
  "workspaces": ["packages/*"]
}
```

```json
{
  "workspaces": {
    "packages": ["packages/*"]
  }
}
```

判斷流程：

1. 自起始目錄向上尋找最近的 `package.json`
2. 讀取該 `package.json` 的 `workspaces` 設定
3. 若無 `workspaces` 設定，繼續往父目錄查找；已到達檔案系統根目錄則回傳 `null`
4. 若有 `workspaces` 設定，計算起始目錄相對該目錄的路徑並進行 glob 匹配
5. 路徑為空（同一目錄）或匹配成功即回傳該目錄，否則回傳 `null`

更多相關工具的比較與遷移方式，請參閱 [docs/find-path-tools.md](../docs/find-path-tools.md)。

## Contributing

Contributions are welcome! Just clone this repository and install the dependencies:

```bash
git clone https://github.com/square/find-yarn-workspace-root.git
cd find-yarn-workspace-root
yarn
```

Note that you'll need `node` and `yarn` installed. Next, verify the tests all pass:

```bash
yarn test
```

Then create a branch for your bugfix/feature, make changes and update the tests, and submit a pull request. Please do not change the version in `package.json` when submitting a pull request. We determine the next version automatically based on the commits since the last release.

> *NOTE*: Commit messages follow the [Angular commit message guidelines](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits).

## Releases

Releases are handled by Travis CI once a build succeeds on `master`. To trigger a release, bump the version using `standard-version`:

```bash
$(yarn bin)/standard-version
```

That should update the CHANGELOG, bump the version in `package.json`, and create a git tag. Then, just `git push && git push --tags`.

---
Copyright 2017 Square, Inc.
