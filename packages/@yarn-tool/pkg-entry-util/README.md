# @yarn-tool/pkg-entry-util

用於處理 package.json entry 相關欄位的工具庫，包含 bin、exports、publishConfig 欄位的修復與驗證功能

Utility library for handling package.json entry-related fields, including fix and verification for bin, exports, and publishConfig fields

## Installation

```bash
yarn add @yarn-tool/pkg-entry-util
yarn-tool add @yarn-tool/pkg-entry-util
yt add @yarn-tool/pkg-entry-util

pnpm add @yarn-tool/pkg-entry-util

npm install @yarn-tool/pkg-entry-util
```

## Features

### Entry Field Utilities / Entry 欄位工具

- `fixPkgBinField` - 修復 package.json 的 bin 欄位路徑 / Fix package.json bin field paths
- `pkgExportsAddPJsonEntry` - 在 exports 欄位中添加 package.json entry / Add package.json entry to exports field
- `pkgExportsVerify` - 驗證 package exports 路徑是否存在 / Verify package exports paths exist
- `fixPublishConfig` - 修復 publishConfig 欄位 / Fix publishConfig field

### Scripts Presets / 腳本預設

此模組提供各類套件的預設 npm scripts，支援 monorepo 與獨立套件開發流程

This module provides default npm scripts for various package types, supporting monorepo and standalone package development workflows

#### 預設腳本分類 / Preset Categories

| 函數 / Function | 適用場景 / Use Case | 主要功能 / Main Features |
|----------------|--------------------|-------------------------|
| `defaultPkgScripts` | 一般套件 / Regular packages | 測試、覆蓋率、型別檢查 / Test, coverage, type check |
| `defaultPkgNotOldExists` | 新建立套件 / New packages | 完整開發腳本（建構、lint、review）/ Complete dev scripts (build, lint, review) |
| `defaultRootScripts` | 獨立套件根目錄 / Standalone package root | 版本遞增、發布、changelog / Version bump, publish, changelog |
| `defaultWorkspaceRootScripts` | 工作區根目錄 / Workspace root | 跨工作區執行、Lerna 發布 / Cross-workspace execution, Lerna publish |
| `defaultSharedRootScripts` | 共用根目錄腳本 / Shared root scripts | CI 安裝、依賴清理 / CI install, dedupe |
| `fillDummyScripts` | 所有套件類型 / All package types | 生命週期腳本佔位符 / Lifecycle script placeholders |

## Usage

### Entry 欄位工具 / Entry Field Utilities

```typescript
import { fixPkgBinField, fixPublishConfig, pkgExportsAddPJsonEntry, pkgExportsVerify } from '@yarn-tool/pkg-entry-util';

// 修復 bin 欄位路徑 / Fix bin field paths
fixPkgBinField(pkg, root);

// 確保 exports 含 ./package.json 入口 / Ensure exports includes ./package.json
pkgExportsAddPJsonEntry(pkg);

// 驗證 exports 路徑存在 / Verify exports paths exist
pkgExportsVerify(pkg, { cwd });

// scoped 套件補上 publishConfig.access / Add publishConfig.access for scoped packages
fixPublishConfig(pkg);
```

### 腳本預設 / Scripts Presets

```typescript
// 工作區根目錄 (Yarn/Lerna Workspaces Root)
import { defaultWorkspaceRootScripts } from '@yarn-tool/pkg-entry-util/lib/preset/scripts/ws-root-scripts';

const wsScripts = defaultWorkspaceRootScripts();
// 包含跨工作區測試、建構、發布等腳本
// Includes cross-workspace test, build, publish scripts

// 一般套件 (Regular Package)
import { defaultPkgScripts, defaultPkgNotOldExists } from '@yarn-tool/pkg-entry-util/lib/preset/scripts/pkg-scripts';

const pkgScripts = defaultPkgScripts();
// 基本測試腳本：test, test:jest, coverage, test:tsd
// Basic test scripts: test, test:jest, coverage, test:tsd

const newPkgScripts = defaultPkgNotOldExists();
// 新套件完整腳本：包含建構、lint、review 等
// Complete scripts for new packages: includes build, lint, review, etc.

// 根目錄套件 (Root Package - Non-workspace)
import { defaultRootScripts } from '@yarn-tool/pkg-entry-util/lib/preset/scripts/root-scripts';

const rootScripts = defaultRootScripts();
// 版本管理與發布腳本：version:bump, npm:publish, postpublish 等
// Version management and publishing scripts: version:bump, npm:publish, postpublish, etc.

// 填充虛擬腳本 (Fill Dummy Scripts)
import { fillDummyScripts } from '@yarn-tool/pkg-entry-util/lib/preset/scripts/dummy';

const scripts = {};
fillDummyScripts(scripts, 'my-package');
// 為生命週期腳本填充 echo 佔位符
// Fill echo placeholders for lifecycle scripts
```

