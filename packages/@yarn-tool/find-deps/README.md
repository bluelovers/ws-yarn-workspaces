# @yarn-tool/find-deps

`@yarn-tool/find-deps` 用來 **find deps tree in workspaces（在 Yarn workspace 中尋找依賴樹）**，
提供向下尋找（找出某套件的所有依賴）與向上尋找（找出所有依賴此套件的套件）兩個方向的查詢。

目前版本：`3.0.11`

## 特色 (Features)

- 向下查找 (Downward)：從指定套件遞迴找出工作區內的所有依賴
- 向上查找 (Upward)：找出所有直接或間接依賴指定套件的套件（誰依賴了我）
- 依 `dependencies`、`devDependencies`、`peerDependencies`、`optionalDependencies` 等欄位全數掃描
- 自動排除重複與自我引用，遞迴過程不會無限迴圈
- 回傳依依賴數量排序過的清單，方便直接呈現在 CLI 或報告中

## 安裝 (Installation)

```bash
yarn add @yarn-tool/find-deps

yarn-tool add @yarn-tool/find-deps
yt add @yarn-tool/find-deps

pnpm add @yarn-tool/find-deps

npm install @yarn-tool/find-deps
```

## 使用方式 (Usage)

先用 `ws-pkg-list` 取得工作區內所有套件的記錄 (Record)，再交給查詢函式：

```ts
import { findDepsAllDeep, findUpDepsAllDeep } from '@yarn-tool/find-deps';
import { wsPkgListable } from 'ws-pkg-list/lib/listable';

// 取得 workspace 內所有套件的記錄（以套件名稱為鍵）
const record = wsPkgListable(rootDir)
	.reduce((a, row) => (a[row.name] = row, a), {});

// 向下：pkg-a 及其所有深層依賴，依依賴數量由少到多排序
const deps = findDepsAllDeep(['pkg-a'], record);
// => [['pkg-a', ['dep1', 'dep2']], ['pkg-b', ['dep3']]]

// 向上：依賴 pkg-a 的所有套件，依依賴數量由多到少排序
const upDeps = findUpDepsAllDeep(['pkg-a'], record);
// => [['pkg-a', ['pkg-b', 'pkg-c']]]
```

## API 文件 (API Documentation)

入口檔 `index.ts` 再匯出以下函式：

| 匯出 | 說明 |
| --- | --- |
| `findDepsAllDeep(names, record)` | 向下查找：回傳 `[套件名稱, 依賴清單]` 陣列，依依賴數量由少到多排序。 |
| `findUpDepsAllDeep(targets, record)` | 向上查找：回傳 `[目標名稱, 向上依賴清單]` 陣列，依依賴數量由多到少排序。 |
| `export default findUpDepsAllDeep` | 預設匯出為向上查找函式。 |

### `lib/find.ts`（向下查找 / Downward）

| 匯出 | 說明 |
| --- | --- |
| `findDepsAllDeepRecordCore(names, record, map?)` | 核心實作：遞迴建立「套件 → 依賴清單」的對應表，已處理過的套件會跳過。 |
| `findDepsAllDeep(names, record)` | 呼叫核心實作後轉成陣列並排序。 |
| `findDepsDeep(name, record, list?)` | 單一入口的遞迴查找，遍歷所有依賴欄位並只收錄存在於 workspace 內的套件。 |

### `lib/find-up.ts`（向上查找 / Upward）

| 匯出 | 說明 |
| --- | --- |
| `findUpDepsDeepRecordCore(target, record, map?)` | 核心實作：找出所有依賴目標套件的套件，並遞迴取得它們的向上依賴，最後去除重複。 |
| `findUpDepsAllDeepRecordCore(targets, record, map?)` | 對多個目標逐一呼叫上述核心實作。 |
| `findUpDepsAllDeep(targets, record)` | 取得向上依賴映射後，再建立向下依賴映射作為排序依據。 |

## 設定 (Configuration)

本套件沒有設定檔，行為完全由呼叫端傳入的參數決定：

| 參數 | 說明 |
| --- | --- |
| `names` / `targets` | 要查找的套件名稱清單；名稱必須與 workspace 內的 `package.json` `name` 一致。 |
| `record` | 以套件名稱為鍵的套件記錄，建議由 [`ws-pkg-list`](../../ws-pkg-list) 取得。 |
| `map` | 可傳入既有的映射物件以延續多次查找；省略時預設為空物件。 |

- 查找範圍僅限同一個 workspace，不會連線至 registry。
- 遞迴深度取決於依賴圖 (Dependency Graph)，循環依賴 (Circular dependency) 由「已存在於列表即跳過」的檢查避免。

## 相關文件 (Related Documents)

- 路徑工具與 `@yarn-tool/find-deps` 的模組整理：[docs/find-path-tools.md](../../../docs/find-path-tools.md)
