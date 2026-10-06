# yarn-list-link

> show list of yarn link

列出目前專案中所有 `yarn link` 關聯 (Linked Modules) 的 CLI 與函式庫 (Library)。

## 特色 (Features)

- 直接讀取 `node_modules/.yarn-integrity` 的 `linkedModules` 欄位，不需啟動 Yarn 進程 (Process)。
- 自動向上尋找工作區根目錄 (Workspace Root)，在子套件中執行也能列出整個工作區的連結。
- 同時提供 CLI 與 API：可用指令列輸出，也可在程式中取得字串陣列。
- 沒有任何連結時以結束碼 (Exit Code) `1` 結束，方便寫進 shell script 判斷。

## 安裝 (Installation)

```bash
yarn add yarn-list-link
yarn-tool add yarn-list-link
yt add yarn-list-link
```

## 使用方式 (Usage)

### CLI

```bash
# 在專案任一目錄下執行
npx yarn-list-link
```

輸出為每一行一個已連結的模組路徑；若沒有任何連結，則輸出錯誤訊息並以結束碼 `1` 結束。

### API

```ts
import yarnListLink from 'yarn-list-link';

const linked = yarnListLink(process.cwd());

console.log(linked);
// => [ 'D:/path/to/linked-package' ]
```

## API 文件 (API Documentation)

| 函式 | 說明 |
|------|------|
| `yarnListLink(cwd)` | 從 `cwd` 向上尋找工作區根目錄，再回傳該根目錄下的連結清單 |
| `yarnListLinkCore(cwd)` | 直接以 `cwd` 當作根目錄讀取連結清單，不做向上尋找 |
| `getYarnIntegrityPath(cwd)` | 回傳 `cwd` 底下 `.yarn-integrity` 檔案的路徑 |

| 參數 | 型別 | 說明 |
|------|------|------|
| `cwd` | `string` | 起始目錄（`yarnListLinkCore` 則直接視為根目錄） |
| 回傳值 | `string[]` | 已連結模組的絕對路徑；`yarnListLinkCore` 找不到 `.yarn-integrity` 時回傳 `undefined` |

`yarnListLink` 找不到工作區根目錄時會拋出 `can't found current package root` 錯誤。

## 設定 (Configuration)

本套件沒有設定檔，行為完全由傳入的 `cwd` 決定：

| 行為 | 說明 |
|------|------|
| 資料來源 | 讀取 `<root>/node_modules/.yarn-integrity` 的 `linkedModules` 欄位 |
| 根目錄搜尋 | `yarnListLink` 使用 `find-yarn-workspace-root2` 向上尋找 |
| 路徑格式 | 回傳值皆經 `upath2` 正規化 (Normalize)，跨平台一致 |
