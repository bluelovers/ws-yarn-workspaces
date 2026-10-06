# @yarn-tool/yarnlock-parse-assert

assert 與型別守衛 (type guard)：驗證解析後的 `yarn.lock` 資料 — assert and type-guard parsed yarn.lock data。

## Features

- `isYarnLockParsed` 判斷任意物件是否為可辨識的解析結果
- `assertYarnLockParsed` 以斷言 (assertion) 型別收窄，失敗時拋出錯誤
- `isYarnLockParsedV1` / `isYarnLockParsedV2` 細分 v1 與 v2 / v3 格式
- `assertYarnLockParsedIsSupported` 支援以回呼 (callback) 依版本分流處理
- 搭配 `@yarn-tool/yarnlock-parse` 的輸出可直接做型別收窄

## Installation

```bash
yarn add @yarn-tool/yarnlock-parse-assert
yarn-tool add @yarn-tool/yarnlock-parse-assert
yt add @yarn-tool/yarnlock-parse-assert
```

## Usage

```ts
import yarnLockParse from '@yarn-tool/yarnlock-parse';
import {
	isYarnLockParsed,
	assertYarnLockParsed,
	isYarnLockParsedV1,
	isYarnLockParsedV2,
} from '@yarn-tool/yarnlock-parse-assert';

const parsed = yarnLockParse(source);

if (isYarnLockParsed(parsed))
{
	// 此處 parsed 已被收窄為 IYarnLockParsed
	assertYarnLockParsed(parsed);

	if (isYarnLockParsedV1(parsed))
	{
		// v1 專用處理
	}
	else if (isYarnLockParsedV2(parsed))
	{
		// v2 / v3 專用處理
	}
}
```

依版本分流執行不同邏輯：

```ts
import { assertYarnLockParsedIsSupported } from '@yarn-tool/yarnlock-parse-assert';

assertYarnLockParsedIsSupported(parsed, (verType, data) =>
{
	// verType 為 EnumDetectYarnLock.v1 / v3，data 已依版本收窄
});
```

## API Documentation

### `isYarnLockParsed(parsedObject): parsedObject is IYarnLockParsed`

回傳布林值 (boolean)，判斷輸入能否辨識出 yarn.lock 版本；不拋出錯誤。

### `assertYarnLockParsed(parsedObject): asserts parsedObject is IYarnLockParsed`

無法辨識版本時拋出 `YarnLockParsedVersionError`，成功時以斷言型別收窄變數。

### `isYarnLockParsedV1(data): data is IYarnLockParsedV1`

`verType === v1` 時回傳 true。

### `isYarnLockParsedV2(data): data is IYarnLockParsedV2`

`verType` 為 v2 或 v3 時回傳 true（兩種格式的結構相同，故合併判斷）。

### `assertYarnLockParsedIsSupported(parsedOldPackage, cb?)`

- v1 與 v2 / v3 皆支援時不拋錯，並可透過 `cb(verType, parsed)` 依版本分流
- 無法辨識版本時拋出 `YarnLockParsedVersionError`

### `assertYarnLockParsed`（default 匯出）

與具名函式 `assertYarnLockParsed` 相同，方便直接 `import assert from ...`。

## Configuration

本套件無須額外設定：

- 版本辨識依賴 `@yarn-tool/detect-yarnlock-version`，與 `@yarn-tool/yarnlock-parse` 共用同一套判斷規則
- 所有 `is*` 函式皆不拋錯、只回傳布林值；所有 `assert*` 函式失敗時一律拋出 `YarnLockParsedVersionError`
