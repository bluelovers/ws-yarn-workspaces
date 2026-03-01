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
- **靜態檔案同步** - 複製 .gitignore, .npmignore, tsconfig.json 等模板檔案
- **Lerna 配置修復** - 自動修復 lerna.json 配置
- **版本依賴修正** - 同步 workspace 內部套件的版本號
- **支援選項** - 可控制是否覆寫 git 資訊、重置靜態檔案等

## 使用方式 (Usage)

```typescript
import npmAutoFixAll from '@yarn-tool/fix-all';

// 在當前目錄執行 / Execute in current directory
await npmAutoFixAll(process.cwd());

// 帶選項執行 / Execute with options
await npmAutoFixAll(process.cwd(), {
  overwriteHostedGitInfo: true,  // 覆寫 git 資訊 / Overwrite git info
  branch: 'main',                // Git 分支名稱 / Git branch name
  resetStaticFiles: true,        // 重置靜態檔案 / Reset static files
});
```

## 選項說明 (Options)

| 選項 / Option | 類型 / Type | 說明 / Description |
|--------------|-------------|-------------------|
| `overwriteHostedGitInfo` | `boolean` | 是否覆寫 hosted git 資訊 / Whether to overwrite hosted git info |
| `branch` | `string` | Git 分支名稱（預設自動偵測）/ Git branch name (auto-detected by default) |
| `resetStaticFiles` | `boolean` | 是否重置靜態檔案 / Whether to reset static files |

## 執行流程 (Execution Flow)

1. **尋找根目錄** - 自動偵測 workspace 或套件根目錄
2. **複製靜態檔案** - 根據專案類型複製對應的模板檔案
3. **取得 Git 資訊** - 從 git remote 提取 repository 相關資訊
4. **修復根目錄** - 更新 package.json 的 git 相關欄位
5. **修復 Lerna** - 更新 lerna.json 配置
6. **遍歷套件** - 對每個子套件執行修復操作

