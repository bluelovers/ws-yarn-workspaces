# @yarn-tool/ws-find-up-paths

在工作區環境中向上搜尋檔案或目錄的工具  
Find files or directories by walking up parent directories in workspace environments

## 簡介 / Introduction

此模組結合 `find-up-paths` 與 yarn workspaces 功能，提供在工作區環境中向上搜尋檔案或目錄的能力。它會自動偵測工作區根目錄，並限制搜尋範圍不超過工作區邊界。

This module combines `find-up-paths` with yarn workspaces functionality, providing the ability to search upward for files or directories in a workspace environment. It automatically detects the workspace root and limits the search scope within workspace boundaries.

## 功能特色 / Features

- 🔄 **工作區感知 (Workspace-aware)** - 自動偵測工作區根目錄，限制搜尋範圍
- 📁 **向上搜尋 (Find Up)** - 從當前目錄向上遍歷父層目錄
- ⚡ **同步/非同步支援 (Sync/Async Support)** - 提供同步與非同步兩種 API
- 🎯 **靈活選項 (Flexible Options)** - 支援忽略當前套件或從套件目錄開始搜尋

## 安裝 / Install

```bash
yarn add @yarn-tool/ws-find-up-paths

yarn-tool add @yarn-tool/ws-find-up-paths

yt add @yarn-tool/ws-find-up-paths

pnpm add @yarn-tool/ws-find-up-paths

npm install @yarn-tool/ws-find-up-paths
```

## 使用方式 / Usage

### 基本用法 / Basic Usage

```typescript
import { findUpPathsWorkspaces } from '@yarn-tool/ws-find-up-paths';

// 搜尋 package.json 檔案
// Search for package.json file
const result = findUpPathsWorkspaces('package.json');
console.log(result);
// { stat: Stats, result: '/path/to/package.json' }
```

### 非同步版本 / Async Version

```typescript
import { findUpPathsWorkspacesAsync } from '@yarn-tool/ws-find-up-paths';

// 非同步搜尋
// Async search
const result = await findUpPathsWorkspacesAsync(['package.json', 'package-lock.json']);
console.log(result);
```

### 取得所有父層路徑 / Get All Parent Paths

```typescript
import { pathParentsWorkspaces } from '@yarn-tool/ws-find-up-paths';

// 取得從當前目錄到工作區根目錄的所有父層路徑
// Get all parent paths from current directory to workspace root
const paths = pathParentsWorkspaces();
console.log(paths);
// ['/path/to/current', '/path/to/parent', '/path/to/workspace-root']
```

### 選項說明 / Options

```typescript
interface IOptionsFindUpPathsWorkspaces {
  /**
   * 是否忽略當前套件目錄
   * Whether to ignore the current package directory
   */
  ignoreCurrentPackage?: boolean;
  
  /**
   * 是否從當前套件目錄開始搜尋
   * Whether to start searching from the current package directory
   */
  startFromCurrentPackage?: boolean;
  
  // 繼承自 find-up-paths 的選項
  // Options inherited from find-up-paths
  cwd?: string;
  includeCurrentDirectory?: boolean;
  stopPath?: string | string[];
  onlyFiles?: boolean;
  onlyDirectories?: boolean;
}
```

## API

### `findUpPathsWorkspaces(pattern, opts?)`

同步搜尋符合條件的檔案或目錄。  
Synchronously search for files or directories matching the pattern.

### `findUpPathsWorkspacesAsync(pattern, opts?)`

非同步搜尋符合條件的檔案或目錄。  
Asynchronously search for files or directories matching the pattern.

### `pathParentsWorkspaces(cwd?, opts?)`

取得從當前目錄到工作區根目錄的所有父層路徑。  
Get all parent paths from current directory to workspace root.

### `handleOptions(cwd?, opts?)`

處理選項並返回執行時期物件。  
Process options and return runtime object.

## 相關模組 / Related Modules

- [`find-up-paths`](https://www.npmjs.com/package/find-up-paths) - 向上搜尋路徑的核心功能
- [`@yarn-tool/find-root`](https://www.npmjs.com/package/@yarn-tool/find-root) - 尋找工作區根目錄
- [`path-parents`](https://www.npmjs.com/package/path-parents) - 取得父層路徑

## 授權 / License

ISC

