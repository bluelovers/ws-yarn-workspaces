# @yarn-tool/setup-module-env

用於設定 tsdx 專案環境的工具，自動配置 package.json 與靜態檔案 (Tool for setting up tsdx project environment, auto-configuring package.json and static files)

## Features

- 自動設定 `package.json` 的 scripts（`test`、`build`、`build:tsdx`、`build:dts` 等）
- 自動配置 `main` / `module` / `types` / `exports` 等模組入口欄位
- 自動添加 `create-by-tsdx` 關鍵字 (Keyword) 以標識 tsdx 專案
- 依工作區 (Workspace) 狀態調整 `tslib` 依賴位置（子套件移除、根目錄移至 devDependencies）
- 內建靜態檔案映射表 (Static File Map)，複製 `tsconfig.json` 等範本至目標專案
- 提供 `isTsdxPackage` 判斷既有專案是否為 tsdx 專案

## Installation

```bash
yarn add @yarn-tool/setup-module-env
yarn-tool add @yarn-tool/setup-module-env
yt add @yarn-tool/setup-module-env

pnpm add @yarn-tool/setup-module-env

npm install @yarn-tool/setup-module-env
```

## Usage

```ts
import { setupTsdx } from '@yarn-tool/setup-module-env';

const result = setupTsdx({
	pkg,
	targetDir,
	rootData,
	file_map: [],
	mdFile: 'README.md',
	existsReadme: true,
	oldExists: false,
});

// 回傳更新後的 pkg 與合併後的 file_map
console.log(result.pkg.scripts);
console.log(result.file_map);
```

## API Documentation

### `setupTsdx(config: ISetupTsdxOptions<P>): ISetupTsdxOptions<P> & { pkg, file_map }`

套件的主要入口（Main Entry），執行以下步驟：

1. 呼叫 `updatePackageJson` 更新 `package.json`
2. 合併預設與自訂的靜態檔案映射表
3. 確保目標專案的 `src` 目錄存在

回傳的物件包含原始設定與更新後的 `pkg`、`file_map`。

### `ISetupTsdxOptions<P>` 選項

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `targetDir` | `string` | 目標目錄路徑 |
| `pkg` | `P` | 要更新的 `package.json` 物件 |
| `rootData` | `IFindRootReturnType` | 工作區根目錄資訊（由 `@yarn-tool/find-root` 回傳） |
| `file_map` | `IStaticFilesMapArray<string>` | 自訂靜態檔案映射表 |
| `mdFile` | `string` | README 檔案名稱 |
| `existsReadme` | `boolean` | 是否已存在 README 檔案 |
| `oldExists` | `boolean` | 是否為已存在的專案 |

### 內部函式（`lib/preset/tsdx/`）

- `updatePackageJson(pkg, config?)` — 更新 `package.json` 的 scripts、入口欄位、exports 與 keywords
- `fixTsdxPackage(pkg, config)` — 依工作區狀態修復 `tslib` 依賴位置
- `isTsdxPackage(pkg, config?)` — 透過 keywords 是否含 `create-by-tsdx` 且 `exports['.']` 為物件來判斷是否為 tsdx 專案
- `defaultCopyStaticFilesTsdx` — 凍結 (Frozen) 的預設靜態檔案映射表，包含 `tsconfig.json`、`test/tsconfig.json`、`src/index.cts`、`src/tsconfig.json`

## Configuration

此套件無需設定檔，所有行為皆由 `ISetupTsdxOptions` 參數控制：

- **靜態檔案**：預設映射表會與傳入的 `file_map` 依序合併（預設項在前），可透過 `file_map` 新增或覆寫目標路徑
- **scripts**：僅在欄位缺失時填入預設值（使用 `??=`），已有自訂內容不會被覆寫；唯一的例外是 `build` 不含 `run build:tsdx` 時會被替換
- **依賴**：工作區子套件會移除 `tslib`（由根目錄統一管理），獨立專案或工作區根目錄則移至 `devDependencies`，根目錄另會確保 `@bluelovers/tsconfig` 存在
