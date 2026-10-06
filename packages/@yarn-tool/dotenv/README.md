# @yarn-tool/dotenv

從工作區 (Workspace) 向上尋找並載入 dotenv 環境變數檔 (Environment Variables File)。

## Features

- 從 `cwd` 逐層向上搜尋，直到工作區根目錄為止
- 依模式 (Mode) 決定載入優先順序：`.env.{mode}.local` → `.env.local` → `.env.{mode}` → `.env`
- `test` 模式刻意排除 `.env.local`，確保所有人測試結果一致
- 自動辨識 `NODE_ENV`，亦可手動指定 `isTest` / `dev`
- 回傳實際載入的檔案路徑、所在層級與檔案是否存在
- 提供 `register.ts` 副作用入口，於 `ts-node`/`jest` 等環境直接註冊

## Installation

```bash
yarn add @yarn-tool/dotenv
yarn-tool add @yarn-tool/dotenv
yt add @yarn-tool/dotenv
```

## Usage

### 基本用法

```ts
import wsEnvConfig from '@yarn-tool/dotenv';

const { parsed, path, current, fileExists } = wsEnvConfig();

if (fileExists)
{
	console.log(`loaded from ${path}`, parsed);
}
```

### 以副作用方式載入

```ts
// 於進入點最上方載入，載入後即可直接使用 process.env
import '@yarn-tool/dotenv/register';
```

### 指定模式

```ts
import { dotEnvFiles, wsEnvConfig } from '@yarn-tool/dotenv';

// 手動指定為 development 模式
const { dotenvFiles } = dotEnvFiles({ dev: true });

// 從指定目錄開始向上搜尋
wsEnvConfig('/path/to/project');
```

## API Documentation

### `wsEnvConfig<E>(cwd?, options?): DotenvConfigOutput & { path, cwd, current, fileExists }`

套件主要入口 (Main Entry)，也是預設匯出 (Default Export)。從 `cwd`（預設 `process.cwd()`）逐層向上，於每一層依序嘗試載入 dotenv 檔；第一個成功載入（無 `error`）的檔案即回傳。

| 回傳欄位 | 說明 |
| --- | --- |
| `parsed` | 解析後的環境變數物件 |
| `path` | 最後嘗試的檔案路徑 |
| `cwd` | 傳入（或預設）的起始目錄 |
| `current` | 最後搜尋到的層級 |
| `fileExists` | 該檔案是否存在 |
| `error` | 載入失敗時的錯誤（含 `code`） |

### `dotenvFiles(options?): { isTest, dev, mode, dotenvFiles }`

依選項計算模式與待載入的檔案清單（依優先順序排列）。

- `isTest`：未傳入時以 `process.env.NODE_ENV === 'test'` 判斷
- `mode`：`test` / `development` / `production`
- `dotenvFiles`：過濾後的檔案名陣列

### `IDotenvFilesParams`

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `isTest` | `boolean` | 是否為測試模式，預設自動判斷 `NODE_ENV` |
| `dev` | `boolean` | 是否為開發模式（僅在非測試模式時生效） |

### `register.ts`

副作用入口：載入時直接執行 `wsEnvConfig()`，將找到的環境變數寫入 `process.env`。

## Configuration

此套件無需設定檔，行為由 `cwd` 與 `IDotenvFilesParams` 參數控制：

- **搜尋範圍**：使用 `@yarn-tool/path-parents` 的 `pathUpToWorkspacesGenerator`，僅向上搜尋至工作區根目錄，不會一路掃到檔案系統根目錄
- **載入規則**：遵循 dotenv 的既有行為——已存在的 `process.env` 變數不會被覆寫，且每一層只取第一個成功載入的檔案
- **模式判定**：`isTest` 優先，其次看 `NODE_ENV`；`dev` 僅在非測試模式下將 `mode` 切換為 `development`
