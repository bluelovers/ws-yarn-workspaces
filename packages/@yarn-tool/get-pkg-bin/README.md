# @yarn-tool/get-pkg-bin

從 package.json 取得 bin 腳本路徑的工具庫。
A utility for getting bin script paths from package.json.

## 功能特性 (Features)

- 📦 支援從套件名稱或 package.json 物件取得 bin 腳本
- 🔍 支援全域與本地 node_modules 搜尋
- 🛠️ 自動解析 bin 路徑（相對或絕對）
- 🎯 智慧選擇預設 bin（名稱匹配或第一個）
- 🔧 可自訂路徑解析策略（upath2.resolve 或 require.resolve）

## 安裝 (Installation)

```bash
# 使用 yarn / Using yarn
yarn add @yarn-tool/get-pkg-bin

# 使用 yarn-tool / Using yarn-tool
yarn-tool add @yarn-tool/get-pkg-bin
# yt 是 yarn-tool 的別名 / yt is an alias for yarn-tool
yt add @yarn-tool/get-pkg-bin

# 使用 pnpm / Using pnpm
pnpm add @yarn-tool/get-pkg-bin

# 使用 npm / Using npm
npm install @yarn-tool/get-pkg-bin
```

## 使用範例 (Usage Example)

### 基本使用 (Basic Usage)

```typescript
import { normalizePackageBins, defaultPackageBin } from '@yarn-tool/get-pkg-bin';
import { resolvePackage } from '@yarn-tool/resolve-package';

// 使用套件名稱取得 bin 腳本
const bins = normalizePackageBins({ name: 'ts-node' });
console.dir(bins);
// {
//   'ts-node': 'C:/Users/.../ts-node/dist/bin.js',
//   'ts-script': 'C:/Users/.../ts-node/dist/script.js'
// }

// 使用 usePathResolve 選項
const binsWithResolve = normalizePackageBins({
  ...resolvePackage('ts-node'),
  usePathResolve: true,
});
console.dir(binsWithResolve);

// 使用 package.json 物件
const binsFromPkg = normalizePackageBins({
  pkg: resolvePackage('ts-node').pkg,
  usePathResolve: true,
});
console.dir(binsFromPkg);
// { 'ts-node': './dist/bin.js', 'ts-script': './dist/script.js' }

// 取得預設 bin 腳本
const defaultBin = defaultPackageBin({ name: 'ts-node' });
console.log(defaultBin);
// 'C:/Users/.../ts-node/dist/bin.js'
```

### 進階使用 (Advanced Usage)

```typescript
import { normalizePackageBins, defaultPackageBin } from '@yarn-tool/get-pkg-bin';

// 搜尋全域安裝的套件
const globalBins = normalizePackageBins({
  name: 'typescript',
  includeGlobal: true,
});

// 指定預設的 bin 名稱
const customDefaultBin = defaultPackageBin(
  { name: 'some-package' },
  'my-custom-bin'
);

// 使用本地 package.json
const localBins = normalizePackageBins({
  pkg: require('./package.json'),
  pkgRoot: __dirname,
});

// 自訂搜尋路徑
const binsWithPaths = normalizePackageBins({
  name: 'my-package',
  paths: ['/custom/node_modules'],
  includeCurrentDirectory: true,
});
```

## API

### `normalizePackageBins(options)`

正規化套件的 bin 腳本路徑，返回包含所有 bin 名稱與對應路徑的物件。

**參數：**
- `options` (`IOptions`): 選項配置
  - `name`: 套件名稱（可選，若有提供 pkg）
  - `pkg`: package.json 物件（可選，若有提供 name）
  - `pkgRoot`: 套件根目錄路徑（可選）
  - `usePathResolve`: 是否使用路徑解析而非 require.resolve（可選，預設 false）
  - `includeGlobal`: 是否搜尋全域 node_modules（可選）
  - `includeCurrentDirectory`: 是否搜尋當前目錄（可選）
  - `cwd`: 當前工作目錄（可選）
  - `paths`: 額外的模組搜尋路徑（可選）

**返回值：** `Record<string, string>` - bin 名稱與路徑的對應物件

---

### `defaultPackageBin(options, defaultKey?)`

