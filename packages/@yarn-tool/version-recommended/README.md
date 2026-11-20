# @yarn-tool/version-recommended

Recommend the next semver version: auto-detect bump type and pre-release identifiers from an old version, with yarn workspaces / monorepo support

依舊版本號自動推薦下一個語意化版本 (Semantic Versioning)，可偵測預發行 (Pre-release) 識別字串，並支援 yarn workspaces / monorepo 專案。

## Features

- **自動推薦 bump 類型**：根據舊版本是否為預發行版本，自動推斷應使用 `prerelease`、`premajor` 等預發行類型
- **保留 preid**：舊版本如為 `1.0.0-beta.1`，遞增後仍會保留 `beta` 識別字串
- **identifierBase 偵測**：純數字預發行識別（如 `1.0.0-1`）自動以 `identifierBase: false` 遞增，避免重新從 0 起算
- **多種取用方式**：可直接傳入版本字串、傳入 `package.json` 物件，或自動向上尋找 (Find Up) 專案根目錄
- **workspaces 支援**：透過 `WorkspacesProject` 取得 monorepo 的預設 bump 策略
- **yargs 整合**：提供與 `yarn version` 相容的命令列選項設定

## Installation

```bash
# Using yarn
yarn add @yarn-tool/version-recommended

# Using yarn-tool
yarn-tool add @yarn-tool/version-recommended
# yt is an alias for yarn-tool
yt add @yarn-tool/version-recommended

# Using pnpm
pnpm add @yarn-tool/version-recommended

# Using npm
npm install @yarn-tool/version-recommended
```

## Usage

### 由版本字串推薦

```typescript
import { nextVersionRecommended } from '@yarn-tool/version-recommended';

nextVersionRecommended('1.0.0');
// { bump: 'patch', oldVersion: '1.0.0', newVersion: '1.0.1' }

nextVersionRecommended('1.0.0', { minor: true });
// { bump: 'minor', oldVersion: '1.0.0', newVersion: '1.1.0' }

// 預發行版本會自動偵測並保留 preid / Pre-release versions keep their preid
nextVersionRecommended('1.0.0-beta.1');
// { bump: 'prerelease', oldVersion: '1.0.0-beta.1', newVersion: '1.0.0-beta.2' }
```

### 由 package.json 推薦

```typescript
import { nextVersionRecommendedByPackage } from '@yarn-tool/version-recommended';

const pkg = { name: 'my-pkg', version: '1.0.0' };

nextVersionRecommendedByPackage(pkg);
// { bump: 'patch', oldVersion: '1.0.0', newVersion: '1.0.1', pkg }
```

### 自動尋找專案根目錄 (Find up the project root)

```typescript
import nextVersionRecommendedByPackageFindUp from '@yarn-tool/version-recommended';

const result = nextVersionRecommendedByPackageFindUp({ cwd: process.cwd() });
// 自動讀取最近的 package.json 並回傳推薦版本
```

### workspaces 專案

```typescript
import {
	nextVersionRecommendedByWorkspacesProject,
	nextVersionRecommendedByWorkspacesFindUp,
} from '@yarn-tool/version-recommended';
import WorkspacesProject from '@yarn-tool/workspaces-project';

// 已有 WorkspacesProject 實例
nextVersionRecommendedByWorkspacesProject('1.0.0', new WorkspacesProject(cwd));

// 自動向上尋找並建立實例
nextVersionRecommendedByWorkspacesFindUp('1.0.0', { cwd });
```

## CLI

以 CLI 對 `package.json` 更新版本，新舊版本以 diff 著色（major 紅、minor 青、patch 綠），選項與 `setupToYargs` 一致：

```bash
# 依 bump / preid 推薦並寫回 package.json
version-recommended --cwd ./packages/my-pkg --bump minor

# 以 @yarn-tool/version-style-jetbrains 風格產生新版本
version-recommended --version-style jetbrains-date-time
version-recommended --version-style y2k-date-time --reset-daily-increment

# 只輸出不寫入
version-recommended --dry-run

# 純文字輸出（剝除 ANSI）
version-recommended --no-color

# 直接指定新版本
version-recommended --new-version 2.0.0
```

輸出格式：

```
@my-scope/my-pkg
  1.2.3 → 1.2.4
  /path/to/package.json
```

本地開發可改用 `node --run bin:self -- [args]`（等同 `tsx ./bin/version-recommended.ts`）。

## API Documentation

### `nextVersionRecommended(oldVersion, options?, wsProject?): INextVersionRecommended`

核心函式：回傳依舊版本與選項推算出的推薦版本。

**參數：**

