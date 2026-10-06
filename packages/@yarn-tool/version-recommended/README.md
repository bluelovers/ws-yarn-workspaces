# @yarn-tool/version-recommended

Recommend the next semver version: auto-detect bump type and pre-release identifiers from an old version, with yarn workspaces / monorepo support

依舊版本號自動推薦下一個語意化版本 (Semantic Versioning)，可偵測預發行 (Pre-release) 識別字串，並支援 yarn workspaces / monorepo 專案。

## 功能特色 (Features)

- **自動推薦 bump 類型**：根據舊版本是否為預發行版本，自動推斷應使用 `prerelease`、`premajor` 等預發行類型
- **保留 preid**：舊版本如為 `1.0.0-beta.1`，遞增後仍會保留 `beta` 識別字串
- **identifierBase 偵測**：純數字預發行識別（如 `1.0.0-1`）自動以 `identifierBase: false` 遞增，避免重新從 0 起算
- **多種取用方式**：可直接傳入版本字串、傳入 `package.json` 物件，或自動向上尋找 (Find Up) 專案根目錄
- **workspaces 支援**：透過 `WorkspacesProject` 取得 monorepo 的預設 bump 策略
- **yargs 整合**：提供與 `yarn version` 相容的命令列選項設定

## 安裝 (Installation)

```bash
# 使用 yarn / Using yarn
yarn add @yarn-tool/version-recommended

# 使用 yarn-tool / Using yarn-tool
yarn-tool add @yarn-tool/version-recommended
# yt 是 yarn-tool 的別名 / yt is an alias for yarn-tool
yt add @yarn-tool/version-recommended

# 使用 pnpm / Using pnpm
pnpm add @yarn-tool/version-recommended

# 使用 npm / Using npm
npm install @yarn-tool/version-recommended
```

## 使用方式 (Usage)

### 由版本字串推薦 (From a version string)

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

### 由 package.json 推薦 (From package.json)

```typescript
import { nextVersionRecommendedByPackage } from '@yarn-tool/version-recommended';

const pkg = { name: 'my-pkg', version: '1.0.0' };

nextVersionRecommendedByPackage(pkg);
// { bump: 'patch', oldVersion: '1.0.0', newVersion: '1.0.1', pkg }
```

### 自動尋找專案根目錄 (Find up the project root)

```typescript
import nextVersionRecommendedByPackageFindUp from '@yarn-tool/version-recommended';

// 預設匯出即為此函式 / The default export is this function
const result = nextVersionRecommendedByPackageFindUp({ cwd: process.cwd() });
// 自動讀取最近的 package.json 並回傳推薦版本 / Reads the nearest package.json automatically
```

### workspaces 專案 (Workspaces project)

```typescript
import {
	nextVersionRecommendedByWorkspacesProject,
	nextVersionRecommendedByWorkspacesFindUp,
} from '@yarn-tool/version-recommended';
import WorkspacesProject from '@yarn-tool/workspaces-project';

// 已有 WorkspacesProject 實例 / When you already have a WorkspacesProject instance
nextVersionRecommendedByWorkspacesProject('1.0.0', new WorkspacesProject(cwd));

// 自動向上尋找並建立實例 / Find up and create the instance automatically
nextVersionRecommendedByWorkspacesFindUp('1.0.0', { cwd });
```

## API 文件 (API Documentation)

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

### 選項 (Options)

```typescript
interface INextVersionRecommendedOptions extends ITSPartialRecord<ReleaseType, boolean>
{
	// 工作目錄 / Working directory
	cwd?: string;
	// 指定 bump 類型 / Explicit bump type
	bump?: ReleaseType;
	// 預發行識別字串 / Pre-release identifier (e.g. "beta")
	preid?: string;
	// 預發行數字基準，false 表示不自動重置 / Numeric base for pre-release; false disables reset
	identifierBase?: IdentifierBase | 0 | 1 | false;
	// 當舊版本為純數字預發行時採用的預設 preid / Fallback preid for numeric-only pre-releases
	defaultPreid?: string,
}
```

同時也可直接以布林旗標指定 bump 類型：`major`、`minor`、`patch`、`premajor`、`preminor`、`prepatch`、`prerelease`，例如 `{ minor: true }`。

### 偵測規則 (Detection rules)

當舊版本含預發行資訊且未明確指定 `bump` 時：

1. 預發行段有多個元素（如 `1.0.0-beta.1`）→ 取第一段作為 `preid`，bump 為 `prerelease`
2. 預發行段為純數字（如 `1.0.0-1`）→ 設定 `identifierBase: false`，避免遞增後重置為 1
3. 其他（如 `1.0.0-beta`）→ 採用 `defaultPreid`
4. 指定的 bump 非預發行類型時，自動加上 `pre` 前綴（`minor` → `preminor`）

### 命令列選項 (Command Line Options)

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

## 版本 (Version)

當前版本：3.0.15
