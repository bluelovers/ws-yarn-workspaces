# @yarn-tool/yarnlock-parse

解析 (parse) 各種版本的 `yarn.lock`，將其轉為結構化的 parsed 資料結構 — parse yarnlock all version。

## Features

- 自動偵測 (detect) `yarn.lock` 的格式版本：v1、v2、v3
- 同時支援 `Buffer` 與 `string` 兩種輸入來源
- 輸出統一的 `{ verType, meta, data }` 結構，隱藏 v1 / v2 的格式差異
- 保留原始 (raw) 解析結果的 API，方便需要底層格式的進階用途
- 未知版本時拋出 `YarnLockParsedVersionError`，錯誤明確可捕捉

## Installation

```bash
yarn add @yarn-tool/yarnlock-parse
yarn-tool add @yarn-tool/yarnlock-parse
yt add @yarn-tool/yarnlock-parse
```

## Usage

```ts
import yarnLockParse from '@yarn-tool/yarnlock-parse';
import { readFileSync } from 'fs';

const source = readFileSync('yarn.lock');

const parsed = yarnLockParse(source);

console.log(parsed.verType); // 'v1' | 'v2' | 'v3'
console.log(parsed.meta);    // 解析來源的中繼資料 (metadata)
console.log(parsed.data);    // 各個套件項目 (entries)
```

若只要最底層的原始解析結果：

```ts
import { yarnLockParseRaw } from '@yarn-tool/yarnlock-parse';

const raw = yarnLockParseRaw(source);
```

## API Documentation

### `yarnLockParse<T>(yarnlock_old: Buffer | string): T`

主要 (default) 匯出。偵測版本並解析 `yarn.lock`，回傳統一格式：

```ts
{
  verType: EnumDetectYarnLock, // v1 / v2 / v3
  meta,                        // 中繼資料
  data,                        // 套件項目集合
}
```

### `yarnLockParseRaw<T>(yarnlock_old: Buffer | string): T`

僅做原始 (raw) 解析、不做格式正規化：

- v1 回傳 `{ object, ...meta }` 形狀
- v2 / v3 回傳 `{ __metadata, ...entries }` 形狀

### `yarnLockRawV1ToParsed(rawParsed: IYarnLockRawSourceV1)`

將 v1 的原始解析結果轉為 `{ meta, data }`（不含 `verType`）。

### `yarnLockRawV2ToParsed(rawParsed: IYarnLockRawSourceV2)`

將 v2 / v3 的原始解析結果轉為 `{ meta, data }`（不含 `verType`）。

### `_yarnLockParseRawCore(verType, source)` / `_yarnLockParseRaw(source)`

進階用途的核心 (core) 函式：`_yarnLockParseRawCore` 依指定版本解析，`_yarnLockParseRaw` 則先偵測版本再呼叫前者，兩者皆回傳 `{ verType, parsed, source }`。

### `_yarnLockParseCore(inputResult)`

依 `verType` 挑選對應的轉換函式，把 raw 結果正規化為統一格式。

> 以底線開頭的函式屬於內部 API，可能在未通知的情況下變動；一般請使用 `yarnLockParse` / `yarnLockParseRaw`。

## Configuration

本套件無須額外設定：

- 版本偵測交由 `@yarn-tool/detect-yarnlock-version` 自動完成，不需手動指定格式
- 輸入可以是 `Buffer` 或 `string`，兩者行為一致
- 未知或不支援的版本格式會直接拋出 `YarnLockParsedVersionError`，由呼叫端決定如何處理
