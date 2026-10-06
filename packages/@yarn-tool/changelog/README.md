# @yarn-tool/changelog

Generate and update CHANGELOG.md using conventional commits for monorepo workspaces.

使用慣例提交 (Conventional Commits) 為 monorepo 工作區產生與更新 CHANGELOG.md。

## Features / 功能特色

- **Conventional Commits / 慣例提交** - Automatically generate changelogs from conventional commit messages
  - 自動依慣例提交 (Conventional Commit) 訊息產生更新日誌
- **Monorepo Support / Monorepo 支援** - Works seamlessly with Lerna and Yarn workspaces
  - 可與 Lerna 及 Yarn 工作區 (Workspaces) 搭配運作
- **CLI Tool / 命令列工具** - Easy-to-use command line interface
  - 提供易用的命令列介面 (CLI)
- **Version Recommendation / 版本建議** - Analyze commits to recommend next version
  - 分析提交紀錄以建議下一個版本號
- **Independent/Root Modes / 獨立與根目錄模式** - Support both independent and fixed versioning modes
  - 支援獨立版本 (Independent) 與固定版本 (Root) 兩種模式

## Installation / 安裝

```bash
# Using yarn / 使用 yarn
yarn add @yarn-tool/changelog

# Using yarn-tool / 使用 yarn-tool
yarn-tool add @yarn-tool/changelog

# Using yt (alias) / 使用 yt 別名
yt add @yarn-tool/changelog

# Using pnpm / 使用 pnpm
pnpm add @yarn-tool/changelog

# Using npm / 使用 npm
npm install @yarn-tool/changelog
```

## Usage / 使用方式

### CLI Usage / 命令列使用

```bash
# Generate changelog for current package / 為目前的套件產生更新日誌
changelog

# Specify preset / 指定預設規範 (Preset)
changelog --preset conventional-changelog-angular

# Specify tag prefix / 指定標籤前綴 (Tag Prefix)
changelog --tag-prefix v

# Specify type (independent or root) / 指定模式（independent 或 root）
changelog --type independent
```

### API Usage / 程式化使用

```typescript
import { updateChangelogByCwd } from '@yarn-tool/changelog';

updateChangelogByCwd(process.cwd(), {
  changelogPreset: '@bluelovers/conventional-changelog-bluelovers',
  tagPrefix: 'v',
  type: 'independent',
}).then(data => {
  console.log(`Updated ${data.logPath}`);
  console.log(`New version: ${data.version}`);
});
```

```typescript
import { recommendVersion } from '@yarn-tool/changelog';

recommendVersion(pkg, {
  changelogPreset: 'conventional-changelog-angular',
  type: 'independent',
}).then(version => {
  console.log(`Recommended version: ${version}`);
});
```

## API Documentation / API 文件

### `updateChangelogByCwd(cwd?, options?)`

依工作目錄 (Working Directory) 找到所屬套件並更新其 CHANGELOG.md。
Locates the package from the working directory and updates its CHANGELOG.md.

**Parameters / 參數：**

| Parameter | Type | Description |
|-----------|------|-------------|
| `cwd` | `string` | 工作目錄，預設 `process.cwd()` / Working directory, defaults to `process.cwd()` |
| `options` | `Partial<IOptionsWithType<IOptionsUpdateChangelog>>` | 更新選項 / Update options |

**Returns / 回傳：** `Promise<IReturnTypeUpdateChangelog & { cwd, rootPath, options, pkg }>`

| Property | Type | Description |
|----------|------|-------------|
| `logPath` | `string` | 更新後的 CHANGELOG.md 路徑 / Path of the updated CHANGELOG.md |
| `newEntry` | `string` | 新增的日誌內容 / Newly added changelog entry |
| `version` | `string` | 更新後的版本號 / Updated version number |
| `pkg` | `IListableRow` | 套件資訊 / Package information |

> ⚠️ 在 workspace 根目錄直接呼叫會拋出錯誤：根目錄本身不會建立 CHANGELOG.md。
> Calling it on the workspace root throws: the root itself never gets a CHANGELOG.md.

### `updateChangelog(pkg, options?)`

只更新指定套件（不進行目錄探索）。
Updates a single package without directory discovery.

### `recommendVersion(pkg, options?)`

分析 Git 歷史中的慣例提交，回傳建議的版本號。
Analyses conventional commits in the Git history and returns the recommended version.

## Configuration / 設定方式

命令列選項 (CLI Options) 與 API 選項一一對應，由 `setupToYargs` 建立：
The CLI options map one-to-one onto the API options and are built by `setupToYargs`:

| Option | Alias | Type | Default | Description |
|--------|-------|------|---------|-------------|
| `preset` | `-p`, `changelogPreset` | `string` | `@bluelovers/conventional-changelog-bluelovers` | Changelog 預設規範 / Changelog preset |
| `tag-prefix` | `-t` | `string` | `v` | 讀取 Git 標籤時使用的前綴 / Tag prefix used when reading Git tags |
| `type` | | `string` | `independent` | 模式：`independent`（各套件獨立版本）或 `root`（共用版本） / Mode: `independent` (per-package version) or `root` (shared version) |
| `cwd` | | `string` | `process.cwd()` | 工作目錄 / Working directory |
| `lerna-package` | `-l` | `boolean` | `true` | 為單一 lerna 套件產生日誌 / Generate a changelog for one lerna package |

API 額外選項 / Additional API-only options：

| Option | Type | Description |
|--------|------|-------------|
| `version` | `string` | 指定版本號；未提供時使用套件目前的版本 / Explicit version; falls back to the package's current version |
| `prereleaseId` | `string` | 預發布識別碼 (Prerelease Identifier)，如 `alpha`、`beta`、`rc` / Prerelease identifier such as `alpha`, `beta`, `rc` |
| `rootPath` | `string` | 工作區根目錄路徑，預設自動偵測 / Workspace root path, auto-detected by default |

選項解析順序 / Option resolution order：`handleOptions` 會先套用預設值 → 清除無效的 `type` / `tagPrefix` / `changelogPreset` → 以 `require-resolve` 解析預設規範路徑 → 仍找不到時後備為 `conventional-changelog-angular`。
`handleOptions` applies defaults → drops invalid `type` / `tagPrefix` / `changelogPreset` → resolves the default preset path via `require-resolve` → finally falls back to `conventional-changelog-angular`.

## Supported Presets / 支援的預設規範

- `@bluelovers/conventional-changelog-bluelovers`
- `conventional-changelog-angular`
- `conventional-changelog-atom`
- `conventional-changelog-codemirror`
- `conventional-changelog-ember`
- `conventional-changelog-eslint`
- And more... / 以及其他 conventional-changelog 系列預設

## More Documentation / 更多文件

- [Changelog 工具模組](../../../docs/changelog-tools.md) — 各 changelog 相關套件的分工與檔案清單 / Module map of the changelog related packages

## Related Packages / 相關套件

- [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) — 底層的更新日誌產生器 / The underlying changelog generator
- [Lerna](https://lerna.js.org/) — 版本建議與發佈流程的來源 / Source of the version recommendation and release flow

## License / 授權

ISC
