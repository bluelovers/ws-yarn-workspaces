# npm-init2

> 懶人版的 npm init，支援 Yarn Workspaces / A lazy npm init that supports Yarn Workspaces

## 簡介 / Introduction

`npm-init2` 簡化了創建新 Node.js 套件的流程，讓您無需執行 `mkdir xxx && cd xxx && npm init`，只需執行 `npx npm-init2 xxx` 即可。

`npm-init2` simplifies the process of creating new Node.js packages, allowing you to run `npx npm-init2 xxx` instead of `mkdir xxx && cd xxx && npm init`.

## Features / 功能特性

- ⚡ **一鍵初始化** - 簡化 `mkdir && cd && npm init` 流程
- 🏢 **Workspaces 支援** - 自動偵測並整合 Monorepo 環境
- 📝 **智能設定** - 自動填充 repository、bugs、homepage 等欄位
- 🔧 **腳本範本** - 提供常見的 npm scripts 預設值
- 📦 **依賴管理** - 自動添加 tslib 等常用依賴
- 🧪 **Jest 整合** - 偵測到 Jest 時自動設定測試腳本
- 📚 **README 生成** - 自動生成基礎 README.md

## Installation / 安裝

```bash
# 快速初始化新套件 / Quickly initialize a new package
npx npm-init2 my-package

# 使用 Yarn / Use with Yarn
npx npm-init2 my-package --npmClient yarn

# 在現有目錄初始化 / Initialize in existing directory
npx npm-init2 --cwd ./my-project
```

## Usage / 使用方式

### 基本使用 / Basic Usage

```bash
# 創建新套件 / Create new package
npx npm-init2 my-awesome-lib

# 使用預設值快速創建 / Quick create with defaults
npx npm-init2 my-lib -y
```

### Workspaces 環境 / In Workspaces Environment

```bash
# 在 Monorepo 中創建新套件 / Create package in monorepo
cd my-monorepo
npx npm-init2 packages/my-new-package

# 自動偵測 Workspaces 前綴 / Auto-detect workspace prefix
npx npm-init2 my-package --skipCheckWorkspace
```

### TypeScript + TSDX 專案 / TypeScript + TSDX Project

```bash
# 創建 TSDX 專案 / Create TSDX project
npx npm-init2 my-ts-lib --tsdx
```

## API Documentation / API 文件

### `initWithPreserveDeps(options)`

執行 npm/yarn 初始化指令，並在完成後把舊 `package.json` 的依賴項 (Dependencies) 還原回去。
Runs the npm/yarn init command and restores the dependencies from the old `package.json` afterwards.

```typescript
import { initWithPreserveDeps } from 'npm-init2/lib/initWithPreserveDeps';

const { cp } = initWithPreserveDeps({
  npmClient: 'npm',
  cwd: '/path/to/target',
  args: ['init', '-y'],
  old_pkg,          // 舊 package.json 內容 / previous package.json
  pkg_file_path: '/path/to/target/package.json',
});
```

**Parameters / 參數:**

| 參數 / Parameter | 說明 / Description |
| --- | --- |
| `npmClient` | 執行的套件管理器，例如 `npm`、`yarn` / Package manager to run |
| `cwd` | 執行目錄 / Working directory of the child process |
| `args` | 傳給套件管理器的參數，例如 `['init', '-y']` / Arguments passed to the package manager |
| `old_pkg` | 初始化前的 package.json，用於還原依賴 / The previous package.json, used to restore dependencies |
| `pkg_file_path` | 目標 package.json 路徑 / Path of the target package.json |

**Returns / 回傳:**

- `{ cp }` - 子行程 (Child Process) 的執行結果；`cp.error` 存在代表初始化失敗 / The child process result; a truthy `cp.error` means initialization failed

> 子行程以 `stdio: inherit` 執行並強制關閉顏色輸出（`FORCE_COLOR=0`、`NO_COLOR=1`），避免終端控制碼干擾後續輸出。
> The child process runs with `stdio: inherit` and colors disabled (`FORCE_COLOR=0`, `NO_COLOR=1`) so escape sequences do not corrupt later output.

### `setupToYargs(yargs)`

註冊 `npm-init2` 的命令列選項，並繼承 `@yarn-tool/fix-all` 的共用選項 (Shared Options)。
Registers the CLI options of `npm-init2` and inherits the shared options from `@yarn-tool/fix-all`.

```typescript
import yargs from 'yargs';
import { setupToYargs } from 'npm-init2/lib/yargs-setting';

const cli = setupToYargs(yargs);
const argv = cli.argv;
```

## Configuration / 設定

### CLI Options / 命令列選項

| 選項 / Option | 說明 / Description |
|--------------|-------------------|
| `--npmClient` | 指定套件管理器 (`yarn`, `npm`, `pnpm`) / Specify package manager |
| `--cwd` | 設定工作目錄 / Set working directory |
| `--name` | 指定套件名稱 / Specify package name |
| `--skipCheckWorkspace` | 跳過 Workspaces 檢查 / Skip workspace detection |
| `--sort` | 對 package.json 進行排序 / Sort package.json |
| `--yes` / `-y` | 使用預設值 / Use default values |
| `--tsdx` | 啟用 TSDX 設定 / Enable TSDX configuration |
| `--private` / `-p` | 設定為私有套件 / Set as private package |
| `--createModule` / `-m` | 傳給 `npm init` 的模組建立參數 / Module creation flag forwarded to `npm init` |

> `--cwd` 只在 `defaultDescription` 顯示 `process.cwd()`，未實際傳入時由主流程以 `cli.argv.cwd || process.cwd()` 決定，因此可以區分「使用者明確指定」與「使用預設值」。
> `--cwd` only shows `process.cwd()` as its `defaultDescription`; when it is not passed, the main flow decides via `cli.argv.cwd || process.cwd()`, which distinguishes an explicit path from the default.

## Command Mapping / 對應指令

| npm-init2 指令 | 等效指令 |
|---------------|---------|
| `npx npm-init2` | `npm init` |
| `npx npm-init2 --npmClient yarn` | `yarn init` |
| `npx npm-init2 my-pkg` | `mkdir my-pkg && cd my-pkg && npm init` |

## Default Scripts / 預設腳本

初始化後的 package.json 會包含以下腳本：

The initialized package.json will include these scripts:

```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\"",
    "preversion": "echo preversion",
    "prepublishOnly": "yarn run preversion"
  }
}
```

## Related Projects / 相關專案

- [create-yarn-workspaces](https://www.npmjs.com/package/create-yarn-workspaces) - 初始化 Workspaces 根專案 / Initialize workspace root project
- [find-pkg-ws](https://www.npmjs.com/package/find-pkg-ws) - 尋找 Workspace Package / Find workspace packages
- [workspaces-config](https://www.npmjs.com/package/workspaces-config) - Workspaces 配置解析 / Workspaces config parser
- [keywords:workspaces](https://www.npmjs.com/search?q=keywords:workspaces) - 更多 Workspaces 工具 / More workspaces tools

## 授權 / License

ISC
