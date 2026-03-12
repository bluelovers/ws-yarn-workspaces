# @yarn-tool/get-global-dirs

> 此模組複製來自 https://github.com/sindresorhus/global-directory/blob/main/index.js ，但作為 CJS 模組使用。

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
