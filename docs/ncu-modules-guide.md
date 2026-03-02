# NCU Modules Guide / NCU 模組使用指南

本文件說明 `@yarn-tool/ncu` 和 `@yarn-tool/ncu-ws` 兩個套件的架構、功能與使用方式。

This document explains the architecture, features, and usage of `@yarn-tool/ncu` and `@yarn-tool/ncu-ws` packages.

---

## 模組概述 / Module Overview

### @yarn-tool/ncu

**核心 npm-check-updates 封裝模組 / Core npm-check-updates wrapper module**

提供依賴版本檢查與更新的核心功能，封裝 npm-check-updates 並擴展其能力。

Provides core functionality for dependency version checking and updating, wrapping npm-check-updates and extending its capabilities.

**主要功能 / Key Features：**

| 功能 | 說明 | Feature | Description |
|------|------|---------|-------------|
| Semver 支援 | 處理 ^、~ 等版本範圍 | Semver Support | Handle ^, ~ version ranges |
| 版本快取 | 快取遠端版本查詢結果 | Version Caching | Cache remote version queries |
| CLI 選項 | 完整的 yargs 整合 | CLI Options | Complete yargs integration |
| 表格輸出 | 格式化的更新結果表格 | Table Output | Formatted update result table |

### @yarn-tool/ncu-ws

**Workspace 感知層 / Workspace-aware layer**

專為 Yarn workspaces 設計，支援 monorepo 中所有工作區套件的版本檢查與更新。

Designed for Yarn workspaces, supports version checking and updating across all workspace packages in a monorepo.

**主要功能 / Key Features：**

| 功能 | 說明 | Feature | Description |
|------|------|---------|-------------|
| Workspace 支援 | 批次處理所有套件 | Workspace Support | Batch process all packages |
| yarn.lock 整合 | 自動更新 yarn.lock | Yarn.lock Integration | Auto-update yarn.lock |
| Resolutions | 處理強制版本設定 | Resolutions | Handle forced version settings |
| 去重功能 | 移除重複依賴 | Dedupe | Remove duplicate dependencies |

---

## 架構圖 / Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    @yarn-tool/ncu-ws                         │
│              (Workspace-aware orchestrator)                  │
│                  (Workspace 協調器)                           │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ ncu-main.ts  │  │ncu-yarnlock  │  │ncu-resoluti- │      │
│  │ (套件處理)    │  │  (lock 更新) │  │   ons.ts     │      │
│  │ Single pkg   │  │ Lock update  │  │ (Resolutions)│      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │              │
│  ┌──────┴───────┐  ┌──────┴───────┐  ┌──────┴───────┐      │
│  │   runtime    │  │    dedupe    │  │   findRoot   │      │
│  │  (環境建構)   │  │  (去重處理)   │  │  (尋找根目錄) │      │
│  │ Env builder  │  │ Dedupe logic │  │ Find root    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     @yarn-tool/ncu                          │
│              (Core ncu functionality)                        │
│                  (核心 ncu 功能)                              │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │npmCheckUpdate│  │checkResolut- │  │  setupNcuTo  │      │
│  │   s.ts       │  │  ionsUpdate  │  │    Yargs     │      │
│  │ (核心檢查)    │  │ (Resolutions)│  │  (CLI 設定)   │      │
│  │ Core check   │  │   update     │  │  CLI setup   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘      │
│         │                 │                                │
│  ┌──────┴───────┐  ┌──────┴───────┐  ┌──────────────┐      │
│  │    store     │  │    remote    │  │     util     │      │
│  │  (版本快取)   │  │ (遠端查詢)    │  │  (工具函數)   │      │
│  │Version cache │  │Remote query  │  │  Utilities   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              npm-check-updates (external)                    │
│                   (外部依賴套件)                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 執行流程 / Execution Flow

### Workspace 模式執行流程 / Workspace Mode Execution

```
┌─────────────────┐
│   開始 / Start   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 尋找根目錄 /     │
│ Find root dir   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     是/Yes
│ 是否為 Workspace? │────────►┌─────────────────┐
│ Is Workspace?    │          │ 處理根套件 /     │
└────────┬────────┘          │ Process root    │
         │ No                 └────────┬────────┘
         │                            │
         │                            ▼
         │                   ┌─────────────────┐
         │                   │ 遍歷所有套件 /   │
         │                   │ Iterate pkgs    │
         │                   └────────┬────────┘
         │                            │
         │◄───────────────────────────┘
         │
         ▼
┌─────────────────┐
│ 執行 ncu 檢查 /  │
│ Run ncu check   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 更新 package    │
│ .json / Update  │
│ package.json    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 處理 dedupe /   │
│ Handle dedupe   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 更新 yarn.lock  │
│ Update yarn.lock│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 完成 / Done     │
└─────────────────┘
```

---

## 核心 API 說明 / Core API Documentation

### @yarn-tool/ncu

#### `npmCheckUpdates(cache, options)`

執行 npm-check-updates 檢查並返回更新結果。
Execute npm-check-updates check and return update results.

**參數 / Parameters：**

