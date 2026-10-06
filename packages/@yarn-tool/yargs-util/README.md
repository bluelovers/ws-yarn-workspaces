# @yarn-tool/yargs-util

yargs 參數處理的實用工具，提供 Argv 型別解包與程序結束處理 / Utilities for yargs argument handling, providing Argv type unpacking and process exit handling

## 功能特色 (Features)

- `IUnpackYargsArgv<T>` - 從 `yargs` 的 `Argv` 型別解包 (Unpack) 出參數物件的型別
- `yargsProcessExit(msg, code?)` - 以 yargs 的方式輸出錯誤訊息並結束程序 (Process exit)，同時正確處理 `Error` 與一般字串
- 零執行期依賴：僅使用 `@types/yargs` 與 `yargs` 本身，`sideEffects: false`

## 安裝 (Installation)

```bash
yarn add @yarn-tool/yargs-util
yarn-tool add @yarn-tool/yargs-util
yt add @yarn-tool/yargs-util

pnpm add @yarn-tool/yargs-util

npm install @yarn-tool/yargs-util
```

## 使用方式 (Usage)

```typescript
import { IUnpackYargsArgv, yargsProcessExit } from '@yarn-tool/yargs-util';
import { Argv } from 'yargs';

// 以 yargs 設定函式的回傳值解包參數型別
// Unpack the argument type from the return value of a yargs setup function
function setupToYargs(y: Argv)
{
	return y.option('cwd', { type: 'string' }).option('write', { type: 'boolean' });
}

type IArgvRuntime = IUnpackYargsArgv<ReturnType<typeof setupToYargs>>;
// IArgvRuntime 相當於 { cwd?: string; write?: boolean; ... }
// IArgvRuntime is equivalent to { cwd?: string; write?: boolean; ... }

// 以字串結束程序 / Exit the process with a string message
yargsProcessExit('unknown option: --foo');

// 以 Error 結束程序，並指定自訂結束代碼 / Exit with an Error and a custom exit code
yargsProcessExit(new Error('failed to load config'), 2);
```

## API 文件 (API Documentation)

### `IUnpackYargsArgv<T, D = any>`

型別別名 (Type alias)，從 `Argv` 解包出參數型別。

```typescript
type IUnpackYargsArgv<T extends Argv, D = any> = T extends Argv<infer U> ? U : D;
```

- `T` - 來源 `Argv` 型別
- `D` - 無法解包時的後備型別 (Fallback)，預設為 `any`

### `yargsProcessExit(msg, code = 1)`

輸出錯誤訊息並結束程序。

| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `msg` | `string \| Error` | - | 要輸出的訊息 |
| `code` | `number` | `1` | 結束代碼 (Exit code) |

行為說明：

- 傳入 `string` 時會先包裝成 `Error`，並在 `@ts-ignore` 下附加 `msg.code`，讓 `yargs.exit()` 取得一致的錯誤物件。
- 訊息以 `console.error()` 輸出，接著呼叫 `yargs.exit(code, msg)`，最後執行 `process.exit(code)`。
- 傳入 `Error` 時保留原物件，不覆寫其 `code`，因此可沿用呼叫端設定的結束代碼。

## 設定 (Configuration)

本套件沒有設定檔 (Config file)，也沒有環境變數；行為完全由 `yargsProcessExit()` 的參數決定：

- 省略 `code` 時一律以結束代碼 `1` 結束，符合 CLI 的一般失敗慣例。
- 需要特定結束代碼（例如 `2` 代表用法錯誤）時，請自行傳入 `code`。
