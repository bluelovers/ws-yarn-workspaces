# @yarn-tool/yarn-struct-utils

> parse yarn resolution and descriptor strings into structured data

將 Yarn 的解析字串 (Resolution) 與描述字串 (Descriptor) 解析為結構化資料的小工具。

## 特色 (Features)

- `parseResolutionOrDescriptor()` 可同時處理 resolution 與 descriptor 兩種格式，不必自行判斷。
- 以 `isResolution` 欄位明確標示解析結果的種類。
- 內含 `parseRange()` 的型別化包裝 (Wrapper)，可依選項要求 protocol、source、bindings 等欄位。
- 解析失敗時回傳 `null` 而非拋出例外，方便批量處理。

## 安裝 (Installation)

```bash
yarn add @yarn-tool/yarn-struct-utils
yarn-tool add @yarn-tool/yarn-struct-utils
yt add @yarn-tool/yarn-struct-utils
```

## 使用方式 (Usage)

```ts
import { parseResolutionOrDescriptor } from '@yarn-tool/yarn-struct-utils';

// resolution 格式
console.log(parseResolutionOrDescriptor('lodash@npm:^4.17.21'));
// => { fullName: 'lodash@npm:^4.17.21', isResolution: true, ... }

// descriptor 格式
const ret = parseResolutionOrDescriptor('lodash@npm:4.17.21');
console.log(ret?.isResolution); // false
console.log(ret?.description);  // '4.17.21'

// 無法解析時
console.log(parseResolutionOrDescriptor('!!!'));
// => null
```

`parseRange` 位於子路徑模組：

```ts
import { parseRange } from '@yarn-tool/yarn-struct-utils/lib/parseRange';

const range = parseRange('npm:4.17.21', { requireProtocol: 'npm' });
console.log(range.protocol); // 'npm'
```

## API 文件 (API Documentation)

### `parseResolutionOrDescriptor(rawInput: string)`

| 回傳欄位 | 型別 | 說明 |
|----------|------|------|
| `fullName` | `string` | 套件全名（名稱 + 範圍） |
| `description` | `string \| undefined` | 簡要描述，descriptor 情況下為版本字串 |
| `isResolution` | `true \| false` | 是否為 resolution 格式 |
| `parsed` | `Resolution \| Descriptor` | Yarn 原生解析結果 |
| `parsedRange` | `IParseRangeReturnType` | 僅 descriptor 情況存在，範圍解析結果 |
| `rawInput` | `string` | 原始輸入字串 |

解析失敗時回傳 `null`。

### `parseRange(range, opts?)`

定義於 [lib/parseRange.ts](lib/parseRange.ts)，轉呼叫 `@yarnpkg/core` 的 `structUtils.parseRange`，並補上條件型別 (Conditional Type) 回傳值：

| 選項 | 型別 | 說明 |
|------|------|------|
| `requireBindings` | `boolean` | 缺少 bindings 時拋出錯誤 |
| `requireProtocol` | `boolean \| string` | 缺少 protocol 或與指定值不符時拋出錯誤 |
| `requireSource` | `boolean` | 缺少 source 時拋出錯誤 |
| `parseSelector` | `boolean` | 是否以查詢字串 (Query String) 格式解析 selector |

## 設定 (Configuration)

本套件沒有設定檔，所有行為皆由函式參數決定：

| 參數 | 說明 |
|------|------|
| `rawInput` | 待解析的 resolution 或 descriptor 字串 |
| `range` | 待解析的範圍字串（例如 `npm:4.17.21`） |
| `opts` | 傳給 `structUtils.parseRange` 的驗證選項，會影響回傳值的型別 |
