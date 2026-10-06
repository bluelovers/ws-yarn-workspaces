# @yarn-tool/fix-ws-versions

自動同步和修復 monorepo workspace 中的套件版本依賴 (Auto sync and fix package version dependencies in monorepo workspaces)

## 安裝 (Installation)

```bash
# 使用 yarn / Using yarn
yarn add @yarn-tool/fix-ws-versions

# 使用 yarn-tool / Using yarn-tool
yarn-tool add @yarn-tool/fix-ws-versions
# yt 是 yarn-tool 的別名 / yt is an alias for yarn-tool
yt add @yarn-tool/fix-ws-versions

# 使用 pnpm / Using pnpm
pnpm add @yarn-tool/fix-ws-versions

# 使用 npm / Using npm
npm install @yarn-tool/fix-ws-versions
```

## 功能 (Features)

- `fixWsVersions()` - 自動偵測並修復 workspace 中所有套件的版本依賴
- `fixWsVersionsCore()` - 核心函數，支援自定義套件列表
- `fixPkgDepsVersionsCore()` - 修復單一套件的依賴版本
- 自動處理 `"*"` 萬用字元版本（保留不變）
- 支援所有依賴欄位（dependencies, devDependencies, peerDependencies, optionalDependencies）
- 支援 [Workspace protocol](https://pnpm.io/workspaces#workspace-protocol-workspace)
  （預設轉換為一般版本，`saveWorkspaceProtocol: true` 則保留）
- 提供 Workspace protocol 公用函式（偵測 / 解析 / 順向轉換 / 逆向轉換），可自行替換 protocol 前綴
- 只會改寫 workspace 內部套件的版本，外部依賴一律不動

## 使用方式 (Usage)

```typescript
import { fixWsVersions } from '@yarn-tool/fix-ws-versions';

// 修復當前目錄 workspace 的版本
const result = fixWsVersions();

console.log(`已變更: ${result.changed.length} 個套件`);
console.log(`未變更: ${result.others.length} 個套件`);

// 查看版本映射
console.log(result.data);
```

```typescript
// 保留 Workspace protocol（`workspace:*` 等維持原樣）
const result = fixWsVersions(process.cwd(), { saveWorkspaceProtocol: true });
```

## 設定 (Configuration)

本套件無需設定檔，行為由函式參數控制：

This package needs no config file; behavior is controlled by function arguments:

| 參數 / Param | 型別 / Type | 預設值 / Default | 說明 / Description |
|--------------|-------------|------------------|-------------------|
| `cwd` | `string \| undefined` | `process.cwd()` | workspace 根目錄 / Workspace root directory |
| `saveWorkspaceProtocol` | `boolean \| undefined` | `false` | 保留既有的 `workspace:` 前綴；只「保留」而不會替 plain 引用補上前綴 / Keep an existing `workspace:` prefix; it only *keeps* it and never back-fills it onto plain references |
| `protocol` | `string \| undefined` | `'workspace:'` | Workspace protocol 前綴，以字面比對（分隔符需自行包含）/ Workspace protocol prefix, matched literally (include the separator yourself) |

- 萬用字元版本 `"*"` 一律保留不改寫 / The wildcard version `"*"` is always left untouched
- 只會改寫 workspace 內部套件的版本，外部依賴不動 / Only versions of internal workspace packages are rewritten; external dependencies are untouched
- `saveWorkspaceProtocol: true` 無法修復 bare operator（`workspace:*` / `^` / `~`），因為其本身沒有版本可修復 / With `saveWorkspaceProtocol: true` a bare operator (`workspace:*` / `^` / `~`) cannot be fixed, because it carries no version to fix

## Workspace protocol

[Workspace protocol](https://pnpm.io/workspaces#workspace-protocol-workspace) 的處理由 `saveWorkspaceProtocol` 決定：

`saveWorkspaceProtocol` decides how the Workspace protocol is treated:

| 引用 / Reference | 預設（falsy）/ default | `saveWorkspaceProtocol: true` |
|------------------|------------------------|-------------------------------|
| `workspace:*` | `1.5.0` | `workspace:*`（原樣保留 / kept as-is） |
| `workspace:^` | `^1.5.0` | `workspace:^` |
| `workspace:~` | `~1.5.0` | `workspace:~` |
| `workspace:^1.0.0`（套件實為 `1.5.0`） | `^1.5.0` | `workspace:^1.5.0`（同步版本、保留前綴 / version synced, prefix kept） |
| `^1.0.0`（plain，套件實為 `1.5.0`） | `^1.5.0` | `^1.5.0`（**不會**被加上 `workspace:` / never gains a `workspace:`） |
| `*` | `*` | `*` |
| 外部依賴（如 `lodash`） | 原樣 / untouched | 原樣 / untouched |

### 公用函式 (Shared helpers)

以下函式皆可單獨匯出使用，`opts.protocol` 可替換成其他 protocol 以保持未來擴充性：

```typescript
import {
	DEFAULT_WORKSPACE_PROTOCOL,
	getWorkspaceProtocol,
	isWorkspaceProtocol,
	parseWorkspaceProtocol,
	isWorkspaceProtocolBareRange,
	workspaceProtocolToRange,
	rangeToWorkspaceProtocol,
} from '@yarn-tool/fix-ws-versions';

getWorkspaceProtocol();                                    // 'workspace:'
isWorkspaceProtocol('workspace:*');                        // true
parseWorkspaceProtocol('workspace:^1.5.0');                // { value, protocol: 'workspace:', range: '^1.5.0' }
isWorkspaceProtocolBareRange('^');                         // true

// 順向：Workspace protocol → 一般版本範圍
workspaceProtocolToRange('workspace:*', { version: '1.5.0' }); // '1.5.0'
workspaceProtocolToRange('workspace:^', { version: '1.5.0' }); // '^1.5.0'

// 逆向：一般版本範圍 → Workspace protocol（可更換輸出的 protocol）
rangeToWorkspaceProtocol('^1.5.0');                                   // 'workspace:^1.5.0'
rangeToWorkspaceProtocol('^1.5.0', { protocol: 'custom:' });          // 'custom:^1.5.0'
```

## API 文件 (API Documentation)

### `fixWsVersions(cwd?, opts?): IResult`

主要入口函式 (Main entry)，自動掃描 `cwd` 下的 workspace 套件並同步內部依賴版本。

```typescript
import { fixWsVersions } from '@yarn-tool/fix-ws-versions';

const result = fixWsVersions(process.cwd());
const kept = fixWsVersions(process.cwd(), { saveWorkspaceProtocol: true });
```

### `fixWsVersionsCore(listable, cwd?, opts?): IResult`

核心函式 (Core function)，接受已載入的套件列表，適合由呼叫端自行決定套件來源（`fix-all` 即以 `_runFixPackagesCore()` 傳入快取使用）。

`cwd` 可以是字串，也可以直接傳入選項物件；兩者都可再搭配第三個 `opts` 參數。

### `fixPkgDepsVersionsCore(row, cache, opts?): { row, map, changed, cache }`

修復單一套件的依賴欄位（`row` 會被**就地修改**）。回傳 `changed` 表示是否有版本變更，**沒有變更時為 `undefined`**（而非 `false`）；`cache` 為 `ICacheInput`（需帶 `listable` 或 `record` 其一）。

### `handleRuntimeCache(cache): Required<ICache<R>>`

補齊快取欄位：`record` ← `listable`、`names` ← `record`、`map` ← `{ changed, others, data }`。已存在的欄位會被原樣保留（原地修改並回傳同一個物件）。

### `handleOptionsFixWsVersions(cwd?, opts?): IOptionsFixWsVersions`

正規化參數組合（字串 / 選項物件 / null / undefined），保證回傳值不是 `undefined`；`opts` 的同名欄位會覆蓋前項。

### 回傳值 (Return value)

| 欄位 / Field | 型別 / Type | 說明 / Description |
|--------------|-------------|-------------------|
| `changed` | `IListableRow[]` | 有版本變更的套件 / Packages with version changes |
| `others` | `IListableRow[]` | 無變更的套件 / Unchanged packages |
| `data` | `Record<string, string>` | 套件名稱到最新版本的映射 / Map of package name to latest version |
| `record` / `names` | `Record<string, R>` / `string[]` | 掃描到的套件資料 / Scanned package data |
| `cwd` | `string \| undefined` | `fixWsVersionsCore()` 傳入的工作目錄 / The cwd passed to `fixWsVersionsCore()` |

### 匯出型別 (Exported types)

- `IMap<R>` - 修復結果映射 (result map)
- `ICache<R>` / `ICacheInput<R>` - 執行時快取 (runtime cache；`ICacheInput` 至少需含 `listable` 或 `record`)
- `IOptionsFixWsVersions` - 修復選項（`cwd` / `saveWorkspaceProtocol` / `protocol`）
- `IOptionsWorkspaceProtocol` - 只含 `protocol` 的最小選項，供公用函式使用
- `IOptionsWorkspaceProtocolToRange` - 上者再加上解析 bare operator 所需的 `version`
- `IParsedWorkspaceProtocol` - `parseWorkspaceProtocol()` 的回傳值（`value` / `protocol` / `range`）

### 常數 (Constants)

- `DEFAULT_WORKSPACE_PROTOCOL` - `'workspace:'`

## 工作原理 (How it works)

1. 掃描 workspace 中的所有套件
2. 檢查每個套件的依賴欄位
3. 將內部 workspace 套件的依賴版本更新為當前實際版本
4. 若為 Workspace protocol：預設轉換為一般版本；`saveWorkspaceProtocol: true` 時保留前綴並同步內部版本
5. 跳過 `"*"` 萬用字元版本，以及非 workspace 的外部依賴
6. 返回變更與未變更的套件列表

## 測試 (Tests)

原生 `node:test` 快照測試，所有輸入皆為記憶體內的假資料，不會讀取或修改實際環境檔案。

Native `node:test` snapshot tests; every input is an in-memory fixture, so no real environment file is read or modified.

```bash
node --run test:node
```

- 測試檔 / test file：`test/index.node-test.ts`
- 快照 / snapshot：`test/index.node-test.ts.snapshot`（由框架管理，請勿手動編輯 / framework-managed, do not edit by hand）
- 所有測試共用同一組基底測試資料，測試之間的差異只來自取用哪一列與傳入哪些選項
- 所有 `t.assert.snapshot()` 皆搭配 `t.assert.partialDeepStrictEqual()` 驗證，避免快照自動更新後失去攔截效果
