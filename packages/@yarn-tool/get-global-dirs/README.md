# @yarn-tool/get-global-dirs

> ⚠️ **注意事項**

> 此模組基於 [sindresorhus/global-directory](https://github.com/sindresorhus/global-directory/blob/main/index.js) 並作為 CommonJS (CJS) 模組使用。

> 目前版本存在以下限制與已知問題（源自原版或環境差異）：
> - **pnpm YAML 支援缺失**：原版模組尚未支援讀取 pnpm 的 YAML 格式配置（如 `config.yaml`），僅支援 `rc` 格式。
> - **pnpm 套件路徑差異**：在某些環境下，pnpm 的全局套件路徑可能位於 `.../pnpm/store/5/node_modules` 而非預設的 `.../pnpm/global/5/node_modules`。
> - **暫無修復計畫**：目前暫時不打算針對上述原版即存在的 bug 進行修正。

獲取全局安裝目錄的工具，支援 npm、yarn 和 pnpm。

Get global installation directories for npm, yarn, and pnpm.

## 功能特色

- **多套件管理器支援**: 自動偵測並解析 npm、yarn 和 pnpm 的全局目錄
- **跨平台相容**: 支援 Windows、macOS 和 Linux

## 安裝

```bash
yarn add @yarn-tool/get-global-dirs
yarn-tool add @yarn-tool/get-global-dirs
yt add @yarn-tool/get-global-dirs
```

## 使用方法

```typescript
import globalDirectory from '@yarn-tool/get-global-dirs';

// 獲取 npm 全局目錄
console.log(globalDirectory.npm.prefix);
//=> '/usr/local'

console.log(globalDirectory.npm.packages);
//=> '/usr/local/lib/node_modules'

console.log(globalDirectory.npm.binaries);
//=> '/usr/local/bin'

// 獲取 yarn 全局目錄
console.log(globalDirectory.yarn.packages);
//=> '/Users/username/.config/yarn/global/node_modules'

// 獲取 pnpm 全局目錄
console.log(globalDirectory.pnpm.packages);
//=> '/Users/username/Library/pnpm/global/5/node_modules'
```

## API

### globalDirectory

返回一個物件，包含三個屬性：

#### npm: IGlobalDirectoryEntry

- `prefix`: 全局前綴目錄（相當於 `npm prefix --global`）
- `packages`: 全局套件目錄（相當於 `npm root --global`）
- `binaries`: 全局二進位檔目錄（相當於 `npm bin --global`）

#### yarn: IGlobalDirectoryEntry

- `prefix`: Yarn 全局資料目錄
- `packages`: Yarn 全局套件目錄
- `binaries`: Yarn 全局二進位檔目錄

#### pnpm: IGlobalDirectoryEntry

- `prefix`: pnpm 資料目錄
- `packages`: pnpm 全局套件目錄
- `binaries`: pnpm 全局二進位檔目錄

## 設定（Configuration）

本模組沒有自身的設定檔，解析結果完全取決於執行環境中的環境變數（Environment Variables）與各套件管理器的設定檔。
優先順序由高至低如下：

### 通用

| 來源 | 說明 |
| --- | --- |
| `npm_config_*` 環境變數 | 例如 `npm_config_prefix`，大小寫不敏感，連字號 `-` 會正規化為底線 `_`；優先度最高 |
| `~/.npmrc` | 使用者層級的 npm 設定檔（`prefix` 等鍵值） |
| `PREFIX` | 覆寫 npm / yarn 的全局前綴（Global Prefix） |
| 全域 `npmrc` | Windows 為 `%APPDATA%/npm/etc/npmrc`；Homebrew 安裝則取 `$(brew --prefix)/lib/node_modules/npm/npmrc`；其餘為 `<install dir>/etc/npmrc` |
| `npm prefix --global` 推導值 | 以上皆未設定時，由 `process.execPath` 推導預設前綴 |

### npm

- 無任何設定時：Windows 使用 `%APPDATA%/npm`，其餘平台使用 `dirname(dirname(process.execPath))`（例如 `/usr/local/bin/node` → `/usr/local`）。

### yarn

- `XDG_DATA_HOME`：設定 yarn 資料目錄（Data Directory），於 `yarn` 子目錄下解析。
- Windows：優先使用 `%LOCALAPPDATA%/Yarn/Data`，否則退回 `~/.config/yarn`。
- root 使用者：若 `process.getuid() === 0` 且非 fakeroot 環境，家目錄（Home Directory）採用 `/usr/local/share`。
- yarn 的 `binaries` 由 `PREFIX`（Windows 為 `%LOCALAPPDATA%/Yarn`，否則 `DESTDIR + /usr/local`）加上 `bin` 組成。

### pnpm

- `PNPM_HOME`：pnpm 資料目錄，優先度最高。
- `XDG_DATA_HOME` / `XDG_CONFIG_HOME`：分別對應資料目錄與設定檔位置。
- `global-dir`、`global-bin-dir`：可經由 pnpm 設定檔（`rc`）或 `~/.npmrc` 指定，未設定時退回 `<pnpm data dir>/global` 與 `<pnpm data dir>`。
- 平台預設值：
  - macOS：`~/Library/pnpm`
  - Linux：`~/.local/share/pnpm`
  - Windows：`%LOCALAPPDATA%/pnpm`，否則 `~/.pnpm`
  - 設定檔路徑：macOS 為 `~/Library/Preferences/pnpm/rc`、Windows 為 `%LOCALAPPDATA%/pnpm/config/rc`、其餘為 `~/.config/pnpm/rc`

> ⚠️ 已知限制：目前未支援 pnpm 的 `config.yaml`（YAML 格式）設定檔，僅支援 `rc` 格式，詳見文首的注意事項。
