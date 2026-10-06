# sync-lockfile

同步 (sync) yarn.lock 到 yarn workspaces 中各個套件的工具：把 workspace 根目錄的 yarn.lock 複製 (copy) 到每個子套件目錄，讓各子套件被單獨安裝時也能取得一致的依賴鎖定結果。

## 簡介 (Introduction)

`sync-lockfile` 會從指定的目錄 (cwd) 向上尋找 workspace 根目錄 (workspace root)，確認根目錄存在 `yarn.lock` 後，將它逐一複製到所有 workspace 套件，並印出每個複製目標與總耗時。

同一個功能可以兩種方式使用：命令列工具 (CLI) `sync-lockfile` 與 Node.js API `syncLockfile()`；兩者共用同一份實作，行為完全一致。

## 特色 (Features)

- 自動向上尋找 workspace 根目錄，不必自行計算路徑。
- 一次將根目錄的 `yarn.lock` 複製到所有 workspace 套件。
- 複製時保留時間戳記 (timestamps)、覆寫 (overwrite) 舊檔，並解引用 (dereference) 符號連結。
- 提供 CLI 與 API 兩種入口，CLI 可用 `--silent` 靜默輸出。
- 目標不是 workspace 或缺少 `yarn.lock` 時，可選擇丟出錯誤或回傳 `null` 靜默結束。

## 安裝 (Installation)

```bash
yarn add sync-lockfile
```

以命令列方式執行時可直接使用 `npx`，不必先行安裝：

```bash
npx sync-lockfile
```

## 用法 (Usage)

命令列：

```bash
# 以目前目錄為起點尋找 workspace 並同步 yarn.lock
npx sync-lockfile

# 指定目標目錄、靜默輸出
npx sync-lockfile --cwd packages/example --silent
```

輸出範例：

```text
workspaces: D:/path/to/ws-yarn-workspaces

copy to... packages/@yarn-tool/find-root
copy to... packages/ws-pkg-list
copy done: 620.652ms
```

Node.js API：

```ts
import syncLockfile from 'sync-lockfile';

// 同步成功回傳 true；失敗時依 noThrowError 決定丟錯或回傳 null
const ok = syncLockfile(process.cwd(), {
	print: true,
	noThrowError: true,
});
```

## API 文件 (API Documentation)

### `syncLockfile(cwd: string, options?): true | null`

由根目錄 (package root) 匯出，同時也是預設匯出 (default export)。以 `cwd` 為起點尋找 workspace 根目錄並複製 `yarn.lock`：

| 回傳值 | 情況 |
| --- | --- |
| `true` | 已將 `yarn.lock` 複製到所有 workspace 套件 |
| `null` | 目標不是 workspace、根目錄缺少 `yarn.lock`，且 `noThrowError` 為 `true` |
| （丟出 `Error`） | 同上情況但 `noThrowError` 未啟用 |

內部相依 `@yarn-tool/find-root`（尋找根目錄）與 `ws-pkg-list`（列出 workspace 套件），因此不需要額外傳入套件清單。

## 設定 (Configuration)

### API 選項 (`options`)

`options` 為第二個引數，型別為 `{ print?: boolean, noThrowError?: boolean }`：

| 選項 | 型別 | 預設值 | 說明 |
| --- | --- | --- | --- |
| `print` | `boolean` | `undefined`（不列印） | 是否印出 workspace 根目錄、每個複製目標與 `console.time` 計時 |
| `noThrowError` | `boolean` | `undefined`（會丟錯） | 失敗時改回傳 `null` 而非丟出 `Error` |

### CLI 選項

| 選項 | 簡寫 | 型別 | 說明 |
| --- | --- | --- | --- |
| `--cwd` | `-c` | `string` | 起始目錄，預設為 `process.cwd()`（會正規化 (normalize) 路徑） |
| `--silent` | — | `boolean` | 不印出複製過程，等同 API 的 `print: false` |
| `--help` | — | — | 顯示說明；參數失敗時也會自動顯示 |
