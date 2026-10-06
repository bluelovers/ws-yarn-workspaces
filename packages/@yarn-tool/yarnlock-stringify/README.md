# @yarn-tool/yarnlock-stringify

將已解析的 `yarn.lock` 資料結構，還原（Stringify）成對應版本的原始文字格式。

本套件是 `@yarn-tool/yarnlock-parse` 的逆向操作：parse 負責把 lockfile 文字變成物件，本套件負責把物件變回 lockfile 文字，且會自動判斷 Yarn 鎖定檔版本（Lockfile Version）並選用正確的序列化器，適用於 Yarn v1（classic）、v2/berry 與 v3。

## Features

- 支援 Yarn 鎖定檔 v1 / v2 / v3 三種版本，自動偵測（Detect）並回傳對應格式
- 可接受多種輸入型別：字串、`Buffer`、原始 JSON 物件、已解析（Parsed）物件
- 輸出可與原始檔逐字元相符（round-trip），適合用在快取比對、格式化與差異檢測
- v1 使用 `stringifyYarnLockRawV1`，v2/v3 共用 `stringifyYarnLockRawV2`
- 無法辨識版本時拋出 `YarnLockParsedVersionError`，避免默默產生錯誤的 lockfile

## Installation

```bash
yarn add @yarn-tool/yarnlock-stringify
yarn-tool add @yarn-tool/yarnlock-stringify
yt add @yarn-tool/yarnlock-stringify
```

## Usage

### 將解析後的物件還原成文字

```ts
import yarnLockParse from '@yarn-tool/yarnlock-parse'
import { yarnLockStringify } from '@yarn-tool/yarnlock-stringify'

const parsed = yarnLockParse(rawText)

// 自動判斷版本，回傳與原始檔一致的文字
const text: string = yarnLockStringify(parsed)
```

### 直接吃原始文字（原樣回傳）

```ts
import { yarnLockStringify } from '@yarn-tool/yarnlock-stringify'

// 若輸入本身就是可辨識的 lockfile 文字，則直接 toString() 回傳
const text = yarnLockStringify(rawText)
```

### 只針對「原始 JSON 物件」序列化

```ts
import { yarnLockStringifyRaw } from '@yarn-tool/yarnlock-stringify'

const content: string = yarnLockStringifyRaw(rawSourceJSON)
```

## API Documentation

### `yarnLockStringify(yarnlock_old): string`

萬用入口函式（Default Export）。依序嘗試下列流程：

1. 若輸入為已解析物件（`IYarnLockParsed`），先經 `yarnLockParsedToRawJSON` 轉回原始 JSON。
2. 若輸入為原始 JSON 物件，偵測版本後呼叫 `_yarnLockStringifyRawCore` 序列化。
3. 若輸入為字串 / `Buffer`，嘗試以 `detectYarnLockVersion` 辨識；辨識成功則直接回傳原文字。
4. 以上皆失敗時，拋出 `newYarnLockParsedVersionError()`。

**參數**

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `yarnlock_old` | `Record<string, any> \| Buffer \| string \| IYarnLockSource \| IYarnLockParsed` | 任意形式的 yarn.lock 資料 |

**回傳**：`string` — 對應版本的 lockfile 原始文字。

### `yarnLockStringifyRaw(yarnlockRawJSON): string`

針對已知版本的原始 JSON 物件（`IYarnLockSource`）序列化，回傳純文字內容。內部委派給 `_yarnLockStringifyRaw`。

### `_yarnLockStringifyRaw(yarnlockRawJSON): IResultYarnLockStringifyRaw`

同上，但回傳完整結果物件，包含版本、使用的序列化函式、JSON 與文字。以下底線開頭表示進階／內部 API，一般使用者建議改用 `yarnLockStringifyRaw`。

### `_yarnLockStringifyRawCore(verType, yarnlockRawJSON): IResultYarnLockStringifyRaw`

依傳入的版本枚舉（`EnumDetectYarnLock`）挑選序列化函式：

- `v1` → `stringifyYarnLockRawV1`
- `v2` / `v3` → `stringifyYarnLockRawV2`
- 其他值 → 拋出 `YarnLockParsedVersionError`

### `IResultYarnLockStringifyRaw`

為聯合型別（Union Type），以 `verType` 區分成三個分支：

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `verType` | `EnumDetectYarnLock.v1 \| v2 \| v3` | 鎖定檔版本 |
| `fn` | `typeof stringifyYarnLockRawV1 \| typeof stringifyYarnLockRawV2` | 實際使用的序列化函式 |
| `json` | `IYarnLockRawSourceV1 \| IYarnLockRawSourceV2` | 輸入的原始 JSON |
| `content` | `string` | 序列化後的文字 |

## Configuration

本套件無需任何設定檔或環境變數；版本判斷完全依輸入內容自動完成。

若需要自行控制版本偵測邏輯，可搭配同系列套件：

- [`@yarn-tool/detect-yarnlock-version`](../detect-yarnlock-version/README.md) — 提供 `detectYarnLockVersion`、`detectYarnLockVersionByObject`、`detectYarnLockVersionByParsed` 等偵測函式
- [`@yarn-tool/yarnlock-parse-raw`](../yarnlock-parse-raw/README.md) — 底層的 v1/v2 序列化實作
- [`@yarn-tool/yarnlock-types`](../yarnlock-types/README.md) — 相關型別定義
