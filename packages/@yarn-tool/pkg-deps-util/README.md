# @yarn-tool/pkg-deps-util

`@yarn-tool/pkg-deps-util` 是一套用於**檢查、過濾與安裝套件依賴 (Package Dependencies)** 的工具函式集，
提供 yarn workspaces (工作區) 內的本地套件安裝、依 yarn.lock (鎖檔) 過濾版本，以及 `yarn add` 相關的 CLI 參數設定介面。

目前版本：`3.0.10`

## 特色 (Features)

- 依 yarn workspaces 結構，把要安裝的套件名稱對應到工作區內的本地套件 (Local Package)
- 依 yarn.lock 已解析的結果過濾要安裝的版本，避免重複解析或寫入 lock 中不存在的版本
- 提供 `@types/*` 套件安裝前的檢查流程，包含「已存在」「不存在」「已棄用 (Deprecated)」等狀態回報
- 提供 npm registry 套件資訊查詢，並內建版本找不到時回退 `latest` 的容錯處理
- 內建 semver range (版本範圍) 判斷，可判斷既有的依賴版本是否允許升級
- 提供 `yargs` 的 `yarn add` 參數註冊與對應的 flag 產生函式

## 安裝 (Installation)

```bash
yarn add @yarn-tool/pkg-deps-util
yarn-tool add @yarn-tool/pkg-deps-util
yt add @yarn-tool/pkg-deps-util
```

## 使用方式 (Usage)

以下範例皆以各模組的絕對路徑匯入（本套件沒有統一的根匯出檔）：

```ts
import { filterInstallDeps } from '@yarn-tool/pkg-deps-util/lib/installDeps';
import { installDepsFromWorkspaces } from '@yarn-tool/pkg-deps-util/lib/installDepsFromWorkspaces';
import { installDepsFromYarnLock } from '@yarn-tool/pkg-deps-util/lib/installDepsFromYarnLock';

// 在 workspace 根目錄執行時，會自動改由工作區內的本地套件處理
const result = filterInstallDeps(['@yarn-tool/find-root', 'lodash'], {
	cwd: process.cwd(),
});

// 只安裝工作區內已存在的本地套件，其餘回傳在 others
const local = installDepsFromWorkspaces(['@yarn-tool/find-root'], {});

// 依 yarn.lock 現有的解析結果決定要寫入的版本
const fromLock = await installDepsFromYarnLock(['lodash@^4'], {});
```

檢查 `@types/*` 是否可安裝：

```ts
import { checkInstallTargetTypes } from '@yarn-tool/pkg-deps-util/lib/installTypes';
import { EnumInstallTypesErrorCode } from '@yarn-tool/pkg-deps-util/lib/const';

const result = await checkInstallTargetTypes('@types/node', {
	checkExists: true,
	pkg,
});

if (result.error === EnumInstallTypesErrorCode.SUCCESS)
{
	// 可以把 result.target 安裝到依賴裡
}
```

為 CLI 註冊 `yarn add` 相關參數：

```ts
import { setupYarnAddToYargs } from '@yarn-tool/pkg-deps-util/lib/cli/setupYarnAddToYargs';
import { flagsYarnAdd } from '@yarn-tool/pkg-deps-util/lib/cli/flagsYarnAdd';

setupYarnAddToYargs(yargs);

// 將 argv 中為 true 的選項轉成 `--dev`、`--exact` 之類的 CLI flag
const flags = flagsYarnAdd(argv);
```

## API 文件 (API Documentation)

### `lib/installDeps`

| 匯出 | 說明 |
| --- | --- |
| `filterInstallDeps(packageNames, options?)` | 檢查目前的 `cwd` 是否為 workspace 根目錄；若是，改交由 `installDepsFromWorkspaces` 處理，並回傳尚未被工作區本地套件消化掉的 `packageNames`。 |

### `lib/installDepsFromWorkspaces`

| 匯出 | 說明 |
| --- | --- |
| `installDepsFromWorkspaces(packageNames, options?)` | 將 `packageNames` 對照工作區內的套件清單，存在的套件以 `^版本號` 寫入其 `package.json` 的依賴欄位；回傳 `added`（新增）、`exists`（已存在）、`others`（非本地套件）與 `updated`。 |

### `lib/installDepsFromYarnLock`

| 匯出 | 說明 |
| --- | --- |
| `filterDepsFromYarnLock(names, parsedOldPackage, options?)` | 依 `npa` 解析出的套件名稱，自已解析的 yarn.lock 內取出對應條目。 |
| `installDepsFromYarnLockCore(names, parsedOldPackage, options?)` | 查詢遠端版本後，與 yarn.lock 的解析結果比對，寫入 lock 中實際存在的版本。 |
| `installDepsFromYarnLock(names, options?)` | 讀取 `cwd` 底下的 yarn.lock 並解析後呼叫 core；鎖檔不存在或沒有內容時回傳 `undefined`。 |

### `lib/installDepsFromQuery`

