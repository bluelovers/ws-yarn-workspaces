# @yarn-tool/ncu-ws

Workspace-aware npm-check-updates tool for Yarn workspaces. Supports monorepo dependency version checking and updating across all workspace packages.

專為 Yarn workspaces 設計的依賴版本檢查與更新工具，支援 monorepo 中所有工作區套件的版本檢查與更新。

## Features / 功能特色

- 🏢 **Workspace Support** - Check and update dependencies across all workspace packages
  - 批次處理所有 workspace 套件的依賴更新
- 🔄 **Batch Processing** - Process all packages in a monorepo efficiently
  - 有效率地處理 monorepo 中的所有套件
- 🔗 **Yarn.lock Integration** - Update yarn.lock after dependency changes
  - 在依賴變更後同步更新 yarn.lock 檔案
- 📦 **Resolutions Support** - Handle package resolutions in workspaces
  - 處理 workspace 中的 resolutions 強制版本設定
- 🎯 **Dedupe Support** - Remove duplicate dependencies from resolutions
  - 自動移除 resolutions 中的重複依賴
- ⏱️ **Progress Tracking** - Display execution time and progress info
  - 顯示執行時間與進度資訊

## Installation / 安裝

Using yarn:

```bash
yarn add @yarn-tool/ncu-ws
```

Using yarn-tool:

```bash
yarn-tool add @yarn-tool/ncu-ws
yt add @yarn-tool/ncu-ws
```

Using pnpm:

```bash
pnpm add @yarn-tool/ncu-ws
```

Using npm:

```bash
npm install @yarn-tool/ncu-ws
```

## Usage / 使用方式

### Programmatic API / 程式化使用

```typescript
import _handleNcuArgvAuto from '@yarn-tool/ncu-ws';
import { console } from 'debug-color2';

/**
 * 建立執行時期配置物件
 * Create runtime configuration object
 */
const runtimeInput = {
  console,
  consoleDebug: console,
  printRootData: (rootData, argv) => {
    console.info(`Processing: ${rootData.root}`);
  },
};

/**
 * 執行 ncu 檢查所有 workspace 套件
 * Run ncu check across all workspace packages
 */
await _handleNcuArgvAuto(
  argv,           // yargs parsed arguments / yargs 解析後的參數
  runtimeInput,   // runtime configuration / 執行時期配置
  true,           // isWorkspace: enable workspace mode / 啟用 workspace 模式
  true            // includeRoot: include root package.json / 包含根套件
);
```

### CLI Integration / 命令列整合

This package is designed to be used as part of yarn-tool CLI:
此套件設計為 yarn-tool CLI 的一部分：

```bash
# Check for updates in all workspace packages
# 檢查所有 workspace 套件的更新
yarn-tool ncu

# Check and update all workspace packages
# 檢查並更新所有 workspace 套件
yarn-tool ncu -u

# Check with specific options
# 使用特定選項檢查
yarn-tool ncu --filter "typescript" --dep dev
```

## How It Works / 運作方式

1. **Find Workspace Root / 尋找 Workspace 根目錄**
   - Locates the workspace root directory
   - 定位 workspace 根目錄位置

2. **List Workspace Packages / 列出 Workspace 套件**
   - Enumerates all packages in the workspace
   - 列舉 workspace 中的所有套件

3. **Process Each Package / 處理每個套件**
   - Runs npm-check-updates on each package.json
   - 對每個 package.json 執行 npm-check-updates

4. **Update yarn.lock / 更新 yarn.lock**
   - Synchronizes yarn.lock with package changes
   - 將 yarn.lock 與套件變更同步

5. **Handle Resolutions / 處理 Resolutions**
   - Updates root resolutions if needed
   - 在需要時更新根套件的 resolutions

## API Documentation / API 文件

### `_handleNcuArgvAuto(argv, runtimeInput, isWorkspace?, includeRoot?)`

Main function to process ncu across workspaces.
處理跨 workspaces 的 ncu 主要函數。

**Parameters / 參數：**

| Parameter | Type | Description |
|-----------|------|-------------|
| `argv` | `IArgvRuntime` | Parsed yargs arguments with ncu options / 解析後的 yargs 參數 |
| `runtimeInput` | `IRuntimeInput` | Runtime configuration object / 執行時期配置物件 |
| `isWorkspace` | `boolean` | Enable workspace mode (default: false) / 啟用 workspace 模式 |
| `includeRoot` | `boolean` | Include root package.json (default: false) / 包含根套件 |

**RuntimeInput Properties / 執行時期配置屬性：**

| Property | Type | Description |
|----------|------|-------------|
| `console` | `Console2` | Console instance for output / 輸出用的控制台實例 |
| `consoleDebug` | `Console2` | Console instance for debug output / 除錯輸出的控制台實例 |
| `printRootData` | `function` | Callback to print root data / 輸出根資料的回呼函數 |

**Returns / 回傳：** `Promise<void>`

