# ws-pkg-list

> get Yarn Workspaces Packages List and can help create `paths` for `tsconfig.json`

取得 Yarn Workspaces（工作區）內所有套件的路徑清單，並可進一步產生 `tsconfig.json` 所需的 `paths` 設定。

## Features

- 以同步方式列出 Yarn Workspaces 底下所有套件的資料夾路徑
- 支援回傳絕對路徑或相對於 `cwd` 的相對路徑
- 讀取各套件的 `package.json`，以 `name` 為鍵建立索引物件
- 產生 `tsconfig.json` 的 `paths` 映射（同時包含相對路徑與絕對路徑兩種寫法）
- 提供 listable 列表形態，可搭配 `handler` 自訂欄位並取得依賴（Dependencies）資訊
- 提供 glob（萬用字元）比對工具，依套件名稱過濾清單

## Installation

```bash
npm install ws-pkg-list
```

## Usage

```ts
console.log(workspacesPackagesList(process.cwd(), true));
/*
[ '[abs path]/packages/create-yarn-workspaces',
  '[abs path]/packages/find-pkg-ws',
  '[abs path]/packages/npm-init2',
  '[abs path]/packages/workspaces-config',
  '[abs path]/packages/ws-pkg-list' ]
 */
```

```ts
console.log(readPackages(workspacesPackagesList(process.cwd(), false)));
/*
{ 'create-yarn-workspaces':
   { name: 'create-yarn-workspaces',
     path: '..\\create-yarn-workspaces',
     fullpath:
      '[abs path]\\packages\\create-yarn-workspaces',
     config:
      { name: 'create-yarn-workspaces',
        version: '1.0.7',
        description: 'yarn create yarn-workspaces     npx create-yarn-workspaces',
        keywords: [Array],
        homepage:
         'https://github.com/bluelovers/create-yarn-workspaces#readme',
        bugs: [Object],
        repository: [Object],
        license: 'ISC',
        author: '',
        main: 'index.js',
        bin: [Object],
        directories: [Object],
        scripts: [Object],
        dependencies: [Object],
        devDependencies: {} } },

  ...

  'ws-pkg-list':
   { name: 'ws-pkg-list',
     path: '.',
     fullpath:
      '[abs path]\\packages\\ws-pkg-list',
     config:
      { name: 'ws-pkg-list',
        version: '1.0.0',
        description: 'get Workspaces Packages List',
        main: 'index.js',
        scripts: [Object],
        author: '',
        license: 'ISC',
        dependencies: [Object] } } }
 */
```

```ts
console.log(tsConfigPaths(workspacesPackagesList(true)));
/*
{ 'create-yarn-workspaces/*':
   [ '[abs path]\\packages\\create-yarn-workspaces\\*' ],
  'find-pkg-ws/*':
   [ '[abs path]\\packages\\find-pkg-ws\\*' ],
  'npm-init2/*':
   [ '[abs path]\\packages\\npm-init2\\*' ],
  'workspaces-config/*':
   [ '[abs path]\\packages\\workspaces-config\\*' ],
  'ws-pkg-list/*':
   [ '[abs path]\\packages\\ws-pkg-list\\*' ] }
 */
```

```ts
console.log(tsConfigPaths(workspacesPackagesList(false)));
console.log(tsConfigPaths(process.cwd()));
/*
{ 'create-yarn-workspaces/*':
   [ '..\\create-yarn-workspaces\\*',
     '[abs path]\\packages\\create-yarn-workspaces\\*' ],
  'find-pkg-ws/*':
   [ '..\\find-pkg-ws\\*',
     '[abs path]\\packages\\find-pkg-ws\\*' ],
  'npm-init2/*':
   [ '..\\npm-init2\\*',
     '[abs path]\\packages\\npm-init2\\*' ],
  'workspaces-config/*':
   [ '..\\workspaces-config\\*',
     '[abs path]\\packages\\workspaces-config\\*' ] }
 */
```