| 匯出 | 說明 |
| --- | --- |
| `installDepsFromQuery(names, options?)` | **尚未實作 (not implemented)**，呼叫會直接拋出 `Error('not implement')`。 |

### `lib/installTypes`

| 匯出 | 說明 |
| --- | --- |
| `checkInstallTargetTypes(packageName, options?)` | 檢查套件（通常為 `@types/*`）是否可安裝，回傳 `{ name, target, error, msg }`；`error` 為 `EnumInstallTypesErrorCode`。 |

### `lib/getPackageInfo`

| 匯出 | 說明 |
| --- | --- |
| `getPackageInfo(packageName, excludeVersion?)` | 查詢 npm registry 的簡要套件資訊。指定版本查不到時回退 `latest`；整個套件不存在時回傳 `undefined`。 |

### `lib/util`

| 匯出 | 說明 |
| --- | --- |
| `existsDependencies(name, pkg)` | 依序從 `dependencies`、`devDependencies`、`optionalDependencies` 尋找套件，回傳其版本字串（找不到為 `undefined`）。 |
| `sortDependencies(pkg)` | 對四個依賴欄位依鍵名排序，回傳同一個 `pkg` 物件。 |
| `fetchRemoteInfo(packageNames, options?)` | 依序查詢每個套件的遠端版本解析結果，回傳 `Record<名稱, 解析資料 & { versionQuery }>`。 |
| `isUpdateAbleVersion(version)` | 判斷 semver range 是否為「單一且可升級」的寫法，是則回傳該 range 物件。 |
| `isUpdateAbleVersionByNpmPackageArgResult(npaResult)` | 同上，但入口為 `npa` 結果；僅限 registry 且非 `tag` 類型。 |
| `handleSemverForDependencies(packageName)` | `npa` 解析後再交由上述判斷，用於判斷既有依賴版本能否更新。 |
| `lazyFlags(keys, argv)` | 把 `argv` 中為 true 的鍵轉成 `--key` 形式的參數陣列。 |

### `lib/cli`

| 匯出 | 說明 |
| --- | --- |
| `setupYarnAddToYargs(yargs, opts?)` | 註冊 `--dev` / `--peer` / `--optional` / `--exact` / `--tilde` / `--audit` / `--dedupe` / `--ignore-workspace-root-check` / `--types` 等選項。 |
| `setupYarnAddTypesToYargs(yargs)` | 在上述選項之外，再加 `--auto` / `--all` / `--AA`，並關閉 strict 模式。 |
| `flagsYarnAdd(argv)` | 產生 `yarn add` 可用的 flag 陣列（`dev`、`peer`、`optional`、`exact`、`tilde`、`ignore-workspace-root-check`、`audit`）。 |
| `assertExecInstall(cp)` | 檢查子行程 (Child Process) 的 `status`，非 0 時拋出帶有 `EXIT_CODE` 錯誤碼的例外，否則回傳 `cp`。 |

### `lib/const` 與 `lib/types`

- `EnumInstallTypesErrorCode`：`SUCCESS` / `NOT_EXISTS` / `DEPRECATED` / `SKIP`。
- `lib/addDependenciesIfNotExists.ts`：單純再匯出 (re-export) 自 [`@yarn-tool/pkg-deps-add`](../pkg-deps-add) 的 `_add_to_deps_field`、`addDependencies`、`addDependenciesIfNotExists`。
- 介面型別（如 `IOptionsInstallDepsFromWorkspaces`、`IResultInstallDeps`、`IResultFilterInstallDeps`、`IAddedList`）定義於 `lib/types.ts`。

## 設定 (Configuration)

所有安裝相關函式共用一組選項（型別定義於 `lib/types.ts`）：

| 選項 | 型別 | 說明 |
| --- | --- | --- |
| `cwd` | `string` | 操作目錄，預設為 `process.cwd()`。 |
| `pkg` | `IPackageJson` | 直接指定要修改的 `package.json` 內容，省略時會從 workspace 根目錄讀取。 |
| `skipCheckWorkspace` | `boolean` | 設為 `true` 時略過 workspace 根目錄檢查。 |
| `queryOptions` | `IOptionsQueryVersion` | 傳給版本查詢模組的選項（例如 registry 設定）。 |
| `throwError` | `boolean` | 驗證失敗時是否直接拋出例外。 |

`checkInstallTargetTypes` 另有：

| 選項 | 型別 | 說明 |
| --- | --- | --- |
| `checkExists` | `boolean` | 是否先檢查套件已存在於依賴欄位，存在時回傳 `SKIP`。 |
| `excludeVersion` | `boolean` | 是否忽略輸入中的版本，一律查詢 `latest`。 |

## 相關文件 (Related Documents)

- npm-package-arg 的特殊輸入狀況（本套件大量使用 `npa` 解析套件名稱）：[docs/npm-package-arg-special-cases.md](../../../docs/npm-package-arg-special-cases.md)