- `oldVersion` — 舊版本號字串 (Required)
- `options` — 推薦選項，見 [Configuration](#configuration-options)
- `wsProject` — `WorkspacesProject` 實例，用於取得 monorepo 預設 bump

**回傳值 `INextVersionRecommended`：**

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `bump` | `ReleaseType` | 實際使用的 bump 類型 |
| `oldVersion` | `string` | 傳入的舊版本號 |
| `newVersion` | `string` | 推薦的新版本號 |

### `nextVersionRecommendedByPackage(pkg, options?)`

傳入含 `version` 欄位的 `package.json` 物件；`pkg.version` 缺失時拋出 `TypeError`。回傳值多含 `pkg` 欄位。

### `nextVersionRecommendedByPackageFindUp(options?)`

自 `options.cwd`（預設 `process.cwd()`）向上尋找專案根目錄，讀取 `package.json` 後呼叫 `nextVersionRecommendedByPackage`。為套件的預設匯出。

### `nextVersionRecommendedByWorkspacesProject(oldVersion, wsProject, options?)`

以既有的 `WorkspacesProject` 實例計算，可取得 monorepo 的預設 bump 策略。

### `nextVersionRecommendedByWorkspacesFindUp(oldVersion, options?)`

依 `options.cwd` 自動建立 `WorkspacesProject` 後再計算。

### `setupToYargs(yargs)`

註冊與 `yarn version` 相容的命令列選項（見 [Configuration](#command-line-options)），回傳設定後的 yargs。

## Configuration

### Options

```typescript
interface INextVersionRecommendedOptions extends ITSPartialRecord<ReleaseType, boolean>
{
	// 工作目錄
	cwd?: string;
	// 指Explicit bump type
	bump?: ReleaseType;
	// Pre-release identifier (e.g. "beta")
	preid?: string;
	// Numeric base for pre-release; false disables reset
	identifierBase?: IdentifierBase | 0 | 1 | false;
	// Fallback preid for numeric-only pre-releases
	defaultPreid?: string,
	// 以 @yarn-tool/version-style-jetbrains 風格產生新版本
	versionStyle?: EnumVersionStyle;
	// 風格模式：重設當日遞增號，從 1 重新開始
	// （每日遞增只算同一天：不同日時不論此值為何都會重新產生）
	resetDailyIncrement?: boolean;
	// 風格模式：產生新版本所用的日期（預設為執行當下，內部／測試用途）
	date?: IDateInput;
}
```

同時也可直接以布林旗標指定 bump 類型：`major`、`minor`、`patch`、`premajor`、`preminor`、`prepatch`、`prerelease`，例如 `{ minor: true }`。

指定 `versionStyle` 時，`newVersion` 改由 `@yarn-tool/version-style-jetbrains` 產生，該路徑只看 `versionStyle`、`resetDailyIncrement`、`date` 與 preid 系列（`preid` / `defaultPreid`），不套用 semver 遞增規則：

**每日遞增只計算同一天**：舊版本與產生日期不同日時，不論 `resetDailyIncrement` 為何都會以產生日期重新產生（遞增號回到 1）；同日才遞增舊版本的當日計數。不同時間的版本編號必然不同，時間段已足以區分同一天的多次發版。

```typescript
import { EnumVersionStyle } from '@yarn-tool/version-style-jetbrains';

// 同日未重設 → 沿用舊版本日期時間，遞增當日計數
nextVersionRecommended('264.1120.1744-1', {
	versionStyle: EnumVersionStyle.JetbrainsDateTime,
	date: new Date(2026, 10, 20, 17, 44),
});
// { newVersion: '264.1120.1744-2' }

// 同日重設 → 以 date 產生，遞增號重設為 1
nextVersionRecommended('264.1120.1744-1', {
	versionStyle: EnumVersionStyle.JetbrainsDateTime,
	date: new Date(2026, 10, 20, 17, 44),
	resetDailyIncrement: true,
});

// 舊版本非此風格（或非風格版本）→ 以指定風格產生新版本
nextVersionRecommended('5.5.0', { versionStyle: EnumVersionStyle.JetbrainsShortMD });
```

`date` 為內部／測試用途：指定產生新版本所用的日期，預設為執行當下。

指定 `preid`（或缺省的 `defaultPreid`）時會停用當日遞增後綴：`-n` 與 preid 的 `-xxx` 同時存在會讓版本號帶兩段連字號，停用後才能安全地附加 preid：

```typescript
nextVersionRecommended('264.1120.1744-1', { versionStyle: EnumVersionStyle.JetbrainsDateTime, preid: 'beta' });
// { newVersion: '264.1120.1744-beta' } — 沒有 -1 後綴，只有一段連字號
```

### 偵測規則

當舊版本含預發行資訊且未明確指定 `bump` 時：

1. 預發行段有多個元素（如 `1.0.0-beta.1`）→ 取第一段作為 `preid`，bump 為 `prerelease`
2. 預發行段為純數字（如 `1.0.0-1`）→ 設定 `identifierBase: false`，避免遞增後重置為 1
3. 其他（如 `1.0.0-beta`）→ 採用 `defaultPreid`
4. 指定的 bump 非預發行類型時，自動加上 `pre` 前綴（`minor` → `preminor`）

### 命令列選項

`setupToYargs` 提供以下選項：

| 選項 | 型別 | 說明 |
| --- | --- | --- |
| `--no-git-tag-version` | boolean | 不建立 git tag（預設 `true`） |
| `--no-commit-hooks` | boolean | 提交新版本時略過 commit hooks |
| `--new-version` | string | 指定新版本號 |
| `--major` / `--minor` / `--patch` | boolean | 自動遞增對應版本號 |
| `--premajor` / `--preminor` / `--prepatch` / `--prerelease` | boolean | 自動遞增對應預發行版本號 |
| `--non-interactive` | boolean | 不顯示互動提示 |
| `--bump` | string | 指定 bump 類型 |
| `--preid` | string | 預發行識別字串 |
| `--default-preid` | string | 預設預發行識別字串 |
| `--version-style` | string | 以 `@yarn-tool/version-style-jetbrains` 風格產生新版本（如 `jetbrains-date-time`） |
| `--reset-daily-increment` | boolean | 風格模式下將當日遞增號重設為 1 |