取得套件的預設 bin 腳本路徑。尋找邏輯：
1. 若 `defaultKey` 存在且對應的 bin 存在，返回該 bin 路徑
2. 若 bin 名稱與套件名稱（去除 scope）相符，返回該腳本
3. 否則返回第一個 bin

**參數：**
- `options` (`IOptions`): 選項配置（與 normalizePackageBins 相同）
- `defaultKey?` (`string`): 預設的 bin 名稱（可選）

**返回值：** `string` - bin 腳本的絕對路徑

---

### `getPackageBins(pkg)`

從 package.json 取得 bin 定義，支援字串和物件兩種格式：

- **字串格式**：`{ name: 'my-cli', bin: './cli.js' }` → `{ 'my-cli': './cli.js' }`
- **物件格式**：`{ name: 'my-cli', bin: { 'cli': './cli.js' } }` → `{ 'cli': './cli.js' }`

**參數：**
- `pkg` (`IPackageJsonLike`): package.json 物件

**返回值：** `Record<string, string> | undefined` - bin 名稱與路徑的對應物件

---

### `handlePackageBins(bins, resolveFn?)`

處理 bin 路徑，解析為標準化格式。

**參數：**
- `bins` (`Record<string, string>`): bin 名稱與路徑的對應物件
- `resolveFn?` (`(bin: string) => string`): 路徑解析函數（可選）

**返回值：** `Record<string, string>` - 處理後的 bin 物件

---

### `firstPackageBin(bins)`

取得第一個 bin 腳本路徑。

**參數：**
- `bins` (`Record<string, string>`): bin 名稱與路徑的對應物件

**返回值：** `string | undefined` - 第一個 bin 的路徑

---

### `getPackageInfo(options)`

從選項中取得套件資訊（名稱、根目錄、package.json）。

**參數：**
- `options` (`IOptions`): 選項配置

**返回值：** `{ name: string, pkgRoot: string, pkg: IPackageJson }` - 套件資訊物件

**錯誤：** 若未提供有效的 name 或 pkg，拋出 `TypeError`

## 選項 (Options)

```typescript
interface IOptions {
  /** 套件根目錄路徑 / Package root directory path */
  pkgRoot?: string;

  /** 是否使用路徑解析 / Whether to use path resolution */
  usePathResolve?: boolean;

  /** 模組解析的搜尋路徑 / Search paths for module resolution */
  paths?: string[];

  /** 是否搜尋全域 node_modules / Whether to include global node_modules */
  includeGlobal?: boolean;

  /** 是否搜尋當前目錄 / Whether to include current directory */
  includeCurrentDirectory?: boolean;

  /** 當前工作目錄 / Current working directory */
  cwd?: string;

  /** 套件名稱 / Package name */
  name?: string;

  /** package.json 物件 / package.json object */
  pkg?: IPackageJsonLike;
}
```

### 選項說明

| 選項 | 類型 | 說明 |
|------|------|------|
| `name` | `string` | 套件名稱，用於通過 Node.js 模組解析尋找套件 |
| `pkg` | `IPackageJsonLike` | package.json 物件，可直接提供以避免額外檔案系統操作 |
| `pkgRoot` | `string` | 套件根目錄路徑，用於解析 bin 腳本的相對路徑 |
| `usePathResolve` | `boolean` | `true` 使用 upath2.resolve，`false`（預設）使用 require.resolve |
| `includeGlobal` | `boolean` | 是否搜尋全域 node_modules |
| `includeCurrentDirectory` | `boolean` | 是否搜尋當前目錄 |
| `cwd` | `string` | 指定當前工作目錄 |
| `paths` | `string[]` | 額外的模組搜尋路徑 |

## bin 欄位格式說明

npm/yarn 的 package.json 支援兩種 bin 欄位格式：

### 1. 字串格式（單一 bin）

```json
{
  "name": "my-cli",
  "bin": "./cli.js"
}
```

結果：`{ 'my-cli': './cli.js' }`

適用於只有一個命令列工具的套件。

### 2. 物件格式（多個 bin）

```json
{
  "name": "my-toolkit",
  "bin": {
    "tool-a": "./bin/tool-a.js",
    "tool-b": "./bin/tool-b.js"
  }
}
```

結果：`{ 'tool-a': './bin/tool-a.js', 'tool-b': './bin/tool-b.js' }`

適用於提供多個命令列工具的套件。

## License

ISC