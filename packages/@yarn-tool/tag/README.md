# @yarn-tool/tag

git tag a package

為 npm 套件建立 git tag (標籤)，預設以 `<name>@<version>` 作為標籤名稱，可用前綴 (Prefix) 調整格式。

## 功能特色 (Features)

- **預設標籤格式**：`<name>@<version>`（如 `my-pkg@1.0.0`），可加 `tagPrefix` 前綴或以 `excludeName` 省略套件名
- **workspace 防護**：拒絕在 workspaces 根目錄建立標籤，且要求 `cwd` 等於套件目錄，避免誤標整包 monorepo
- **自動載入 package.json**：未傳入 `pkg` 時自動自專案根目錄讀取
- **CLI 與 API 皆可用**：提供 `yt-tag` 指令列工具與 `gitPackageTag` 函式
- **沿用 git 慣例**：透過 `@git-lazy/tag` 呼叫 git，支援 `--force`、`--sign` 與自訂標籤訊息

## 安裝 (Installation)

```bash
# 使用 yarn / Using yarn
yarn add @yarn-tool/tag

# 使用 yarn-tool / Using yarn-tool
yarn-tool add @yarn-tool/tag
# yt 是 yarn-tool 的別名 / yt is an alias for yarn-tool
yt add @yarn-tool/tag

# 使用 pnpm / Using pnpm
pnpm add @yarn-tool/tag

# 使用 npm / Using npm
npm install @yarn-tool/tag
```

## 使用方式 (Usage)

### CLI

```bash
# 於套件目錄內建立 my-pkg@1.0.0 標籤 / Create the my-pkg@1.0.0 tag inside the package dir
yt-tag --cwd ./packages/my-pkg

# 加上 v 前綴 / Add a v prefix
yt-tag --tag-prefix v

# 只用版本號作為標籤 / Use the version only as the tag name
yt-tag --exclude-name

# 自訂標籤訊息 / Custom tag message
yt-tag -m "release: 1.0.0"
```

### API

```typescript
import { gitPackageTag } from '@yarn-tool/tag';

await gitPackageTag({
	cwd: process.cwd(),
	tagPrefix: 'v',
	excludeName: false,
	message: 'release 1.0.0',
});
```

```typescript
import gitPackageTag from '@yarn-tool/tag';

// 預設匯出與具名匯出相同 / Default export is the same as the named export
await gitPackageTag({ cwd });
```

## API 文件 (API Documentation)

### `gitPackageTag(options, spawnOptions?): Promise<...>`

建立 git tag 的主要函式（亦為預設匯出）。

**流程：**

1. 以 `findRoot(cwd)` 尋找專案根目錄
2. 若 `cwd` 位於 workspaces 根目錄 → 拋出 `disallow create git tag for workspace root`
3. 若 `cwd` 與套件目錄不同 → 拋出 `cwd must be same as package dir`
4. 未提供 `pkg` 時自動載入專案根目錄的 `package.json`
5. 經 `handleOptions` 驗證版本與名稱，再由 `formatPackageTag` 產生標籤名稱
6. 呼叫 `gitTag` 建立標籤

**參數：**

- `options` — 見下方 [Configuration](#configuration)
- `spawnOptions` — `ISpawnGitAsyncOptions`，可覆寫 git 子行程選項（預設 `cwd` 為套件目錄）

**回傳：** `Promise`，解析值含 `exitCode`（CLI 據此呼叫 `process.exit`）。

### `formatPackageTag(options): string`

純函式 (Pure Function)：回傳標籤名稱，不執行 git。標籤格式依序為：

1. 版本號（取自 `options.version` 或 `options.pkg.version`）
2. 若有 `tagPrefix` → 前置串接
3. 若未 `excludeName` → 前置 `<name>@`

版本或名稱缺失時拋出 `Error`。

### `handleOptions(options): IOptionsPackageTag`

驗證並補齊選項：`cwd` 預設 `process.cwd()`、`tagPrefix` 預設空字串，回傳含 `cwd`、`name`、`version`、`tagPrefix` 的完整選項。

### `setupToYargs(yargs)`

註冊 CLI 選項（見 [Configuration](#command-line-options)），回傳設定後的 yargs。

## Configuration

### 選項 (Options)

```typescript
interface IOptionsPackageTag extends IOptions // IOptions 來自 @git-lazy/tag
{
	// 套件目錄，必須等於 findRoot 找到的套件根目錄 / Package dir; must equal the package root found by findRoot
	cwd: string,
	// 套件名；省略時取自 pkg.name / Package name; falls back to pkg.name
	name?: string,
	// 版本號；省略時取自 pkg.version / Version; falls back to pkg.version
	version?: string,
	// 標籤前綴，如 v / Tag prefix, e.g. "v"
	tagPrefix?: string,
	// 為 true 時標籤不含 <name>@ 前段 / When true the tag omits the <name>@ part
	excludeName?: boolean,
	// package.json 內容；省略時自動載入 / package.json content; loaded automatically when omitted
	pkg?: IPackageJsonWithVersion
}
```

輸入型別 `IOptionsPackageTagInput` 要求至少提供 `version` 或 `pkg` 之一，確保版本號可取得。

### 命令列選項 (Command Line Options)

| 選項 | 別名 | 型別 | 說明 |
| --- | --- | --- | --- |
| `--cwd` | | string | 套件目錄，預設 `process.cwd()` |
| `--tag-prefix` | `-t` | string | 標籤前綴 |
| `--exclude-name` | | boolean | 標籤省略套件名 |
| `--message` | `-m` | string | 標籤訊息，預設與標籤名稱相同 |
| `--force-git-tag` | `-f` | boolean | 標籤已存在時強制覆蓋 |
| `--sign-git-tag` | | boolean | 以 GPG 簽署標籤 |
| `--version` | | | 顯示版本 |
| `--help` | `-h` | | 顯示說明；失敗時自動顯示 |

## 版本 (Version)

當前版本：3.0.13