## API Documentation

### workspacesPackagesList(cwd?, absolute?)

列出 Workspaces 內所有套件的資料夾路徑。

- `cwd?: string | boolean` — 查找工作區根目錄（Workspace Root）的起始路徑；若直接傳入布林值，會被視為 `absolute` 參數（相容舊版簽名）。
- `absolute?: boolean` — 為 `false` 時回傳相對於 `cwd` 的路徑，根套件本身回傳 `'.'`；預設回傳絕對路徑。
- 回傳 `string[]` — 各套件資料夾路徑的清單。

### readPackages(ls, cwd?)

讀取路徑清單中各套件的 `package.json`。

- `ls: string[]` — 套件資料夾路徑清單（通常來自 `workspacesPackagesList`）。
- `cwd?: string` — 解析相對路徑的基準目錄，預設為 `process.cwd()`。
- 回傳 `IReadedPackages` — 以套件 `name` 為鍵的物件，值包含 `name`、`path`、`fullpath`、`manifestLocation` 與 `config`（即 `package.json` 內容）。

### tsConfigPaths(ls)

產生 `tsconfig.json` 的 `paths` 映射。

- `ls` — 可為 `cwd` 字串、套件路徑清單（`string[]`）或 `readPackages` 的回傳值。
- 回傳 `{ [k: string]: string[] }` — 以 `套件名/*` 為鍵，值為相對路徑與絕對路徑兩種寫法；根套件（路徑為 `.` 或空字串）會被略過。

### wsPkgListable(cwd?, options?)

以列（Row）的形態取得套件清單。

- `cwd?: string` — 工作區根目錄，預設為 `process.cwd()`。
- `options?: IOptionsPkgListable` — 可提供 `handler(row, pkg)` 自訂或過滔回傳的列；`handler` 回傳的資料缺少必要欄位時會拋出 `TypeError`。
- 回傳 `IListableRow[]` — 每筆含 `name`、`version`、`private`、`location`、`manifestLocation`。

另有 `wsPkgListableFromPaths(paths, cwd?, options?)` 與 `wsPkgListableFromReaded(readed, options?)` 可從既有輸入轉換。

### wsPkgDepsListableRecord(cwd?, options?)

取得含依賴資訊的套件列並轉為以 `name` 為鍵的記錄（Record）。會自動找出工作區根目錄，並將 `dependencies`、`devDependencies`、`optionalDependencies`、`peerDependencies` 併入每筆列；`options.handler` 會在內建處理之後被呼叫。

### globFilterListable(list, globPattern, globOptions?)

以 glob 模式過濾套件列清單，僅比對 `row.name`。

- `list: IListableRow[]` — 要過濾的清單。
- `globPattern: string | string[]` — glob 模式（如 `@yarn-tool/*`）。
- `globOptions?: micromatch.Options` — 傳給 micromatch 的選項。
- 回傳過濾後的同一型別清單。

### 工具函式 (Utility Functions)

- `normalizeListableRow(row)` / `normalizeListable(list)` — 將 `location` 正規化（Normalize）為統一格式，並在缺少時補上 `manifestLocation`。
- `normalizeListableRowExtra(row, root)` / `normalizeListableExtra(list, root)` — 額外加上相對於 `root` 的 `prefix` 欄位。
- `listableToRecord(list)` — 將列清單轉為以 `name` 為鍵的記錄物件。

## Configuration

本套件本身沒有額外設定檔，行為完全由函式參數控制：

- Workspaces 的套件範圍來自專案 `package.json` 的 `workspaces` 欄位（由 `workspaces-config` 與 `find-yarn-workspace-root2` 解析），因此只需照常設定 Yarn Workspaces 即可。
- 若要產生 `tsconfig.json` 的 `paths`，可直接將 `tsConfigPaths()` 的回傳值併入專案的 `compilerOptions.paths`。
