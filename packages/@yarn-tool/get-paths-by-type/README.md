# @yarn-tool/get-paths-by-type

根據類型 Symbol 取得對應的路徑陣列（支援全域 npm/yarn 路徑、當前目錄、主模組路徑）。  
Get corresponding path array based on type Symbol (supports global npm/yarn paths, current directory, and main module path).

## 功能特色 (Features)

- 🧭 **Symbol 分派 (Symbol Dispatch)** - 以全域註冊的 Symbol（`Symbol.for(...)`）選擇路徑類型，避免字串比對的拼寫錯誤
- 🌐 **全域路徑 (Global Paths)** - 支援 Npm、Yarn、Pnpm 的全域套件目錄，並自動偵測 fnm 安裝路徑
- 📂 **多種類型 (Multiple Types)** - 涵蓋當前工作目錄 (Current Working Directory)、全域目錄與主模組 (Main Module) 路徑
- 🧰 **彈性輸入 (Flexible Input)** - `getPathsByTypeLazy` 接受單一 Symbol、字串或其陣列，一次取得多組路徑

## 安裝 (Installation)

```bash
# 使用 yarn / Using yarn
yarn add @yarn-tool/get-paths-by-type

# 使用 yarn-tool / Using yarn-tool
yarn-tool add @yarn-tool/get-paths-by-type
# yt 是 yarn-tool 的別名 / yt is an alias for yarn-tool
yt add @yarn-tool/get-paths-by-type

# 使用 pnpm / Using pnpm
pnpm add @yarn-tool/get-paths-by-type

# 使用 npm / Using npm
npm install @yarn-tool/get-paths-by-type
```

## 使用範例 (Usage Example)

```typescript
import getPathsByType, {
  SymbolCurrentDirectory,
  SymbolGlobal,
  SymbolGlobalNpm,
  SymbolGlobalYarn,
  SymbolModuleMain,
} from '@yarn-tool/get-paths-by-type';

// 取得全域 Yarn 套件目錄 / Get global Yarn package directory
const yarnPaths = getPathsByType(SymbolGlobalYarn);
console.log(yarnPaths); // ['/usr/local/share/.config/yarn/global/node_modules']

// 取得全域 Npm 套件目錄 / Get global Npm package directory
const npmPaths = getPathsByType(SymbolGlobalNpm);
console.log(npmPaths); // ['/usr/local/lib/node_modules']

// 取得所有全域路徑（Yarn + Npm）/ Get all global paths (Yarn + Npm)
const globalPaths = getPathsByType(SymbolGlobal);
console.log(globalPaths); // [yarn packages path, npm packages path]

// 取得當前工作目錄 / Get current working directory
const cwdPaths = getPathsByType(SymbolCurrentDirectory);
console.log(cwdPaths); // [process.cwd()]

// 取得當前目錄（指定路徑）/ Get current directory (specified path)
const customCwdPaths = getPathsByType(SymbolCurrentDirectory, '/custom/path');

// 取得主模組路徑 / Get main module path
const mainModulePaths = getPathsByType(SymbolModuleMain);
```

## API 文件 / API Documentation

### `getPathsByType(valueType, cwd?)`

根據類型 Symbol 取得對應的路徑陣列。

**參數 (Parameters):**
- `valueType` - 路徑類型 Symbol / Path type Symbol
- `cwd` - 工作目錄（選填，用於 SymbolCurrentDirectory）/ Working directory (optional, for SymbolCurrentDirectory)

**返回 (Returns):** `string[]` - 路徑陣列 / Path array

### `getPathsByTypeLazy(valueType, cwd?)`

接受單一 Symbol、字串或兩者混合的陣列，逐一解析並合併結果；字串為空時拋出 `TypeError`。  
Accepts a single Symbol, a string, or an array mixing both, resolving and merging the results; throws `TypeError` for an empty string.

**參數 (Parameters):**
- `valueType` - 路徑類型 Symbol、路徑字串或其陣列 / Path type Symbol, path string, or an array of them
- `cwd` - 工作目錄（選填，用於 SymbolCurrentDirectory）/ Working directory (optional, for SymbolCurrentDirectory)

**返回 (Returns):** `string[]` - 合併後的路徑陣列 / Merged path array

### `isValidPathSymbol(value)`

判斷給定值是否為本模組支援的路徑類型 Symbol。  
Checks whether the given value is a supported path type Symbol.

### Symbol 類型 (Symbol Types)

| Symbol | 說明 / Description |
|--------|-------------------|
| `SymbolCurrentDirectory` | 當前工作目錄 / Current working directory |
| `SymbolGlobal` | 全域 Yarn + Npm 套件目錄 / Global Yarn + Npm package directories |
| `SymbolGlobalNpm` | 全域 Npm 套件目錄 / Global Npm package directory |
| `SymbolGlobalYarn` | 全域 Yarn 套件目錄 / Global Yarn package directory |
| `SymbolGlobalPnpm` | 全域 Pnpm 套件目錄 / Global Pnpm package directory |
| `SymbolModuleMain` | 主模組的路徑 / Main module path |

## 設定 / Configuration

本模組無須額外設定檔，行為由傳入的參數與執行環境決定：
This module requires no extra configuration file; behavior is determined by the passed arguments and the runtime environment:

- `cwd` 參數 - 僅影響 `SymbolCurrentDirectory`；未傳入時使用 `process.cwd()` /
  Affects `SymbolCurrentDirectory` only; falls back to `process.cwd()` when omitted
- 全域路徑（`SymbolGlobalNpm`、`SymbolGlobalYarn`、`SymbolGlobalPnpm`、`SymbolGlobal`）- 依 npm/yarn/pnpm 的全域安裝位置而定，並在偵測到 fnm 時額外加入其 `node_modules` 路徑 /
  Global paths depend on the global install locations of npm/yarn/pnpm; when fnm is detected, its `node_modules` path is also included
- `SymbolModuleMain` - 依目前 Node.js 程序的主模組 (Main Module) 而定 /
  Depends on the main module of the current Node.js process

## License

ISC