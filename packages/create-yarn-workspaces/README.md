# create-yarn-workspaces

> 快速初始化 Yarn Workspaces 專案結構 / Quickly initialize Yarn Workspaces project structure

一鍵建立 Yarn Workspaces（工作區）專案骨架，自動處理 package.json、Lerna 設定與 packages 目錄。

## 功能特性 / Features

- 🚀 **快速初始化** - 一鍵創建完整的 Yarn Workspaces 專案結構
- 📦 **Lerna 整合** - 自動檢測並更新現有的 Lerna 配置
- 📝 **智能設定** - 自動配置 package.json、tsconfig 等開發環境檔案
- 🔧 **靈活選項** - 支援自定義初始化回呼與多種配置選項
- 🗂️ **目錄管理** - 根據 workspaces 配置自動創建 packages 目錄

## 安裝 / Installation

此為 CLI 工具，不需另外安裝，直接透過下列任一方式執行：

```bash
# 使用 Yarn
yarn create yarn-workspaces

# 使用 npx
npx create-yarn-workspaces

# 使用 pnpm
pnpm create yarn-workspaces
```

## 使用方式 / Usage

```bash
# 在目前目錄初始化
yarn create yarn-workspaces

# 指定目標目錄（作為 package 名稱）
yarn create yarn-workspaces my-project

# 忽略已存在的 Package 並覆寫
yarn create yarn-workspaces --ignoreExistsPackage
```

命令列選項 / CLI Options：

| 選項 / Option | 別名 / Alias | 說明 / Description |
|--------------|-------------|-------------------|
| `--name` | `-n` | 指定 Package 名稱 / Specify package name |
| `--ignoreExistsPackage` | `-i` | 忽略已存在的 Package / Ignore existing package |
| `--ignoreParentWorkspaces` | | 忽略父層 Workspaces / Ignore parent workspaces |
| `--debug` | | 啟用除錯模式 / Enable debug mode |

初始化後的專案結構 / Project structure after initialization:

```
my-project/
├── package.json          # Workspaces 配置 / Workspaces config
├── lerna.json           # Lerna 配置（如果存在）/ Lerna config (if exists)
├── tsconfig.json        # TypeScript 配置 / TypeScript config
├── .gitignore           # Git 忽略規則 / Git ignore rules
├── .eslintrc.json       # ESLint 配置 / ESLint config
└── packages/            # 套件目錄 / Packages directory
    └── .gitkeep
```

## API 文件 / API Documentation

```typescript
import { createYarnWorkspaces, IOptions } from 'create-yarn-workspaces';

// 基本使用 / Basic usage
const success = createYarnWorkspaces('./my-project');

// 帶選項 / With options
const options: IOptions = {
  ignoreExistsPackage: true,
  ignoreParentWorkspaces: false,
  initPackageJson: (pkg) => {
    pkg.author = 'Your Name';
    return pkg;
  }
};

createYarnWorkspaces('./my-project', options);
```

### `createYarnWorkspaces(cwd?, options?)`

建立 Workspaces 專案結構的主要函式 / Main function that creates the workspace project structure.

- `cwd?: string | IOptions` — 目標目錄；也可直接傳入選項物件 / Target directory; an options object may be passed directly as the first argument.
- `options?: IOptions` — 配置選項 / Configuration options.
- 回傳 `boolean` — 是否成功建立 / Whether creation succeeded.

其他匯出 / Also exported: `createDirByPackages(cwd, packages)`、`getDefaultPackageJson(name?)`、`getDefaultTsconfig()`、`setupWorkspacesInitToYargs(yargs)`。

## 組態設定 / Configuration

`IOptions` 支援下列欄位 / The `IOptions` interface supports:

| 欄位 / Field | 型別 / Type | 預設 / Default | 說明 / Description |
| --- | --- | --- | --- |
| `cwd` | `string` | `process.cwd()` | 工作目錄路徑 / Working directory path |
| `ignoreExistsPackage` | `boolean` | `false` | 忽略已存在的 Package / Ignore existing package |
| `ignoreParentWorkspaces` | `boolean` | `false` | 忽略父層 Workspaces / Ignore parent workspaces |
| `initPackageJson` | `(pkg) => pkg` | — | 自定義 package.json 初始化回呼 / Custom package.json init callback |
| `debug` | `boolean` | `false` | 啟用除錯輸出 / Enable debug output |
| `addStaticFiles` | `boolean` | `true` | 自動加入靜態範本檔案 / Auto-add static template files |
| `noStaticFiles` | `boolean` | `false` | 略過靜態檔案（優先於 `addStaticFiles`）/ Skip static files (takes precedence over `addStaticFiles`) |

靜態檔案（Static Files）的複製行為由 `@yarn-tool/static-file` 提供，可透過 `addStaticFiles`／`noStaticFiles` 開關控制。

## 相關專案 / Related Projects

- [npm-init2](https://www.npmjs.com/package/npm-init2) - 初始化個別 Package / Initialize individual packages
- [find-pkg-ws](https://www.npmjs.com/package/find-pkg-ws) - 尋找 Workspace Package / Find workspace packages
- [workspaces-config](https://www.npmjs.com/package/workspaces-config) - Workspaces 配置解析 / Workspaces config parser
- [keywords:workspaces](https://www.npmjs.com/search?q=keywords:workspaces) - 更多 Workspaces 工具 / More workspaces tools

## 授權 / License

ISC
