# @yarn-tool/yarnlock-parsed-to-json

將解析後的 `yarn.lock` 資料轉回原始 JSON 結構 — convert parsed yarn.lock back to raw JSON。

## Features

- 依格式版本 (v1 / v2 / v3) 自動選擇轉換路徑
- 輸出與 `@yarn-tool/yarnlock-parse-raw` 相容的原始 (raw) 結構
- 提供 V1 / V2 專用函式與共用的 overload 簽名
- 內建 `throwError` 選項控制無法辨識版本時的行為
- 與 `@yarn-tool/yarnlock-parse-assert` 共用同一套版本驗證

## Installation

```bash
yarn add @yarn-tool/yarnlock-parsed-to-json
yarn-tool add @yarn-tool/yarnlock-parsed-to-json
yt add @yarn-tool/yarnlock-parsed-to-json
```

## Usage

```ts
import yarnLockParse from '@yarn-tool/yarnlock-parse';
import yarnLockParsedToRawJSON from '@yarn-tool/yarnlock-parsed-to-json';

const parsed = yarnLockParse(source);

// 轉回 { object } (v1) 或 { __metadata, ...entries } (v2 / v3)
const rawJson = yarnLockParsedToRawJSON(parsed);
```

只處理單一版本時可直接使用專用函式：

```ts
import {
	yarnLockParsedV1ToRawJSON,
	yarnLockParsedV2ToRawJSON,
} from '@yarn-tool/yarnlock-parsed-to-json';

const rawV1 = yarnLockParsedV1ToRawJSON(parsedV1);
const rawV2 = yarnLockParsedV2ToRawJSON(parsedV2);
```

## API Documentation

### `yarnLockParsedToRawJSON(parsedObject, options?)`

主要 (default) 匯出，具 overload 簽名：

- 傳入 `IYarnLockParsedV1` 回傳 `IYarnLockRawSourceV1`
- 傳入 `IYarnLockParsedV2` 回傳 `IYarnLockRawSourceV2`
- 先經 `assertYarnLockParsed` 驗證，再依格式分流

### `yarnLockParsedV1ToRawJSON(parsedObject: IYarnLockParsedV1)`

將 v1 解析結果的 `meta` 展開於頂層、`data` 放回 `object` 鍵。

### `yarnLockParsedV2ToRawJSON(parsedObject: IYarnLockParsedV2)`

將 v2 / v3 解析結果的 `meta` 放回 `__metadata`、`data` 展開於頂層。

### `IOptionsYarnLockParsedToRawJSON`

| 選項 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `throwError` | `boolean` | `false` | 無法辨識版本且未命中任何分支時，是否拋出 `YarnLockParsedVersionError` |

## Configuration

本套件的行為由 `options` 控制：

- 輸入若不是可辨識的解析結果，`assertYarnLockParsed` 會先拋出 `YarnLockParsedVersionError`
- 通過驗證卻仍未命中 v1 / v2 任何分支時，預設回傳 `undefined`（不拋錯）
- 設定 `throwError: true` 可改為拋出 `YarnLockParsedVersionError`
- 版本驗證本身由 `@yarn-tool/yarnlock-parse-assert` 執行，與整個 yarnlock 系列套件採用相同規則
