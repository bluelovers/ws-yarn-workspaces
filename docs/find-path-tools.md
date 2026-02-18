# 路徑工具模組

---

## Table of Contents

1. [packages/find-yarn-workspace-root2](#1-packagesfind-yarn-workspace-root2)
2. [packages/find-pkg-ws](#2-packagesfind-pkg-ws)
3. [packages/@yarn-tool/find-root](#3-packagesyarn-toolfind-root)
4. [packages/@yarn-tool/find-deps](#4-packagesyarn-toolfind-deps)
5. [packages/cache-path](#5-packagescache-path)

---

## 1. packages/find-yarn-workspace-root2

**Description / Description:** Algorithm for finding the root of a yarn workspace, extracted from yarnpkg.com

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

## 3. packages/@yarn-tool/find-root

**Description:** Find root directory information for yarn workspaces

### Updated Files

| File | Description |
|------|-------------|
| [`index.ts`](../packages/@yarn-tool/find-root/index.ts) | Main module with all root finding functions |

### Interfaces

| Interface | Description |
|-----------|-------------|
| `IFindRootReturnType` | Return type for root finding functions |
| `IFindRootOptions` | Options for root finding functions |

### Exported Functions

| Function | Description |
|----------|-------------|
| `findRootLazy(options?, _throwError?)` | Find root with lazy initialization |
| `findRoot(options, _throwError?)` | Find root directory information |
| `newFakeRootData(rootData, input)` | Create fake root data object |
| `assertHasWorkspaces(rootData)` | Assert that workspace has workspaces |
| `assertNotWorkspacesRoot(rootData)` | Assert that current directory is not workspace root |
| `assertHasAndNotWorkspacesRoot(rootData)` | Combined assertion for workspaces |
| `listMatchedPatternByPath(ws, pkg)` | List matched workspace patterns by path |

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

### Example

```typescript
/**
 * Find the root directory of a yarn workspace
 *
 * Adapted from yarnpkg.com implementation
 *
 * @param {string} [initial] - Initial directory to start searching from
 * @returns {string | null} Absolute path to workspace root, or null if not found
 */
export function findWorkspaceRoot(initial?: string): string | null
```

---

## Related Links

- [analyze-code-commenter Skill](https://github.com/bluelovers/ws-yarn-workspaces/tree/master/skills/analyze-code-commenter)
- [Conventional Commits](https://conventionalcommits.org/)

---

*Last updated: 2026-02-18*
