# @yarn-tool/resolve-package

解析 Node.js 套件的根目錄與 package.json 路徑的工具庫，支援 Node.js 17 以上版本。
A utility for resolving package root and package.json paths, compatible with Node.js 17+.

## 安裝 (Installation)

```bash
# 使用 yarn / Using yarn
yarn add @yarn-tool/resolve-package

# 使用 yarn-tool / Using yarn-tool
yarn-tool add @yarn-tool/resolve-package
# yt 是 yarn-tool 的別名 / yt is an alias for yarn-tool
yt add @yarn-tool/resolve-package

# 使用 pnpm / Using pnpm
pnpm add @yarn-tool/resolve-package

# 使用 npm / Using npm
npm install @yarn-tool/resolve-package
```

## 使用範例 (Usage Example)

```typescript
import { resolvePackageJsonLocation, resolvePackage, resolvePackageRoot } from '@yarn-tool/resolve-package'

// 取得套件的 package.json 路徑 / Get package.json path
console.dir(resolvePackageJsonLocation('tslib'));

// 取得套件根目錄 / Get package root directory
console.dir(resolvePackageRoot('tslib'));

// 取得完整套件資訊 / Get complete package information
const pkg = resolvePackage('tslib');
console.dir(pkg.pkgRoot);        // 套件根目錄 / Package root
console.dir(pkg.pkgJsonLocation); // package.json 路徑 / package.json path
console.dir(pkg.pkg);            // package.json 內容 / package.json content
console.dir(pkg.resolveLocation('lib/index.js')); // 相對路徑解析 / Resolve relative path
```

## API

### `resolvePackageCore(moduleName, options?)`

核心解析函數，嘗試解析模組的入口點位置。

### `resolvePackageRoot(moduleName, options?)`

取得套件的根目錄路徑。

### `resolvePackageJsonLocation(moduleName, options?)`

取得套件的 package.json 檔案位置。

### `createResolveLocationFn(moduleName, options?)`

建立一個相對於套件根目錄解析路徑的函數。

### `readModulePackageJson(moduleName, options?)`

讀取並返回模組的 package.json 內容。

### `resolvePackage(moduleName, options?)`

最完整的解析函數，返回套件根目錄、入口點、package.json 內容及路徑解析函數。

## License

ISC