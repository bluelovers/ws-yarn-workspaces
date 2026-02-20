# @yarn-tool/require-resolve

擴充版 require.resolve，支援在額外路徑中搜尋模組（包含全域 npm/yarn 路徑）。
An extended require.resolve with support for searching modules in extra paths (including global npm/yarn paths).

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

## API

### `requireResolveCore(name, options?)`

require.resolve 的核心實作，支援額外搜尋路徑。

### `requireResolveExtra(name, options?)`

解析模組並返回結果或錯誤，不會拋出 MODULE_NOT_FOUND 錯誤。

### `requireExtra(name, options?)`

解析並載入模組。

### `importExtra(name, options?)`

解析並動態導入模組（返回 Promise）。

### `handleOptionsPaths(paths, cwd?)`

處理選項中的路徑陣列，將符號轉換為實際路徑。

### `isErrorModuleNotFound(error)`

檢查錯誤是否為模組未找到錯誤。

## 選項 (Options)

```typescript
interface IOptions {
  /** 模組名稱對應表 / Module name mapping table */
  map?: Record<string, string>;
  /** 自訂 require 函數 / Custom require function */
  require?: NodeRequire;
  /** 是否包含全域路徑 / Whether to include global paths */
  includeGlobal?: boolean | IPathItem[];
  /** 是否包含當前目錄 / Whether to include current directory */
  includeCurrentDirectory?: boolean;
  /** 工作目錄 / Working directory */
  cwd?: string;
  /** 搜尋路徑 / Search paths */
  paths?: (string | IPathItem)[];
}
```

## License

ISC