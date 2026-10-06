# @yarn-tool/fix-ws-pkgs-link

修復 workspace 套件在 node_modules 的符號連結 (Sync workspace package symlinks in node_modules)

將 workspace 內每個套件重新連結 (symlink) 到根目錄的 `node_modules`，確保 Yarn / npm workspace 的內部依賴可被正確解析；當連結缺失、指向錯誤位置或被實體目錄取代時會自動修復。

Re-links every workspace package into the root `node_modules` so internal workspace dependencies resolve correctly under Yarn / npm workspaces; missing links, wrong targets, or real directories that replaced the link are fixed automatically.

## 功能 (Features)

- **自動修復符號連結 (Auto-fix symlinks)** - 缺少連結、連結指向錯誤、或被實體目錄取代時重新建立
- **保留舊檔案 (Backup old files)** - 修復前將既有實體檔案改名為 `*.old_<random>`，不直接刪除
- **逐套件回報 (Per-package report)** - 回傳實際被修復的套件列表，未變更者不列入
- **workspace 與單一套件皆可用 (Workspace & single package)** - 由 `findRootLazy()` 自動偵測專案根目錄

## 安裝 (Installation)

```bash
# 使用 yarn / Using yarn
yarn add @yarn-tool/fix-ws-pkgs-link

# 使用 yarn-tool / Using yarn-tool
yarn-tool add @yarn-tool/fix-ws-pkgs-link
# yt 是 yarn-tool 的別名 / yt is an alias for yarn-tool
yt add @yarn-tool/fix-ws-pkgs-link

# 使用 pnpm / Using pnpm
pnpm add @yarn-tool/fix-ws-pkgs-link

# 使用 npm / Using npm
npm install @yarn-tool/fix-ws-pkgs-link
```

## 使用方式 (Usage)

```typescript
import fixWorkspacesPackageLinks from '@yarn-tool/fix-ws-pkgs-link';

// 修復當前目錄的 workspace 連結 / Fix links for the workspace in cwd
const fixed = fixWorkspacesPackageLinks(process.cwd());

console.log(`已修復 ${fixed.length} 個套件 / Fixed ${fixed.length} packages`);
```

## API 文件 (API Documentation)

### `fixWorkspacesPackageLinks(cwd?): IFixEntry[]`

主要匯出函式 (Main export)，同時為預設匯出 (default export)。

| 參數 / Param | 型別 / Type | 說明 / Description |
|--------------|-------------|-------------------|
| `cwd` | `string \| undefined` | 起始目錄，未傳入時由 `findRootLazy()` 自行解析 / Starting directory; resolved by `findRootLazy()` when omitted |

回傳值 (Return value)：`wsPkgListable()` 過濾後的套件項目，**僅包含本次實際重建連結的套件**；連結本來就正確的套件不會出現在結果中。

Filtered entries from `wsPkgListable()` — **only packages whose links were actually rebuilt**; packages with correct links are not included.

修復判定 (Fix condition)，滿足任一即重建：

Rebuilt when any of the following holds:

1. `node_modules/<套件名>` 不存在 (target does not exist)
2. 存在但不是符號連結，且 `realpath` 與套件實際路徑不同 (exists but is not a symlink and its realpath differs from the package location)

重建流程 (Rebuild flow)：既有實體檔案先 `renameSync` 為 `<name>.old_<random>` 保留，再以 `fsSymlinkSync(..., { overwrite: true })` 建立連結。

## 設定 (Configuration)

本套件無設定檔 (no config file)，行為完全由 `cwd` 參數決定：

- 連結目標固定為 `<workspace root>/node_modules/<package name>`
- 被替換的實體檔案不會被刪除，而是以 `*.old_<random>` 備份於 `node_modules` 內，需自行清理
- Replaced real files are backed up as `*.old_<random>` inside `node_modules` rather than deleted; clean them up manually if needed
