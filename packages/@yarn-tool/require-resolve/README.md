# @yarn-tool/require-resolve

擴充版 require.resolve，支援在額外路徑中搜尋模組（包含全域 npm/yarn 路徑）。
An extended require.resolve with support for searching modules in extra paths (including global npm/yarn paths).

## 功能特色 (Features)

- 🌐 **額外搜尋路徑 (Extra Search Paths)**: 可在自訂路徑、目前目錄 (Current Directory) 與全域 npm/yarn 路徑中搜尋模組
- 🚫 **不拋出錯誤 (No Throw)**: `requireResolveExtra` 以回傳值承載 `MODULE_NOT_FOUND` 錯誤，而非丟出例外
- ⚡ **同步與非同步載入**: 提供 `requireExtra`（同步 require）與 `importExtra`（動態 `import()`）兩種載入方式
- 🧰 **可選載入 (Optional Load)**: `tryRequireExtra` / `tryImportExtra` 失敗時回傳 `null`
- 📦 **套件解析 (Package Resolution)**: 取得套件根目錄 (Package Root)、`package.json` 位置與內容，並可建立相對路徑解析函數
- 🔤 **名稱對應 (Name Mapping)**: 透過 `map` 選項將模組名稱對應到實際入口點

## 安裝 (Installation)

```bash
# 使用 yarn / Using yarn
yarn add @yarn-tool/require-resolve

# 使用 yarn-tool / Using yarn-tool
yarn-tool add @yarn-tool/require-resolve
# yt 是 yarn-tool 的別名 / yt is an alias for yarn-tool
yt add @yarn-tool/require-resolve

# 使用 pnpm / Using pnpm
pnpm add @yarn-tool/require-resolve

# 使用 npm / Using npm
npm install @yarn-tool/require-resolve
```

## 使用範例 (Usage Example)

```typescript
import { requireResolveExtra, requireExtra, importExtra } from '@yarn-tool/require-resolve';

// 基本解析 / Basic resolution
const tsdx_path = requireResolveExtra('tsdx').result;

// 包含全域路徑和當前目錄 / Include global paths and current directory
let actual = requireResolveExtra('ts-jest', {
  includeGlobal: true,
  includeCurrentDirectory: true,
  paths: [
    tsdx_path,
  ],
});

console.dir(actual);

// 載入模組 / Load module
const module = requireExtra('some-module');

// 動態導入模組 / Dynamic import module
const asyncModule = await importExtra('some-module');
```

## API 文件 (API Documentation)

### `requireResolveCore(name, options?)`

require.resolve 的核心實作，支援額外搜尋路徑。找不到模組時會照原生行為丟出 `MODULE_NOT_FOUND`。

### `requireResolveExtra(name, options?)`

解析模組並返回結果或錯誤，不會拋出 MODULE_NOT_FOUND 錯誤。

### `buildResolvePaths(options)`

依選項建構解析路徑陣列：先放入 `paths`，再視 `includeGlobal`、`includeCurrentDirectory` 依序插入全域符號與目前目錄符號。

### `requireExtra(name, options?)`

解析並載入模組。

### `importExtra(name, options?)`

解析並動態導入模組（返回 Promise）。

### `tryRequireExtra(name, options?)` / `tryImportExtra(name, options?)`

嘗試載入模組，失敗時回傳 `null`，適合可選依賴 (Optional Dependency)。

### `handleOptionsPaths(paths, cwd?)`

處理選項中的路徑陣列，將符號轉換為實際路徑。

### `isErrorModuleNotFound(error)`

檢查錯誤是否為模組未找到錯誤。

### 套件解析 (Package Resolution)

| 函式 | 說明 |
| --- | --- |
| `resolvePackageCore(name, options?)` | 回傳 `{ name, pkgRoot, entryPointLocation }`；入口點解析失敗時改解析 `package.json` |
| `resolvePackageRoot(name, options?)` | 只回傳套件根目錄 (Package Root) |
| `resolvePackageJsonLocation(name, options?)` | 回傳 `package.json` 檔案路徑 |
| `readModulePackageJson(name, options?)` | 讀取並回傳模組的 `package.json` 內容 |
| `createResolveLocationFn(name, options?)` | 建立一個相對於套件根目錄解析路徑的函數 |
| `resolvePackage(name, options?)` | 最完整版本：套件根目錄、入口點、`package.json` 內容與 `resolveLocation()` 一次取得 |

## 設定 (Configuration)

本套件不使用設定檔 (Config File)，所有設定皆透過函式第二參數 `options` 傳入：

```typescript
interface IOptionsRequireResolve {
  /** 模組名稱對應表 / Module name mapping table */
  map?: Record<string, string>;
  /** 自訂 require 函數 / Custom require function */
  require?: NodeRequire;
  /** 是否包含全域路徑（可直接給路徑陣列）/ Whether to include global paths (or pass a path array) */
  includeGlobal?: boolean | IPathItem[];
  /** 是否包含當前目錄 / Whether to include current directory */
  includeCurrentDirectory?: boolean;
  /** 工作目錄 / Working directory */
  cwd?: string;
  /** 搜尋路徑（可含全域/目前目錄符號）/ Search paths (may contain global/current-directory symbols) */
  paths?: (string | IPathItem)[];
}
```

| 選項 | 預設值 | 說明 |
| --- | --- | --- |
| `map` | `{ tsdx: 'tsdx/dist/index' }`（`defaultMap`） | 自訂對應優先，其次為 `defaultMap`，最後使用原始名稱 |
| `require` | 呼叫環境的 `require` | 可注入自訂 `require` 以改變解析行為 |
| `includeGlobal` | `false` | `true` 時插入全域符號；傳入陣列時逐一插入指定的全域路徑 |
| `includeCurrentDirectory` | `false` | `true` 時把目前目錄加入搜尋路徑 |
| `cwd` | 未指定 | 轉換符號路徑時的基準目錄；省略時交由 `@yarn-tool/get-paths-by-type` 決定 |
| `paths` | `[]` | 使用者提供的搜尋路徑；全域與目前目錄符號會被插入到它們之前 |

> 📄 相關文件：其他路徑工具的整理請見 [docs/find-path-tools.md](../../../docs/find-path-tools.md) 的「packages/@yarn-tool/require-resolve」章節。

## License

ISC