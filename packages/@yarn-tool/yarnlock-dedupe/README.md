# @yarn-tool/yarnlock-dedupe

yarn.lock 去重 (Deduplication) 工具：自動偵測 (auto detect) yarn v1 與 Berry 格式，列出並修正 lockfile 中重複的依賴項目。

## 簡介 (Introduction)

`@yarn-tool/yarnlock-dedupe` 是針對 yarn.lock 的去重工具，會先以 `@yarn-tool/detect-yarnlock-version` 偵測鎖定檔 (lockfile) 的格式，再分派到對應的實作：yarn v1 交由 `yarn-deduplicate` 處理，yarn Berry（v2/v3）交由 `yarn-berry-deduplicate` 處理。偵測失敗時會丟出 `TypeError`。

除了回傳字串的函式外，也提供一次回傳新舊內容與是否變動的 `yarnDedupe`，以及直接讀取檔案路徑的 `yarnDedupeFile`。

## 特色 (Features)

- 自動偵測 yarn.lock 格式（v1 / v2 / v3），單一 API 覆蓋兩種生態系。
- 提供列出重複項目 (list) 與產出去重整 content (fix) 兩種操作層級。
- `yarnDedupe` 回傳 `yarnlock_changed`，可避免無變動時的多餘寫檔。
- Berry 實作會保留 yarn.lock 開頭的橫幅註解 (banner)。
- 支援依 scope (套件命名空間) 與套件名稱篩選要處理的範圍。

## 安裝 (Installation)

```bash
yarn add @yarn-tool/yarnlock-dedupe
yarn-tool add @yarn-tool/yarnlock-dedupe
yt add @yarn-tool/yarnlock-dedupe
```

## 用法 (Usage)

```ts
import { listDuplicates, fixDuplicates, yarnDedupeFile } from '@yarn-tool/yarnlock-dedupe';
import { readFileSync, writeFileSync } from 'fs';

const yarnlock = readFileSync('yarn.lock', 'utf8');

// 列出重複的項目鍵值 (entry keys)
const duplicates: string[] = listDuplicates(yarnlock);

// 取得去重後的內容
const fixed = fixDuplicates(yarnlock);

// 讀檔、比對並依需要寫回
const { yarnlock_new, yarnlock_changed } = yarnDedupeFile('yarn.lock');

if (yarnlock_changed)
{
	writeFileSync('yarn.lock', yarnlock_new);
}
```

## API 文件 (API Documentation)

所有函式皆可由套件根目錄匯入；也可用 `import v1 from '@yarn-tool/yarnlock-dedupe/lib/v1'` 或 `.../lib/v2` 直接取得特定格式的實作。

### `listDuplicates(yarnlock_old, options?): string[]`

回傳重複項目的鍵值 (entry keys) 陣列；內容可以是 `Buffer` 或 `string`。

### `fixDuplicates(yarnlock_old, options?): string`

回傳去重後的 lockfile 內容字串。v1 實作直接輸出去重結果，v2 實作會先拆出橫幅註解 (banner) 再拼回輸出。

### `yarnDedupe(yarnlock_old, options?)`

執行去重並回傳：

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `yarnlock_old` | `string` | 執行前的 yarn.lock |
| `yarnlock_new` | `string` | 執行後的 yarn.lock |
| `yarnlock_changed` | `boolean` | 內容是否有變動 |

### `yarnDedupeFile(yarnlock_old_file, options?)`

與 `yarnDedupe` 相同，但以檔案路徑讀取 `yarn.lock` 內容。

### 預設匯出 (Default export)

```ts
import dedupe from '@yarn-tool/yarnlock-dedupe';

dedupe.listDuplicates(...)
dedupe.fixDuplicates(...)
dedupe.yarnDedupe(...)
```

### `object.ts`（已棄用 / deprecated）

`@yarn-tool/yarnlock-dedupe/object` 提供接受 `Record<string, any>` 輸入的同名函式，內部會先以 `yarnLockStringify` 序列化後再委派給根目錄實作；新程式碼建議直接使用根目錄 API。

## 設定 (Configuration)

所有函式的第二個引數皆為 `IOptionsDedupe`：

| 選項 | 型別 | 說明 |
| --- | --- | --- |
| `includeScopes` | `string[]` | 只處理指定 scope（如 `types`）的套件 |
| `includePackages` | `string[]` | 只處理指定的套件名稱 |
| `excludePackages` | `string[]` | 排除指定的套件名稱 |
| `useMostCommon` | `boolean` | 保留較常見的版本，而非一律升級 (v1 選項) |
