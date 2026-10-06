# @yarn-tool/yarnlock-error

`factory for yarn.lock version detection errors` —— 為 yarn.lock 版本偵測 (Version Detection) 失敗提供統一錯誤 (Error) 的小型工廠套件：當內容無法判斷為 v1 或 berry（v2/v3）時，回傳具固定訊息的 `TypeError`，讓各套件對同一情況拋出一致的例外。

## Features

- `newYarnLockParsedVersionError()` 建立統一訊息的 `TypeError`
- 支援自訂訊息，便於在呼叫端補上診斷資訊
- 以預設匯出提供，`import ... from` 即可直接使用
- 零相依（僅需 `tslib`），可安全被其他 yarn.lock 套件引用

## Installation

```bash
yarn add @yarn-tool/yarnlock-error
yarn-tool add @yarn-tool/yarnlock-error
yt add @yarn-tool/yarnlock-error
```

## Usage

```ts
import newYarnLockParsedVersionError from '@yarn-tool/yarnlock-error';

// 使用預設訊息：can't detect yarn.lock version
throw newYarnLockParsedVersionError();

// 自訂訊息以補上診斷資訊
throw newYarnLockParsedVersionError('current object not v1 yarnlock');
```

搭配版本判別使用：

```ts
import { newYarnLockParsedVersionError } from '@yarn-tool/yarnlock-error';

function assertKnownVersion(verType: number)
{
	if (verType === 0)
	{
		throw newYarnLockParsedVersionError();
	}
}
```

## API Documentation

| 匯出 | 說明 |
| --- | --- |
| `newYarnLockParsedVersionError(msg?)` | 回傳 `new TypeError(msg)`；未傳入 `msg` 時使用預設訊息 `can't detect yarn.lock version`，傳入 `null` / `undefined` 亦同（以 `??` 只替換空值） |
| default | 同 `newYarnLockParsedVersionError`，便於直接 import 預設值 |

## Configuration

本套件無設定檔或環境變數，唯一可調整項為函式參數：

| 參數 | 型別 | 預設值 | 說明 |
| --- | --- | --- | --- |
| `msg` | `string?` | `can't detect yarn.lock version` | 錯誤訊息；省略或為 `null` / `undefined` 時使用預設訊息 |

錯誤型別固定為 `TypeError`，呼叫端可直接以 `catch (err)` 後檢查 `instanceof TypeError` 處理。