```typescript
interface IOptionsNpmCheckUpdates {
  json_old: IPackageJson;      // 當前 package.json / Current package.json
  upgrade?: boolean;           // 是否套用更新 / Whether to apply updates
  cwd?: string;                // 工作目錄 / Working directory
  filter?: string[];           // 套件過濾器 / Package filter
  dep?: string;                // 依賴區段 / Dependency section
  minimal?: boolean;           // 最小升級 / Minimal upgrade
  newest?: boolean;            // 最新版本 / Newest version
  greatest?: boolean;          // 最高版本 / Greatest version
}
```

**回傳值 / Return Value：**

```typescript
interface IOptionsNpmCheckUpdates {
  json_changed: boolean;       // 是否有變更 / Whether changed
  list_updated: Record<string, string>;  // 更新清單 / Update list
  current: IDependency;        // 當前版本 / Current versions
  json_new: IPackageJson;      // 新的 package.json / New package.json
}
```

#### `checkResolutionsUpdate(resolutions, yarnlock, options)`

檢查並更新 yarn.lock 中的 resolutions。
Check and update resolutions in yarn.lock.

**參數 / Parameters：**

| 參數 | 類型 | 說明 |
|------|------|------|
| resolutions | `IDependency` | Resolutions 對應表 / Resolutions map |
| yarnlock | `string \| Buffer \| object` | yarn.lock 內容 / yarn.lock content |
| options | `IOptionsNpmCheckUpdates` | 配置選項 / Options |

### @yarn-tool/ncu-ws

#### `_handleNcuArgvAuto(argv, runtimeInput, isWorkspace?, includeRoot?)`

自動處理 workspace 範圍的 ncu 操作。
Automatically handle workspace-wide ncu operations.

**參數 / Parameters：**

| 參數 | 類型 | 說明 | Description |
|------|------|------|-------------|
| argv | `IArgvRuntime` | yargs 解析後的參數 | Parsed yargs arguments |
| runtimeInput | `IRuntimeInput` | 執行時期配置 | Runtime configuration |
| isWorkspace | `boolean` | 啟用 workspace 模式 | Enable workspace mode |
| includeRoot | `boolean` | 包含根套件 | Include root package |

**RuntimeInput 屬性 / RuntimeInput Properties：**

```typescript
interface IRuntimeInput {
  console: Console2;           // 輸出控制台 / Output console
  consoleDebug: Console2;      // 除錯控制台 / Debug console
  printRootData: (rootData: IFindRootReturnType, argv: { cwd: string }) => void;
                               // 根資料輸出回呼 / Root data output callback
}
```

---

## 使用範例 / Usage Examples

### 基本使用 / Basic Usage

```typescript
import { npmCheckUpdates } from '@yarn-tool/ncu';
import { readPackageJson } from '@ts-type/package-dts';

// 讀取 package.json / Read package.json
const packageJson = readPackageJson('./package.json');

// 執行檢查 / Execute check
const result = await npmCheckUpdates({ cwd: process.cwd() }, {
  json_old: packageJson,
  upgrade: false,  // 只檢查不更新 / Check only, don't update
});

console.log('可更新的套件 / Updatable packages:', result.list_updated);
```

### Workspace 模式 / Workspace Mode

```typescript
import _handleNcuArgvAuto from '@yarn-tool/ncu-ws';
import { console } from 'debug-color2';

const runtimeInput = {
  console,
  consoleDebug: console,
  printRootData: (rootData) => {
    console.info(`處理中 / Processing: ${rootData.root}`);
  },
};

// 處理所有 workspace 套件 / Process all workspace packages
await _handleNcuArgvAuto(
  { cwd: process.cwd(), upgrade: true, AA: true },
  runtimeInput,
  true,   // isWorkspace
  true    // includeRoot
);
```

### CLI 整合 / CLI Integration

```typescript
import { setupNcuToYargs } from '@yarn-tool/ncu';
import yargs from 'yargs';

const parser = setupNcuToYargs(yargs)
  .option('custom-option', {
    type: 'string',
    description: '自定義選項 / Custom option',
  });

const argv = parser.parseSync();
```

---

## CLI 選項說明 / CLI Options Reference

| 選項 | 別名 | 說明 | Option | Description |
|------|------|------|--------|-------------|
| `--dep` | | 依賴區段過濾 | Dependency section filter |
| `--minimal` | `-m` | 最小升級 | Minimal upgrade |
| `--newest` | `-n` | 最新版本 | Newest versions |
| `--greatest` | `-g` | 最高版本 | Greatest versions |
| `--upgrade` | `-u` | 套用更新 | Apply updates |
| `--registry` | `-r` | Registry URL | Third-party registry |
| `--silent` | `-s` | 靜默模式 | Silent mode |
| `--dedupe` | | 去重處理 | Remove duplicates |
| `--filter` | | 套件過濾 | Package filter |

---

## 相關連結 / Related Links

- [npm-check-updates](https://github.com/raineorshine/npm-check-updates) - 底層依賴工具 / Underlying dependency tool
- [@yarn-tool/ncu README](../packages/@yarn-tool/ncu/README.md) - 核心模組說明 / Core module documentation
- [@yarn-tool/ncu-ws README](../packages/@yarn-tool/ncu-ws/README.md) - Workspace 模組說明 / Workspace module documentation

---

## 授權 / License

ISC License - 詳見各套件目錄中的 LICENSE 文件。
See LICENSE files in each package directory for details.
