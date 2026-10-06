# @yarn-tool/write-package-json

以一致的格式 (Pretty Formatting) 寫入 `package.json`：固定 2 空白縮排 (2-Space Indent) 並保證檔尾換行 (Final EOL)。提供同步 (Sync) 與非同步 (Async)、以及會自動建立上層目錄的 `output` 兩組 API。

## Features

- 預設 2 空白縮排、檔尾保留換行符，確保不同工具寫出的 `package.json` 格式一致
- 同步 (`Sync`) 與非同步 (Async) 版本成對提供
- `outputPackageJSON(Sync)` 會先建立上層目錄（mkdir -p 語意）
- 可透傳 `@bluelovers/fs-json` 的 `IWriteOptions` 覆寫縮排等行為

## Installation

```bash
yarn add @yarn-tool/write-package-json
yarn-tool add @yarn-tool/write-package-json
yt add @yarn-tool/write-package-json
```

## Usage

```ts
import writePackageJSONSync, {
	writePackageJSON,
	outputPackageJSONSync,
	outputPackageJSON,
} from '@yarn-tool/write-package-json';

// 同步寫入（檔案所在目錄需已存在）
writePackageJSONSync('./package.json', { name: 'my-pkg', version: '1.0.0' });

// 非同步寫入
await writePackageJSON('./package.json', { name: 'my-pkg', version: '1.0.0' });

// 自動建立上層目錄後寫入
outputPackageJSONSync('./nested/dir/package.json', { name: 'my-pkg' });

// 自訂格式選項（覆寫預設的 spaces / finalEOL）
writePackageJSONSync('./package.json', { name: 'my-pkg' }, { spaces: 4 });
```

## API Documentation

所有函式簽名相同：`(file: string, data: unknown, options?: IWriteOptions)`，差異在於同步/非同步與是否建立目錄。

| 函式 | 行為 |
|------|------|
| `writePackageJSONSync(file, data, options?)` | 同步寫入；亦為預設匯出 |
| `writePackageJSON(file, data, options?)` | 非同步寫入 |
| `outputPackageJSONSync(file, data, options?)` | 同步寫入，缺少的上層目錄會自動建立 |
| `outputPackageJSON(file, data, options?)` | 非同步寫入，缺少的上層目錄會自動建立 |
| `_handleOptions(options)` | 內部用：補上 `spaces: 2` 與 `finalEOL: true` 預設值 |

## Configuration

`options` 型別為 `IWriteOptions`（來自 `@bluelovers/fs-json`），未指定時套用：

- `spaces: 2` — JSON 縮排空白數
- `finalEOL: true` — 檔案結尾保留換行符

傳入的其他欄位會原樣透傳給底層的 `writeJSON` / `outputJSON`。
