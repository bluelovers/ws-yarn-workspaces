# @yarn-tool/pkg-hosted-info

自動填入 `package.json` 的託管 Git 資訊欄位（Hosted Git Info）：`homepage`、`bugs`、`repository`。

資料來源為 `@yarn-tool/pkg-git-info` 所解析的託管平台資訊，並搭配 `@yarn-tool/find-root` 取得 workspace 根目錄，因此在 monorepo 的子套件中也能正確產生 `repository.directory` 與指向特定分支的 `homepage`。

## Features

- 依目標目錄（target directory）自動推斷 `homepage`、`bugs.url`、`repository`
- 支援 monorepo workspace：自動計算 `repository.directory` 相對路徑
- `homepage` 會自動附加 `/tree/<branch>/<directory>`，直接指向套件所在資料夾
- 提供「僅填入缺漏欄位」與「強制覆寫（Overwrite）」兩種模式
- 惰性求值（Lazy）：未指定 `rootData` / `hostedGitInfo` 時才自行推斷

## Installation

```bash
yarn add @yarn-tool/pkg-hosted-info
yarn-tool add @yarn-tool/pkg-hosted-info
yt add @yarn-tool/pkg-hosted-info
```

## Usage

```ts
import fillPkgHostedInfo from '@yarn-tool/pkg-hosted-info';

// 自動偵測目前專案並補齊缺漏欄位
const pkg = fillPkgHostedInfo({ name: 'my-package' });

// 指定目標目錄與分支
fillPkgHostedInfo({ name: 'my-package' }, {
  targetDir: 'packages/my-package',
  branch: 'main',
});

// 強制以託管平台的資訊覆寫既有欄位
fillPkgHostedInfo(pkg, { overwriteHostedGitInfo: true });
```

## API Documentation

### `fillPkgHostedInfo(pkg, options?)`

預設匯出（Default Export），也是具名匯出。就地（in-place）填入 `pkg` 的 `homepage`、`bugs`、`repository` 欄位，並回傳同一個物件。

- 當 `overwriteHostedGitInfo` 為 `true`，或 `homepage` / `bugs` / `repository` 任一欄位缺失時才會執行；否則直接回傳原物件。
- `rootData` 未提供時，會以 `targetDir` 為起點呼叫 `findRootLazy()` 推斷。
- `targetDir` 未提供時，取 `rootData.pkg`。
- `hostedGitInfo` 未提供時，會以 `targetDir` 呼叫 `npmHostedGitInfoLazy()` 取得。
- 若推斷結果不含託管 Git 資訊（例如不是 Git repo），則不修改 `pkg`。

### `_hostedGitInfoToFields(pkg, options)`

底層函式（Low-level），把既有的 `hostedGitInfo`、`rootData`、`targetDir` 直接轉換成 `homepage` / `bugs` / `repository` 欄位。`options` 為必填，不會自行推斷，適合已在外部取得資料的呼叫端。

### 介面（Interfaces）

| 名稱 | 說明 |
| --- | --- |
| `IFillPkgHostedInfoOptions` | `fillPkgHostedInfo` 的選項：`targetDir`、`rootData`、`branch`、`hostedGitInfo`、`overwriteHostedGitInfo` |
| `IFillPkgHostedInfoFields` | 回傳值保證存在的欄位型別：`homepage`、`bugs.url`、`repository.{type,url,directory}` |

#### `IFillPkgHostedInfoOptions`

| 欄位 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `targetDir` | `string` | `rootData.pkg` | 套件所在目錄，用於推斷 workspace 相對路徑 |
| `rootData` | `IFindRootReturnType` | `findRootLazy({ cwd: targetDir })` | 已解析的根目錄資料，可避免重複查找 |
| `branch` | `string` | `'master'` | 組成 `homepage` 時使用的分支名稱 |
| `hostedGitInfo` | `INpmHostedGitInfo` | `npmHostedGitInfoLazy(targetDir)` | 托管平台資訊（homepage / bugs / repository 網址） |
| `overwriteHostedGitInfo` | `boolean` | `false` | `true` 時無條件覆寫既有欄位；`false` 僅填入缺漏欄位 |

## Configuration

本套件本身沒有設定檔；行為完全由 `fillPkgHostedInfo(pkg, options?)` 的 `options` 決定。

若要在 monorepo 中取得正確的 `repository.directory`，請確認目標套件位於 workspace 根目錄之下，如此 `rootData.hasWorkspace` 為 `true` 且 `rootData.isWorkspace` 為 `false` 時，才會以 `relative(rootData.ws, targetDir)` 計算相對路徑。

`homepage` 的分支預設為 `master`；若專案使用 `main` 等其他主分支，請透過 `branch` 選項指定。
