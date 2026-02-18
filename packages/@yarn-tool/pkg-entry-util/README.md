# @yarn-tool/pkg-entry-util

用於處理 package.json entry 相關欄位的工具庫，包含 bin、exports、publishConfig 欄位的修復與驗證功能 (Utility for handling package.json entry-related fields, including fix and verification for bin, exports, and publishConfig fields)

## Install

```bash
yarn add @yarn-tool/pkg-entry-util
yarn-tool add @yarn-tool/pkg-entry-util
yt add @yarn-tool/pkg-entry-util

pnpm add @yarn-tool/pkg-entry-util

npm install @yarn-tool/pkg-entry-util
```

## Features

- `fixPkgBinField` - 修復 package.json 的 bin 欄位路徑
- `pkgExportsAddPJsonEntry` - 在 exports 欄位中添加 package.json entry
- `pkgExportsVerify` - 驗證 package exports 路徑是否存在
- `fixPublishConfig` - 修復 publishConfig 欄位

