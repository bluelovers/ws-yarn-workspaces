# @yarn-tool/yarnlock-entries

`entries from yarnlock v1 and berry` —— 以迭代器 (Iterator) 逐筆讀取 yarn.lock 條目的工具套件，同時支援 v1（Yarn Classic）與 berry（Yarn Berry v2/v3），可從內容字串或檔案建立，並提供增刪改查與序列化 (Serialize) 能力。

## Features

- 從內容字串 (`fromContent`) 或檔案 (`fromFile`) 建立條目迭代器，皆提供 Async 版本
- 同一套 API 透過 `isV1()` / `isV2()` / `v1()` / `v2()` 判別 (Discriminate) lockfile 版本
- 以 Map 風格介面操作條目：`keys()` / `values()` / `get()` / `set()` / `has()` / `del()` / `update()`
- 支援 `map` / `reduce` 及對應的 Async 版本，逐筆處理條目
- `stringify()` / `toJSON()` 將變更後的資料還原為 yarn.lock 內容
- 迭代時自動解析 (Normalize) 條目為統一的名稱與版本資訊

## Installation

```bash
yarn add @yarn-tool/yarnlock-entries
yarn-tool add @yarn-tool/yarnlock-entries
yt add @yarn-tool/yarnlock-entries
```

## Usage

### 從檔案讀取並逐筆迭代

```ts
import { fromFile } from '@yarn-tool/yarnlock-entries';

const it = fromFile('yarn.lock');

for (const { key, raw, value } of it)
{
	// key：yarn.lock 的鍵值（名稱@版本範圍）
	// raw：原始列資料；value：解析後的名稱與版本資訊
	console.log(key, raw, value);
}
```

### 從內容字串建立並修改條目

```ts
import { fromContent } from '@yarn-tool/yarnlock-entries';
import { readFileSync, writeFileSync } from 'fs-extra';

const it = fromContent(readFileSync('yarn.lock', 'utf-8'));

// Map 風格操作
const firstKey = it.keys()[0];
console.log(it.has(firstKey));
console.log(it.get(firstKey));

// 刪除條目並序列化回 yarn.lock 內容
it.del(firstKey);
writeFileSync('yarn.lock', it.stringify());
```

### 版本判別

```ts
import { fromFile, YarnLockIterator } from '@yarn-tool/yarnlock-entries';

const it = fromFile('yarn.lock');

if (it.isV1())
{
	// 收窄 (Narrow) 為 v1 迭代器
	console.log(it.v1().keys());
}
else
{
	// v1 以外呼叫 v1() 會拋出 yarnlock-error 的版本錯誤
	console.log(it.v2().keys());
}
```

## API Documentation

### 建立迭代器

| 函式 | 說明 |
| --- | --- |
| `fromContent(yarnlock_old)` | 從 `Buffer \| string` 內容解析並建立迭代器 |
| `fromContentAsync(yarnlock_old)` | `fromContent` 的非同步版本（回傳 Promise） |
| `fromFile(yarnlock_file)` | 讀取檔案並建立迭代器 |
| `fromFileAsync(yarnlock_file)` | `fromFile` 的非同步版本（回傳 Promise） |
| `handleContentObject(data)` | 直接由已解析的 `IYarnLockParsedV1 \| IYarnLockParsedV2` 建立迭代器（內部 API） |

### YarnLockIterator

| 成員 | 說明 |
| --- | --- |
| `constructor($object)` | 傳入解析結果；同時為 v1 與 v2 時拋出版本錯誤 |
| `verType` | 目前的 lockfile 版本 |
| `isV1()` / `isV2()` | 型別判別函式 (Type Guard)，供收窄使用 |
| `v1()` / `v2()` | 斷言版本並回傳對應型別的迭代器，不符時拋錯 |
| `keys()` | 取得所有條目鍵值 |
| `values()` | 以陣列回傳所有條目（含 `key` / `raw` / `value`） |
| `get(key)` / `set(key, raw)` / `has(key)` | 讀取、寫入、檢查條目是否存在 |
| `del(key)` | 刪除條目並回傳被刪除的列資料 |
| `update(key, raw)` | 深度合併 (Deep Merge) 部分欄位；鍵不存在時拋 `TypeError` |
| `iterator()` / `[Symbol.iterator]()` | 逐筆迭代出 `IYarnLockIteratorWrap` |
| `iteratorRaw()` | 只迭代 `key` 與原始列資料 `raw`，不做額外解析 |
| `map(fn)` / `mapAsync(fn)` | 逐筆轉換為陣列，Async 版本可等待非同步回呼 |
| `reduce(fn, initValue?)` / `reduceAsync(...)` | 逐筆累加，未提供 `initValue` 時以空物件起始 |
| `stringify()` | 還原為 yarn.lock 內容字串 |
| `toJSON()` | 還原為原始來源型別（`IYarnLockSource`），失敗時拋錯 |

### 型別

| 型別 | 說明 |
| --- | --- |
| `IYarnLockIteratorWrap<D>` | 迭代項目：`key`（鍵值）、`raw`（原始列資料）、`value`（解析後資訊） |
| `IYarnLockIteratorWrapValue<D>` | `value` 的型別，含解析出的名稱與版本資訊 |

## Configuration

本套件以泛型 (Generic) 回傳對應版本的型別：

| 泛型 | 預設值 | 說明 |
| --- | --- | --- |
| `T` | 由呼叫端傳入或推導 | 解析結果型別（`IYarnLockParsedV1` 或 `IYarnLockParsedV2`），決定 `keys()` / `get()` 等回傳的列型別 |
| `DD` | `IUnpackYarnLockDataRow<T>` | 迭代時使用的列資料 (Row) 型別，可於 `iterator<D>()` / `map<D>()` 等方法個別覆寫 |

鎖檔版本由內容自動偵測，無須額外設定；若傳入同時具備 v1 與 v2 特徵的物件，建構子會拋出 `@yarn-tool/yarnlock-error` 的版本錯誤。
