# @yarn-tool/pkg-git-info

把 Git 遠端網址（Remote URL）解析成託管 Git 資訊（Hosted Git Info），並輸出可直接填入 `package.json` 的 `homepage`、`bugs`、`repository` 三個欄位。

底層使用 `hosted-git-info` 與 `@git-lazy/info`：先從目前目錄向上尋找 `.git/config`，讀取 `remote.origin.url`，再依 GitHub / GitLab / Bitbucket 等託管平台轉換成對應網址。

## Features

- 自動從 `cwd` 向上尋找 Git 設定檔（Config），無需手動傳入遠端網址
- 支援 GitHub、GitLab、Bitbucket、Gitee 等 `hosted-git-info` 認識的託管平台
- 一次產出 `homepage` / `bugs` / `repository` 三個欄位，可直接寫入 `package.json`
- 提供惰性版本（Lazy Variant）：解析失敗時回傳 `undefined` 而非拋出例外
- 保留原始 `HostedGitInfo` 物件（`_` 欄位），供進階用法自行取用

## Installation

```bash
yarn add @yarn-tool/pkg-git-info
yarn-tool add @yarn-tool/pkg-git-info
yt add @yarn-tool/pkg-git-info

pnpm add @yarn-tool/pkg-git-info

npm install @yarn-tool/pkg-git-info
```

## Usage

```ts
import npmHostedGitInfo, { npmHostedGitInfoLazy, npmHostedGitInfoCore } from '@yarn-tool/pkg-git-info';

// 由目前目錄推斷 Git 遠端，並取得三個欄位
const info = npmHostedGitInfo(process.cwd());

if (info)
{
	console.log(info.homepage);    // https://github.com/user/repo
	console.log(info.bugs);        // https://github.com/user/repo/issues
	console.log(info.repository);  // https://github.com/user/repo.git
}

// 惰性版本：不在 Git repo、或無法解析時回傳 undefined
const safe = npmHostedGitInfoLazy('/path/to/project');

// 已有 HostedGitInfo 實例時，可直接轉成三個欄位
const fields = npmHostedGitInfoCore(hostedGitInfoInstance);
```

## API Documentation

### `npmHostedGitInfo(cwd?)`

預設匯出（Default Export）。從 `cwd`（預設為目前工作目錄）向上尋找 Git 設定檔，解析 `remote.origin.url` 並回傳 `INpmHostedGitInfo`。

- 找不到 Git 設定檔時回傳 `undefined`。
- 找到設定檔但遠端網址無法辨識時，`hosted-git-info` 可能回傳空值，同樣會得到 `undefined`。

### `npmHostedGitInfoLazy(cwd?)`

同 `npmHostedGitInfo`，但以 `try/catch` 包裹：任何解析錯誤（例如設定檔格式異常、網址不合規格）一律回傳 `undefined`，適合不希望中斷流程的批次處理。

### `npmHostedGitInfoCore(info)`

把既有的 `HostedGitInfo` 實例直接轉成 `INpmHostedGitInfo`，三個網址皆以 `noCommittish: true` 產生，避免把 commit / branch / tag 附加到 `homepage`、`bugs`、`repository` 上（package.json 的欄位應指向穩定位置）。

### `getHostedGitInfo(config)`

低階函式（Low-level）：輸入 `@git-lazy/info` 的 `parseConfig()` 結果，過濾遠端網址後回傳 `HostedGitInfo` 物件。

### `INpmHostedGitInfo`

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `homepage` | `string` | 套件首頁網址 |
| `bugs` | `string` | 缺陷回報網址（純字串，填入 package.json 時需包成 `{ url }`） |
| `repository` | `string` | 遠端仓库網址（建議使用 `https` 形式） |
| `_` | `HostedGitInfo` | 原始 `hosted-git-info` 實例，供進階操作使用 |

## Configuration

本套件沒有設定檔，行為完全由輸入參數決定：

- `cwd`：起始目錄，會向上層尋找 Git 設定檔；在 monorepo 子套件中可傳入套件目錄，仍會找到共用的 repo 根目錄。
- `getHostedGitInfo` 的輸入則是已解析的 Git 設定內容，可搭配 `@git-lazy/info` 的 `findConfigPathLocal()` / `parseConfig()` 自行組合。

若需要把結果填入 `package.json`（包含 workspace 的 `repository.directory` 與 `homepage` 分支路徑），請改用上層套件 [`@yarn-tool/pkg-hosted-info`](../pkg-hosted-info/README.md)。
