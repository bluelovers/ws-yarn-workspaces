# npm-package-json-loader

用於載入、處理和寫入 package.json 的工具類別，支援自動修復、排序與驗證功能 (Utility class for loading, processing, and writing package.json with auto-fix, sorting, and verification features)

## Install

```bash
yarn add npm-package-json-loader
yarn-tool add npm-package-json-loader
yt add npm-package-json-loader

pnpm add npm-package-json-loader

npm install npm-package-json-loader
```

## Features

- `PackageJsonLoader` - 載入和處理 package.json 的主要類別
- `autofix()` - 自動修復 bin、exports、publishConfig 欄位
- `sort()` - 排序 package.json 欄位
- `write()` - 寫入 package.json 檔案
- `loadByModuleName()` - 透過模組名稱載入 package.json

## Usage

```typescript
import { PackageJsonLoader } from 'npm-package-json-loader';

// 從檔案路徑載入
const pkg = new PackageJsonLoader('/path/to/package.json');
pkg.read();
pkg.autofix();
pkg.sort();
pkg.write();

// 從模組名稱載入
const pkg2 = PackageJsonLoader.loadByModuleName('lodash');

// 使用回調處理
pkg.use((json) => {
  json.version = '1.0.0';
});
pkg.run();
```