#### 腳本預設詳細說明 / Scripts Preset Details

##### defaultWorkspaceRootScripts / 工作區根目錄腳本

適用於 `create-yarn-workspaces` 建立的工作區根目錄

For workspace root created by `create-yarn-workspaces`

```typescript
import { defaultWorkspaceRootScripts } from '@yarn-tool/pkg-entry-util/lib/preset/scripts/ws-root-scripts';

const scripts = defaultWorkspaceRootScripts();
```

包含腳本 / Includes:
- **測試相關 / Test**: `test`, `test:all`, `test:since`, `test:tsd:all`, `test:tsd:since`
- **建構相關 / Build**: `build:all`, `build:since`
- **程式碼品質 / Quality**: `lint:all`, `lint:since`, `review:all`, `review:since`, `coverage:all`, `coverage:since`
- **發布相關 / Publish**: `lerna:publish`, `lerna:publish:yes:patch\|minor\|major`, `prepublishOnly:root`
- **維護相關 / Maintenance**: `ncu:root`, `ncu:ws`, `sort-package-json`, `prepare:fix-ws-links`

##### defaultRootScripts / 根目錄腳本

適用於獨立套件或 monorepo 根目錄（非工作區）

For standalone packages or monorepo root (non-workspace)

```typescript
import { defaultRootScripts } from '@yarn-tool/pkg-entry-util/lib/preset/scripts/root-scripts';

const scripts = defaultRootScripts();
```

包含腳本 / Includes:
- **版本管理 / Version**: `version:bump`, `version:bump:patch\|minor\|major\|prerelease`
- **發布流程 / Publishing**: `npm:publish`, `npm:publish:bump`, `prepublishOnly:check-bin`
- **發布後自動化 / Post-publish**: `postpublish`, `postpublish:git:commit`, `postpublish:git:tag`, `postpublish:changelog`
- **依賴更新 / Dependencies**: `ncu`, `pnpm:dedupe`, `ncu:pnpm`

##### defaultPkgScripts / 套件腳本

適用於一般套件專案

For general package projects

```typescript
import { defaultPkgScripts } from '@yarn-tool/pkg-entry-util/lib/preset/scripts/pkg-scripts';

const scripts = defaultPkgScripts();
```

包含腳本 / Includes:
- `test` / `test:jest` - 執行 Jest 測試 / Run Jest tests
- `coverage` - 測試含覆蓋率報告 / Test with coverage report
- `test:snapshot` / `test:jest:snapshot` - 更新測試快照 / Update test snapshots
- `test:tsd` - TypeScript 型別檢查 / TypeScript type checking
- `tsc:showConfig` - 顯示 TypeScript 設定 / Show TypeScript config

##### fillDummyScripts / 填充虛擬腳本

為 package.json 的生命週期腳本填充 echo 佔位符

Fill echo placeholders for package.json lifecycle scripts

```typescript
import { fillDummyScripts } from '@yarn-tool/pkg-entry-util/lib/preset/scripts/dummy';

const pkg = { scripts: {} };
fillDummyScripts(pkg.scripts, 'workspaces');

// 結果 / Result:
// pkg.scripts = {
//   preversion: 'echo workspaces preversion',
//   version: 'echo workspaces version',
//   prepublishOnly: 'echo workspaces prepublishOnly',
//   // ... 其他生命週期腳本 / other lifecycle scripts
// }
```

## API Documentation

### Entry 欄位工具 / Entry Field Utilities

