# 路徑工具模組

---

## Table of Contents

1. [packages/find-yarn-workspace-root2](#1-packagesfind-yarn-workspace-root2)
2. [packages/find-pkg-ws](#2-packagesfind-pkg-ws)
3. [packages/@yarn-tool/find-root](#3-packagesyarn-toolfind-root) ⭐ 推薦使用
4. [packages/@yarn-tool/find-deps](#4-packagesyarn-toolfind-deps)
5. [packages/cache-path](#5-packagescache-path)

---

## 1. packages/find-yarn-workspace-root2

**Description / Description:** Algorithm for finding the root of a yarn workspace, extracted from yarnpkg.com

> ⚠️ **重要提示 / Important Notice:** 
> 
> **推薦使用 [`@yarn-tool/find-root`](#3-packagesyarn-toolfind-root) 取代此模組**
> 
> **Recommended to use [`@yarn-tool/find-root`](#3-packagesyarn-toolfind-root) instead of this module**
> 
> `@yarn-tool/find-root` 提供更完整的功能，包括：
> - 路徑驗證與錯誤處理
> - 斷言函數
> - 延遲初始化
> - 更詳細的返回資訊
> 
> `@yarn-tool/find-root` provides more complete features, including:
> - Path validation and error handling
> - Assertion functions
> - Lazy initialization
> - More detailed return information

### Updated Files

| File | Description |
|------|-------------|
| [`core.ts`](../packages/find-yarn-workspace-root2/core.ts) | Core functions for finding workspace root |
| [`index.ts`](../packages/find-yarn-workspace-root2/index.ts) | Module entry point|

### Exported Functions

| Function | Description |
|----------|-------------|
| `findWorkspaceRoot(initial?: string)` | Find the root directory of a yarn workspace |
| `checkWorkspaces(current: string, initial: string)` | Check if current directory is within workspaces |
| `isMatchWorkspaces(relativePath: string, workspaces: string[])` | Check if path matches workspace patterns |
| `extractWorkspaces(manifest)` | Extract workspaces configuration from package.json |
| `readPackageJSON(dir: string)` | Read and parse package.json file |

---

## 2. packages/find-pkg-ws

**Description:** Find yarn workspaces package.json

### Updated Files

| File | Description |
|------|-------------|
| [`index.ts`](../packages/find-pkg-ws/index.ts) | Main module for finding workspace package.json |

### Exported Functions

| Function | Description |
|----------|-------------|
| `findWorkspacePackageJson(cwd?: string)` | Find the package.json path of yarn workspace root |

---

## 3. packages/@yarn-tool/find-root ⭐

**Description:** 尋找 Yarn workspace 根目錄的工具，提供路徑驗證、錯誤處理和斷言函數

**English Description:** Find Yarn workspace root directory with path validation, error handling, and assertion functions

> 🌟 **為什麼選擇 @yarn-tool/find-root？ / Why choose @yarn-tool/find-root?**
> 
> 相比 `find-yarn-workspace-root2`，此模組提供：
> 
> Compared to `find-yarn-workspace-root2`, this module provides:
> 
> | 功能 / Feature | find-yarn-workspace-root2 | @yarn-tool/find-root |
> |---------------|---------------------------|---------------------|
> | 尋找 workspace 根目錄 / Find workspace root | ✅ | ✅ |
> | 尋找套件根目錄 / Find package root | ❌ | ✅ |
> | 返回完整路徑資訊 / Return complete path info | ❌ | ✅ |
> | 錯誤處理選項 / Error handling options | ❌ | ✅ |
> | 斷言函數 / Assertion functions | ❌ | ✅ |
> | 延遲初始化 / Lazy initialization | ❌ | ✅ |
> | Workspace 模式匹配 / Workspace pattern matching | ❌ | ✅ |

### Updated Files

| File | Description |
|------|-------------|
| [`index.ts`](../packages/@yarn-tool/find-root/index.ts) | Main module with all root finding functions |

### Interfaces

| Interface | Description |
|-----------|-------------|
| `IFindRootReturnType` | Return type for root finding functions, contains all path information and status flags |
| `IFindRootOptions` | Options for root finding functions |

### Exported Functions

| Function | Description |
|----------|-------------|
| `findRootLazy(options?, _throwError?)` | Find root with lazy initialization, all options are optional |
| `findRoot(options, _throwError?)` | Find root directory information with full options |
| `newFakeRootData(rootData, input)` | Create fake root data object for testing |
| `assertHasWorkspaces(rootData)` | Assert that current directory is inside a workspace |
| `assertNotWorkspacesRoot(rootData)` | Assert that current directory is not workspace root |
| `assertHasAndNotWorkspacesRoot(rootData)` | Combined assertion: inside workspace but not root |
| `listMatchedPatternByPath(ws, pkg)` | List workspace patterns that match the specified path |

### Migration Guide / 遷移指南

從 `find-yarn-workspace-root2` 遷移到 `@yarn-tool/find-root`：

Migrating from `find-yarn-workspace-root2` to `@yarn-tool/find-root`:

```typescript
// ❌ 舊的方式 / Old way
import { findWorkspaceRoot } from 'find-yarn-workspace-root2';
const root = findWorkspaceRoot('/path/to/dir');

// ✅ 新的方式 / New way (推薦 / Recommended)
import { findRoot, findRootLazy } from '@yarn-tool/find-root';

// 方式 1: 使用 findRootLazy（最簡單）
// Method 1: Using findRootLazy (simplest)
const rootData = findRootLazy();
console.log(rootData?.root);  // workspace 根目錄 / workspace root
console.log(rootData?.ws);    // workspace 根目錄 / workspace root
console.log(rootData?.pkg);   // 套件根目錄 / package root

// 方式 2: 使用 findRoot（更多控制）
// Method 2: Using findRoot (more control)
const rootData2 = findRoot({
  cwd: '/path/to/dir',
  throwError: true,  // 找不到時拋出錯誤 / throw error if not found
});
```

---

## 4. packages/@yarn-tool/find-deps

**Description:** Find dependency tree in workspaces

### Updated Files

| File | Description |
|------|-------------|
| [`index.ts`](../packages/@yarn-tool/find-deps/index.ts) | Module entry point |
| [`lib/find.ts`](../packages/@yarn-tool/find-deps/lib/find.ts) | Functions for finding dependencies |
| [`lib/find-up.ts`](../packages/@yarn-tool/find-deps/lib/find-up.ts) | Functions for finding upward dependencies |

### Exported Functions

| Function | Description |
|----------|-------------|
| `findDepsAllDeep(cwd, options?)` | Find all dependencies recursively |
| `findDepsDeep(cwd, options?)` | Find dependencies with depth control |
| `findUpDepsAllDeep(cwd, options?)` | Find all upward dependencies recursively |

---

## 5. packages/cache-path

**Description:** Return a cache directory, like `find-cache-dir` does

### Updated Files

| File | Description |
|------|-------------|
| [`index.ts`](../packages/cache-path/index.ts) | Module entry point |
| [`lib/getCachePath.ts`](../packages/cache-path/lib/getCachePath.ts) | Main cache path functions |
| [`lib/getCacheRoot.ts`](../packages/cache-path/lib/getCacheRoot.ts) | Cache root functions |
| [`lib/normalizeName.ts`](../packages/cache-path/lib/normalizeName.ts) | Name normalization function |
| [`lib/finder/findNpmCachePath.ts`](../packages/cache-path/lib/finder/findNpmCachePath.ts) | NPM cache path finder |
| [`lib/finder/findYarnCachePath.ts`](../packages/cache-path/lib/finder/findYarnCachePath.ts) | Yarn cache path finder |
| [`lib/finder/findPkgModuleCachePath.ts`](../packages/cache-path/lib/finder/findPkgModuleCachePath.ts) | Package module cache path finder |
| [`lib/finder/findOSTempPath.ts`](../packages/cache-path/lib/finder/findOSTempPath.ts) | OS temp path finder |

### Exported Functions

| Function | Description |
|----------|-------------|
| `getCachePath(name?, options?)` | Get cache directory path (sync) |
| `getCachePathAsync(name?, options?)` | Get cache directory path (async) |
| `getCacheRoot(options?)` | Get cache root directory (sync) |
| `getCacheRootAsync(options?)` | Get cache root directory (async) |
| `normalizeName(name, hash?)` | Normalize package name for cache path |
| `findNpmCachePath(cwd?, processEnv?)` | Find NPM cache directory |
| `findYarnCachePath(cwd?, processEnv?)` | Find Yarn cache directory |
| `findPkgModuleCachePath(cwd?)` | Find package module cache directory |
| `findPkgModulePath(cwd?)` | Find package module path |
| `findOSTempPath(cwd?, processEnv?)` | Find OS temporary directory |

---

## Related Links

- [analyze-code-commenter Skill](https://github.com/bluelovers/ws-yarn-workspaces/tree/master/skills/analyze-code-commenter)
- [Conventional Commits](https://conventionalcommits.org/)

---

*Last updated: 2026-02-19*
