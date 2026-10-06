# @yarn-tool/node-modules-link

link package to node_modules

將指定的套件來源目錄以符號連結 (Symlink) 方式連結到 `node_modules` 的工具，並附帶命令列 (CLI) 介面，特別適用於 Yarn Workspaces 環境。

## 功能特色 (Features)

- 🔗 **符號連結 (Symlink)**: 透過 `fs-symlink-extra` 將套件來源目錄連結進 `node_modules`
- 🧭 **自動推斷 (Auto Detection)**: 未指定來源或目標路徑時，自動向上尋找工作區根目錄 (Workspace Root) 與套件根目錄 (Package Root)
- 🖥️ **CLI 支援**: 內建 `node-modules-link` 指令，可用引數 (Argument) 控制所有行為
- 🔁 **覆寫控制 (Overwrite Control)**: 預設允許覆寫既有的連結，可透過 `overwrite` 關閉
- 📦 **套件名稱自動讀取**: 未指定 `name` 時自動讀取來源套件的 `package.json` 名稱

## Installation

```bash
yarn add @yarn-tool/node-modules-link
yarn-tool add @yarn-tool/node-modules-link
yt add @yarn-tool/node-modules-link
```

## Usage

### 基本用法

```typescript
import { linkToNodeModules } from '@yarn-tool/node-modules-link';

// 以目前工作目錄為起點，自動推斷來源與目標路徑
const result = linkToNodeModules();

console.log(result.resultPath); // 連結建立後的完整路徑
```

### 指定來源與目標

```typescript
import { linkToNodeModules } from '@yarn-tool/node-modules-link';

const result = linkToNodeModules({
	sourcePackagePath: '/path/to/my-package',
	targetNodeModulesPath: '/path/to/project/node_modules',
	name: 'my-package',
	overwrite: true,
});

console.log(result.resultPath); // /path/to/project/node_modules/my-package
```

### 使用 CLI

```bash
node-modules-link --name my-package --sourcePackagePath /path/to/my-package --targetNodeModulesPath /path/to/project/node_modules
```

## API Documentation

### linkToNodeModules(options?)

主要入口函式：建立 (或更新) 套件到 `node_modules` 的符號連結。必要路徑未提供時，會呼叫 `@yarn-tool/find-root` 的 `findRoot` 自動推斷。

**參數 (Parameters):**

| 名稱 | 型別 | 必要 | 說明 |
| --- | --- | --- | --- |
| `name` | `string` | ❌ | 連結名稱；省略時讀取來源套件 `package.json` 的 `name` |
| `sourcePackagePath` | `string` | ❌ | 來源套件目錄；省略時以 `findRoot` 推斷目前套件根目錄 |
| `targetNodeModulesPath` | `string` | ❌ | 目標 `node_modules` 目錄；省略時以工作區根目錄加上 `targetNodeModulesName` 推斷 |
| `cwd` | `string` | ❌ | 起始搜尋目錄，預設 `process.cwd()` |
| `targetNodeModulesName` | `string` | ❌ | 自訂模組目錄名稱，預設 `node_modules`（交由 `@yarn-tool/node-modules` 的 `getModulesDir` 處理） |
| `overwrite` | `boolean` | ❌ | 是否覆寫既存在的連結，預設 `true` |

**回傳值 (Returns):**

```typescript
{
	// ...傳入的 options
	resultPath: string;  // 建立連結後的完整路徑
}
```

### linkToNodeModulesCore(options)

核心實作：不進行任何路徑推斷，直接於 `targetNodeModulesPath` 下建立名為 `name` 的符號連結。請確保 `name`、`sourcePackagePath`、`targetNodeModulesPath` 均已提供。

### IOptions

選項介面 (Interface)，繼承 `Partial<IFindRootOptions>`（來自 `@yarn-tool/find-root`），因此也支援 `findRoot` 相關選項，如 `throwError`、`skipCheckWorkspace`。

## Configuration

本套件不使用獨立設定檔 (Config File)，所有設定皆透過 `options` 物件或 CLI 引數傳入：

| 選項 / CLI 引數 | 型別 | 預設值 | 說明 |
| --- | --- | --- | --- |
| `--name` | `string` | 讀取來源套件的 `package.json.name` | 連結在 `node_modules` 中的名稱（含 scope，如 `@scope/pkg`） |
| `--sourcePackagePath` | `string` | `findRoot().pkg` | 要被連結的來源套件目錄 |
| `--targetNodeModulesPath` | `string` | `getModulesDir(findRoot().root, targetNodeModulesName)` | 要寫入連結的 `node_modules` 目錄 |
| `--cwd` | `string` | `process.cwd()` | 路徑推斷的起點 |
| `--targetNodeModulesName` | `string` | `node_modules` | 非標準命名的模組目錄名稱 |
| `overwrite`（僅 API） | `boolean` | `true` | 是否覆寫既存在的連結 |
| `--skipCheckWorkspace` / `-W` | `boolean` | `false` | 傳給 `findRoot`，略過工作區檢查 (Workspace Check) |
| `throwError`（僅 API，CLI 固定為 `true`） | `boolean` | `false` | 找不到根目錄時是否丟出錯誤 (Throw Error) |