| 函數 / Function | 簡介 / Description |
|----------------|--------------------|
| `fixPkgBinField(pkg, root)` | 修正 bin 欄位路徑：檔案不在根目錄但在 `bin/` 子目錄時自動改寫，支援字串與物件兩種格式 / Fix bin field paths, rewriting when the file lives in `bin/` instead of the root; supports string and object formats |
| `fixBinPath(bin, root)` | 單一路徑的修正版，需修正時回傳新路徑，否則回傳 `null` / Fix a single path, returning the new path or `null` |
| `pkgExportsAddPJsonEntry(pkg)` | 確保 `exports` 含 `'./package.json'` 入口，讓外部可匯入 package.json / Ensure `exports` includes a `'./package.json'` entry so it can be imported externally |
| `pkgExportsVerify(pkg, options?)` | 驗證 `exports` 中的檔案路徑是否存在；失敗時拋出附帶詳細清單的錯誤 / Verify that files in `exports` exist; throws an error carrying a detailed list on failure |
| `fixPublishConfig(pkg)` | 為非私有的 scoped 套件補上 `publishConfig.access = 'public'` / Add `publishConfig.access = 'public'` for non-private scoped packages |
| `fixEmptyFields(pkg, root)` | 移除 `bin`、`resolutions` 等欄位中的空配置 / Remove empty configurations from fields such as `bin` and `resolutions` |
| `isEmptyConfig(value)` | 判斷值是否為 `undefined`、`null`、空物件或空字串 / Check whether a value is `undefined`, `null`, an empty object, or an empty string |

> `fixEmptyFields` / `isEmptyConfig` 未由套件根目錄匯出，需自 `lib/field/fixEmpty` 引入；
> `EnumScriptsEntry` / `scriptsEntryIsNoTestSpecified` 則位於 `lib/field/scripts`
> `fixEmptyFields` / `isEmptyConfig` are not re-exported from the package root; import them from `lib/field/fixEmpty`.
> `EnumScriptsEntry` / `scriptsEntryIsNoTestSpecified` live in `lib/field/scripts`

### 腳本預設 / Scripts Presets

| 函數 / Function | 簡介 / Description |
|----------------|--------------------|
| `defaultPkgScripts()` | 一般套件的測試與型別檢查腳本 / Test and type-check scripts for regular packages |
| `defaultPkgNotOldExists()` | 新套件的完整開發腳本（含建構與 lint）/ Complete dev scripts for new packages (build and lint included) |
| `defaultRootScripts()` | 獨立套件根目錄的版本遞增與發布腳本 / Version bump and publish scripts for standalone roots |
| `defaultWorkspaceRootScripts()` | 工作區根目錄的跨工作區與 Lerna 發布腳本 / Cross-workspace and Lerna publish scripts for workspace roots |
| `defaultSharedRootScripts()` | 根目錄共用的 CI 安裝與維護腳本 / Shared CI install and maintenance scripts for roots |
| `fillDummyScripts(scripts?, prefix?)` | 以 `echo <prefix> <script>` 佔位符填充生命週期腳本 / Fill lifecycle scripts with `echo <prefix> <script>` placeholders |
| `_runAllOrSince(script)` | 產生 `test:all` / `test:since` 形式的腳本對 / Generate `test:all` / `test:since` style script pairs |
| `scriptsEntryIsNoTestSpecified(value)` | 判斷腳本是否為「未指定測試」的 echo 佔位 / Detect the "no test specified" echo placeholder |

### 常數與列舉 / Constants & Enums

| 匯出 | 說明 |
| --- | --- |
| `EnumScriptsEntry` | 常用腳本命令字串列舉（Jest、TSC、DTS 建構等）/ Enum of common script command strings (Jest, TSC, DTS build, etc.) |
| `_defaultCiInstallDeps` | CI 環境需安裝的核心開發工具清單 / Core dev tools installed in CI |

## Configuration

本套件無設定檔，行為由各函式的參數控制：

| 參數 / Parameter | 套用函式 / Used by | 說明 / Description |
|----------------|--------------------|--------------------|
| `root` | `fixPkgBinField`、`fixEmptyFields` | 套件根目錄路徑，用以判斷 bin 檔案實際位置 / Package root path, used to locate bin files |
| `options.cwd` | `pkgExportsVerify` | 查找套件根目錄的起始工作目錄，預設為 `process.cwd()` / Starting directory for locating the package root, defaults to `process.cwd()` |
| `prefix` | `fillDummyScripts` | echo 佔位符的前綴文字，通常為套件名稱 / Prefix text for echo placeholders, usually the package name |
| `includeVersion` | - | 本套件不使用；版本處理交由 `npm-package-arg-util` 相關套件 / Not used here; version handling belongs to `npm-package-arg-util` related packages |

## 相關模組 / Related Modules

- [create-yarn-workspaces](https://www.npmjs.com/package/create-yarn-workspaces) - 使用 `defaultWorkspaceRootScripts` 建立工作區
- [npm-init2](https://www.npmjs.com/package/npm-init2) - 使用 `fillDummyScripts` 和 `defaultRootScripts` 初始化套件