### `IArgvRuntime`

Type for parsed command line arguments. Extends the base ncu options with workspace-specific flags:
解析後的命令列參數類型，擴展基礎 ncu 選項並加入 workspace 特定旗標：

| Option | Description |
|--------|-------------|
| `AA` | Auto-enable workspace mode with root inclusion / 自動啟用 workspace 模式並包含根套件 |
| `resolutions` | Process resolutions instead of dependencies / 處理 resolutions 而非依賴 |
| `dedupe` | Remove duplicate dependencies from resolutions / 從 resolutions 移除重複依賴 |
| `upgrade` | Apply updates to package.json / 將更新套用到 package.json |
| `filter` | Filter packages by name pattern / 依名稱模式篩選套件 |

## Configuration / 設定方式

ncu-ws 的行為由三層設定決定：workspace 相關旗標、由 `setupNcuToYargs2` 建立的命令列選項 (CLI Options)，以及執行時期配置物件 `IRuntimeInput`。
The behaviour of ncu-ws is controlled by three layers: the workspace flags, the CLI options built by `setupNcuToYargs2`, and the `IRuntimeInput` runtime object.

### Workspace Flags / Workspace 旗標

| Option | Alias | Default | Description |
|--------|-------|---------|-------------|
| `AA` | | `false` | 一次啟用 workspace 模式並包含根套件 / Enable workspace mode and include the root package at once |
| `resolutions` | `-R` | `false` | 只處理 resolutions，不更新依賴 / Handle resolutions only, without updating dependencies |
| `dedupe` | | `false` | 從 resolutions 與 yarn.lock 移除重複依賴 / Remove duplicated dependencies from resolutions and yarn.lock |
| `no-safe` | | `false` | 允許跳離目前版本範圍（例如 `~` 約束） / Allow leaving the current range (e.g. a `~` constraint) |
| `upgrade` | `-u` | `false` | 將更新實際寫入 package.json 與 yarn.lock / Actually write updates into package.json and yarn.lock |
| `filter` | | | 依名稱模式篩選要處理的套件 / Filter packages to process by name pattern |

其餘通用選項（`dep`、`minimal`、`newest`、`greatest`、`semverLevel`、`removeRange`、`registry`、`silent`）由 `@yarn-tool/ncu` 提供，詳見 [ncu 的 Configuration 章節](../ncu#configuration--設定方式)。
The remaining generic options (`dep`, `minimal`, `newest`, `greatest`, `semverLevel`, `removeRange`, `registry`, `silent`) come from `@yarn-tool/ncu`; see the [Configuration section of ncu](../ncu#configuration--設定方式).

### Runtime Input / 執行時期配置

`IRuntimeInput` 決定輸出方式與目前處理項目的顯示：

| Property | Type | Description |
|----------|------|-------------|
| `console` | `Console2` | 一般輸出用的 console / Console used for regular output |
| `consoleDebug` | `Console2` | 除錯輸出用的 console / Console used for debug output |
| `printRootData` | `(rootData, argv) => void` | 輸出目前處理的根目錄或套件 / Prints the root or package currently processed |

未提供的欄位會在 `_handleNcuArgvAuto` 內以預設值補齊，因此可以只傳入需要的部分。
Missing fields are filled in with defaults inside `_handleNcuArgvAuto`, so only the parts you need must be supplied.

### Environment Detection / 環境偵測

- 以 `@yarn-tool/find-root` 偵測專案根目錄 (Project Root)，並判斷是否具備 workspace 結構。
  Uses `@yarn-tool/find-root` to locate the project root and to tell whether a workspace structure exists.
- `resolutions` 預設取自目前套件；當處於 workspace 根目錄且本身不是工作區成員時，改讀根套件的 `resolutions`。
  `resolutions` come from the current package by default; when running at the workspace root itself, the root package's `resolutions` are read instead.
- 所有子套件處理完成後才會統一更新一次 yarn.lock，避免重複寫檔。
  The yarn.lock is updated once after every sub-package has been processed, to avoid repeated writes.

### More Documentation / 更多文件

- [NCU 版本檢查工具模組](../../../docs/ncu-tools.md) — ncu / ncu-ws / pkg-version-query 的分工與檔案清單 / Module map of ncu, ncu-ws and pkg-version-query
- [NCU 模組指南](../../../docs/ncu-modules-guide.md) — 進階用法與整合方式 / Advanced usage and integration guide

## Related Packages / 相關套件

- [@yarn-tool/ncu](../ncu) - Core ncu wrapper functionality / 核心 ncu 封裝功能
- [@yarn-tool/find-root](../find-root) - Find workspace root / 尋找 workspace 根目錄
- [ws-pkg-list](../ws-pkg-list) - List workspace packages / 列出 workspace 套件
- [@yarn-tool/yarnlock-ncu](../yarnlock-ncu) - yarn.lock ncu integration / yarn.lock ncu 整合

## License / 授權

ISC