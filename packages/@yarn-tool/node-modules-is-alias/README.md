# @yarn-tool/node-modules-is-alias

check given node modules path is alias or not

檢查指定的 node_modules 路徑是否為別名 (Alias) 的工具。所謂「別名」是指目錄名稱、scope (範圍) 與實際解析 (Resolve) 出來的套件名稱不一致的情況，例如符號連結 (Symlink)、工作區互相連結 (Workspace Link) 或被改名的資料夾。

## 功能特色 (Features)

- 🧾 **絕對路徑驗證 (Absolute Path Check)**: `assertIsAbsolutePath` 會在路徑非絕對路徑 (Absolute Path) 時丟出 `RangeError`
- 🗂️ **模組路徑解析 (Module Path Parsing)**: 取得模組根目錄、目錄名稱、是否位於 `@types`、是否直接位於 `node_modules` 之下
- 🔎 **別名判定 (Alias Detection)**: 比對目錄名稱與實際解析出的套件名稱／scope，判斷是否為別名
- 🧷 **兩種解析模式**: 依路徑直接判定，或先解析出套件根目錄再判定（`Unsafe` 版本）
- ✅ **布林值捷徑 (Boolean Shortcut)**: `modulePathIsAlias` 一行取得判定結果

## Installation

```bash
yarn add @yarn-tool/node-modules-is-alias
yarn-tool add @yarn-tool/node-modules-is-alias
yt add @yarn-tool/node-modules-is-alias
```

## Usage

### 基本用法

```typescript
import modulePathIsAlias from '@yarn-tool/node-modules-is-alias';

// 判斷某個路徑是否為別名
const isAlias = modulePathIsAlias('/path/to/project/node_modules/some-package');

console.log(isAlias); // true / false
```

### 取得完整解析結果

```typescript
import { parseModulePathIsAlias } from '@yarn-tool/node-modules-is-alias';

const data = parseModulePathIsAlias('/path/to/project/node_modules/@types/node');

console.log(data.root);           // 最近的 package.json 所在目錄
console.log(data.moduleBasename); // 模組目錄名稱（如 node）
console.log(data.parentBasename); // 上層目錄名稱（如 @types）
console.log(data.isTypes);        // 是否為 @types 套件
console.log(data.isAlias);        // 是否為別名
console.log(data.parsed);         // 解析出的套件名稱（含 scope、subname）
```

### 先解析套件根目錄再判定

```typescript
import { parseModulePathIsAliasUnsafe } from '@yarn-tool/node-modules-is-alias';

// 輸入可以是套件內的任意路徑，會先解析出套件根目錄
const data = parseModulePathIsAliasUnsafe('/path/to/project/node_modules/some-package/src/index.ts');

console.log(data.isAlias);
```

## API Documentation

### assertIsAbsolutePath(absolutePath)

驗證輸入為絕對路徑 (Absolute Path)，否則丟出 `RangeError`。回傳值僅作為型別斷言 (Type Assertion) 使用。

| 參數 | 型別 | 說明 |
| --- | --- | --- |
| `absolutePath` | `string` | 待驗證的路徑 |

**丟出 (Throws):** `RangeError` — 當路徑不是絕對路徑時。

### parseModulePath(absolutePath)

以 `pkg-dir` 找出最近的 `package.json` 作為模組根目錄，並拆解其上下層目錄名稱。

**回傳值 (Returns):**

```typescript
{
	root: string;            // 模組根目錄（最近的 package.json 所在目錄）
	moduleBasename: string;  // 模組目錄名稱，如 node、lodash
	parentBasename: string;  // 上層目錄名稱，如 node_modules、@types、@scope
	isTypes: boolean;        // 上層目錄是否為 @types
	inNodeModules: boolean;  // 上層目錄是否為 node_modules（僅限未帶 scope 的套件）
}
```

### parseModulePathIsAlias(absolutePath)

在 `parseModulePath` 的基礎上，解析該路徑對應的實際套件名稱並判斷是否為別名。

**回傳值 (Returns):** `parseModulePath` 的所有欄位，再加上：

```typescript
{
	parsed: IParsePackageName;   // 實際套件名稱的解析結果（name、scope、subname）
	resolveData: object;         // 套件解析結果，pkg.name 為實際套件名稱
	isAlias: boolean;            // 是否為別名
}
```

**判定為別名的情況 (Alias Conditions):**

1. 目錄名稱與實際套件的 subname 不一致（資料夾被改名）
2. 目錄位於 `@types` 之下，但實際套件並非 `@types` 套件
3. 實際套件帶有 scope，但上層目錄名稱與該 scope 不符

### parseModulePathIsAliasUnsafe(absolutePath)

先以 `resolvePackageCore` 解析出套件根目錄 (Package Root)，再交給 `parseModulePathIsAlias` 判定。適用於輸入可能是套件內任意檔案路徑的場合；路徑無法解析時錯誤會直接丟出，故稱為 Unsafe。

### modulePathIsAlias(dir)

布林值捷徑，等同 `parseModulePathIsAlias(dir).isAlias`。本套件的預設 (Default) 匯出。

## Configuration

本套件不使用設定檔 (Config File)，行為完全由輸入路徑與磁碟上的目錄結構決定：

| 條件 | 說明 |
| --- | --- |
| 路徑必須為絕對路徑 (Absolute Path) | 相對路徑會在 `assertIsAbsolutePath` 觸發 `RangeError` |
| 模組根目錄 | 以 `pkg-dir` 向上尋找最近的 `package.json`；若整個目錄樹都沒有 `package.json`，解析會失敗 |
| `@types` 判定 | 上層目錄名稱為 `@types` 時 `isTypes` 為 `true` |
| `node_modules` 判定 | 僅在模組直接位於 `node_modules` 下（未帶 scope）時 `inNodeModules` 為 `true`；scoped 套件的上層目錄為 `@scope` |
| 別名判定 | 依據目錄名稱、`@types`、scope 三項與實際解析結果比對，任一不符即為別名 |
