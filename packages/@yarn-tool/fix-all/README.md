# @yarn-tool/fix-all

自動檢查和修復 workspaces/package 的工具，支援 git 資訊更新、靜態檔案複製與版本修正 (Auto check/fix tool for workspaces/packages with git info update, static file copy, and version fix)

## Install

```bash
yarn add @yarn-tool/fix-all
yarn-tool add @yarn-tool/fix-all
yt add @yarn-tool/fix-all

pnpm add @yarn-tool/fix-all

npm install @yarn-tool/fix-all
```

## Features

- `npmAutoFixAll()` - 自動修復 workspaces/package 的主要函數
- 自動更新 git 相關資訊 (homepage, repository, bugs)
- 複製靜態檔案 (.gitignore, .npmignore 等)
- 修復 lerna.json 配置
- 修正 workspace 版本依賴

## Usage

```typescript
import npmAutoFixAll from '@yarn-tool/fix-all';

// 在當前目錄執行
await npmAutoFixAll(process.cwd());

// 帶選項執行
await npmAutoFixAll(process.cwd(), {
  overwriteHostedGitInfo: true,
  branch: 'main',
  resetStaticFiles: true,
});
```

