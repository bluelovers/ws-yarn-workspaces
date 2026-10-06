# @yarn-tool/workspaces-project

> mixin yarn/lerna workspaces

以單一 `WorkspacesProject` 類別混合（Mixin）操作 Yarn Workspaces 與 Lerna 專案設定，讓你用同一套介面讀取／修改 `lerna.json`、workspaces 套件清單與版本發佈設定。

## Features

- 以 `WorkspacesProject` 類別包裝 `@lerna/project`，並自動對齊 Yarn Workspaces 根目錄（Workspace Root）
- 透過 `checkPaths` 嚴格比對 yarn 根目錄與 lerna 根目錄，不一致時拋出錯誤
- 以 getter／setter 存取 `npmClient`、`workspaces`、`defaultWorkspace`、`version` 等常用設定
- 提供 `isIndependent()` 判斷 Lerna 是否採用獨立版本（Independent Versioning）模式
- `releaseConfig` 會合併 `command.version` 與 `command.publish` 並依鍵名排序，方便產生發佈設定

## Installation

```bash
yarn add @yarn-tool/workspaces-project
yarn-tool add @yarn-tool/workspaces-project
yt add @yarn-tool/workspaces-project
```

## Usage

```ts
import WorkspacesProject from '@yarn-tool/workspaces-project';

const project = new WorkspacesProject(process.cwd());

// 讀取工作區根目錄與 lerna 設定位置
console.log(project.rootPath);
console.log(project.lernaConfigLocation);

// 讀取／修改 workspaces 套件清單
console.log(project.workspaces);
project.defaultWorkspace = project.workspaces[0];

// 讀取版本設定；'independent' 代表獨立版本模式
console.log(project.version, project.isIndependent());
```

## API Documentation

### `new WorkspacesProject(cwd?, options?)`

建立專案實例。

- `cwd?: string` — 起始目錄，預設為 `process.cwd()`；會用來尋找 Yarn Workspaces 根目錄。
- `options?: { skipStrictCheck?: boolean }` — 設為 `true` 時，即使 lerna 根目錄與 yarn 根目錄不一致也不拋錯（交由 `checkPaths` 判斷）。
- 若 lerna 根目錄與 yarn 根目錄不一致且未豁免檢查，建構函式會拋出 `Error`。

### 屬性 (Properties)

| Property | Type | 說明 |
| --- | --- | --- |
| `rootPath` | `string` | 工作區根目錄（已正規化） |
| `lernaConfigLocation` | `string` | `lerna.json` 的檔案路徑 |
| `npmClient` | `string` | 讀寫 `lerna.json` 的 `npmClient`；根目錄存在且未設定時預設為 `yarn` |
| `workspaces` | `string[]` | workspaces 套件 glob 清單；來源失效時回退為 `packages/*`，並快取 (Cache) 於內部 |
| `defaultWorkspace` | `string` | 目前採用的 workspace glob，setter 會驗證其存在於 `workspaces`，否則拋出 `RangeError` |
| `version` | `string \| 'independent'` | Lerna 版本模式，可讀寫 |
| `manifest` | `IPackedManifest` | 根套件的 `package.json` 封裝結果 |
| `config` | `ILernaJson` | `lerna.json` 設定物件，讀取時會同步 `workspaces`／`packages`、`version` 與 `defaultWorkspace` 順序 |
| `bump` | `IReleaseType` | `command.publish.bump` 或 `command.version.bump` 的發版級別 |
| `changelogPreset` | `IChangelogPreset` | `command.version`／`command.publish` 的 changelog 預設集 |
| `releaseConfig` | `object` | 合併 version/publish 指令並補上 `changelogPreset`、`bump`、`conventionalGraduate`，結果依鍵名排序 |

### 方法 (Methods)

- `isIndependent(): boolean` — 版本為 `'independent'` 時回傳 `true`。
- `existsLernaConfigFile(): boolean` — `lerna.json` 是否存在於磁碟。

### `checkPaths({ root, rootPath }, options?)` (`lib/util`)

比對 yarn 根目錄與 lerna 根目錄，回傳 `EnumCheckPaths`：

- `EnumCheckPaths.root` — lerna 根目錄位於 yarn 根目錄之下，應改用 yarn 根目錄。
- `EnumCheckPaths.rootPath` — 兩者一致，或其中一方為空。
- `EnumCheckPaths.failed` — 不一致且未設定 `skipStrictCheck`。

路徑比對前會先以 `path-dir-normalize` 正規化（Normalize），避免尾端斜線造成誤判。

## Configuration

本套件不新增自己的設定檔，一切以專案既有的 Lerna／Yarn 設定為準：

- `lerna.json` — 由 `@lerna/project` 載入，涵蓋 `npmClient`、`useWorkspaces`、`version`、`packages`／`workspaces` 與 `command.version`／`command.publish` 等欄位。
- `package.json` 的 `workspaces` 欄位 — 由 `find-yarn-workspace-root2` 解析，作為 `rootPath` 對齊的基準。

相關參考：

- https://www.npmjs.com/package/find-yarn-workspace-root2
- https://www.npmjs.com/package/%40yarn-tool%2Ffind-root
