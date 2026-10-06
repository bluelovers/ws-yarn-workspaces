# @yarn-tool/static-file

用於將靜態設定檔案 (static configuration files) 複製到 yarn 工作區專案的工具 / A utility for copying static configuration files to yarn workspace projects

## 功能特色 (Features)

- `copyStaticFiles()` - 依檔案映射 (File map) 將靜態樣板批量複製到目標目錄
- `detectFile` 機制 - 目標已存在正式設定檔時自動跳過，避免覆蓋既有設定
- `defaultCopyStaticFiles` / `defaultCopyStaticFilesRootOnly` / `defaultCopyStaticFilesWsRootOnly` - 依情境內建的三套預設清單（套件層級、僅根目錄、僅工作區根目錄）
- `getRootCopyStaticFilesAuto()` - 依專案根目錄結構自動挑選要複製的清單
- `getWsCopyStaticFiles()` - 取得工作區 (Workspace) 完整設定所需的合併清單，並自動將 `.tpl` 樣板重新映射 (Remap) 為正式檔名
- `getStaticFile()` / `getRowOfStaticFilesMapArray()` - 依檔案 ID 查詢單一映射條目
- `reMapStaticFilesMapArray()` - 將樣板條目的目標路徑重新映射為其他名稱

## 安裝 (Installation)

```bash
yarn add @yarn-tool/static-file

yarn-tool add @yarn-tool/static-file
yt add @yarn-tool/static-file

pnpm add @yarn-tool/static-file

npm install @yarn-tool/static-file
```

## 使用方式 (Usage)

```typescript
import { copyStaticFiles } from '@yarn-tool/static-file';

// 將預設靜態檔案複製到當前目錄
// Copy default static files to the current directory
copyStaticFiles({
  cwd: process.cwd(),
  overwrite: true,
});

// 使用自訂檔案映射
// With a custom file map
copyStaticFiles({
  cwd: '/path/to/project',
  file_map: [
    ['.gitignore', 'file/gitignore'],
    ['README.md', 'file/README.md'],
  ],
});
```

進階用法 (Advanced usage)：

```typescript
import { getRootCopyStaticFilesAuto } from '@yarn-tool/static-file/lib/root/getRootCopyStaticFiles';
import { getWsCopyStaticFiles } from '@yarn-tool/static-file/lib/ws/wsCopyStaticFiles';
import { getStaticFile } from '@yarn-tool/static-file/lib/getStaticFile';

// 依根目錄結構挑選清單 / Pick the list based on the root structure
const file_map = getRootCopyStaticFilesAuto({ isRoot: true, hasWorkspace: false });

// 查詢單一條目 / Look up a single entry
console.dir(getStaticFile('.gitignore')); // ['.gitignore', 'file/gitignore']

// 工作區完整清單 / Full workspace list
console.dir(getWsCopyStaticFiles());
```

## API 文件 (API Documentation)

### `copyStaticFiles(options)`

主入口 (Main entry)，回傳實際複製成功的條目陣列。

| 參數 | 型別 | 說明 |
| --- | --- | --- |
| `options.cwd` | `string` | 目標目錄（必填，不存在時拋出 `TypeError`） |
| `options.staticRoot` | `string?` | 靜態樣板來源目錄，預設為本套件的 `file/` 目錄 |
| `options.overwrite` | `boolean?` | 是否覆寫已存在的檔案，預設 `false` |
| `options.file_map` | `IStaticFiles` | 自訂映射；省略時使用 `defaultCopyStaticFiles` |

### 檔案映射條目 (Map entry)

每個條目為三元組 (Tuple)：`[targetFile, staticFile, detectFile?]`

- `targetFile` - 目標檔案路徑（相對於 `cwd`）
- `staticFile` - 來源樣板路徑（相對於 `staticRoot`）
- `detectFile` - 可選的檢測路徑；若該檔案已存在則跳過此條目

### 內建清單 (Built-in lists)

以子路徑 `@yarn-tool/static-file/lib/const` 匯入：

- `defaultCopyStaticFiles` - 各套件都需要的檔案（`.gitignore`、`.npmignore`、`tsconfig.json`、`jest.config.js`、`test/` 樣板等）
- `defaultCopyStaticFilesRootOnly` - 只給專案根目錄的檔案（`lerna.json`、`pnpm-workspace.yaml`、`.github/`、`.nvmrc` 等）
- `defaultCopyStaticFilesWsRootOnly` - 只給工作區根目錄的檔案（`__root_ws.ts`、`jest-preset.js`、`.run/` 等）

### 其他函式 (Other functions)

| 函式 | 子路徑 | 說明 |
| --- | --- | --- |
| `getRootCopyStaticFilesAuto(rootData)` | `lib/root/getRootCopyStaticFiles` | 依 `isRoot` / `hasWorkspace` 決定要複製的清單 |
| `getWsCopyStaticFiles()` | `lib/ws/wsCopyStaticFiles` | 合併三套清單並重新映射 `.tpl` 樣板檔名 |
| `parseStaticMap(file_map)` | `lib/parseStaticMap` | 將陣列或記錄 (Record) 格式統一成條目陣列 |
| `getRowOfStaticFilesMapArray(file_map, key)` | `lib/getRowOfStaticFilesMapArray` | 依目標檔名查詢條目 |
| `getStaticFile(file_id, options?)` | `lib/getStaticFile` | 依檔案 ID 查詢條目（預設清單） |
| `reMapStaticFilesMapArray(file_map, replaceMap)` | `lib/reMapStaticFilesMapArray` | 以「新路徑 → 舊路徑」建立重新映射後的新清單 |
| `replaceTargetOfStaticFilesMapArrayEntry(entry, targetFile)` | `lib/replaceTargetOfStaticFilesMapArrayEntry` | 保留來源、只替換目標路徑 |

### 邊界情況 (Edge cases)

- `cwd` 不是字串或為空字串 → 拋出 `TypeError`
- `cwd` 目錄不存在 → 拋出 `TypeError`
- 解析後的 `file_map` 為空 → 拋出 `TypeError`
- 來源樣板檔案不存在 → 拋出 `Error`（表示清單與 `file/` 目錄不同步）
- 已存在 `detectFile` 的目標會被跳過，且不出現在回傳陣列中

## 設定 (Configuration)

本套件沒有設定檔 (Config file)，行為完全由 `copyStaticFiles()` 的 `options` 與所選的內建清單決定：

- **樣板來源**：以 `staticRoot` 覆寫預設的 `file/` 目錄，即可使用自備的樣板集。
- **覆寫策略**：`overwrite` 為 `false` 時，已存在的目標檔案維持原狀（`errorOnExist: false`，不會中斷批次）。
- **情境選擇**：一般套件用 `defaultCopyStaticFiles`；獨立專案根目錄用 `getRootCopyStaticFilesAuto({ isRoot: true, hasWorkspace: false })`；工作區根目錄用 `getWsCopyStaticFiles()`。
- **忽略清單**：`.npmignore` / `.gitignore` 中的 `!file/` 白名單由 `test/scripts/update-npmignore-static-files.ts` 依 `lib/const.ts` 自動產生。
