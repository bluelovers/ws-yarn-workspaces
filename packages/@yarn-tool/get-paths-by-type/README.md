# @yarn-tool/get-paths-by-type

根據類型 Symbol 取得對應的路徑陣列（支援全域 npm/yarn 路徑、當前目錄、主模組路徑）。
Get corresponding path array based on type Symbol (supports global npm/yarn paths, current directory, and main module path).

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

## API

### `getPathsByType(valueType, cwd?)`

根據類型 Symbol 取得對應的路徑陣列。

**參數 (Parameters):**
- `valueType` - 路徑類型 Symbol / Path type Symbol
- `cwd` - 工作目錄（選填，用於 SymbolCurrentDirectory）/ Working directory (optional, for SymbolCurrentDirectory)

**返回 (Returns):** `string[]` - 路徑陣列 / Path array

### Symbol 類型 (Symbol Types)

| Symbol | 說明 / Description |
|--------|-------------------|
| `SymbolCurrentDirectory` | 當前工作目錄 / Current working directory |
| `SymbolGlobal` | 全域 Yarn + Npm 套件目錄 / Global Yarn + Npm package directories |
| `SymbolGlobalNpm` | 全域 Npm 套件目錄 / Global Npm package directory |
| `SymbolGlobalYarn` | 全域 Yarn 套件目錄 / Global Yarn package directory |
| `SymbolModuleMain` | 主模組的路徑 / Main module path |

## License

ISC