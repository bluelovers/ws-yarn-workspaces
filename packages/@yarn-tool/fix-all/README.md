# @yarn-tool/fix-all

一站式自動修復工具，支援 git 資訊更新、靜態檔案同步、版本修正與 workspace 管理 (All-in-one auto-fix tool for git info update, static file sync, version fix, and workspace management)

## 安裝 (Installation)

```bash
# 使用 yarn / Using yarn
yarn add @yarn-tool/fix-all

# 使用 yarn-tool / Using yarn-tool
yarn-tool add @yarn-tool/fix-all
# yt 是 yarn-tool 的別名 / yt is an alias for yarn-tool
yt add @yarn-tool/fix-all

# 使用 pnpm / Using pnpm
pnpm add @yarn-tool/fix-all

# 使用 npm / Using npm
npm install @yarn-tool/fix-all
```

## 功能 (Features)

- `npmAutoFixAll()` - 自動修復 workspaces/package 的主要函數
- **Git 資訊更新** - 自動更新 homepage, repository, bugs 等欄位
- **靜態檔案同步** - 複製 .gitignore, .npmignore, tsconfig.json 等模板檔案（需指定 `addStaticFiles` / requires `addStaticFiles`）
- **Lerna 配置修復** - 自動修復 lerna.json 配置
- **版本依賴修正** - 同步 workspace 內部套件的版本號
- **支援選項** - 可控制是否覆寫 git 資訊、加入或重置靜態檔案等

## 使用方式 (Usage)

```typescript
import npmAutoFixAll from '@yarn-tool/fix-all';

// 在當前目錄執行 / Execute in current directory
await npmAutoFixAll(process.cwd());

// 帶選項執行 / Execute with options
await npmAutoFixAll(process.cwd(), {
  overwriteHostedGitInfo: true,  // 覆寫 git 資訊 / Overwrite git info
  branch: 'main',                // Git 分支名稱 / Git branch name
  addStaticFiles: true,          // 自動偵測並加入靜態檔案 / Auto-detect and add static files
  resetStaticFiles: true,        // 重置靜態檔案（會強制 addStaticFiles）/ Reset static files (forces addStaticFiles)
});
```

## 設定 (Configuration)

下列選項可透過 `npmAutoFixAll(cwd, options)` 的第二個參數傳入：

| 選項 / Option | 類型 / Type | 說明 / Description |
|--------------|-------------|-------------------|
| `overwriteHostedGitInfo` | `boolean` | 是否覆寫 hosted git 資訊 / Whether to overwrite hosted git info |
| `branch` | `string` | Git 分支名稱（預設自動偵測）/ Git branch name (auto-detected by default) |
| `addStaticFiles` | `boolean` | 是否自動偵測並加入靜態檔案，預設不執行 / Whether to auto-detect and add static files; disabled by default |
| `noStaticFiles` | `boolean` | 是否略過靜態檔案，為 true 時 `addStaticFiles` 視為 false / Skip static files; when true, `addStaticFiles` is treated as false |
| `resetStaticFiles` | `boolean` | 是否重置靜態檔案，會強制觸發 `addStaticFiles` / Whether to reset static files; forces `addStaticFiles` |

> 判定邏輯集中在 `lib/file/staticFiles.ts` 的 `_isAddStaticFiles()` 與 `_isAddStaticFilesWithReset()`，可由其他套件共用（`addStaticFiles` 可透過第二個參數指定預設值）。
> The decision logic lives in `_isAddStaticFiles()` / `_isAddStaticFilesWithReset()` in `lib/file/staticFiles.ts`, shared by other packages (the second argument sets the default of `addStaticFiles`).

## API 文件 (API Documentation)

### `npmAutoFixAll(cwd, options?)`

主要匯出函式（同時也是預設匯出 / default export），回傳 `Bluebird<void>`。

| 參數 / Param | 型別 / Type | 說明 / Description |
|--------------|-------------|-------------------|
| `cwd` | `string` | 當前工作目錄，未傳入時使用 `process.cwd()` / Current working directory; defaults to `process.cwd()` when omitted |
| `options` | `INpmAutoFixAll` | 修復選項，詳見 [設定 (Configuration)](#設定-configuration) / Fix options; see Configuration above |

拋出 `Invalid workspaces / package` 錯誤的情況：`cwd` 無法解析出有效的 workspace 或套件根目錄。

Throws an `Invalid workspaces / package` error when `cwd` cannot resolve to a valid workspace or package root.

### `INpmAutoFixAll`

選項介面 (Options interface)，欄位說明同 [設定 (Configuration)](#設定-configuration) 表格。

### 內部模組 (Internal modules)

以下模組供 repo 內其他套件共用，非本套件的主要公開 API：

These modules are shared by other packages in the repo and are not part of the main public API:

- `lib/file/staticFiles.ts` - `_isAddStaticFiles()` / `_isAddStaticFilesWithReset()` 靜態檔案判定 (static file decision helpers)
- `lib/root/index.ts` - `_fixRoot()` / `_fixWsRoot()` 根目錄 package.json 修復 (root package.json fixing)
- `lib/ws/lerna.ts` - `_fixLernaJson()` lerna.json 修復 (lerna.json fixing)

## 執行流程 (Execution Flow)

1. **尋找根目錄** - 自動偵測 workspace 或套件根目錄
2. **複製靜態檔案** - 依 `_isAddStaticFilesWithReset()` 判定（`addStaticFiles` / `noStaticFiles` / `resetStaticFiles`）決定是否複製對應的模板檔案
3. **取得 Git 資訊** - 從 git remote 提取 repository 相關資訊
4. **修復根目錄** - 更新 package.json 的 git 相關欄位
5. **修復 Lerna** - 更新 lerna.json 配置
6. **遍歷套件** - 對每個子套件執行修復操作

