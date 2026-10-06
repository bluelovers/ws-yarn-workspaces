# @yarn-tool/yarnlock-util

把 `yarn.lock` 的單一列（Row）解析成 `name` / `version` / `semver` 結構，支援 Yarn v1 與 Berry（v2/v3）。

yarn.lock 的每一個區塊（Block）都代表一個套件解析結果，但 v1 與 Berry 的列格式差異很大：v1 的鍵是 `name@range` 一整串，Berry 則把名稱放在 `resolution` 欄位。本套件以統一的回傳型別包裝兩種格式，並提供把整個已解析 lockfile 依套件名分組（Group）或歸約（Reduce）的工具。

## Features

- `parseYarnLockRowV1` / `parseYarnLockRowV2` 回傳相同的 `IParseNameAndVersionWithNpaResult` 結構，呼叫端不必分支處理版本
- 名稱解析優先走 `npa`（npm-package-arg），失敗時退回正規表示式 `PACKAGE_REGEX`，避免特殊鍵格式導致整批失敗
- `version` 會移除 Berry 的 `npm:` 前綴，直接得到可比對的 semver 字串
- 無法解析出名稱時回傳 `undefined`（而非丟出例外），讓呼叫端自行決定要不要略過該列
- 提供 `groupYarnLockParsedEntries`（依套件名分組）與 `reduceYarnLockParsedEntries`（自訂歸約）兩種整檔處理工具
- 以 `assertYarnLockParsedIsSupported` 驗證版本，遇到不支援的 lockfile 會立刻明確失敗

## Installation

```bash
yarn add @yarn-tool/yarnlock-util
yarn-tool add @yarn-tool/yarnlock-util
yt add @yarn-tool/yarnlock-util
```

## Usage

### 解析單一列

```ts
import { parseYarnLockRowV1, parseYarnLockRowV2 } from '@yarn-tool/yarnlock-util'

// v1：鍵為 name@range
const row1 = parseYarnLockRowV1('lodash@^4.17.0', { version: '4.17.21' })
// { name: 'lodash', version: '4.17.21', semver: '^4.17.0', ... }

// Berry：名稱從 resolution 取得
const row2 = parseYarnLockRowV2('lodash@npm:^4.17.21', {
	version: '4.17.21',
	resolution: 'lodash@npm:4.17.21',
})
```

### 把整份已解析的 lockfile 依套件名分組

```ts
import { groupYarnLockParsedEntries } from '@yarn-tool/yarnlock-util/lib/util/groupYarnLockParsedEntries'
import { yarnLockParse } from '@yarn-tool/yarnlock-parse'

const parsed = yarnLockParse(rawText)

const grouped = groupYarnLockParsedEntries(parsed)
// { lodash: [['4.17.21', { name, version, semver, ... }], ...] }

// 只保留指定套件
const only = groupYarnLockParsedEntries(parsed, { names: ['lodash', 'chalk'] })
```

### 自訂歸約（Reduce）

```ts
import { reduceYarnLockParsedEntries } from '@yarn-tool/yarnlock-util/lib/util/reduceYarnLockParsedEntries'

const versions = reduceYarnLockParsedEntries<string[]>({}, parsed, (acc, [key, data]) =>
{
	acc ??= []
	acc.push(`${key} -> ${data.version}`)
	return acc
})
```

## API Documentation

### `parseYarnLockRowV1(packageName, packageData): IParseNameAndVersionWithNpaResult`

解析 Yarn v1 的列鍵（Row Key）。

| 參數 | 型別 | 說明 |
| --- | --- | --- |
| `packageName` | `string` | 列鍵，例如 `lodash@^4.17.0` 或 `@babel/core@^7.0.0` |
| `packageData` | `IYarnLockDataRowV1` | 該列的資料，`version` 為實際解析到的版本 |

**回傳**：無法解析出名稱時回傳 `undefined`，否則回傳下列欄位：

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `name` | `string` | 套件名稱（不含範圍） |
| `version` | `string` | `packageData.version` |
| `semver` | `string` | 列鍵中的版本範圍（Range），如 `^4.17.0` |
| `type` | `IResult['type']` | npa 判斷的依賴類型，npa 失敗時為 `undefined` |
| `raw` | `IResult['raw']` | npa 的原始輸入 |

### `parseYarnLockRowV2(packageName, packageData): IParseNameAndVersionWithNpaResult`

解析 Berry（v2/v3）的列。名稱與版本優先取自 `resolution`（經 `parseResolutionOrDescriptor` 解析），並移除 `npm:` 前綴；`description` 為空時退回 `packageData.version`。

參數與回傳型別同 `parseYarnLockRowV1`。同樣在無法取得名稱時回傳 `undefined`。

### `IParseNameAndVersionWithNpaResult`

列解析結果的統一型別，由 `IResult`（`@yarn-tool/npm-package-arg-util`）挑出 `type`、`raw`，再加入 `name`、`version`、`semver` 三個欄位。透過 `export * from './lib/types'` 自套件根目錄直接匯出。

### `groupYarnLockParsedEntries(parsedOldPackage, options?): IComputedPackageEntries<IParseNameAndVersionWithNpaResult>`

模組路徑：`lib/util/groupYarnLockParsedEntries`

把整份已解析 lockfile 依套件名分組，值為 `[version, parseResult]` 陣列。

| 選項 | 型別 | 說明 |
| --- | --- | --- |
| `names` | `string[]` | 只保留這些套件名；傳入空陣列等同不過濾 |

### `reduceYarnLockParsedEntries(alreadyComputedPackage, parsedOldPackage, fn): T`

模組路徑：`lib/util/reduceYarnLockParsedEntries`

通用歸約（Reduce）工具，逐列呼叫 `fn(acc, [key, data], index, parsed)`。`groupYarnLockParsedEntries` 即建立在此之上。

### `IComputedPackageEntries<T>`

```ts
interface IComputedPackageEntries<T> {
	[packageName: string]: [key: string, data: T][];
}
```

### `PACKAGE_REGEX`

模組路徑：`lib/const`。用來在 `npa` 解析失敗時，從 v1 列鍵以正規表示式（Regular Expression）取出 `packageName` 等具名群組（Named Group）。

## Configuration

本套件無需設定檔或環境變數；所有行為都由呼叫端傳入的參數決定。

需要其他 yarn.lock 處理能力時，可搭配同系列套件：

- [`@yarn-tool/yarnlock-parse`](../yarnlock-parse/README.md) — 把 lockfile 文字解析為物件
- [`@yarn-tool/yarnlock-stringify`](../yarnlock-stringify/README.md) — 把物件還原成 lockfile 文字
- [`@yarn-tool/yarnlock-types`](../yarnlock-types/README.md) — `IYarnLockParsedV1` / `IYarnLockParsedV2` 等型別定義
- [`@yarn-tool/yarnlock-diff`](../yarnlock-diff/README.md) — 以本套件為基礎比對兩份 lockfile
