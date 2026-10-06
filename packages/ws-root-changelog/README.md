# ws-root-changelog

產生包含所有工作區 (Workspace) 套件 changelog 連結的根目錄 `CHANGELOG.md`。

當前版本：`3.0.12`

## Features

- **目錄 (Table of Contents)**：為 Monorepo 建立集中式的 changelog 索引
- **套件圖示**：私有 (Private) 套件顯示 🔒、公開 (Public) 套件顯示 🌏
- **快速導覽**：直接連結到各套件的 changelog 檔案
- **CLI 工具**：提供易用的命令列介面 `ws-root-changelog`
- **同步／非同步 API**：兩種寫檔方式皆可選用

## Installation

```bash
# Using yarn
yarn add ws-root-changelog

# Using yarn-tool
yarn-tool add ws-root-changelog

# Using yt (alias)
yt add ws-root-changelog
```

安裝後即可使用全域或專案內的 `ws-root-changelog` 指令。

## Usage

### 命令列 (CLI)

```bash
# 在目前目錄產生根目錄 changelog
ws-root-changelog

# 針對指定目錄產生
ws-root-changelog /path/to/workspace
```

### 建立根目錄 Changelog

```typescript
import { createWorkspacesRootChangelog, outputWorkspacesRootChangelog, outputWorkspacesRootChangelogAsync } from 'ws-root-changelog';

// 產生 Markdown 內容（不寫檔）
const markdown = createWorkspacesRootChangelog(process.cwd());
console.log(markdown);

// 寫入檔案（同步）
const result = outputWorkspacesRootChangelog(process.cwd());
console.log(`Created: ${result.file}`);

// 寫入檔案（非同步）
const asyncResult = await outputWorkspacesRootChangelogAsync(process.cwd());
```

### 列出套件 Changelog

```typescript
import { listChangelog } from 'ws-root-changelog';

const links = listChangelog(process.cwd());
// Returns: ['* 🔒 [`@scope/private-pkg`](./packages/private/CHANGELOG.md) *packages/private*', ...]
```

### 取得 Changelog 檔案路徑

```typescript
import { getWorkspacesRootChangelogPath } from 'ws-root-changelog';

const path = getWorkspacesRootChangelogPath(process.cwd(), './CHANGELOG.md');
```

## API Documentation

### Functions

| 函式 | 說明 | 回傳值 |
|----------|-------------|---------|
| `createWorkspacesRootChangelog(cwd?)` | 產生 Markdown 內容 | `string` |
| `outputWorkspacesRootChangelog(cwd?, filename?)` | 寫入檔案（同步） | `{ file, md }` |
| `outputWorkspacesRootChangelogAsync(cwd?, filename?)` | 寱入檔案（非同步） | `Promise<{ file, md }>` |
| `listChangelog(cwd)` | 取得 Markdown 連結列表 | `string[]` |
| `getWorkspacesRootChangelogPath(cwd?, filename?)` | 取得檔案路徑 | `string` |
| `_findWorkspacesRootPath(cwd?)` | 找出工作區根目錄路徑（內部使用） | `string` |

### 圖示 (Icons)

| 圖示 | 意義 |
|------|---------|
| 🔒 | 私有套件 (Private package) |
| 🌏 | 公開套件 (Public package) |

### 錯誤處理

- `listChangelog(cwd)` 在工作區 (Workspace) 中找不到任何套件時會拋出 `RangeError`。
- `_findWorkspacesRootPath` 透過 `findRootLazy({ throwError: true })` 尋找根目錄，找不到工作區根目錄時會拋出錯誤。

## Configuration

本套件不需額外設定檔，行為由下列參數與專案設定決定：

| 來源 | 說明 |
|------|------|
| `cwd` 參數／CLI 第一個參數 | 起始目錄，預設為 `process.cwd()`；會自動向上尋找工作區根目錄 |
| `filename` 參數 | 要寫入的檔案名稱，預設為 `./CHANGELOG.md`，最終路徑以工作區根目錄為基準解析 (Resolve) |
| `package.json` 的 `workspaces` | 決定會被列出的套件範圍 |
| `package.json` 的 `private` | 決定該套件顯示 🔒 或 🌏 圖示 |

所有套件的 changelog 連結皆為相對於根目錄的路徑（例如 `./packages/foo/CHANGELOG.md`），因此根目錄 `CHANGELOG.md` 可直接在 Git 網頁介面中點擊導覽。

## Output Example

產生的 `CHANGELOG.md`：

```markdown
# Change Log

Please see the individual package changelogs for what's new:

* 🔒 [`@scope/private-pkg`](./packages/private/CHANGELOG.md "packages/private") *packages/private*
* 🌏 [`public-pkg`](./packages/public/CHANGELOG.md "packages/public") *packages/public*
* 🌏 [`ws-root-changelog`](./packages/ws-root-changelog/CHANGELOG.md "packages/ws-root-changelog") *packages/ws-root-changelog*
```

## Use Cases

### CI/CD Integration

```bash
# Update root changelog before release
ws-root-changelog

git add CHANGELOG.md
git commit -m "docs: update root changelog"
```

### Pre-release Hook

```json
{
  "scripts": {
    "prerelease": "ws-root-changelog && git add CHANGELOG.md"
  }
}
```

## Related

- [@yarn-tool/changelog](../@yarn-tool/changelog) - 為個別套件產生 changelog
- [@yarn-tool/ws-changed](../@yarn-tool/ws-changed) - 偵測有變更的套件
- [docs/changelog-tools.md](../docs/changelog-tools.md) - 本套件的完整指令與 API 說明文件

## License

ISC
