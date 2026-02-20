# @yarn-tool/get-pkg-bin

從 package.json 取得 bin 腳本路徑的工具庫。
A utility for getting bin script paths from package.json.

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

## API

### `normalizePackageBins(options)`

正規化套件的 bin 腳本路徑，返回包含所有 bin 名稱與對應路徑的物件。

### `defaultPackageBin(options, defaultKey?)`

取得套件的預設 bin 腳本路徑。若 bin 名稱與套件名稱相符則返回該腳本，否則返回第一個 bin。

### `getPackageBins(pkg)`

從 package.json 取得 bin 定義。

### `handlePackageBins(bins, resolveFn?)`

處理 bin 路徑，解析為標準化格式。

### `firstPackageBin(bins)`

取得第一個 bin 腳本路徑。

### `getPackageInfo(options)`

從選項中取得套件資訊（名稱、根目錄、package.json）。

## 選項 (Options)

```typescript
interface IOptions {
  /** 套件根目錄路徑 / Package root directory path */
  pkgRoot?: string;

  /** 是否使用路徑解析 / Whether to use path resolution */
  usePathResolve?: boolean;

  /** 模組解析的搜尋路徑 / Search paths for module resolution */
  paths?: string[];

  /** 套件名稱 / Package name */
  name?: string;

  /** package.json 物件 / package.json object */
  pkg?: IPackageJsonLike;
}
```

```js
{
  'ts-node': 'C:/Users/User/AppData/Roaming/npm/node_modules/ts-node/dist/bin.js',
  'ts-script': 'C:/Users/User/AppData/Roaming/npm/node_modules/ts-node/dist/script.js'
}
{
  'ts-node': 'C:/Users/User/AppData/Roaming/npm/node_modules/ts-node/dist/bin.js',
  'ts-script': 'C:/Users/User/AppData/Roaming/npm/node_modules/ts-node/dist/script.js'
}
{ 'ts-node': './dist/bin.js', 'ts-script': './dist/script.js' }
{
  'ts-node': 'C:/Users/User/AppData/Roaming/npm/node_modules/ts-node/dist/bin.js',
  'ts-script': 'C:/Users/User/AppData/Roaming/npm/node_modules/ts-node/dist/script.js'
}
```

## License

ISC