# @yarn-tool/publish-retry

publish un-published workspace packages, skipping versions already on the npm registry

依序發布 (Publish) monorepo 中尚未發布到 npm registry (倉庫) 的套件，已發布的版本會自動略過，適合中斷後重跑。

## 功能特色 (Features)

- **略過已發布**：透過 `@yarn-tool/is-published` 查詢 registry，`name@version` 已存在時不重複發布
- **依序執行 (Serial)**：以 `mapSeries` 逐一套件發布，避免 registry 速率限制 (Rate Limit)
- **沿用 npm CLI**：直接呼叫 `npm publish` 並繼承標準輸入輸出 (stdio)，保留 npm 原本的認證與輸出
- **發布間隔**：每次發布後延遲 1 秒，降低觸發 registry 限流的風險

## 安裝 (Installation)

```bash
# 使用 yarn / Using yarn
yarn add @yarn-tool/publish-retry

# 使用 yarn-tool / Using yarn-tool
yarn-tool add @yarn-tool/publish-retry
# yt 是 yarn-tool 的別名 / yt is an alias for yarn-tool
yt add @yarn-tool/publish-retry

# 使用 pnpm / Using pnpm
pnpm add @yarn-tool/publish-retry

# 使用 npm / Using npm
npm install @yarn-tool/publish-retry
```

## 使用方式 (Usage)

```typescript
import { publishRetry } from '@yarn-tool/publish-retry';

// 自動尋找 workspaces 並發布未發布的套件 / Find workspaces and publish unpublished packages
await publishRetry(process.cwd());

// 指定專案根目錄 / Specify the project root
await publishRetry('/path/to/monorepo');
```

```typescript
import publishRetry from '@yarn-tool/publish-retry';

// 預設匯出與具名匯出相同 / Default export is the same as the named export
await publishRetry();
```

## API 文件 (API Documentation)

### `publishRetry(cwd?: string): Promise<void>`

依序處理 `cwd` 底下所有 workspace 套件：

1. 以 `wsPkgListable(cwd)` 列出所有 workspace 套件
2. 以 `isPublishedByPackageJSON(row)` 查詢該 `name@version` 是否已發布
3. 未發布時執行 `npm publish`（於該套件目錄、`stdio: 'inherit'`）
4. 無論成功與否都延遲 1 秒後處理下一個套件

**參數：**

- `cwd` — 專案根目錄；省略時由 `wsPkgListable` 決定預設搜尋位置

**回傳：** `Promise<void>`，於所有套件處理完成後 resolve。

**注意：**

- 傳回值不含各套件的發布結果；發布狀態請以終端輸出（黃底紅字提示）判讀
- `npm publish` 的失敗（如權限不足）不會中斷後續套件的檢查

## Configuration

本套件無自有設定項；registry 網址、認證 (Auth) 等沿用 `npm` CLI 與專案 `.npmrc` 設定。

查詢已發布狀態的選項請見 [`@yarn-tool/is-published`](../is-published/README.md)。

## 版本 (Version)

當前版本：2.0.10
