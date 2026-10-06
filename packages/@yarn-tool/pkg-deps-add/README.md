# @yarn-tool/pkg-deps-add

`@yarn-tool/pkg-deps-add` 是用來**新增與檢查 `package.json` 依賴欄位 (Dependencies Fields)** 的工具函式，
可依需求把套件寫入 `dependencies`、`devDependencies`、`peerDependencies` 或 `optionalDependencies`，
並回報「本次變更 (changed)」或「已存在 (exists)」。

目前版本：`3.0.10`

## 特色 (Features)

- 直接操作記憶體中的 `package.json` 物件，寫入後由呼叫端決定何時落盤
- 支援四種依賴欄位，可用 `dev` / `peer` / `optional` 選項指定目標欄位
- 內建存在性檢查，提供型別守衛 (Type Guard) 讓後續程式碼自動窄化型別
- 明確區分「本次新增」與「已存在」，方便 CLI 產生正確的安裝訊息
- 提供「只在已存在時覆寫」與「只在不存在時新增」兩種細部控制

## 安裝 (Installation)

```bash
yarn add @yarn-tool/pkg-deps-add
yarn-tool add @yarn-tool/pkg-deps-add
yt add @yarn-tool/pkg-deps-add
```

## 使用方式 (Usage)

```ts
import addDependencies, {
	addDependenciesIfNotExists,
	addDependenciesOverwrite,
	checkDependenciesExistsAll,
} from '@yarn-tool/pkg-deps-add';
import { EnumResultAddDependencies } from '@yarn-tool/pkg-deps-add';

const pkg = { name: 'demo', version: '1.0.0' } as const;

// 預設寫入 dependencies
const { pkg: result, bool } = addDependencies(pkg as any, 'lodash', '^4.18.1');

// 已存在就不覆寫；回傳 bool === EnumResultAddDependencies.exists
addDependenciesIfNotExists(pkg as any, 'lodash', '^4.18.1');

// 一律覆寫成新的版本字串
addDependenciesOverwrite(pkg as any, 'lodash', '^4.18.1');

// 寫入 devDependencies
addDependencies(pkg as any, 'jest', '^30.0.0', { dev: true });

// 檢查套件是否已出現在任一依賴欄位
const found = checkDependenciesExistsAll(pkg as any, 'lodash');
```

## API 文件 (API Documentation)

### 列舉與型別 (Enums & Types)

| 匯出 | 說明 |
| --- | --- |
| `EnumResultAddDependencies` | `changed = 2` 表示本次有寫入；`exists = 1` 表示套件已存在且未變更。 |
| `IOptionsAddDepsToPackageJson` | 所有 `add*` 函式共用的選項，見「設定 (Configuration)」。 |

### 存在性檢查 (Existence checks)

| 匯出 | 說明 |
| --- | --- |
| `_checkDependenciesExists(record, name)` | 檢查單一依賴記錄 (Dependency Record) 是否含該名稱，回傳型別守衛。 |
| `checkDependenciesExists(pkg, field, name)` | 檢查指定欄位，成功時把 `pkg` 窄化成含該欄位的型別。 |
| `_checkDependenciesExistsAll(pkg, fields, name)` | 依指定欄位清單逐一檢查，回傳各欄位的布林值、命中的欄位清單 `_field` 與總結果 `_exists`。 |
| `checkDependenciesExistsAll(pkg, name)` | 對四種依賴欄位全數檢查，等同傳入 `packageJsonDependenciesFields`。 |

### 寫入依賴 (Adding dependencies)

| 匯出 | 說明 |
| --- | --- |
| `_add_to_deps_field_core(pkg, field, name, semver)` | 最底層寫入：確保欄位物件存在後直接賦值，不做任何存在性判斷。 |
| `_add_to_deps_field(pkg, field, name, semver, override, bool, existsOnly?)` | 欄位層級的寫入決策，依 `override` 與 `existsOnly` 決定是否更新，回傳更新後的 `EnumResultAddDependencies`。 |
| `addDependencies(pkg, name, semver, options?, override?, existsOnly?)` | 依選項把套件寫入目標欄位；若未指定任何欄位，預設寫入 `dependencies`。回傳 `{ pkg, bool }`。 |
| `addDependenciesIfNotExists(pkg, name, semver, options?)` | `addDependencies(..., override = false)`：已存在時保持原版本。 |
| `addDependenciesOverwrite(pkg, name, semver, options?)` | `addDependencies(..., override = true)`：一律改寫成新的版本字串。 |
| `export default addDependencies` | 預設匯出為 `addDependencies`。 |

## 設定 (Configuration)

`IOptionsAddDepsToPackageJson`：

| 選項 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `cwd` | `string` | `process.cwd()` | 搭配 `@yarn-tool/find-root` 使用時的基準目錄。 |
| `pkg` | `IPackageJson` | — | 直接指定要修改的 `package.json` 內容。 |
| `dev` | `boolean` | `false` | 寫入 `devDependencies`。 |
| `peer` | `boolean` | `false` | 寫入 `peerDependencies`。 |
| `optional` | `boolean` | `false` | 寫入 `optionalDependencies`。 |

`addDependencies` 的額外參數：

| 參數 | 說明 |
| --- | --- |
| `override` | `true` 時已存在也覆寫；`false` 時僅在原值為空時新增。 |
| `existsOnly` | `true` 只在已存在時覆寫、`false` 只在不存在時新增；`undefined` 則依 `override` 判斷。 |

## 相關套件 (Related Packages)

- 需要 workspace、yarn.lock 相關的安裝流程時，請改用 [`@yarn-tool/pkg-deps-util`](../pkg-deps-util)。
