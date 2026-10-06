# workspaces-config

解析並分類 `package.json` 中的 `workspaces` 設定 (Configuration)，回傳靜態路徑 (Static Path) 與 glob 前綴 (Prefix) 等分類結果，主要供 monorepo 初始化工具使用。

當前版本：`2.0.11`

```ts
console.log(parseStaticPackagesPaths(getConfig()));
// => {
//   static: [],
//   prefixRoot: [ 'packages' ],
//   prefix: [ 'packages' ],
//   prefixSub: [ '' ],
//   all: [ 'packages/*' ]
// }
```

## Features

- **自動尋找 package.json**：透過 [find-pkg-ws](../find-pkg-ws) 自目錄向上尋找含 `workspaces` 的 `package.json`
- **兩種格式皆支援**：陣列格式 `['packages/*']` 與物件格式 `{ packages: [...] }` 會被正規化 (Normalize) 為同一種結構
- **路徑分類**：區分完全靜態的路徑、帶 glob 的前綴路徑，以及無法解析的樣式
- **跨平台路徑**：同時以 `/` 與 `\` 切割樣式，輸出一律使用 POSIX 分隔符
- **無副作用**：純剖析 (Parse) 函式，不寫入任何檔案

## Installation

```bash
yarn add workspaces-config
```

## Usage

```ts
import getConfig, { parseStaticPackagesPaths, parseWorkspaces } from 'workspaces-config';

// 讀取目前工作區的 workspaces 設定
const config = getConfig();

// 分類為靜態路徑與 glob 前綴
const result = parseStaticPackagesPaths(config);

console.log(result.static);    // 完全靜態的路徑，如 ['packages/foo']
console.log(result.prefix);    // 含 glob 的前綴，如 ['packages']
console.log(result.all);       // 原始樣式列表，如 ['packages/*']
```

也可直接傳入 `workspaces` 樣式陣列：

```ts
parseStaticPackagesPaths(['packages/*', 'apps/*']);
```

## API Documentation

### getConfig(cwd?): WorkspacesConfig

自 `cwd`（預設為目前目錄）向上尋找 `package.json`，讀取其中的 `workspaces` 欄位並正規化後回傳。

- 找不到 `package.json` 時拋出 `RangeError`

### parseWorkspaces(workspaces): WorkspacesConfig

將兩種 `workspaces` 格式正規化為物件格式：

| 輸入 | 回傳 |
|------|------|
| `['packages/*']` | `{ packages: ['packages/*'] }` |
| `{ packages: ['packages/*'] }` | 原樣回傳 |

### parseStaticPackagesPaths(workspaces): IParseStaticPackagesPathsReturnType

逐一剖析 `packages` 中的樣式並分類：

| 欄位 | 意義 |
|------|------|
| `static` | 所有片段皆為純名稱（無 glob）的路徑，如 `packages/foo` |
| `prefixRoot` | 前綴的最上層名稱，如 `packages` |
| `prefix` | 前綴的完整路徑，如 `packages` 或 `@scope/pkg` |
| `prefixSub` | 前綴去掉第一段後的路徑，單段前綴時為空字串 `''` |
| `all` | 原始樣式列表，不論是否可解析皆會收錄 |

剖析規則：

1. 每個樣式以 `/` 或 `\` 切割為片段
2. 片段需符合 `/^@?[\w\-]+$/`（可含前綴 `@`、英數字、底線、連字號）才算有效
3. 遇到第一個無效片段（例如 `*`、`**`、`.`）即停止解析
4. 所有片段皆有效 → 收進 `static`
5. 部分片段有效 → 收進 `prefixRoot` / `prefix` / `prefixSub`
6. 完全無有效片段（樣式以 glob 開頭）→ 僅收進 `all`

### Types

```ts
type WorkspacesConfig = {
	packages?: WorkspacesConfigArray,
	nohoist?: Array<string>,
};

type WorkspacesConfigArray = Array<string>;

interface IParseStaticPackagesPathsReturnType
{
	static: string[];
	prefixRoot: string[];
	prefix: string[];
	prefixSub: string[];
	all: string[];
}
```

### 其他匯出

| 匯出 | 說明 |
|------|------|
| `findPkg` | 自 [find-pkg-ws](../find-pkg-ws) 轉發 (Re-export)，用於尋找 `package.json` |
| `default` | 預設匯出為 `getConfig` |

## Configuration

本套件不需自身設定，輸入完全取決於目標專案的 `package.json`：

```json
{
  "workspaces": ["packages/*", "apps/*"]
}
```

或物件格式（Yarn 1 的 `nohoist` 亦會保留）：

```json
{
  "workspaces": {
    "packages": ["packages/*"],
    "nohoist": ["**/react"]
  }
}
```

| 來源 | 說明 |
|------|------|
| `cwd` 參數 | 起始目錄，預設為目前目錄；會向上尋找最近的 `package.json` |
| `workspaces` 欄位 | 決定剖析的樣式來源；欄位不存在時 `getConfig` 回傳 `undefined`，此時需自行確保有陣列再呼叫 `parseStaticPackagesPaths`（否則會因讀取 `undefined.packages` 拋出 `TypeError`） |
| `nohoist` 欄位 | 會原樣保留在回傳的物件格式中 |

## 相關套件

* [npm-init2](../npm-init2)
* [create-yarn-workspaces](../create-yarn-workspaces)
* [find-pkg-ws](../find-pkg-ws)
* [workspaces-config](https://www.npmjs.com/package/workspaces-config)
* [keywords:workspaces](https://www.npmjs.com/search?q=keywords:workspaces)

更多尋找路徑相關工具的比較，請參閱 [docs/find-path-tools.md](../docs/find-path-tools.md)。
