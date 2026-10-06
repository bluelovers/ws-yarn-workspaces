# npm-package-json-loader

用於載入、處理和寫入 package.json 的工具類別，支援自動修復、排序與驗證功能 (Utility class for loading, processing, and writing package.json with auto-fix, sorting, and verification features)

## Features

- `PackageJsonLoader` - 載入和處理 package.json 的主要類別
- `autofix()` - 自動修復 bin、exports、publishConfig 欄位
- `sort()` - 排序 package.json 欄位
- `write()` - 寫入 package.json 檔案
- `loadByModuleName()` - 透過模組名稱載入 package.json

## Installation

```bash
yarn add npm-package-json-loader
yarn-tool add npm-package-json-loader
yt add npm-package-json-loader

pnpm add npm-package-json-loader

npm install npm-package-json-loader
```

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

## API Documentation

### `new PackageJsonLoader(fileOrJson, ...argv)`

建立載入器 (Loader) 實例。`fileOrJson` 可為檔案路徑 (`string`)、`Buffer`、JSON 物件或 `package.json` 相容物件；傳入 `null` 時建立空實例（稍後再以 `setJson()` 填入資料）。

### 靜態方法 (Static methods)

| 方法 | 說明 |
| --- | --- |
| `PackageJsonLoader.create(file, ...argv)` | 工廠方法，依檔案路徑或 JSON 物件建立實例 |
| `PackageJsonLoader.createByJson(json, ...argv)` | 直接以 JSON 物件建立實例 |
| `PackageJsonLoader.findPackageJsonPath(name)` | 回傳指定模組 `package.json` 的絕對路徑 |
| `PackageJsonLoader.loadByModuleName(name)` | 依模組名稱載入；若解析出的 `name` 與請求不符會拋出 `TypeError` |

### 實例方法 (Instance methods)

| 方法 / 屬性 | 說明 |
| --- | --- |
| `read(reload?)` | 讀取 `package.json` 檔案，已載入時預設不重讀 |
| `reload()` | 強制重新讀取檔案 |
| `use(fn \| fn[])` | 註冊自訂處理函式 |
| `run(options?)` | 執行處理流程；`options.autofix` 預設為 `true` |
| `autofix()` | 修復 `bin`、`publishConfig`、`exports` 並清理空欄位 |
| `sort()` | 以標準順序排序欄位；資料為 `undefined` / `null` 時拋出錯誤 |
| `write()` | 寫回 `package.json`；未設定檔案路徑時拋出錯誤 |
| `writeOnlyWhenLoaded()` | 僅在已載入狀態下寫入，回傳是否已載入 |
| `exists()` | 檔案是否存在 |
| `stringify()` | 將 JSON 資料格式化為字串（縮排 2 空格） |
| `data` / `unsafeTypeData` | 取得或設定 `package.json` 資料；後者略過型別檢查 |
| `dir` | `package.json` 所在目錄路徑 |
| `loaded` | 是否已載入資料 |

### 錯誤情況 (Edge cases)

- `read()` 尚未呼叫時，存取 `data` 會自動讀取檔案。
- `setFilename()` 後再呼叫 `write()` 才會實際寫檔。
- `loadByModuleName()` 解析出的套件名稱不相符時會拋出 `TypeError`。

## Configuration

本套件沒有額外的設定檔 (Config file)，行為皆由方法參數控制：

- `run({ autofix: false })` 可關閉自動修復。
- `sort()` 採用 [sort-package-json3](../packages/sort-package-json3) 的預設欄位順序，其他排序相關工具請參考 [Sort Package JSON Utils](../docs/sort-package-json-utils.md)。
- `autofix()` 的欄位修復邏輯委由 `@yarn-tool/pkg-entry-util` 提供。
