# create-yarn-workspaces

> 快速初始化 Yarn Workspaces 專案結構 / Quickly initialize Yarn Workspaces project structure

## 安裝與使用 / Installation & Usage

```bash
# 使用 Yarn
yarn create yarn-workspaces

# 使用 npx
npx create-yarn-workspaces

# 使用 pnpm
pnpm create yarn-workspaces
```

## 功能特性 / Features

- 🚀 **快速初始化** - 一鍵創建完整的 Yarn Workspaces 專案結構
- 📦 **Lerna 整合** - 自動檢測並更新現有的 Lerna 配置
- 📝 **智能設定** - 自動配置 package.json、tsconfig 等開發環境檔案
- 🔧 **靈活選項** - 支援自定義初始化回呼與多種配置選項
- 🗂️ **目錄管理** - 根據 workspaces 配置自動創建 packages 目錄

## 命令列選項 / CLI Options

| 選項 / Option | 別名 / Alias | 說明 / Description |
|--------------|-------------|-------------------|
| `--name` | `-n` | 指定 Package 名稱 / Specify package name |
| `--ignoreExistsPackage` | `-i` | 忽略已存在的 Package / Ignore existing package |
| `--ignoreParentWorkspaces` | | 忽略父層 Workspaces / Ignore parent workspaces |
| `--debug` | | 啟用除錯模式 / Enable debug mode |

## API 使用 / API Usage

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

## 目錄結構 / Directory Structure

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

## 相關專案 / Related Projects

- [npm-init2](https://www.npmjs.com/package/npm-init2) - 初始化個別 Package / Initialize individual packages
- [find-pkg-ws](https://www.npmjs.com/package/find-pkg-ws) - 尋找 Workspace Package / Find workspace packages
- [workspaces-config](https://www.npmjs.com/package/workspaces-config) - Workspaces 配置解析 / Workspaces config parser
- [keywords:workspaces](https://www.npmjs.com/search?q=keywords:workspaces) - 更多 Workspaces 工具 / More workspaces tools

## 授權 / License

ISC
