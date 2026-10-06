# env-run-path

將本機已安裝的可執行檔路徑 (Local Binaries Path) 加入 `process.env` 的 `PATH`，讓子行程能直接執行專案 `node_modules/.bin` 內的指令。

## Features

- 從目前工作目錄 (cwd) 向上搜尋所有 `node_modules/.bin` 目錄
- 支援自訂搜尋起點 `cwd` 與終點 `stopPath`
- 可選擇將原本的 `PATH` 置前 (Prepend) 或置後 (Append)，或合併 `execPath`
- 透過 `env-run-path/loader` 一行 `import` 即可懶載入 (Lazy Load) 並寫回 `process.env`
- 自動偵測 `PATH` 的實際鍵名（例如 Windows 上可能為 `Path`）

## Installation

```bash
yarn add env-run-path
```

## Usage

### 懶載入 (Lazy Use)

```ts
import 'env-run-path/loader';
```

或以 Node.js 啟動參數載入：

```bash
node -r env-run-path/loader -e console.log(process.env.Path)
```

### 手動合併 PATH

```typescript
import { processRunPath } from 'env-run-path';
import { console } from 'debug-color2';

let { result, delimiter, pathKey } = processRunPath();

const originEnvPath = process.env[pathKey];

console.green.log(`origin:`);
console.log(originEnvPath);

console.green.log(`local`);
console.log(result);

// use origin first
process.env[pathKey] = [originEnvPath, result].join(delimiter);

// use local bin first
process.env[pathKey] = [result, originEnvPath].join(delimiter);
```

### 以選項控制合併方式

```ts
import { processRunPath } from 'env-run-path';
import { console } from 'debug-color2';

let { result, pathKey } = processRunPath();

const originEnvPath = process.env[pathKey];

// use origin first
result = processRunPath({
	includeEnvPath: true,
}).result;

// use local bin first
result = processRunPath({
	includeEnvPath: true,
	prepend: true,
}).result;
```

## API Documentation

### `processRunPath(options?): { result, processEnv, pathKey, delimiter }`

計算合併後的 `PATH` 字串但不寫回環境變數，回傳結果供呼叫端自行決定如何套用。

### `processRunPathEnv(options?): ProcessEnv`

與 `processRunPath` 相同的計算，但會直接將結果寫入 `options.processEnv`（預設 `process.env`）並回傳該環境物件。此為預設匯出 (Default Export)。

### `findBinPath(options?): { result, history }`

從 `cwd` 向上逐層搜尋 `node_modules/.bin`：

- `result`：實際存在的 bin 目錄陣列
- `history`：所有檢查過的目錄（含不存在者），除錯用

### `findBinPathCore(options): { result, history }`

`findBinPath` 的底層實作，不做 `findRoot` 的專案根目錄推斷。

### `getExePath(options): string`

回傳 Node.js 可執行檔所在目錄（`execPath` 的父目錄）。

### Options

| 選項 | 型別 | 預設值 | 說明 |
| --- | --- | --- | --- |
| `cwd` | `string` | `process.cwd()` | 搜尋 `node_modules/.bin` 的起始目錄 |
| `stopPath` | `string \| string[] \| boolean` | 專案根目錄 | 向上搜尋的終點；`true`/`null` 為專案根目錄、`false` 為不設限 |
| `prepend` | `boolean` | `false` | 將本機 bin 路徑置於最前（優先執行本機版本） |
| `includeEnvPath` | `boolean` | `false` | 合併結果時是否包含原本的 `PATH` |
| `appendExecPath` | `boolean` | `false` | 是否將 Node.js 可執行檔目錄附加至結尾 |
| `processEnv` | `ProcessEnv` | `process.env` | 要讀取/寫入的環境物件 |
| `envPath` | `string` | `process.env[pathKey]` | 要合併的原始 `PATH` 字串 |
| `execPath` | `string` | `process.execPath` | Node.js 可執行檔路徑 |
| `overwrite` | `boolean` | `false` | `processRunPathEnv` 是否直接修改傳入的 `processEnv`（否則先複製一份） |

## Configuration

此套件無需設定檔，所有行為皆由上方 Options 選項控制。若只需將本機 bin 加入 `PATH`，直接 `import 'env-run-path/loader'` 即可，預設以「本機 bin 優先、附加 execPath」的方式寫回 `process.env`。
