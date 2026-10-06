# cache-path

> return a cache directory, like `find-cache-dir` do

回傳一個快取 (Cache) 目錄路徑，用法與 [`find-cache-dir`](https://github.com/avajs/find-cache-dir) 相同，差異在於本套件在任何環境下都能回傳路徑。

## 特色 (Features)

1. 在任何環境下都能回傳路徑
   `find-cache-dir` 在非模組/專案目錄下執行時會回傳失敗，本套件仍會回傳可用的路徑。
2. 可自訂尋找快取路徑的順序 (Order)
   透過 `fnOrder` 調整各種快取來源的嘗試順序。
3. 同步 (Sync) 與非同步 (Async) API 皆齊備
   `getCachePath` / `getCacheRoot` 都有對應的 `*Async` 版本。
4. 支援名稱正規化 (Normalize)、雜湊 (Hash) 與隨機目錄 (Random Directory)。
5. 內建多種快取來源：`node_modules/.cache`、Yarn 快取、npm 快取、作業系統暫存目錄。

## 安裝 (Installation)

```bash
npm install cache-path
```

## 使用方式 (Usage)

[API 型別定義](index.ts)

`getCachePath` 也有非同步版本 `getCachePathAsync`。

```ts
import { normalizeName, getCachePath } from 'cache-path';

console.log(normalizeName('@node-novel/sort'));
// => _node_novel_sort
console.log(normalizeName('@node-novel/sort', true));
// => 7bc015f2

// 在模組/專案目錄下執行時
console.log(getCachePath());
// => D:\Users\Documents\The Project\nodejs-yarn\ws-segment\packages\cache-path\node_modules\.cache
console.log(getCachePath('@node-novel/sort'));
// => D:\Users\Documents\The Project\nodejs-yarn\ws-segment\packages\cache-path\node_modules\.cache\_node_novel_sort

// 其他環境（例如系統暫存目錄）
console.log(getCachePath());
// => T:\cache\npm-cache\.cache
console.log(getCachePath('@node-novel/sort'));
// => T:\cache\npm-cache\.cache\_node_novel_sort
```

## API 文件 (API Documentation)

| 函式 | 說明 |
|------|------|
| `getCachePath(name?, options?)` | 取得快取目錄路徑（同步） |
| `getCachePathAsync(name?, options?)` | 取得快取目錄路徑（非同步） |
| `getCacheRoot(options?)` | 取得快取根目錄 (Cache Root)（同步） |
| `getCacheRootAsync(options?)` | 取得快取根目錄（非同步） |
| `normalizeName(name, hash?)` | 正規化名稱，必要時轉為雜湊值 |
| `findPkgModuleCachePath(cwd?)` | 尋找專案 `node_modules/.cache` 路徑 |
| `findPkgModulePath(cwd?)` | 尋找專案 `node_modules` 路徑 |
| `findYarnCachePath(cwd?, processEnv?)` | 尋找 Yarn 快取路徑 |
| `findNpmCachePath(cwd?, processEnv?)` | 尋找 npm 快取路徑 |
| `findOSTempPath(cwd?, processEnv?)` | 取得作業系統暫存目錄 (OS Temp Directory) |

各函式的完整參數與回傳值請參閱 [index.ts](index.ts) 與 [lib/](lib/) 原始碼中的 JSDoc。

## 設定 (Configuration)

`getCachePath` / `getCacheRoot` 接受 `IOptions`（定義於 [lib/types.ts](lib/types.ts)），亦可直接傳入字串作為 `cwd`。

| 選項 | 型別 | 說明 |
|------|------|------|
| `cwd` | `string` | 搜尋起始目錄，預設為 `process.cwd()` |
| `base` | `string` | 快取根目錄下的基礎目錄名稱，預設 `.cache` |
| `name` | `string` | 快取子目錄名稱，會經過 `normalizeName` 正規化 |
| `fnOrder` | `Array<(cwd?, processEnv?) => string>` | 尋找快取根目錄的函式順序，回傳第一個可用結果 |
| `disableDefaultFailback` | `boolean` | 設為 `true` 時，`fnOrder` 找不到結果不再回退至預設順序 |
| `create` | `boolean` | 目錄不存在時是否自動建立 |
| `thunk` | `boolean` | 回傳可組合子路徑的 thunk 函數 (Thunk Function) 而非字串 |
| `hash` | `boolean \| ((input: string) => string)` | 名稱是否轉為雜湊值，或傳入自訂雜湊函數 |
| `randomIfNoName` | `boolean` | 未指定名稱時是否建立隨機暫存目錄 |
| `processEnv` | `NodeJS.ProcessEnv` | 傳給各快取來源函式的環境變數 |

## 相關文件

- [路徑工具模組](../docs/find-path-tools.md) — § 5. packages/cache-path
