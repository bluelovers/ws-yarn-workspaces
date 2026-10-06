# @yarn-tool/fix-ws-links

修復 workspace 內部的 yarn link 與符號連結 (Fix yarn links and symlinks inside a workspace)

提供 CLI 與 API 兩種方式，檢查 workspace 各套件的 `node_modules` 連結狀態，修正指向錯誤的套件連結、補上 `yarn link` 缺漏，並可於修復後自動執行 `yarn install` 復原。

Provides both a CLI and an API to inspect link status inside each workspace package's `node_modules`, fix links pointing at the wrong location, fill in missing `yarn link` entries, and optionally run `yarn install` afterwards to recover.

## 功能 (Features)

- **yarn link 修復 (Fix yarn links)** - 檢查已連結模組 (linked modules)，對指向錯誤的套件重建符號連結 (symlink)
- **yarn link 補登 (Re-register yarn link)** - 失敗或需重登時以 `yarn link <name>` 補齊
- **子套件節點模組檢查 (Sub-package modules check)** - 只處理有自行安裝 `node_modules` 的子套件
- **失敗復原 (Fallback)** - 任何錯誤發生時以 `yarn install` 復原，或用 `--runYarnAfter` 強制執行
- **批次重建 (Batch rebuild)** - `rebuildYarnWorkspaceLinks()` 將所有 workspace 套件重新連結到根 `node_modules`

## 安裝 (Installation)

```bash
# 使用 yarn / Using yarn
yarn add @yarn-tool/fix-ws-links

# 使用 yarn-tool / Using yarn-tool
yarn-tool add @yarn-tool/fix-ws-links
# yt 是 yarn-tool 的別名 / yt is an alias for yarn-tool
yt add @yarn-tool/fix-ws-links

# 使用 pnpm / Using pnpm
pnpm add @yarn-tool/fix-ws-links

# 使用 npm / Using npm
npm install @yarn-tool/fix-ws-links
```

## 使用方式 (Usage)

### CLI

安裝後可直接使用 `fix-ws-links` 指令：

```bash
# 在 workspace 根目錄執行 / Run at the workspace root
fix-ws-links

# 修復後也執行 yarn install / Also run yarn install afterwards
fix-ws-links --runYarnAfter
```

### API

```typescript
import { fixYarnWorkspaceLinks } from '@yarn-tool/fix-ws-links';
import { rebuildYarnWorkspaceLinks } from '@yarn-tool/fix-ws-links/lib/rebuildYarnWorkspaceLinks';

// 修復 yarn link 與套件符號連結 / Fix yarn links and package symlinks
fixYarnWorkspaceLinks(process.cwd(), {
  verbose: true,        // 顯示除錯訊息 / Show debug output
  runYarnAfter: false,  // 修復後執行 yarn install / Run yarn install after fixing
});

// 將所有 workspace 套件重建連結到根 node_modules
// Rebuild links of all workspace packages into the root node_modules
rebuildYarnWorkspaceLinks({ cwd: process.cwd() });
```

## API 文件 (API Documentation)

### `fixYarnWorkspaceLinks(cwd?, options?)`

主要的 link 修復函式，流程：掃描 workspace 套件 → 比對每個子套件 `node_modules` 內的連結 → 對指向錯誤且非符號連結的項目重建 symlink → 需要時執行 `yarn link` → 發生錯誤或 `runYarnAfter` 時執行 `yarn install`。

Main link-fix flow: scan workspace packages → compare links inside each sub-package's `node_modules` → rebuild symlinks for wrong non-symlink targets → run `yarn link` when needed → run `yarn install` on error or when `runYarnAfter` is set.

| 參數 / Param | 型別 / Type | 說明 / Description |
|--------------|-------------|-------------------|
| `cwd` | `string \| undefined` | workspace 根目錄 / Workspace root directory |
| `options.dir` | `string` | 限定檢查有自行安裝 node_modules 的子目錄 / Restrict checks to sub-directories with their own node_modules |
| `options.verbose` | `boolean` | 顯示除錯與錯誤訊息 / Show debug and error messages |
| `options.runYarnAfter` | `boolean` | 每個套件修復後執行 `yarn install` / Run `yarn install` after each package is fixed |

### `rebuildYarnWorkspaceLinks(options?)`（位於 `lib/rebuildYarnWorkspaceLinks.ts`）

將 workspace 內所有套件重新連結 (link) 到根目錄 `node_modules`。`cwd` 未指定時使用 `process.cwd()`，並自動解析至 workspace 根目錄（非根目錄時拋出 `cwd not workspace root`）。

Re-links all workspace packages into the root `node_modules`. Defaults `cwd` to `process.cwd()` and resolves it to the workspace root (throws `cwd not workspace root` otherwise).

### `rebuildYarnWorkspaceLinksFromPkgListable(listable, options)`（同上檔案）

同上，但由呼叫端傳入已載入的套件列表，適合與 `wsPkgListable()` 搭配重複使用。

Same as above but takes a pre-loaded package list; convenient to combine with `wsPkgListable()` for reuse.

### `fixWorkspacesPackageLinks(cwd?)`（由 `@yarn-tool/fix-ws-pkgs-link` 提供）

修復套件名對應的 `node_modules/<name>` 符號連結，本套件的 CLI（`bin/fix-ws-links.ts`）會在 `fixYarnWorkspaceLinks()` 之後呼叫它。

Fixes `node_modules/<name>` symlinks; this package's CLI (`bin/fix-ws-links.ts`) calls it after `fixYarnWorkspaceLinks()`.

## 設定 (Configuration)

本套件無設定檔 (no config file)：

- 行為由 `fixYarnWorkspaceLinks()` 的 `options` 或 CLI 的 `--runYarnAfter` 參數控制
- 連結目標固定為 workspace 根目錄的 `node_modules`
- `rebuildYarnWorkspaceLinks()` 可透過 `options.targetNodeModulesName` 指定替代的 node_modules 目錄名稱
- Behavior is controlled by `fixYarnWorkspaceLinks()` options or the CLI's `--runYarnAfter` flag
- `rebuildYarnWorkspaceLinks()` accepts `options.targetNodeModulesName` to target an alternate node_modules directory name

## 相關套件 (Related packages)

- `@yarn-tool/fix-ws-pkgs-link` - 單獨修復 `node_modules/<name>` 符號連結 / Standalone fix for `node_modules/<name>` symlinks
- `@yarn-tool/fix-all` - 一站式的 workspace 自動修復 / All-in-one workspace auto-fix
