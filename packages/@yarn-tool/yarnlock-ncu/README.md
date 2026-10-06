# @yarn-tool/yarnlock-ncu

更新 yarn.lock（v1 與 Berry）的工具：解析 lockfile 中以 tag 或 alias 指定的依賴項目 (dependency entries)，查詢目前最新版本並產出可重新解析的更新後 lockfile 內容。

## 簡介 (Introduction)

`@yarn-tool/yarnlock-ncu` 用來更新 yarn.lock v1 與 Berry 格式的鎖定檔。它會逐一檢查 lockfile 的每一個項目，當項目型別為 `tag`（例如 `latest`）或 `npm:` 別名 (alias) 時，向 registry 查詢目前可取得的最新版本；只有在查詢結果嚴格高於 (strictly greater than) 目前鎖定版本時，才會移除該項目並寫入報告，讓 yarn 在下次安裝時重新解析 (re-resolve) 到較新的版本。

函式本身不直接操作磁碟，而是回傳新舊內容的字串與差異報告，方便呼叫端自行決定是否寫回 `yarn.lock`。

## 特色 (Features)

- 同時支援 yarn.lock v1 與 Berry 格式（透過 `@yarn-tool/yarnlock-entries` 解析與序列化）。
- 處理 `tag` 型項目與 `npm:` 別名項目，依 sub-spec 型別推導適當的 semver range (語意化版本範圍)。
- 僅在新版本嚴格較高時才更新，避免降級 (downgrade) 或造成無意義的 lockfile 差異。
- 查詢失敗（例如版本不存在）時僅發出警告並略過該項目，不中斷整批更新。
- 提供 `printReport` 以彩色表格 (colored table) 呈現新舊版本差異。

## 安裝 (Installation)

```bash
yarn add @yarn-tool/yarnlock-ncu
yarn-tool add @yarn-tool/yarnlock-ncu
yt add @yarn-tool/yarnlock-ncu
```

## 用法 (Usage)

```ts
import updateYarnLockTag, { printReport } from '@yarn-tool/yarnlock-ncu';
import { readFileSync, writeFileSync } from 'fs';

const yarnlock_old = readFileSync('yarn.lock', 'utf8');

const { yarnlock_new, yarnlock_changed, report } = await updateYarnLockTag(yarnlock_old);

if (yarnlock_changed)
{
	writeFileSync('yarn.lock', yarnlock_new);

	console.log(printReport(report));
}
```

## API 文件 (API Documentation)

### `updateYarnLockTag(yarnlock_old: Buffer | string): Promise<IYarnLockUpdate>`

預設匯出 (default export)，同時也是具名匯出。解析輸入的 lockfile 內容，更新可升級的 `tag` 與 `npm:` 別名項目，回傳：

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `yarnlock_old` | `string` | 經標準序列化後的原始 lockfile 內容 |
| `yarnlock_new` | `string` | 更新後的 lockfile 內容 |
| `yarnlock_changed` | `boolean` | 新舊內容是否有差異，可用來避免多餘的寫檔 |
| `report` | `IYarnLockUpdateReport` | 被移除（待重新解析）的項目報告 |

### `printReport(report: IYarnLockUpdateReport, options?): string`

將報告轉為依賴表格 (dependency table) 文字：每列顯示項目名稱、舊版本、箭頭與上色後的新版本差異；沒有任何更新時回傳空字串 `''`。

### 型別 (Types)

```ts
interface IYarnLockUpdateReport
{
	removed?: Record<string, {
		from: string,
		to: string,
	}>
}

interface IYarnLockUpdate
{
	yarnlock_old: string,
	yarnlock_new: string,
	yarnlock_changed: boolean,
	report: IYarnLockUpdateReport,
}
```

## 設定 (Configuration)

`printReport(report, options?)` 的 `options`：

| 選項 | 型別 | 說明 |
| --- | --- | --- |
| `chalk` | `IChalk` | 自訂的著色 (colorize) 實例；未提供時依 `console` 推斷 |
| `console` | `Console` | 用來推斷 chalk 色彩能力的 console 物件 |

`updateYarnLockTag` 本身沒有設定選項，版本查詢透過 `@yarn-tool/pkg-version-query` 的快取 (Cache) 進行。
