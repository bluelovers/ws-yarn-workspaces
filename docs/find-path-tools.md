# 路徑工具模組

---

## Table of Contents

1. [packages/find-yarn-workspace-root2](#1-packagesfind-yarn-workspace-root2)
2. [packages/find-pkg-ws](#2-packagesfind-pkg-ws)
3. [packages/@yarn-tool/find-root](#3-packagesyarn-toolfind-root) ⭐ 推薦使用
4. [packages/@yarn-tool/find-deps](#4-packagesyarn-toolfind-deps)
5. [packages/cache-path](#5-packagescache-path)
6. [packages/@yarn-tool/fnm-detect](#6-packagesyarn-toolfnm-detect)
7. [packages/@yarn-tool/get-paths-by-type](#7-packagesyarn-toolget-paths-by-type)
8. [packages/@yarn-tool/get-pkg-bin](#8-packagesyarn-toolget-pkg-bin)
9. [packages/@yarn-tool/require-resolve](#9-packagesyarn-toolrequire-resolve)
10. [packages/@yarn-tool/resolve-package](#10-packagesyarn-toolresolve-package)
11. [packages/@yarn-tool/ws-find-up-paths](#11-packagesyarn-toolws-find-up-paths)
12. [packages/@yarn-tool/find-tsconfig](#12-packagesyarn-toolfind-tsconfig)
13. [packages/@yarn-tool/check-pkg-bin](#13-packagesyarn-toolcheck-pkg-bin)
14. [packages/up-require](#14-packagesup-require)

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

## 6. packages/@yarn-tool/fnm-detect

**Description:** fnm (Fast Node Manager) 環境偵測模組

**English Description:** fnm (Fast Node Manager) environment detection module

> 🔧 **功能特點 / Key Features:**
> - 偵測當前 Node.js 是否在 fnm 管理的環境中執行
> - 支援兩種偵測方法：execPath 和環境變數
> - 提取 fnm 相關路徑資訊（FNM_DIR、multishell 路徑等）

### Updated Files

| File | Description |
|------|-------------|
| [`index.ts`](../packages/@yarn-tool/fnm-detect/index.ts) | Main module with all fnm detection functions |

### Interfaces

| Interface | Description |
|-----------|-------------|
| `IDetectFnmByEnv` | Environment variables type for fnm detection |
| `IDetectFnmByExecPathResult` | Detection result from execPath method |
| `IDetectFnmByEnvResult` | Detection result from environment variables method |
| `IDetectFnmByAllResult` | Combined detection result from all methods |

### Exported Functions

| Function | Description |
|----------|-------------|
| `detectFnmByExecPath(execPath?, nodeVersion?)` | Detect fnm environment via process.execPath |
| `detectFnmByEnv(env?, nodeVersion?)` | Detect fnm environment via environment variables |
| `detectFnmByAll(pc?)` | Detect fnm using both execpath and env methods |
| `detectFnmPathType(normalizedFnmPath, inDeep?)` | Detect fnm path type (multishells/aliases/node-versions) |
| `isFNM()` | Simple check if current process is running under fnm |
| `toFnmPath(fnmPathType)` | Build fnm path based on path type |

---

## 7. packages/@yarn-tool/get-paths-by-type

**Description:** 根據類型 Symbol 取得對應路徑陣列的工具

**English Description:** Utility to get corresponding path array based on type Symbol

> 🔧 **功能特點 / Key Features:**
> - 使用 Symbol 定義路徑類型
> - 支援當前目錄、全域 Npm/Yarn 套件目錄、主模組路徑
> - 整合 fnm 環境偵測

### Updated Files

| File | Description |
|------|-------------|
| [`index.ts`](../packages/@yarn-tool/get-paths-by-type/index.ts) | Main module with path type utilities |

### Exported Symbols

| Symbol | Description |
|--------|-------------|
| `SymbolCurrentDirectory` | Symbol for current directory |
| `SymbolGlobal` | Symbol for global paths (Yarn + Npm) |
| `SymbolGlobalNpm` | Symbol for global Npm path |
| `SymbolGlobalYarn` | Symbol for global Yarn path |
| `SymbolModuleMain` | Symbol for main module path |

### Exported Functions

| Function | Description |
|----------|-------------|
| `getPathsByType(valueType, cwd?)` | Get corresponding path array based on type Symbol |

---

## 8. packages/@yarn-tool/get-pkg-bin

**Description:** 從 package.json 取得 bin 腳本路徑的工具庫

**English Description:** Utility for getting bin script paths from package.json

> 🔧 **功能特點 / Key Features:**
> - 從 package.json 的 bin 欄位取得所有 bin 腳本
> - 解析為絕對路徑
> - 支援 includeGlobal、includeCurrentDirectory、cwd 選項

### Updated Files

| File | Description |
|------|-------------|
| [`index.ts`](../packages/@yarn-tool/get-pkg-bin/index.ts) | Main module with bin path functions |
| [`lib/types.ts`](../packages/@yarn-tool/get-pkg-bin/lib/types.ts) | Type definitions |
| [`util.ts`](../packages/@yarn-tool/get-pkg-bin/util.ts) | Utility functions |

### Exported Functions

| Function | Description |
|----------|-------------|
| `normalizePackageBins(options)` | Normalize package bin script paths to absolute paths |
| `defaultPackageBin(options, defaultKey?)` | Get the default bin script path of a package |
| `getPackageBins(pkg)` | Extract bin entries from package.json |
| `handlePackageBins(bins, resolveFn?)` | Process bin entries with optional resolver |
| `firstPackageBin(bins)` | Get first bin entry from bins object |

---

## 9. packages/@yarn-tool/require-resolve

**Description:** 擴充版 require.resolve，支援在額外路徑中搜尋模組

**English Description:** An extended require.resolve with support for searching modules in extra paths

> 🔧 **功能特點 / Key Features:**
> - 支援在全域路徑（Yarn/Npm）中搜尋模組
> - 支援在當前目錄中搜尋
> - 提供載入模組和讀取 package.json 的功能

### Updated Files

| File | Description |
|------|-------------|
| [`index.ts`](../packages/@yarn-tool/require-resolve/index.ts) | Module entry point |
| [`lib/core.ts`](../packages/@yarn-tool/require-resolve/lib/core.ts) | Core resolve functions |
| [`lib/loader.ts`](../packages/@yarn-tool/require-resolve/lib/loader.ts) | Module loader functions |
| [`lib/package.ts`](../packages/@yarn-tool/require-resolve/lib/package.ts) | Package resolution functions |
| [`lib/types.ts`](../packages/@yarn-tool/require-resolve/lib/types.ts) | Type definitions |
| [`lib/util.ts`](../packages/@yarn-tool/require-resolve/lib/util.ts) | Utility functions |
| [`lib/error.ts`](../packages/@yarn-tool/require-resolve/lib/error.ts) | Error handling |

### Exported Functions

| Function | Description |
|----------|-------------|
| `requireResolveCore(request, options)` | Core require.resolve function |
| `requireResolveExtra(request, options?)` | Extended require.resolve with extra paths support |
| `buildResolvePaths(options)` | Build resolve paths from options |
| `requireExtra(request, options?)` | Require module with extra paths |
| `importExtra(request, options?)` | Import module with extra paths |
| `tryRequireExtra(request, options?)` | Try to require module, return null if not found |
| `tryImportExtra(request, options?)` | Try to import module, return null if not found |
| `resolvePackageCore(request, options?)` | Resolve package root and package.json location |
| `resolvePackageRoot(request, options?)` | Resolve package root directory |
| `resolvePackageJsonLocation(request, options?)` | Resolve package.json location |
| `readModulePackageJson(request, options?)` | Read package.json of a module |

---

## 10. packages/@yarn-tool/resolve-package

**Description:** 套件解析模組 - 重新匯出 @yarn-tool/require-resolve 的套件解析功能

**English Description:** Package resolution module - Re-exports package resolution functions from @yarn-tool/require-resolve

> ⚠️ **注意 / Notice:**
> 
> 此模組為 `@yarn-tool/require-resolve` 的別名套件，提供更簡潔的匯入路徑。
> This module is an alias package for `@yarn-tool/require-resolve`, providing a cleaner import path.

### Updated Files

| File | Description |
|------|-------------|
| [`index.ts`](../packages/@yarn-tool/resolve-package/index.ts) | Module entry point (re-exports) |

### Exported Functions

| Function | Description |
|----------|-------------|
| `resolvePackageCore(request, options?)` | Resolve package root and package.json location |
| `resolvePackageRoot(request, options?)` | Resolve package root directory |
| `resolvePackageJsonLocation(request, options?)` | Resolve package.json location |
| `readModulePackageJson(request, options?)` | Read package.json of a module |
| `resolvePackage(request, options?)` | Resolve package with full information |

---

## 11. packages/@yarn-tool/ws-find-up-paths

**Description:** 在工作區環境中向上搜尋檔案或目錄的模組

**English Description:** Module for finding up paths in workspaces environment

> 🔧 **功能特點 / Key Features:**
> - 結合 find-up-paths 與 yarn workspaces 功能
> - 支援在工作區範圍內向上搜尋
> - 提供同步和非同步版本

### Updated Files

| File | Description |
|------|-------------|
| [`index.ts`](../packages/@yarn-tool/ws-find-up-paths/index.ts) | Main module with workspace find-up functions |

### Interfaces

| Interface | Description |
|-----------|-------------|
| `IOptionsFindUpPathsWorkspaces` | Options for workspace find-up |
| `IRuntimeFindUpPathsWorkspaces` | Runtime interface for workspace find-up |

### Exported Functions

| Function | Description |
|----------|-------------|
| `findUpPathsWorkspaces(pattern, opts?)` | Find up paths matching pattern in workspace (sync) |
| `findUpPathsWorkspacesAsync(pattern, opts?)` | Find up paths matching pattern in workspace (async) |
| `pathParentsWorkspaces(cwd?, opts?)` | Get all parent paths in workspace |
| `handleOptions(cwd?, opts?)` | Handle options for workspace find-up |

---

## 12. packages/@yarn-tool/find-tsconfig

**Description:** 在工作區範圍內尋找 tsconfig.json 的模組

**English Description:** Module for finding tsconfig.json within workspace scope

> 🔧 **功能特點 / Key Features:**
> - 只允許在當前套件或工作區路徑內尋找
> - 確保返回的 tsconfig.json 路徑是有效的

### Updated Files

| File | Description |
|------|-------------|
| [`index.ts`](../packages/@yarn-tool/find-tsconfig/index.ts) | Main module for finding tsconfig |

### Exported Functions

| Function | Description |
|----------|-------------|
| `findTsconfig(cwd)` | Find tsconfig.json within current package/workspace path |

---

## 13. packages/@yarn-tool/check-pkg-bin

**Description:** 檢查套件 bin 腳本是否有 shebang 的工具

**English Description:** Utility for checking if package bin scripts have shebang

> 🔧 **功能特點 / Key Features:**
> - 檢查 bin 腳本是否存在 shebang
> - 支援檢查單一套件或整個工作區
> - 返回驗證結果供後續處理

### Updated Files

| File | Description |
|------|-------------|
| [`index.ts`](../packages/@yarn-tool/check-pkg-bin/index.ts) | Module entry point |
| [`lib/core.ts`](../packages/@yarn-tool/check-pkg-bin/lib/core.ts) | Core check functions |
| [`lib/pkg.ts`](../packages/@yarn-tool/check-pkg-bin/lib/pkg.ts) | Package-level check functions |
| [`lib/ws.ts`](../packages/@yarn-tool/check-pkg-bin/lib/ws.ts) | Workspace-level check functions |

### Exported Functions

| Function | Description |
|----------|-------------|
| `checkPkgDir(pkgDir?)` | Check bin scripts in a package directory |
| `checkPkgJson(pkg, cwd)` | Check bin scripts from package.json object |
| `checkFile(file)` | Check if a file has shebang |
| `hasShebang(buf)` | Check if content has shebang |
| `checkWorkspaces(cwd?)` | Check bin scripts in all workspace packages |

---

## 14. packages/up-require

**Description:** 從最上層父模組向上搜尋並 require 模組的工具

**English Description:** Utility for requiring modules by searching upward from the top parent module

> 🔧 **功能特點 / Key Features:**
> - 從 Node.js 模組樹的最上層開始向下搜尋並 require 模組
> - 支援從父模組向上搜尋
> - 提供取得模組快取、根據 exports 或檔案路徑查找模組的功能

### Updated Files

| File | Description |
|------|-------------|
| [`index.ts`](../packages/up-require/index.ts) | Main module with all up-require functions |

### Interfaces

| Interface | Description |
|-----------|-------------|
| `IErrnoException` | Extended error interface with module information |
| `INodeModule<T>` | Extended NodeModule interface with typed exports |
| `INodeRequireCache` | Type for require.cache |

### Exported Functions

| Function | Description |
|----------|-------------|
| `requireFromTopParent<T>(id, startModule?)` | Require package module from highest module |
| `upRequire<T>(id, startModule?)` | Alias for requireFromTopParent |
| `requireUp<T>(id, startModule?)` | Alias for requireFromTopParent |
| `requireParent<T>(id, startModule)` | Require package module by parent module require |
| `requireFromParentUp<T>(id, startModule?)` | Require package module start from parent module |
| `getAllModule(startModule?)` | Get all module and parents by start module |
| `requireFromModuleList<T>(id, ls, startModule)` | Require module from module list |
| `getModuleByExports<T>(exportModule, req?)` | Find module by exports |
| `getModuleByFile<T>(file, requireIfNotExists?, req?)` | Find module by full file path |
| `getModuleByID<T>(id, requireIfNotExists?, req?)` | Get module by package id like require(id) |
| `getMainModule<T>(id?)` | Get main module |
| `getRequireCache(req?)` | Return require.cache for typescript |

---

## Related Links

- [analyze-code-commenter Skill](https://github.com/bluelovers/ws-yarn-workspaces/tree/master/skills/analyze-code-commenter)
- [Conventional Commits](https://conventionalcommits.org/)

---

*Last updated: 2026-02-21*
