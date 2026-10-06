# @yarn-tool/npa-to-deps-query

Resolve npm-package-arg (npa) specs to concrete versions by querying the npm registry.
透過查詢 npm registry (Registry)，將 npm-package-arg (npa) 規格解析為具體版本。

## Features / 功能特點

- 將 `name@range` 規格 (Spec) 解析為具體版本值 (Concrete Version Value)，例如 `jest@^12` → `^12.1.1`
- 僅在結果標記為需要查詢 (fetchQuery) 時才向 registry 發送請求，其餘情況直接回傳原始範圍 (Range)
- 透過 `queryVersionWithCache` 使用版本查詢快取 (Cache)，避免重複請求 registry
- 支援自訂查詢選項 (queryOptions)，沿用 `package-json` 的 `Options` 設定
- 以 Bluebird Promise 回傳，可直接串接非同步流程 / Returns a Bluebird promise for async chaining

## Installation / 安裝

```bash
yarn add @yarn-tool/npa-to-deps-query
yarn-tool add @yarn-tool/npa-to-deps-query
yt add @yarn-tool/npa-to-deps-query
```

## Usage / 使用方式

```typescript
import queryDepsValueByNpa, { queryDepsValueByNpaResult } from '@yarn-tool/npa-to-deps-query';

// 一步完成解析與版本查詢 / Parse and query the version in one step
queryDepsValueByNpa('jest@12')
	.tap(console.dir);
// => { name: 'jest', value: '12.1.1', ..., result: ... }
```

已有 `@yarn-tool/npa-to-deps` 的轉換結果時，可只執行版本查詢：

When you already have a conversion result from `@yarn-tool/npa-to-deps`, run only the version query:

```typescript
import { npaToDepsValue } from '@yarn-tool/npa-to-deps';
import { queryDepsValueByNpaResult } from '@yarn-tool/npa-to-deps-query';

const depsResult = npaToDepsValue('jest@^12');
const actual = await queryDepsValueByNpaResult(depsResult);
// => { name: 'jest', value: '^12.1.1' }
```

### 範例輸出 / Example Output

以下為 `queryDepsValueByNpaResult` 對不同輸入的回傳值，`*` 表示需向 registry 查詢後才取得：
The values returned by `queryDepsValueByNpaResult` for different inputs; `*` marks inputs that require a registry lookup:

| 輸入 Input | 回傳值 Returned `value` |
| --- | --- |
| `jest@12` | `12.1.1` * |
| `jest@^12` | `^12.1.1` * |
| `jest@>12` | `>12` |
| `jest@<12` | `<12` |
| `jest@>=12` | `>=12` |
| `jest@<=12` | `<=12` |

## API Documentation / API 文件

### `queryDepsValueByNpa(input: string, options?: IOptions)`

解析套件規格字串，必要時向 registry 查詢版本，回傳合併後的依賴值 (Merged Dependency Value)。
Parses a package spec string, queries the registry when needed, and returns the merged dependency value.

**Parameters / 參數:**
- `input` - The package spec string, e.g. `jest@^12` / 套件規格字串，例如 `jest@^12`
- `options` - Parsing, conversion and query options / 解析、轉換與查詢選項

**Returns / 回傳:**
- Promise resolving to the `IDepsResult` fields merged with `name` and `value` / Promise，解析為 `IDepsResult` 欄位加上 `name` 與 `value`

### `queryDepsValueByNpaResult(depsResult, options?: IOptions)`

針對既有的依賴值轉換結果執行版本查詢，僅回傳 `{ name, value }`。
Runs the version query for an existing dependency value conversion result, returning only `{ name, value }`.

**Parameters / 參數:**
- `depsResult` - `IDepsResult` or a promise of it / `IDepsResult` 或其 Promise
- `options` - Query options / 查詢選項

**Returns / 回傳:**
- `{ name: string, value: string }` - `value` 為 `operator` 加上查詢到的版本或原始範圍 / `value` is the `operator` plus the queried version or the original range

## Configuration / 設定

```typescript
export interface IOptions extends IOptionsDepsValue
{
	queryOptions?: IOptionsQueryVersion<Options>,
}
```

- `queryOptions` - 傳給 `@yarn-tool/pkg-version-query` 的查詢選項，內含 `package-json` 的 `Options`（例如自訂 registry 或請求設定）
  / Query options passed to `@yarn-tool/pkg-version-query`, including `package-json` `Options` (e.g. custom registry or request settings)
- `where` - 解析相對路徑的基礎目錄（由 `npaToDepsValue` 使用）
  / Base directory for resolving relative paths (used by `npaToDepsValue`)
- `preserveTag` / `preserveRange` - 沿用 `@yarn-tool/npa-to-deps` 的選項；`npaToDepsValue` 目前僅使用 `where`
  / Inherited from `@yarn-tool/npa-to-deps`; `npaToDepsValue` currently only uses `where`

## Related / 相關專案

- [@yarn-tool/npa-to-deps](../npa-to-deps) - Convert npm-package-arg results to dependency values / 將 npm-package-arg 結果轉換為依賴值
- [@yarn-tool/pkg-version-query](../pkg-version-query) - Query package versions from the npm registry / 從 npm registry 查詢套件版本
- [npm-package-arg 特殊輸入狀況說明](../../../docs/npm-package-arg-special-cases.md) - Special input cases (empty string, space, `*`) and how they are detected / npm-package-arg 特殊輸入（空字串、空格、`*`）的行為與偵測方式
