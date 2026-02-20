# @yarn-tool/run-script-lifecycle

[![NPM version](https://img.shields.io/npm/v/@yarn-tool/run-script-lifecycle.svg)](https://www.npmjs.com/package/@yarn-tool/run-script-lifecycle)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

> 執行 npm/yarn 生命週期腳本，支援前置/後置腳本
> Execute npm/yarn lifecycle scripts with pre/post script support

## 簡介 (Introduction)

`@yarn-tool/run-script-lifecycle` 是一個用於執行 npm/yarn 生命週期腳本的工具模組。它能自動處理前置腳本 (pre-scripts) 和後置腳本 (post-scripts)，讓您可以輕鬆地以程式化方式執行完整的生命週期流程。

This is a utility module for running npm/yarn lifecycle scripts. It automatically handles pre-scripts and post-scripts, allowing you to easily execute complete lifecycle flows programmatically.

## 功能特色 (Features)

- 🔄 **自動執行前置/後置腳本** - 自動執行 `preinstall`、`postinstall` 等相關腳本
  - **Automatic pre/post script execution** - Automatically runs related scripts like `preinstall`, `postinstall`
- 📦 **讀取 package.json** - 自動解析套件的 `package.json` 並執行定義的腳本
  - **Read package.json** - Automatically parses package's `package.json` and executes defined scripts
- 🎯 **TypeScript 支援** - 完整的 TypeScript 類型定義
  - **TypeScript support** - Complete TypeScript type definitions
- ⚙️ **靈活配置** - 支援自訂環境變數、stdio 配置等選項
  - **Flexible configuration** - Supports custom environment variables, stdio configuration, and more

## 安裝 (Installation)

```bash
# 使用 yarn (Using yarn)
yarn add @yarn-tool/run-script-lifecycle

# 使用 yarn-tool (Using yarn-tool)
yarn-tool add @yarn-tool/run-script-lifecycle

# 使用 npm (Using npm)
npm install @yarn-tool/run-script-lifecycle
```

## 使用方法 (Usage)

### 基本用法 (Basic Usage)

```typescript
import runLifecycleScript from '@yarn-tool/run-script-lifecycle';

// 執行 install 生命週期腳本
// Run install lifecycle script
const results = await runLifecycleScript({
  event: 'install',
  path: '/path/to/package'
});

// results 包含 preinstall、install、postinstall 的執行結果（如果存在）
// results contains execution results for preinstall, install, postinstall (if they exist)
console.log(results);
```

### 帶選項的用法 (Usage with Options)

```typescript
import runLifecycleScript from '@yarn-tool/run-script-lifecycle';

const results = await runLifecycleScript({
  event: 'build',
  path: '/path/to/package',
  stdio: 'inherit',           // 繼承父進程的 stdio (Inherit parent process stdio)
  env: {                      // 自訂環境變數 (Custom environment variables)
    NODE_ENV: 'production',
    CUSTOM_VAR: 'value'
  }
});

// 檢查執行結果 (Check execution results)
results.forEach(result => {
  if (result.code === 0) {
    console.log(`${result.event} completed successfully`);
  } else {
    console.error(`${result.event} failed with code ${result.code}`);
  }
});
```

## API 文檔 (API Documentation)

### `runLifecycleScript(options)`

執行生命週期腳本的主函數。

Main function to run lifecycle scripts.

#### 參數 (Parameters)

| 參數 (Parameter) | 類型 (Type) | 必填 (Required) | 描述 (Description) |
|-----------------|-------------|----------------|-------------------|
| `event` | `string` | ✅ | 要執行的生命週期事件名稱 (Name of lifecycle event to run) |
| `path` | `string` | ✅ | 套件所在的目錄路徑 (Directory path where package is located) |
| `args` | `any[]` | ❌ | 傳遞給腳本的參數 (Arguments to pass to script) |
| `env` | `Record<string, any>` | ❌ | 執行時的環境變數 (Environment variables during execution) |
| `stdio` | `StdioOptions` | ❌ | 標準輸入輸出配置 (Standard I/O configuration) |
| `stdioString` | `boolean` | ❌ | 是否將 stdio 視為字串 (Whether to treat stdio as strings) |
| `pkg` | `IPackageJson` | ❌ | 套件的 package.json 物件 (Package's package.json object) |

#### 返回值 (Returns)

```typescript
Promise<(IResultNotExists | IResult)[]>
```

返回執行結果陣列，每個結果包含：

Returns an array of execution results, each containing:

| 屬性 (Property) | 類型 (Type) | 描述 (Description) |
|----------------|-------------|-------------------|
| `code` | `number` | 退出代碼 (Exit code) |
| `signal` | `null \| any` | 執行訊號 (Execution signal) |
| `stdout` | `string` | 標準輸出 (Standard output) |
| `stderr` | `string` | 標準錯誤輸出 (Standard error output) |
| `event` | `string` | 事件名稱 (Event name) |
| `script` | `string` | 執行的腳本命令 (Executed script command) |
| `pkgid` | `string` | 套件識別符 (Package identifier) |
| `path` | `string` | 執行路徑 (Execution path) |

## 生命週期執行順序 (Lifecycle Execution Order)

當執行 `install` 事件時，腳本會按照以下順序執行：

When executing the `install` event, scripts run in the following order:

1. `preinstall` - 安裝前腳本 (Pre-install script)
2. `install` - 主要安裝腳本 (Main install script)
3. `postinstall` - 安裝後腳本 (Post-install script)

## 相依套件 (Dependencies)

- `@npmcli/run-script` - npm 官方的腳本執行庫
- `@yarn-tool/script-lifecycle` - 生命週期配置管理
- `@ts-type/package-dts` - TypeScript 類型定義
- `read-package-json-fast` - 快速讀取 package.json

## 授權 (License)

ISC

## 相關套件 (Related Packages)

- [`@yarn-tool/script-lifecycle`](../script-lifecycle) - 生命週期配置管理
- [`@npmcli/run-script`](https://github.com/npm/cli/tree/latest/workspaces/libnpmexec) - npm 腳本執行核心