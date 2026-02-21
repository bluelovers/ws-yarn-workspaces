# NCU 版本檢查工具模組

---

## Table of Contents

1. [packages/@yarn-tool/pkg-version-query](#1-packagesyarn-toolpkg-version-query) ⭐ 核心模組
2. [packages/@yarn-tool/ncu](#2-packagesyarn-toolncu) ⭐ 核心模組
3. [packages/@yarn-tool/ncu-ws](#3-packagesyarn-toolncu-ws) ⭐ Workspace 支援

---

## 1. packages/@yarn-tool/pkg-version-query ⭐

**Description:** 從 npm registry 查詢套件版本，支援 LRU 快取、版本範圍語法與 npm: 協議處理

**English Description:** Query package versions from npm registry with LRU cache support. Supports version ranges, npm: protocol, and semver syntax handling.

> 🔧 **功能特點 / Key Features:**
> - 從 npm registry 查詢套件版本
> - 支援 LRU 快取，減少重複 API 呼叫
> - 處理 semver 版本範圍語法 (^, ~, 等)
> - 支援 npm: 別名協議語法
> - 檔案系統支援的快取持久化

### Updated Files

| File | Description |
|------|-------------|
| [`index.ts`](../packages/@yarn-tool/pkg-version-query/index.ts) | 模組入口點 / Module entry point |
| [`lib/types.ts`](../packages/@yarn-tool/pkg-version-query/lib/types.ts) | 類型定義 / Type definitions |
| [`lib/core.ts`](../packages/@yarn-tool/pkg-version-query/lib/core.ts) | 核心查詢函數 / Core query functions |
| [`lib/queryVersion.ts`](../packages/@yarn-tool/pkg-version-query/lib/queryVersion.ts) | 版本查詢與快取 / Version query with cache |
| [`lib/queryVersionByNpmPackageArg.ts`](../packages/@yarn-tool/pkg-version-query/lib/queryVersionByNpmPackageArg.ts) | npm 套件參數查詢 / Query by npm package argument |
| [`lib/cacheAgent.ts`](../packages/@yarn-tool/pkg-version-query/lib/cacheAgent.ts) | 快取代理 / Cache agent |
| [`lib/createCacheKey.ts`](../packages/@yarn-tool/pkg-version-query/lib/createCacheKey.ts) | 快取鍵建立 / Cache key creation |
| [`lib/queryVersionCacheRaw.ts`](../packages/@yarn-tool/pkg-version-query/lib/queryVersionCacheRaw.ts) | 原始快取查詢 / Raw cache query |

### Interfaces

| Interface | Description |
|-----------|-------------|
| `ICachedVersionResultCore` | 快取版本結果核心結構 / Core structure for cached version result |
| `ICachedVersionResult` | 快取版本結果 / Cached version result |
| `IOptionsQueryVersion` | 版本查詢選項 / Version query options |

### Exported Functions

| Function | Description |
|----------|-------------|
| `queryVersionWithCache(name, targetVersion?, options?)` | 使用 LRU 快取查詢套件版本 / Query package version with LRU cache |
| `queryVersionByNpmPackageArgWithCache(input, options?)` | 使用 npm 套件參數語法查詢版本 / Query version using npm package argument syntax |
| `getCache(options?)` | 取得或建立全域快取實例 / Get or create global cache instance |

### Usage Example / 使用範例

```typescript
import queryVersionWithCache, { getCache } from '@yarn-tool/pkg-version-query';

// 查詢最新版本 / Query latest version
const version = await queryVersionWithCache('lodash');
// => '4.17.21'

// 查詢特定版本範圍 / Query specific version range
const version = await queryVersionWithCache('typescript', '^4.0.0');
// => '4.9.5'

// 使用 npm 套件參數語法 / Using npm package argument syntax
import { queryVersionByNpmPackageArgWithCache } from '@yarn-tool/pkg-version-query';
const version = await queryVersionByNpmPackageArgWithCache('lodash@^4.0.0');

// 進階快取操作 / Advanced cache operations
const cache = getCache();
cache.clear();              // 清除快取 / Clear cache
await cache.fsDump();       // 將快取寫入檔案系統 / Dump cache to filesystem
```

---

## 2. packages/@yarn-tool/ncu ⭐

**Description:** 封裝 npm-check-updates 的依賴版本檢查與更新工具，支援 semver 版本範圍處理與 yarn.lock 整合

**English Description:** A wrapper tool for npm-check-updates that checks and updates package dependencies with semver support and yarn.lock integration.

> 🔧 **功能特點 / Key Features:**
> - 檢查 package.json 中依賴套件的可用更新
> - 比較當前版本與最新版本
> - 支援 semver 版本範圍處理 (^, ~, 等)
> - 整合版本快取機制
> - 支援 yarn.lock resolutions 更新

### Updated Files

| File | Description |
|------|-------------|
| [`index.ts`](../packages/@yarn-tool/ncu/index.ts) | 模組入口點 / Module entry point |
| [`lib/types.ts`](../packages/@yarn-tool/ncu/lib/types.ts) | 類型定義 / Type definitions |
| [`lib/cli.ts`](../packages/@yarn-tool/ncu/lib/cli.ts) | CLI 選項設定 / CLI options setup |
| [`lib/options.ts`](../packages/@yarn-tool/ncu/lib/options.ts) | 選項處理 / Options processing |
| [`lib/store.ts`](../packages/@yarn-tool/ncu/lib/store.ts) | 儲存功能 / Store functions |
| [`lib/remote.ts`](../packages/@yarn-tool/ncu/lib/remote.ts) | 遠端查詢 / Remote query |
| [`lib/util.ts`](../packages/@yarn-tool/ncu/lib/util.ts) | 工具函數 / Utility functions |
| [`lib/update.ts`](../packages/@yarn-tool/ncu/lib/update.ts) | 更新功能匯出 / Update functions export |
| [`lib/update/npmCheckUpdates.ts`](../packages/@yarn-tool/ncu/lib/update/npmCheckUpdates.ts) | 核心 npm-check-updates 封裝 / Core ncu wrapper |
| [`lib/update/checkResolutionsUpdate.ts`](../packages/@yarn-tool/ncu/lib/update/checkResolutionsUpdate.ts) | Resolutions 更新檢查 / Resolutions update check |
| [`lib/remote/getVersionTarget.ts`](../packages/@yarn-tool/ncu/lib/remote/getVersionTarget.ts) | 取得版本目標 / Get version target |
| [`lib/remote/queryRemoteVersions.ts`](../packages/@yarn-tool/ncu/lib/remote/queryRemoteVersions.ts) | 查詢遠端版本 / Query remote versions |

### Interfaces

| Interface | Description |
|-----------|-------------|
| `IOptionsNpmCheckUpdates` | npm-check-updates 選項 / npm-check-updates options |
| `IVersionCacheMapKey` | 版本快取鍵 / Version cache key |
| `IVersionCacheMapValue` | 版本快取值 / Version cache value |
| `IOptionsFetchVersion` | 版本獲取選項 / Version fetch options |

### Exported Functions

| Function | Description |
|----------|-------------|
| `npmCheckUpdates(cache, options)` | 檢查並更新 package.json 中的依賴版本 / Check and update package dependencies |
| `checkResolutionsUpdate(resolutions, yarnlock, options)` | 檢查並更新 yarn.lock 中的 resolutions / Check and update resolutions in yarn.lock |
| `setupNcuToYargs(yargs)` | 將 ncu 選項整合到 yargs 解析器 / Setup ncu options to yargs parser |

### CLI Options / 命令列選項

| Option | Alias | Description |
|--------|-------|-------------|
| `--dep` | | 檢查特定依賴區段 (prod\|dev\|peer\|optional\|bundle) |
| `--minimal` | `-m` | 不升級已符合 semver 範圍的版本 |
| `--newest` | `-n` | 尋找最新版本而非穩定版本 |
| `--greatest` | `-g` | 尋找最高可用版本 |
| `--upgrade` | `-u` | 覆寫 package.json |
| `--registry` | `-r` | 指定第三方 npm registry |
| `--silent` | `-s` | 不輸出任何內容 |
| `--semverLevel` | | 在 "major" 或 "minor" 範圍內尋找最高版本 |
| `--removeRange` | | 從最終版本中移除版本範圍 |
| `--dedupe` | | 從 resolutions 中移除已升級的模組 |
| `--filter` | | 只包含符合模式的套件 |

### Usage Example / 使用範例

```typescript
import { npmCheckUpdates, checkResolutionsUpdate, setupNcuToYargs } from '@yarn-tool/ncu';

// 檢查並更新 package.json 依賴 / Check and update package.json dependencies
const result = await npmCheckUpdates(cache, {
  json_old: packageJson,
  upgrade: true,
});

console.log(result.list_updated);  // { "package-name": "new-version" }
console.log(result.json_changed);  // true 如有更新 / true if any updates

// 檢查並更新 resolutions / Check and update resolutions
const resolutionResult = await checkResolutionsUpdate(
  resolutions,
  yarnlockContent,
  options
);

// CLI 整合 / CLI integration
import yargs from 'yargs';
const parser = setupNcuToYargs(yargs);
```

---

## 3. packages/@yarn-tool/ncu-ws ⭐

**Description:** 專為 Yarn workspaces 設計的依賴版本檢查與更新工具，支援 monorepo 中所有工作區套件的版本檢查與更新

**English Description:** Workspace-aware npm-check-updates tool for Yarn workspaces. Supports monorepo dependency version checking and updating across all workspace packages.

> 🔧 **功能特點 / Key Features:**
> - 支援 Yarn Workspaces 批次處理
> - 在 monorepo 中高效處理所有套件
> - 整合 yarn.lock 更新
> - 支援 Resolutions 處理
> - 提供 Dedupe 功能
> - 顯示執行時間與進度資訊

### Updated Files

| File | Description |
|------|-------------|
| [`index.ts`](../packages/@yarn-tool/ncu-ws/index.ts) | 模組入口點 / Module entry point |
| [`lib/types.ts`](../packages/@yarn-tool/ncu-ws/lib/types.ts) | 類型定義 / Type definitions |
| [`lib/argv.ts`](../packages/@yarn-tool/ncu-ws/lib/argv.ts) | 命令列參數處理 / Command line argument handling |
| [`lib/runtime.ts`](../packages/@yarn-tool/ncu-ws/lib/runtime.ts) | 執行時配置 / Runtime configuration |
| [`lib/ncu-main.ts`](../packages/@yarn-tool/ncu-ws/lib/ncu-main.ts) | 主要 ncu 處理函數 / Main ncu handler |
| [`lib/ncu-resolutions.ts`](../packages/@yarn-tool/ncu-ws/lib/ncu-resolutions.ts) | Resolutions 處理 / Resolutions handling |
| [`lib/ncu-yarnlock.ts`](../packages/@yarn-tool/ncu-ws/lib/ncu-yarnlock.ts) | Yarn.lock 處理 / Yarn.lock handling |
| [`lib/ncu-dedupe.ts`](../packages/@yarn-tool/ncu-ws/lib/ncu-dedupe.ts) | Dedupe 處理 / Dedupe handling |

### Interfaces

| Interface | Description |
|-----------|-------------|
| `IRuntimeInput` | 執行時輸入配置 / Runtime input configuration |
| `IRuntime` | 完整執行時配置 / Complete runtime configuration |
| `IArgvRuntime` | 解析後的命令列參數類型 / Parsed command line arguments type |

### Exported Functions

| Function | Description |
|----------|-------------|
| `_handleNcuArgvAuto(argv, runtimeInput, isWorkspace?, includeRoot?)` | 在 workspaces 中執行 ncu 操作 / Process ncu across workspaces |

### Workspace-specific Options / Workspace 特定選項

| Option | Description |
|--------|-------------|
| `AA` | 自動啟用 workspace 模式並包含根目錄 / Auto-enable workspace mode with root inclusion |
| `resolutions` | 處理 resolutions 而非 dependencies / Process resolutions instead of dependencies |
| `dedupe` | 從 resolutions 中移除重複依賴 / Remove duplicate dependencies from resolutions |

### Usage Example / 使用範例

```typescript
import _handleNcuArgvAuto from '@yarn-tool/ncu-ws';
import { console } from 'debug-color2';

const runtimeInput = {
  console,
  consoleDebug: console,
  printRootData: (rootData, argv) => {
    console.info(`Processing: ${rootData.root}`);
  },
};

// 在所有 workspaces 中執行 ncu
// Run ncu across all workspaces
await _handleNcuArgvAuto(
  argv,           // yargs 解析後的參數 / yargs parsed arguments
  runtimeInput,   // 執行時配置 / runtime configuration
  true,           // isWorkspace: 啟用 workspace 模式 / enable workspace mode
  true            // includeRoot: 包含根 package.json / include root package.json
);
```

### CLI Usage / 命令列使用

```bash
# 檢查所有 workspace 套件的更新 / Check updates in all workspace packages
yarn-tool ncu

# 檢查並更新所有 workspace 套件 / Check and update all workspace packages
yarn-tool ncu -u

# 使用特定選項檢查 / Check with specific options
yarn-tool ncu --filter "typescript" --dep dev
```

---

## Architecture Overview / 架構概覽

```
@yarn-tool/pkg-version-query (底層)
         ↓
@yarn-tool/ncu (核心)
         ↓
@yarn-tool/ncu-ws (Workspace 擴展)
```

### Dependencies Flow / 依賴流程

1. **@yarn-tool/pkg-version-query** - 提供底層的 npm registry 版本查詢與快取功能
2. **@yarn-tool/ncu** - 封裝 npm-check-updates，使用 pkg-version-query 進行版本查詢
3. **@yarn-tool/ncu-ws** - 擴展 ncu 以支援 Yarn Workspaces 環境

---

## Related Links

- [npm-check-updates](https://github.com/raineorshine/npm-check-updates) - The underlying tool
- [package-json](https://github.com/sindresorhus/package-json) - npm registry client
- [lru-cache-fs2](https://github.com/bluelovers/lru-cache-fs2) - File-system backed LRU cache

---

*Last updated: 2026-02-22*