# find-pkg-ws

> find yarn workspaces package.json
>
> 從任意目錄向上搜尋 (Find Up)，找到 Yarn workspaces 工作區 (Workspace) 根目錄下的 `package.json`。

[![npm version](https://badge.fury.io/js/find-pkg-ws.svg)](https://www.npmjs.com/package/find-pkg-ws)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## Features | 功能特色

- **向上搜尋 (Find Up)**：從指定目錄（預設為當前工作目錄）逐層向上尋找工作區根目錄
- **工作區感知 (Workspace-aware)**：底層使用 `find-yarn-workspace-root2`，可正確判斷是否位於 Yarn workspaces 專案中
- **輕量回傳 (Simple Result)**：找到回傳 `package.json` 的絕對路徑，找不到回傳 `null`，不拋出例外
- **多種呼叫方式 (Multiple Call Styles)**：支援預設匯出、命名空間與 CommonJS 直接呼叫

## Installation | 安裝

```bash
# Using yarn
yarn add find-pkg-ws

# Using yarn-tool
yarn-tool add find-pkg-ws

# Using yt (short for yarn-tool)
yt add find-pkg-ws

# Using npm
npm install find-pkg-ws
```

## Usage | 使用方式

```ts
const findPkg = require('find-pkg-ws');

// 從當前目錄向上搜尋 / Search upward from current directory
findPkg();

// 從指定目錄向上搜尋 / Search upward from a specific directory
findPkg('path of anywhere wanna search');

// 回傳值 / Return value
// => '/path/to/workspace/root/package.json'
// => null（找不到工作區 / when no workspace is found）
```

ESM / TypeScript：

```ts
import findPkg = require('find-pkg-ws');
```

## API Documentation | API 文件

### `findWorkspacePackageJson(cwd?)`

從 `cwd` 開始向上搜尋 Yarn workspace 根目錄，回傳該根目錄下 `package.json` 的絕對路徑。

Searches upward from `cwd` for the Yarn workspace root and returns the absolute path to `package.json` in that root.

| Parameter | Type | Description |
|-----------|------|-------------|
| `cwd` | `string` \| `undefined` | 起始搜尋目錄，未提供時使用 `process.cwd()` / Starting directory; defaults to `process.cwd()` when omitted |

**Return**: `string | null` — `package.json` 的絕對路徑；找不到工作區根目錄時回傳 `null`。  
Absolute path to `package.json`, or `null` when no workspace root is found.

> 本套件以 `export =` 匯出，因此 `require('find-pkg-ws')` 與 `require('find-pkg-ws').default` 為同一函式。  
> The package uses `export =`, so `require('find-pkg-ws')` and `require('find-pkg-ws').default` are the same function.

## Configuration | 設定

本套件沒有設定檔，行為完全由呼叫參數決定：

This package has no configuration file; behavior is controlled entirely by the call argument:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `cwd` | `string` | `process.cwd()` | 向上搜尋的起始目錄 / Directory where the upward search starts |

工作區的定義（例如 `package.json` 的 `workspaces` 欄位）由底層的 `find-yarn-workspace-root2` 與工作區設定決定，請參考其文件。  
The definition of a workspace (e.g. the `workspaces` field in `package.json`) is handled by the underlying `find-yarn-workspace-root2` and workspace config; see its documentation.

## Related Packages | 相關套件

- [npm-init2](https://www.npmjs.com/package/npm-init2)
- [create-yarn-workspaces](https://www.npmjs.com/package/create-yarn-workspaces)
- [workspaces-config](https://www.npmjs.com/package/workspaces-config)
- [keywords:workspaces](https://www.npmjs.com/search?q=keywords:workspaces)

## License | 授權

ISC
