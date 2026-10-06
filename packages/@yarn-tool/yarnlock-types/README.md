# @yarn-tool/yarnlock-types

`TypeScript types for yarn.lock data` —— 為 `yarn.lock` 資料定義的 TypeScript 型別 (Type Definition) 套件，涵蓋 v1 / v2 的列資料 (Row)、解析後的紀錄 (Parsed Record) 與 lockfile 版本偵測 (Version Detection)，供 `@yarn-tool` 系列與其他工具共用同一組型別。

## Features

- 定義 `yarn.lock` v1 與 v2 的列資料型別（`IYarnLockDataRowV1` / `IYarnLockDataRowV2`）
- 以 `IYarnLockParsedV1` / `IYarnLockParsedV2` 區分解析結果的版本差異，可由 `verType` 判別 (Narrowing)
- 提供 `EnumDetectYarnLock` 等列舉 (Enum) 判斷 lockfile 是 v1、v2（Berry）或 v3
- 原始解析結果型別 `IYarnLockRawSourceV1` / `IYarnLockRawSourceV2`，對應 `@yarnpkg/lockfile` 與 `@yarnpkg/parsers` 的回傳形狀
- 以 `IUnpackYarnLockDataRow` 從解析結果反推列資料型別，避免手動重複定義

## Installation

```bash
yarn add @yarn-tool/yarnlock-types
yarn-tool add @yarn-tool/yarnlock-types
yt add @yarn-tool/yarnlock-types
```

## Usage

```ts
import type {
	IYarnLockDataRecord,
	IYarnLockParsed,
	IYarnLockParsedV2,
	IYarnLockDataRowV2,
} from '@yarn-tool/yarnlock-types';
import { EnumDetectYarnLock } from '@yarn-tool/yarnlock-types';

// 依 verType 判別 lockfile 版本，並取得對應的 data
function handle(parsed: IYarnLockParsed)
{
	if (parsed.verType === EnumDetectYarnLock.v1)
	{
		// 此處 parsed 為 IYarnLockParsedV1，data 的列含 resolved / integrity
		return parsed.data;
	}

	// 此處 parsed 為 IYarnLockParsedV2，data 的列含 resolution / checksum
	return parsed.data;
}

// 自訂 record 的鍵值與列型別
type TRecord = IYarnLockDataRecord<IYarnLockDataRowV2, string>;
```

## API Documentation

### 列資料 (Row)

| 型別 | 說明 |
| --- | --- |
| `IYarnLockDataRowBase` | 列資料基礎：`version` 與可選的 `dependencies` |
| `IYarnLockDataRowV1` | v1 列資料，另含 `resolved`（安裝來源網址）與 `integrity`（雜湊） |
| `IYarnLockDataRowV2` | v2 列資料，另含 `resolution`、`checksum`、`languageName`、`linkType` |
| `IYarnLockDataRecord<D, K>` | `Record<K, D>`，以鍵值對應列資料的解析結果容器 |

### 解析結果 (Parsed)

| 型別 / 列舉 | 說明 |
| --- | --- |
| `IYarnLockParsed` | `IYarnLockParsedV1 \| IYarnLockParsedV2` 聯集 |
| `IYarnLockParsedV1<D>` | v1 解析結果：`verType`、`meta.type`、`data` |
| `IYarnLockParsedV2<D>` | v2 解析結果：`verType`、`meta.version` / `cacheKey`、`data` |
| `IYarnLockParsedLoose<D, K>` | 寬鬆解析結果，用於避免 TypeScript 型別錯誤 |
| `IUnpackYarnLockDataRow<T>` | 從解析結果型別反推列資料型別 |
| `EnumDetectYarnLock` | 版本偵測列舉：`v1` / `v2`（`berry` 為 deprecated 別名） / `v3`（`canary` 為 deprecated 別名） / `unknown` |
| `EnumDetectYarnLockInputType` | 偵測輸入來源列舉：`unknown` / `simple` / `parse_raw` |

### 版本與原始來源 (Raw Source)

| 型別 / 列舉 | 說明 |
| --- | --- |
| `IEnumDetectYarnLockValues` | `EnumDetectYarnLock` 的值聯集 |
| `IValidYarnLockVersion` | 排除 `unknown` 後的有效版本值 |
| `IYarnLockVersionSyml` | 再排除 v1 後的版本符號值（v2 / v3） |
| `IYarnLockMetaVersion` | meta 內的版本字串（數字字面型別） |
| `IYarnLockRawSourceV1` / `IYarnLockRawSourceV1Full` | `@yarnpkg/lockfile` 的 v1 解析回傳形狀（`Full` 為欄位全為必要） |
| `IYarnLockRawSourceV2` / `IYarnLockRawSourceV2Full` | `@yarnpkg/parsers` 的 v2 解析回傳形狀（含 `__metadata`） |
| `IYarnLockSource` | 原始來源的 v1 / v2 聯集 |
| `EnumYarnLockSourceV1Type` | v1 來源型別：`success` / `merge` / `conflict` |
| `EnumLinkType` | 連結方式：`hard` / `soft` |
| `EnumLanguageName` | 語言名稱：`node` / `unknown` |

## Configuration

本套件的多數型別以泛型 (Generic) 參數化，可依需求調整：

| 型別 | 泛型 | 預設值 | 說明 |
| --- | --- | --- | --- |
| `IYarnLockDataRecord<D, K>` | `D` 列資料、`K` 鍵值型別 | `IYarnLockDataRowBase`、`string` | 自訂列型別與鍵值形狀 |
| `IYarnLockParsedLoose<D, K>` | `D`、`K` | 同上 | 寬鬆解析結果的列與鍵值 |
| `IYarnLockParsedV1<D>` / `IYarnLockParsedV2<D>` | `D` 資料容器 | 對應版本的 record | 收窄或放寬解析結果的 `data` |
