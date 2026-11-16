# @yarn-tool/find-root

尋找 Monorepo workspace 根目錄與最近套件根目錄的工具，提供路徑驗證、錯誤處理和斷言函數
Find Monorepo workspace root and nearest package root with path validation, error handling, and assertion functions

## Introduction

此模組提供尋找 Monorepo workspace 根目錄與最近套件根目錄的進階功能，包含路徑驗證、錯誤處理和斷言函數。它能夠自動偵測 cwd 是否位於 workspace 環境中，並返回完整的路徑資訊。

This module provides advanced functionality for finding Monorepo workspace root directories and the nearest package root, including path validation, error handling, and assertion functions. It can automatically detect whether cwd is inside a workspace environment and return complete path information.

## Features

- 🔍 **根目錄偵測 (Root Detection)** - 自動尋找 workspace 根目錄和套件根目錄
- ✅ **路徑驗證 (Path Validation)** - 提供多種斷言函數驗證 workspace 狀態
- ⚠️ **錯誤處理 (Error Handling)** - 支援自訂錯誤拋出行為
- 🔄 **延遲初始化 (Lazy Initialization)** - 提供方便的 `findRootLazy` 函數
- 📋 **模式匹配 (Pattern Matching)** - 列出符合套件路徑的 workspace 模式

## Install

```bash
yarn add @yarn-tool/find-root

yarn-tool add @yarn-tool/find-root

yt add @yarn-tool/find-root

pnpm add @yarn-tool/find-root

npm install @yarn-tool/find-root
```

## Usage

### Basic Usage

```typescript
import { findRoot, findRootLazy } from '@yarn-tool/find-root';

// 使用 findRootLazy（選項皆為可選）
// Using findRootLazy (all options are optional)
const rootData = findRootLazy();
console.log(rootData?.root); // 專案根目錄 / Project root
console.log(rootData?.ws);   // Workspace 根目錄 / Workspace root
console.log(rootData?.pkg);  // cwd 往上最近的套件根目錄 / Nearest package root above cwd

// 使用 findRoot（需提供完整選項）
// Using findRoot (requires complete options)
const rootData2 = findRoot({
  cwd: process.cwd(),
  throwError: true,
});
```

### Return Value

```typescript
interface IFindRootReturnType {
  /** 當前工作目錄（傳入的路徑） / Current working directory (the given input path) */
  cwd: string;
  /** cwd 往上最近的套件根目錄 / Nearest package root directory found above cwd */
  pkg: string;
  /** Workspace 根目錄 / Workspace root directory */
  ws: string;
  /** cwd 是否位於 workspace 內 / Whether cwd is located inside a workspace */
  hasWorkspace: boolean;
  /** 最近的套件根目錄是否為 workspace 根目錄 / Whether the nearest package root is the workspace root */
  isWorkspace: boolean;
  /** 專案根目錄（workspace 根目錄優先，否則為最近的套件根目錄） / Project root (workspace root if present, otherwise package root) */
  root: string;
  /** 最近的套件根目錄是否為專案根目錄 / Whether the nearest package root is the project root */
  isRoot: boolean;
  /** 最近的套件根目錄存在且不是 workspace 根目錄 / Whether the nearest package root exists and is not the workspace root */
  isPkg: boolean;
}
```

### Assertion Functions

```typescript
import {
  assertHasWorkspaces,
  assertNotWorkspacesRoot,
  assertHasAndNotWorkspacesRoot
} from '@yarn-tool/find-root';

// 斷言 cwd 位於 workspace 內
// Assert that cwd is inside a workspace
assertHasWorkspaces(rootData);

// 斷言最近的套件根目錄不是 workspace 根目錄
// Assert that the nearest package root is not the workspace root
assertNotWorkspacesRoot(rootData);

// 組合斷言：cwd 位於 workspace 內，且最近的套件根目錄不是 workspace 根目錄
// Combined assertion: cwd inside workspace, and the nearest package root is not the workspace root
assertHasAndNotWorkspacesRoot(rootData);
```

### List Workspace Patterns

```typescript
import { listMatchedPatternByPath } from '@yarn-tool/find-root';

// 列出符合套件路徑的 workspace 模式
// List workspace patterns that match the package path
const patterns = listMatchedPatternByPath(
  '/workspace/root',           // Workspace 根目錄 / Workspace root
  '/workspace/root/packages/a' // 套件目錄 / Package directory
);
console.log(patterns); // ['packages/*']
```

## Configuration

`findRoot` 與 `findRootLazy` 透過 `IFindRootOptions` 介面設定行為，以下為可用選項：

```typescript
interface IFindRootOptions {
  /** 當前工作目錄 / Current working directory */
  cwd: string;
  /** 是否跳過 workspace 檢查 / Whether to skip workspace check */
  skipCheckWorkspace?: boolean | string;
  /** 找不到時是否拋出錯誤 / Whether to throw error when not found */
  throwError?: boolean;
  /** 是否要求必須有 workspace 配置 / Whether workspace configuration is required */
  shouldHasWorkspaces?: boolean;
  /** 是否要求最近的套件根目錄不能是 workspace 根目錄 / Whether the nearest package root should not be the workspace root */
  shouldNotWorkspacesRoot?: boolean;
}
```

## API Documentation

### `findRoot(options, _throwError?)`

尋找 Yarn workspace 根目錄的核心函數。
Core function for finding Yarn workspace root directory.

### `findRootLazy(options?, _throwError?)`

延遲初始化版本，選項參數皆為可選。
Lazy initialization version with all options being optional.

### `newFakeRootData(rootData, input)`

建立虛擬的根目錄資料物件。
Create a fake root data object.

### `assertHasWorkspaces(rootData)`

斷言 cwd 位於 workspace 內（且有找到套件根目錄）。
Assert that cwd is inside a workspace (and a package root was found).

### `assertNotWorkspacesRoot(rootData)`

斷言最近的套件根目錄不是 workspace 根目錄。
Assert that the nearest package root is not the workspace root.

### `assertHasAndNotWorkspacesRoot(rootData)`

組合斷言：cwd 位於 workspace 內，且最近的套件根目錄不是 workspace 根目錄。
Combined assertion: cwd inside workspace, and the nearest package root is not the workspace root.

### `listMatchedPatternByPath(ws, pkg)`

列出符合指定路徑的 workspace 模式。
List workspace patterns that match the specified path.

## Related Modules

- [docs/find-path-tools.md](../../../docs/find-path-tools.md) - 路徑尋找工具總覽與遷移指南 / Overview and migration guide for path-finding tools
- [`find-yarn-workspace-root2`](https://www.npmjs.com/package/find-yarn-workspace-root2) - 尋找 Monorepo workspace 根目錄
- [`pkg-dir`](https://www.npmjs.com/package/pkg-dir) - 尋找最近的 package.json 目錄
- [`upath2`](https://www.npmjs.com/package/upath2) - 跨平台路徑處理
