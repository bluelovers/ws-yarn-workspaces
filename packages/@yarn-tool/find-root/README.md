# @yarn-tool/find-root

尋找 Yarn workspace 根目錄的工具，提供路徑驗證、錯誤處理和斷言函數  
Find Yarn workspace root directory with path validation, error handling, and assertion functions

## 簡介 / Introduction

此模組提供尋找 Yarn workspace 根目錄的進階功能，包含路徑驗證、錯誤處理和斷言函數。它能夠自動偵測當前目錄是否位於 workspace 環境中，並返回完整的路徑資訊。

This module provides advanced functionality for finding Yarn workspace root directories, including path validation, error handling, and assertion functions. It can automatically detect whether the current directory is inside a workspace environment and return complete path information.

## 功能特色 / Features

- 🔍 **根目錄偵測 (Root Detection)** - 自動尋找 workspace 根目錄和套件根目錄
- ✅ **路徑驗證 (Path Validation)** - 提供多種斷言函數驗證 workspace 狀態
- ⚠️ **錯誤處理 (Error Handling)** - 支援自訂錯誤拋出行為
- 🔄 **延遲初始化 (Lazy Initialization)** - 提供方便的 `findRootLazy` 函數
- 📋 **模式匹配 (Pattern Matching)** - 列出符合套件路徑的 workspace 模式

## 安裝 / Install

```bash
yarn add @yarn-tool/find-root

yarn-tool add @yarn-tool/find-root

yt add @yarn-tool/find-root

pnpm add @yarn-tool/find-root

npm install @yarn-tool/find-root
```

## 使用方式 / Usage

### 基本用法 / Basic Usage

```typescript
import { findRoot, findRootLazy } from '@yarn-tool/find-root';

// 使用 findRootLazy（選項皆為可選）
// Using findRootLazy (all options are optional)
const rootData = findRootLazy();
console.log(rootData?.root); // 專案根目錄 / Project root
console.log(rootData?.ws);   // Workspace 根目錄 / Workspace root
console.log(rootData?.pkg);  // 套件根目錄 / Package root

// 使用 findRoot（需提供完整選項）
// Using findRoot (requires complete options)
const rootData2 = findRoot({
  cwd: process.cwd(),
  throwError: true,
});
```

### 返回值說明 / Return Value

```typescript
interface IFindRootReturnType {
  /** 當前工作目錄 / Current working directory */
  cwd: string;
  /** 當前套件的根目錄 / Current package root directory */
  pkg: string;
  /** Workspace 根目錄 / Workspace root directory */
  ws: string;
  /** 是否存在 workspace 配置 / Whether workspace configuration exists */
  hasWorkspace: boolean;
  /** 當前目錄是否為 workspace 根目錄 / Whether current directory is workspace root */
  isWorkspace: boolean;
  /** 專案根目錄 / Project root */
  root: string;
  /** 當前目錄是否為專案根目錄 / Whether current directory is project root */
  isRoot: boolean;
}
```

### 斷言函數 / Assertion Functions

```typescript
import { 
  assertHasWorkspaces, 
  assertNotWorkspacesRoot,
  assertHasAndNotWorkspacesRoot 
} from '@yarn-tool/find-root';

// 斷言當前目錄位於 workspace 內
// Assert that current directory is inside a workspace
assertHasWorkspaces(rootData);

// 斷言當前目錄不是 workspace 根目錄
// Assert that current directory is not workspace root
assertNotWorkspacesRoot(rootData);

// 組合斷言：位於 workspace 內但不是根目錄
// Combined assertion: inside workspace but not root
assertHasAndNotWorkspacesRoot(rootData);
```

### 列出 Workspace 模式 / List Workspace Patterns

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

### 選項說明 / Options

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
  /** 是否要求當前目錄不能是 workspace 根目錄 / Whether current directory should not be workspace root */
  shouldNotWorkspacesRoot?: boolean;
}
```

## API

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

斷言當前目錄位於 workspace 內。  
Assert that current directory is inside a workspace.

### `assertNotWorkspacesRoot(rootData)`

斷言當前目錄不是 workspace 根目錄。  
Assert that current directory is not workspace root.

### `assertHasAndNotWorkspacesRoot(rootData)`

組合斷言：位於 workspace 內但不是根目錄。  
Combined assertion: inside workspace but not root.

### `listMatchedPatternByPath(ws, pkg)`

列出符合指定路徑的 workspace 模式。  
List workspace patterns that match the specified path.

## 相關模組 / Related Modules

- [`find-yarn-workspace-root2`](https://www.npmjs.com/package/find-yarn-workspace-root2) - 尋找 yarn workspace 根目錄
- [`pkg-dir`](https://www.npmjs.com/package/pkg-dir) - 尋找最近的 package.json 目錄
- [`upath2`](https://www.npmjs.com/package/upath2) - 跨平台路徑處理

## 授權 / License

ISC

