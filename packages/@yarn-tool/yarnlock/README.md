# @yarn-tool/yarnlock

`util for yarn.lock` —— 針對 `yarn.lock` 的工具函式庫 (Utility Library)，提供解析 (Parse)、過濾 (Filter)、去重 (Deduplicate) 與差異比較 (Diff) 等常見操作，也是 `yarn-tool` 系列指令背後共用的核心 API。

## Features

- 讀取與寫入 `yarn.lock`（轉呼叫 `@yarn-tool/yarnlock-fs`）
- 依 `package.json` 的 `resolutions` 過濾或移除 `yarn.lock` 內的條目
- 偵測同一模組被安裝多個版本的情況，並萃取每個模組的最大安裝版本
- 以單一函式完成 `yarn.lock` 去重，並產出去重前後的差異資訊
- `wrapDedupe` 管線：以 `init` / `before` / `main` / `after` / `end` 五個步驟 (Step) 包裝整套去重流程
- 解析 `yarn.lock` 的鍵值 (Key)，拆出模組名稱與版本範圍

## Installation

```bash
yarn add @yarn-tool/yarnlock
yarn-tool add @yarn-tool/yarnlock
yt add @yarn-tool/yarnlock
```

## Usage

### 去重 yarn.lock

```ts
import { yarnDedupe, yarnLockDiff } from '@yarn-tool/yarnlock';
import { readFileSync, writeFileSync } from 'fs-extra';

const file = 'yarn.lock';
const before = readFileSync(file, 'utf-8');

const ret = yarnDedupe(before);

if (ret.yarnlock_changed)
{
	writeFileSync(file, ret.yarnlock_new);

	// 產出去重前後的差異 (Diff) 訊息
	console.log(yarnLockDiff(ret.yarnlock_old, ret.yarnlock_new));
}
```

### 依 package.json 的 resolutions 過濾

```ts
import { filterResolutions, exportYarnLock } from '@yarn-tool/yarnlock';
import { parse } from '@yarnpkg/lockfile';
import { readFileSync } from 'fs-extra';

const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
const record = parse(readFileSync('yarn.lock', 'utf-8')).object;

// 只保留 package.json 的 resolutions 有指定的模組
const result = filterResolutions(pkg, record);

console.dir(result?.deps, { depth: null });
```

### 取得重複安裝的模組

```ts
import { filterDuplicateYarnLock, exportYarnLock } from '@yarn-tool/yarnlock';
import { parse } from '@yarnpkg/lockfile';
import { readFileSync } from 'fs-extra';

const record = parse(readFileSync('yarn.lock', 'utf-8')).object;

// 找出同一模組被安裝多個版本的條目
const dup = filterDuplicateYarnLock(record);

console.dir(dup.installed, { depth: null });
```

### 拆解 yarn.lock 鍵值

```ts
import { stripDepsName } from '@yarn-tool/yarnlock';

// => ['@scope/foo', '^1.0.0']
stripDepsName('@scope/foo@^1.0.0');
```

## API Documentation

| 匯出 | 說明 |
| --- | --- |
| `filterResolutions(pkg, yarnlock)` | 依 `pkg.resolutions` 過濾 `yarn.lock` 資料，沒有 `resolutions` 時回傳 `null` |
| `removeResolutions(pkg, yarnlock_old)` | 移除 `resolutions` 對應的條目，回傳新舊資料與是否有變動 |
| `removeResolutionsCore(result, yarnlock_old)` | `removeResolutions` 的核心實作，直接吃過濾結果 |
| `filterDuplicateYarnLock(yarnlock)` | 取得同一模組安裝多個版本的重複 (Duplicate) 條目 |
| `exportYarnLock(yarnlock, filter?)` | 將 `yarn.lock` 資料依模組名稱彙整為 `deps` / `installed` / `max` |
| `stripDepsName(name)` | 拆解 `name@version` 鍵值為 `[名稱, 版本範圍]` |
| `yarnDedupe(yarnlock)` | 對 `yarn.lock` 內容字串執行去重，回傳新舊內容與是否變動（`Dedupe` 為 deprecated 別名） |
| `yarnLockDiff(before, after)` | 產生兩份 `yarn.lock` 的差異字串（default export） |
| `_diffArray` | 產出差異陣列的底層格式化工具 |
| `checkAndReadYarnLockFileSafe(cwd)` | 安全地查找並讀取 `yarn.lock`（不存在時不拋錯） |
| `writeYarnLockFile(...)` | 寫入 `yarn.lock` 檔案 |
| `wrapDedupe(yarg, argv, options)` | 以步驟管線包裝去重流程（deprecated，建議使用各步驟自行組合） |
| `infoFromDedupeCache(cache)` | 自 `wrapDedupe` 的快取 (Cache) 萃取彙整資訊 |

型別：`IFilterResolutions`、`IRemoveResolutions`、`IYarnLockfileParseObject`（deprecated）、`IWrapDedupeCache`、`IWrapDedupeCacheRuntime`、`IWrapDedupeReturnType`、`IInfoFromDedupeCacheReturnType`、`IFsYarnLockReturnType`、`IOptionsDedupe`。

## Configuration

`wrapDedupe` 透過 `IWrapDedupeOptions` 設定管線行為：

| 選項 | 必要 | 說明 |
| --- | --- | --- |
| `main` | 是 | 主要步驟，於第一次去重後執行 |
| `init` | 否 | 初始化步驟，只要初始化未發生錯誤必定執行 |
| `before` | 否 | 第一次去重前執行 |
| `after` | 否 | 第二次去重後執行 |
| `end` | 否 | 結束前執行，未發生錯誤必定執行 |
| `cache` | 否 | 步驟間共享的快取，會影響部分行為（如 `cwd`） |
| `consoleDebug` | 否 | 除錯用的 console 實例 |

各步驟回傳 truthy 值即可中斷後續步驟；執行狀態記錄於快取的 `ret` 欄位（`true` 代表中斷、`null` 代表步驟不存在、`undefined` 代表未執行）。
