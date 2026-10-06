# @yarn-tool/env-path

讀取與寫入 `PATH` 這類環境變數路徑 (Environment Path) 的小型工具，可直接操作 `process.env`，也可操作任意 record-like 的環境變數物件。

## Features

- 從 `process.env` 或任意 record-like 物件讀取 `PATH` 環境變數
- 以陣列或字串寫入 `PATH` 環境變數，自動處理分隔符號 (Delimiter)
- 自動偵測 `PATH` 的實際鍵名（例如 Windows 上可能為 `Path`）
- 將 `PATH` 字串解析為結構化物件，方便取用各段路徑
- 在無法存取 `process.env` 的環境下，可透過 `ignoreErrors` 安全地回傳 `undefined`

## Installation

```bash
yarn add @yarn-tool/env-path
yarn-tool add @yarn-tool/env-path
yt add @yarn-tool/env-path
```

## Usage

```ts
import envPathObject, {
	processEnv,
	envPathKey,
	getEnvPathValue,
	setEnvPathValue,
	envObject,
	delimiter,
} from '@yarn-tool/env-path';

// 取得目前 process.env 的 PATH 字串
const pathValue = getEnvPathValue();

// 取得 PATH 在目前環境中的實際鍵名
const key = envPathKey();

// 以陣列寫入 PATH（自動以平台分隔符號 join）
setEnvPathValue(['/usr/local/bin', '/usr/bin']);

// 解析 PATH 為結構化物件
const { path } = envPathObject();
console.log(path);
```

## API Documentation

### `processEnv(ignoreErrors?: boolean): NodeJS.ProcessEnv | undefined`

回傳 `process.env`。當存取 `process.env` 拋出例外時：

- `ignoreErrors` 為 falsy（預設）：重新拋出例外
- `ignoreErrors` 為 `true`：回傳 `undefined`，方便在受限環境（如沙箱）中安全呼叫

### `envPathKey(env?: IRecordLike<string, any>): string`

在給定的環境物件中找出 `PATH` 的實際鍵名（大小寫不敏感）。未傳入 `env` 時使用 `processEnv()`。

### `getEnvPathValue(env?: IRecordLike<string, any>, key?: string): string`

回傳 `PATH` 的字串值。`key` 未傳入時自動以 `envPathKey(env)` 取得。

### `setEnvPathValue(value: string | string[], env?: IRecordLike<string, string>, key?: string, delim?: IPathDelimiter): void`

寫入 `PATH` 值。若 `value` 是陣列，會以 `delim ?? delimiter` 連接成字串後寫入。

### `envObject(env?: IRecordLike<string, any>, key?: string, delim?: IPathDelimiter)`

將環境變數中的 `PATH` 字串解析為結構化物件（透過 `path-env2`）。若 `env` 是 `Map` 等具 `entries()` 的物件，會先轉為普通物件。

### `envPathObject(env?: IRecordLike<string, any>, key?: string, delim?: IPathDelimiter)`

等同於 `envObject(env, key, delim).path`，也是此套件的預設匯出 (Default Export)。

### `delimiter: string`

目前平台的 `PATH` 分隔符號（`path.delimiter`，Unix 為 `:`、Windows 為 `;`）。

## Configuration

此套件無需設定，所有參數皆以函式參數傳入：

| 參數 | 型別 | 說明 |
| --- | --- | --- |
| `env` | `IRecordLike<string, any>` | 要操作的環境物件，預設為 `process.env` |
| `key` | `string` | `PATH` 的鍵名，預設自動偵測 |
| `delim` | `IPathDelimiter` | 陣列連接用的分隔符號，預設為平台的 `delimiter` |
| `ignoreErrors` | `boolean` | 存取 `process.env` 失敗時是否忽略例外 |
