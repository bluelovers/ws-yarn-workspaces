# @yarn-tool/is-published

check package is published or not

檢查 npm 套件 (Package) 是否已發布到 registry (倉庫)，以及指定版本是否存在。

## 功能特色 (Features)

- **三種查詢結果**：精確發布、版本不存在、套件不存在，透過 `EnumIsPublishedState` 區分
- **型別縮窄 (Type Narrowing)**：`IPublishedResult` 為聯合型別，依 `exists` / `state` 可縮窄至對應介面
- **多種輸入**：支援 npm 規格解析字串（如 `pkg@1.0.0`、`pkg@^1.0.0`）、`package.json` 物件、以及 npa 解析結果
- **Promise API**：以 Bluebird Promise 回傳，`package-json` 的 `PackageNotFoundError` / `VersionNotFoundError` 會被轉換為結構化結果而非例外

## 安裝 (Installation)

```bash
# 使用 yarn / Using yarn
yarn add @yarn-tool/is-published

# 使用 yarn-tool / Using yarn-tool
yarn-tool add @yarn-tool/is-published
# yt 是 yarn-tool 的別名 / yt is an alias for yarn-tool
yt add @yarn-tool/is-published

# 使用 pnpm / Using pnpm
pnpm add @yarn-tool/is-published

# 使用 npm / Using npm
npm install @yarn-tool/is-published
```

## 使用方式 (Usage)

### 以字串檢查 (By spec string)

```typescript
import { isPublished } from '@yarn-tool/is-published';

// 檢查精確版本 / Check an exact version
const ok = await isPublished('lodash@4.17.21');
// true（已發布）/ true (published)

const missing = await isPublished('lodash@99.0.0');
// false（版本不存在）/ false (version not found)
```

### 以 package.json 檢查 (By package.json)

```typescript
import isPublishedByPackageJSON from '@yarn-tool/is-published';

// 預設匯出 / Default export
const published = await isPublishedByPackageJSON({
	name: 'my-pkg',
	version: '1.0.0',
});
```

### 取得完整結果 (Get the full result)

```typescript
import { _isPublishedCore } from '@yarn-tool/is-published';

const result = await _isPublishedCore('lodash@4.17.21');

if (result.exists && result.isPublished)
{
	// 套件存在且版本完全符合 / Package exists and the version matches exactly
}
else if (result.state === 2 /* PackageNotFound */)
{
	// 整個套件不存在 / The package itself does not exist
}
```

## API 文件 (API Documentation)

### `isPublished(input, options?): Promise<boolean | null>`

以 npm 規格字串檢查是否已發布。

- **參數 `input`** — 如 `name`、`name@version`、`name@range` 的字串
- **參數 `options`** — `IOptions`（來自 `@yarn-tool/npa-to-deps-query`，可指定 registry 等）
- **回傳** — `true`（版本完全符合）、`false`（版本不存在）、`null`（套件不存在）

### `isPublishedByPackageJSON(pkg, options?): Promise<boolean | null>`

傳入 `{ name, version }` 物件，內部組合成 `${name}@${version}` 後查詢。

### `isPublishedByNpaResult(depsResult, options?): Promise<boolean | null>`

傳入已由 npa 解析的 `IDepsResult`，避免重複解析。

### `_isPublishedCore(input, options?): Promise<IPublishedResult>`

回傳完整結構化結果（含 `state`、`queryResult`），供需要區分「版本不存在」與「套件不存在」的呼叫端使用。

### `_isPublishedCoreByNpaResult(depsResult, options?): Promise<IPublishedResult>`

同上，但接受 `IDepsResult`（可為 Promise）。

### `_isPublishedCoreByPackageJSON(pkg, options?): Promise<IPublishedResult>`

同 `_isPublishedCore`，但以 `package.json` 物件為輸入。

### `EnumIsPublishedState`

| 成員 | 值 | 說明 |
| --- | --- | --- |
| `VersionPublished` | `0` | 套件存在且版本符合 / Package exists and version matches |
| `VersionNotFound` | `1` | 套件存在但版本不存在 / Package exists, version does not |
| `PackageNotFound` | `2` | 套件不存在 / Package does not exist |

### 結果型別 (Result types)

```typescript
interface IPublishedResultBase
{
	depsResult: IDepsResult<IResult>;
	/** 套件是否存在 / Whether the package exists */
	exists: boolean;
	/** true=已發布、false=版本不存在、null=套件不存在 */
	isPublished: null | boolean;
	state: EnumIsPublishedState;
}

type IPublishedResult =
	| IPublishedResultVersionPublished  // exists: true,  isPublished: true,  state: 0
	| IPublishedResultVersionNotFound   // exists: true,  isPublished: false, state: 1
	| IPublishedResultPackageNotFound;  // exists: false, isPublished: null,  state: 2
```

`IPublishedResultVersionPublished` 另含 `queryResult: { name, value }`，記載 registry 回傳的實際發布資訊。

## Configuration

`options` 為 `IOptions`（定義於依賴套件 `@yarn-tool/npa-to-deps-query`），可設定 registry 網址、驗證狀態 (Auth) 等查詢相關選項。詳見該套件文件。

## 版本 (Version)

當前版本：2.0.10
