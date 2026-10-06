# @yarn-tool/yarnlock-fs

`read/write yarnlock v1 and berry` —— 讀取與寫入 yarn.lock 檔案的工具套件，同時支援 v1（Yarn Classic）與 berry（Yarn Berry v2/v3），提供「檔案不存在也不拋錯」的安全讀取 (Safe Read) 與還原序列化 (Stringify) 寫入。

## Features

- `fsYarnLockSafe`：由專案根目錄讀取 yarn.lock，回傳路徑、是否存在與原始內容
- `checkAndReadYarnLockFileSafe`：指定路徑安全讀取，檔案不存在或內容為空時回傳 `undefined` 而非拋錯
- `writeYarnLockFile`：將解析後的資料還原為 yarn.lock 內容並寫入檔案
- 讀取結果以 `IFsYarnLockReturnType` 統一表示，方便在流程中傳遞與判斷狀態
- 以 `notEmpty` 判斷內容有效性，避免把空檔案誤當成「已存在」

## Installation

```bash
yarn add @yarn-tool/yarnlock-fs
yarn-tool add @yarn-tool/yarnlock-fs
yt add @yarn-tool/yarnlock-fs
```

## Usage

### 讀取專案根目錄的 yarn.lock

```ts
import { fsYarnLockSafe } from '@yarn-tool/yarnlock-fs';

const { yarnlock_file, yarnlock_exists, yarnlock_old } = fsYarnLockSafe(process.cwd());

if (yarnlock_exists)
{
	console.log(yarnlock_file, yarnlock_old.length);
}
else
{
	console.log('yarn.lock 不存在或內容為空');
}
```

### 指定檔案路徑安全讀取

```ts
import { checkAndReadYarnLockFileSafe } from '@yarn-tool/yarnlock-fs';

// 檔案不存在時回傳 undefined，不拋錯
const content = checkAndReadYarnLockFileSafe<string>('/path/to/yarn.lock', 'utf8');
```

### 寫入 yarn.lock

```ts
import { writeYarnLockFile } from '@yarn-tool/yarnlock-fs';
import { parse } from '@yarnpkg/lockfile';
import { readFileSync } from 'fs-extra';

const data = parse(readFileSync('yarn.lock', 'utf-8'));

// 內部以 yarnLockStringify 還原格式後寫入
writeYarnLockFile('yarn.lock', data as any);
```

## API Documentation

| 匯出 | 說明 |
| --- | --- |
| `fsYarnLockSafe(root)` | 由根目錄組出 `yarn.lock` 路徑並安全讀取；**預設匯出** |
| `fsYarnLock(root)` | 同上的舊版實作（deprecated），檔案為空時 `yarnlock_old` 為 `null` |
| `checkAndReadYarnLockFileSafe(file, options?)` | 讀取指定路徑；不存在或空白內容回傳 `undefined` |
| `writeYarnLockFile(file, data)` | 將 `IYarnLockSource` 序列化後寫入指定路徑，回傳 `writeFileSync` 結果 |
| `notEmpty(buf)` | 判斷 Buffer / 字串是否具有內容（內部工具） |

### IFsYarnLockReturnType

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `yarnlock_file` | `string` | yarn.lock 的完整路徑 |
| `yarnlock_exists` | `boolean` | 檔案是否存在且內容非空 |
| `yarnlock_old` | `string` | 讀取到的原始內容（`fsYarnLock` 的 deprecated 版本可能為 `null`） |

## Configuration

| 參數 | 說明 |
| --- | --- |
| `root` | 專案根目錄，`fsYarnLockSafe` / `fsYarnLock` 會以 `join(root, 'yarn.lock')` 組出路徑 |
| `file` | yarn.lock 的完整路徑，供 `checkAndReadYarnLockFileSafe` / `writeYarnLockFile` 直接使用 |
| `options` | 傳給 `readFileSync` 的讀取選項，可指定 `encoding`、`flag` 等（型別 `IOptionsReadFile`） |

版本偵測不在此套件的責任範圍：讀取結果為原始內容或來源資料，需解析時請搭配 `@yarn-tool/yarnlock-parse`。
