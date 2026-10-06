# @yarn-tool/is-npx

檢測當前是否在 NPX/YPX 環境中執行  
Detect if running in NPX/YPX environment

## 功能 (Features)

- 檢測是否在 NPX / YPX / pnpm dlx 環境中執行 / Detect NPX, YPX, or pnpm dlx execution environments
- 支援多種偵測策略 (Detection strategies)：路徑特徵、環境變數、原始 `is-npx` 模組
- 提供選項標準化 (Option normalization) 與預設值填充
- 內部函式 `_inNpxPath`、`handleOptionsDetectNpx` 亦可單獨使用

## 安裝 (Installation)

```bash
npm install @yarn-tool/is-npx
```

或 / or

```bash
yarn add @yarn-tool/is-npx
```

或 / or

```bash
pnpm add @yarn-tool/is-npx
```

## 使用方式 (Usage)

### 基本用法 / Basic Usage

```typescript
import { isNpx } from '@yarn-tool/is-npx';

const result = isNpx({
  __dirname: __dirname,
  env: process.env,
  argv: process.argv
});

if (result) {
  console.log('Running in NPX/YPX environment');
} else {
  console.log('Running in normal environment');
}
```

## API 文件 (API Documentation)

#### `isNpx(opts)`

檢測當前是否在 NPX/YPX 環境中。  
Detect if currently running in NPX/YPX environment.

**參數 / Parameters:**

| 參數 / Parameter | 型別 / Type | 必填 / Required | 說明 / Description |
|-----------------|------------|----------------|-------------------|
| `opts` | `IOptionsDetectNpxInput` | 是 / Yes | 檢測選項 / Detection options |
| `opts.__dirname` | `string` | 是 / Yes | 當前檔案目錄 / Current file directory |
| `opts.env` | `Record<string, string>` | 是 / Yes | 環境變數物件 / Environment variables object |
| `opts.argv` | `string[]` | 否 / No | 命令列參數陣列 / Command line arguments array |

**回傳值 / Returns:** `boolean` - 是否在 NPX/YPX 環境中 / Whether in NPX/YPX environment

#### `_inNpxPath(__dirname)`

檢查路徑是否包含 NPX/YPX 特徵（內部函式）。  
Check if path contains NPX/YPX characteristics (internal function).

```typescript
import { _inNpxPath } from '@yarn-tool/is-npx';

const isNpxPath = _inNpxPath('/some/path/ypx_abc');
console.log(isNpxPath); // true
```

#### `handleOptionsDetectNpx(opts)`

處理並標準化 NPX 檢測選項（內部函式）。  
Process and normalize NPX detection options (internal function).

## 組態設定 (Configuration)

`isNpx(opts)` 接受 `IOptionsDetectNpxInput`（`__dirname` 與 `env` 至少需提供其中一項），並由 `handleOptionsDetectNpx` 補上預設值：

`isNpx(opts)` takes an `IOptionsDetectNpxInput` (at least one of `__dirname` or `env` is required), and `handleOptionsDetectNpx` fills in defaults:

| 選項 (Option) | 型別 (Type) | 預設值 (Default) | 說明 (Description) |
| --- | --- | --- | --- |
| `__dirname` | `string` | `''` | 當前檔案目錄，用於路徑特徵偵測 / Current file directory, used for path characteristic detection |
| `env` | `Record<string, string>` | `process.env` | 環境變數來源，讀取 `_`、`PNPM_PACKAGE_NAME` 等 / Environment variable source; reads `_`, `PNPM_PACKAGE_NAME`, and similar |
| `argv` | `string[]` | `process.argv` | 命令列參數，`argv[0]` 亦會進行路徑特徵偵測 / Command line arguments; `argv[0]` is also checked for path characteristics |

- 若 `__dirname` 為空且 `env` 不存在，`handleOptionsDetectNpx` 會拋出 `RangeError`
- If `__dirname` is empty and `env` is missing, `handleOptionsDetectNpx` throws a `RangeError`
- 預設值不會修改呼叫端傳入的原始物件 / Defaults never mutate the object passed in by the caller

## 檢測機制 (Detection Mechanism)

此模組使用多種策略來檢測 NPX/YPX 環境：

This module uses multiple strategies to detect NPX/YPX environments:

1. **路徑特徵檢測 / Path Characteristic Detection**
   - 檢查路徑中是否包含 `ypx_`、`_npx` 或 `dlx`
   - Checks if path contains `ypx_`, `_npx`, or `dlx`

2. **PNPM 套件名稱檢測 / PNPM Package Name Detection**
   - 檢查環境變數 `PNPM_PACKAGE_NAME` 是否匹配 NPX/YPX 相關名稱
   - Checks if environment variable `PNPM_PACKAGE_NAME` matches NPX/YPX related names

3. **原始 is-npx 檢測 / Original is-npx Detection**
   - 使用 `is-npx` 模組進行檢測
   - Uses the `is-npx` module for detection

## 授權 / License

ISC
