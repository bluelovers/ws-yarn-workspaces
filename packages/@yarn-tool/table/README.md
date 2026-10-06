# @yarn-tool/table

shared cli table utils for yarn-tool

為 yarn-tool 系列指令列 (CLI) 工具共用的表格工具，基於 [cli-table3](https://github.com/cli-table/cli-table3) 提供建立依賴表格、版本差異著色與無邊框樣式等常用功能。

## 功能特色 / Features

- **依賴表格 (Dependency Table)**：一行程式碼建立預設無邊框、右對齊版本欄的表格
- **版本差異著色 (Version Diff Colorize)**：搭配 `@yarn-tool/semver-diff` 將版本升級／降級以顏色標示
- **無邊框樣式 (Borderless Style)**：可對既有表格套用無邊框樣式
- **型別再匯出 (Type Re-export)**：直接取得 `ITable`、`ICell`、`IDependency` 等常用型別，不必另行引用 `cli-table3`

## 安裝 / Install

```bash
yarn add @yarn-tool/table
yarn-tool add @yarn-tool/table
yt add @yarn-tool/table
```

## 使用方法 / Usage

```typescript
import { createDependencyTable, toDependencyTable, applyStyleBorderless } from '@yarn-tool/table';

// 建立空白表格並自行填入內容 / Create an empty table and fill it in yourself
const table = createDependencyTable();
table.options.head = ['package name', 'old version(s)', '', 'new version(s)'];
table.push(['lodash', '^4.17.20', '→', '^4.17.21']);

console.log(table.toString());

// 直接把兩份依賴清單轉成版本差異表格 / Turn two dependency maps into a diff table
const diffTable = toDependencyTable({
  from: { lodash: '^4.17.20' },
  to: { lodash: '^4.17.21' },
});

console.log(diffTable.toString());

// 對既有表格套用無邊框樣式 / Apply the borderless style to an existing table
applyStyleBorderless(table);
```

也可以直接以 `CliTable` / `Table` 別名使用 `cli-table3` 本體：

```typescript
import { CliTable, Table } from '@yarn-tool/table';
```

## API Documentation

### `createDependencyTable(options?)`

建立一個預設「無邊框」的依賴表格 (Dependency Table)。

- `options`（選用）：`cli-table3` 的 `TableConstructorOptions`，會展開並覆寫預設值（例如 `colAligns`、`head`、`chars`）。
- 回傳值：`cli-table3` 的 `Table` 實例。

預設欄位對齊為 `['left', 'right', 'right', 'right']`：套件名稱靠左、版本欄靠右，適合呈現依賴版本清單。

### `toDependencyTable(args)`

將「更新前後」的兩份依賴 (Dependencies) 清單轉為版本差異表格。

| 參數 | 類型 | 說明 |
|------|------|------|
| `args.from` | `IDependency` | 更新前的依賴清單（`套件名稱: 版本`） |
| `args.to` | `IDependency` | 更新後的依賴清單 |
| `args.options` | `IOptionsParseVersionsDiff`（選用） | 傳給 `@yarn-tool/semver-diff` 的著色選項 |

- 每列輸出格式為 `[套件名稱, 舊版本, '→', 經著色的新版本]`。
- `from` 中不存在的套件，舊版本欄會顯示為空字串。
- 回傳值：已填入資料列的 `Table` 實例。

### `applyStyleBorderless(table)`

對**既有**表格就地 (in-place) 套用無邊框樣式（將所有 `chars` 邊框字元設為空字串），並回傳同一個 `table` 實例以便鏈式使用。

### 型別 / Types

自 `lib/types.ts` 再匯出（源自 `cli-table3` 與 `@ts-type/package-dts`）：

- `ITable`、`ITableConstructorOptions`、`ICell`
- `IHorizontalAlignment`、`IVerticalAlignment`
- `IDependency`：依賴清單的鍵值對型別

### 匯出別名 / Export Aliases

| 匯出 | 說明 |
|------|------|
| `CliTable` | `cli-table3` 的預設匯出 |
| `Table` | `CliTable` 的別名 |
| 預設匯出 (default) | 同 `CliTable` |

## 設定 / Configuration

本套件沒有自身的設定檔 (Config File)，所有行為皆由呼叫時傳入的參數決定：

- `createDependencyTable(options)` 的 `options` 可覆寫任何 `cli-table3` 的建構選項。
- `toDependencyTable(args.options)` 控制版本差異的著色行為（交由 `@yarn-tool/semver-diff` 處理）。
- 表格輸出寬度、顏色支援等終端列 (Terminal) 相關行為由 `cli-table3` 及執行環境決定。
