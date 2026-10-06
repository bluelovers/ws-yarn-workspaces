# @yarn-tool/find-tsconfig

尋找目前套件或 workspace 範圍內的 tsconfig.json，並確保結果位於專案路徑下  
Find tsconfig.json within the current package or workspace, ensuring the result stays inside the project path

## 簡介 / Introduction

此模組提供 `findTsconfig` 函數，用來從指定目錄尋找最近的 `tsconfig.json` 檔案。
與單純的 `tsconfig` 套件不同，它會先透過 [`@yarn-tool/find-root`](../find-root/README.md) 取得套件根目錄 (Package Root) 與 workspace 根目錄 (Workspace Root)，再驗證找到的檔案確實位於專案路徑範圍內，避免誤用上層目錄或其他專案的設定檔。

This module provides the `findTsconfig` function to locate the nearest `tsconfig.json` from a given directory.
Unlike the plain `tsconfig` package, it first obtains the package root and workspace root via [`@yarn-tool/find-root`](../find-root/README.md), then verifies that the found file lies inside the project path, avoiding accidental use of a parent directory's or another project's config.

## 功能特色 / Features

- 🔍 **範圍限制的尋找 (Scoped Lookup)** - 只接受位於目前套件或 workspace 內的 `tsconfig.json`
- 🧩 **Workspace 感知 (Workspace Aware)** - 支援 monorepo 中套件與 workspace 根目錄的判斷
- 🔗 **符號連結處理 (Symlink Handling)** - 找不到時改用 `realpathSync` 解析真實路徑後再次嘗試
- 📦 **預設匯出 (Default Export)** - `findTsconfig` 同時為預設匯出，方便直接引入

## 安裝 / Install

```bash
yarn add @yarn-tool/find-tsconfig

yarn-tool add @yarn-tool/find-tsconfig
yt add @yarn-tool/find-tsconfig

pnpm add @yarn-tool/find-tsconfig

npm install @yarn-tool/find-tsconfig
```

## 使用方式 / Usage

```typescript
import findTsconfig from '@yarn-tool/find-tsconfig';

// 尋找目前目錄範圍內的 tsconfig.json
// Find tsconfig.json within the current directory scope
const file = findTsconfig(process.cwd());

console.log(file);
// 例：/path/to/project/tsconfig.json
// e.g. /path/to/project/tsconfig.json
```

若找不到位於專案範圍內的 `tsconfig.json`，函數會返回 `undefined`。  
If no `tsconfig.json` inside the project scope is found, the function returns `undefined`.

## API 文件 / API Documentation

### `findTsconfig(cwd)`

從 `cwd` 開始尋找最近的 `tsconfig.json`，並確認其位於目前套件或 workspace 路徑內。  
Searches for the nearest `tsconfig.json` from `cwd`, ensuring it lies within the current package or workspace path.

| 參數 / Parameter | 型別 / Type | 說明 / Description |
| --- | --- | --- |
| `cwd` | `string` | 起始搜尋目錄 / Starting search directory |

**回傳值 (Returns)**：`string | undefined` — 已標準化 (Normalized) 的 `tsconfig.json` 路徑；若超出專案範圍或找不到則為 `undefined`。

### 預設匯出 / Default Export

`export default findTsconfig` 與具名匯出為同一函數。  
The default export is the same function as the named export.

## 設定 / Configuration

本模組本身沒有額外設定選項，搜尋行為由傳入的 `cwd` 決定；  
專案的 TypeScript 設定請參閱根目錄的 `tsconfig.json`，或各套件內的 `tsconfig.json`。

This module has no additional configuration options; the lookup behavior is determined by the passed `cwd`.
For TypeScript configuration, see the root `tsconfig.json` or each package's own `tsconfig.json`.

## 相關模組 / Related Modules

- [docs/find-path-tools.md](../../../docs/find-path-tools.md) - 路徑尋找工具總覽與遷移指南 / Overview and migration guide for path-finding tools
- [`@yarn-tool/find-root`](../find-root/README.md) - 尋找 Yarn workspace 根目錄 / Find Yarn workspace root directory
- [`tsconfig`](https://www.npmjs.com/package/tsconfig) - 底層的 tsconfig 搜尋實作 / Underlying tsconfig search implementation
