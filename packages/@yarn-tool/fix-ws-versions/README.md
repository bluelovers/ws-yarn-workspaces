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
- 自動處理 `*"` 萬用字元版本（保留不變）
- 支援所有依賴欄位（dependencies, devDependencies, peerDependencies 等）

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

## 設定 (Configuration)

本套件無需設定檔，行為由函式參數控制：

This package needs no config file; behavior is controlled by function arguments:

| 參數 / Param | 型別 / Type | 預設值 / Default | 說明 / Description |
|--------------|-------------|------------------|-------------------|
| `cwd` | `string \| undefined` | `process.cwd()` | workspace 根目錄，`fixWsVersions()` 忽略此值以外的自訂來源 / Workspace root directory; `fixWsVersions()` only reads packages from here |

- 萬用字元版本 `"*"` 一律保留不改寫 / The wildcard version `"*"` is always left untouched
- 只會改寫 workspace 內部套件的版本，外部依賴不動 / Only versions of internal workspace packages are rewritten; external dependencies are untouched

## API 文件 (API Documentation)

### `fixWsVersions(cwd?): IResult`

主要入口函式 (Main entry)，自動掃描 `cwd` 下的 workspace 套件並同步內部依賴版本。

```typescript
import { fixWsVersions } from '@yarn-tool/fix-ws-versions';

const result = fixWsVersions(process.cwd());
```

### `fixWsVersionsCore(listable, cwd?): IResult`

核心函式 (Core function)，接受已載入的套件列表，適合由呼叫端自行決定套件來源（`fix-all` 即以 `_runFixPackagesCore()` 傳入快取使用）。

### `fixPkgDepsVersionsCore(row, cache): { row, map, changed, cache }`

修復單一套件的依賴欄位，回傳 `changed` 表示是否有版本變更；`cache` 為 `ICacheInput`（需帶 `listable` 或 `record` 其一）。

### 回傳值 (Return value)

| 欄位 / Field | 型別 / Type | 說明 / Description |
|--------------|-------------|-------------------|
| `changed` | `IListableRow[]` | 有版本變更的套件 / Packages with version changes |
| `others` | `IListableRow[]` | 無變更的套件 / Unchanged packages |
| `data` | `Record<string, string>` | 套件名稱到最新版本的映射 / Map of package name to latest version |
| `record` / `names` | `Record<string, R>` / `string[]` | 掃描到的套件資料 / Scanned package data |

### 匯出型別 (Exported types)

- `IMap<R>` - 修復結果映射 (result map)
- `ICache<R>` / `ICacheInput<R>` - 執行時快取 (runtime cache；`ICacheInput` 至少需含 `listable` 或 `record`)

## 工作原理 (How it works)

1. 掃描 workspace 中的所有套件
2. 檢查每個套件的依賴欄位
3. 將內部 workspace 套件的依賴版本更新為當前實際版本
4. 跳過 `"*"` 萬用字元版本
5. 返回變更與未變更的套件列表
