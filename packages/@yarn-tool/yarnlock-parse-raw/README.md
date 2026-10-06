# @yarn-tool/yarnlock-parse-raw

Parse and/or write yarn.lock files all version — 以原始 (raw) 格式解析與寫回任意版本的 `yarn.lock`。

## Features

- 同時支援 v1 與 v2 / v3 兩種 `yarn.lock` 格式
- `parse` 保留底層原始結構（不做正規化），適合需要完整欄位的進階用途
- `stringify` 可寫回標準格式，v2 支援是否保留 banner 標頭 (banner)
- 輸入接受 `Buffer` 與 `string`，無須自行轉型
- 附帶 `parseResolution` / `stringifyResolution` 處理 resolution 欄位

## Installation

```bash
yarn add @yarn-tool/yarnlock-parse-raw
yarn-tool add @yarn-tool/yarnlock-parse-raw
yt add @yarn-tool/yarnlock-parse-raw
```

## Usage

```ts
import {
	parseYarnLockRawV1,
	stringifyYarnLockRawV1,
	parseYarnLockRawV2,
	stringifyYarnLockRawV2,
} from '@yarn-tool/yarnlock-parse-raw';

// v1 格式：回傳 { type, object }
const rawV1 = parseYarnLockRawV1(source);

// v2 / v3 格式：回傳 { __metadata, ...entries }
const rawV2 = parseYarnLockRawV2(source);

// 寫回 yarn.lock
const outputV1 = stringifyYarnLockRawV1(rawV1);
const outputV2 = stringifyYarnLockRawV2(rawV2);
```

## API Documentation

### `parseYarnLockRawV1(source: string | Buffer, fileLoc?: string)`

解析 v1 格式的 `yarn.lock`，回傳 `{ type, object }` 原始結構，`fileLoc` 用於錯誤訊息中的檔案位置。

### `getYarnLockRawV1Root(input)` / `parseYarnLockRawV1Root(source, fileLoc?)`

取得 v1 原始結果的 `object` 根節點；若輸入缺少 `object` 鍵會拋出 `TypeError`。

### `stringifyYarnLockRawV1(json, noHeader?)`

將 v1 資料寫回字串。可直接傳入 `{ object }` 包裹的結果或純 `object` 內容，`noHeader` 可省略 banner 標頭。

### `parseYarnLockRawV2(source: string | Buffer)`（亦以 `parseYarnLockRawV2Root` 匯出）

解析 v2 / v3 格式的 `yarn.lock`，回傳 `{ __metadata, ...entries }` 原始結構。

### `getYarnLockRawV2Root(input)`

回傳 v2 原始結果本身；若意外帶有 v1 的 `object` 鍵則拋出 `TypeError`。

### `stringifyYarnLockRawV2(json, noHeader?)`

將 v2 資料寫回字串，預設附加 v2 banner 標頭並以 LF 分隔，`noHeader` 可移除標頭。

### `parseResolution` / `stringifyResolution`

重新匯出 (re-export) 自 `@yarnpkg/parsers`，用於解析與寫回 lock 檔中的 resolution 欄位。

## Configuration

本套件無須額外設定：

- 版本格式由呼叫端決定（v1 或 v2 函式分開匯出），不做自動偵測；需要自動偵測請使用 `@yarn-tool/yarnlock-parse`
- `noHeader` 參數控制是否輸出 banner 標頭
- 底層解析委託 `@yarnpkg/lockfile`（v1）與 `@yarnpkg/parsers`（v2），行為與 Yarn 官方一致
