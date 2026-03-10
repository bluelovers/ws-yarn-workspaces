# @yarn-tool/node-modules

Node.js 模組路徑尋找工具套件，特別適用於 Yarn Workspaces 環境。

Node.js module path finding utilities, especially useful in Yarn Workspaces environments.

## 功能特色

- 🔍 **模組路徑尋找**: 快速尋找專案中的 node_modules 路徑
- 📦 **工作區支援**: 完美支援 Yarn Workspaces 環境
- 🎯 **精確定位**: 自動識別 scoped packages 和一般 packages
- 🚀 **高效能**: 使用 fast-glob 進行快速檔案搜尋
- 📝 **雙語註解**: 完整的中英文註解說明

## Installation

```bash
yarn add @yarn-tool/node-modules
yarn-tool add @yarn-tool/node-modules
yt add @yarn-tool/node-modules
```

## 使用方法

### 基本用法

```typescript
import { findModulesPackagePaths } from '@yarn-tool/node-modules';

// 尋找當前工作目錄下的模組
const result = findModulesPackagePaths();

console.log(result.cwd);        // 當前工作目錄
console.log(result.modules);    // 找到的模組陣列
```

### 自訂 node_modules 路徑

```typescript
import { findModulesPackagePaths } from '@yarn-tool/node-modules';

// 指定自訂的 node_modules 路徑
const result = findModulesPackagePaths('/path/to/project', 'custom-node-modules');

console.log(result.modules);
```

### 工作區使用

```typescript
import { wsFindPackageHasModules } from '@yarn-tool/node-modules';

// 尋找工作區中包含模組的套件
const packages = wsFindPackageHasModules();

packages.forEach(pkg => {
    console.log(`Package: ${pkg.name}`);
    console.log(`Location: ${pkg.location}`);
    console.log(`Modules: ${pkg.modules.length}`);
});
```

## API 文件

### findModulesPackagePaths(cwd?, dir?)

尋找模組路徑的主要函數。

**參數:**
- `cwd` (可選): 工作目錄，若未提供則使用當前工作目錄
- `dir` (可選): 自訂的 node_modules 目錄路徑

**回傳值:**
```typescript
{
    cwd: string;           // 當前工作目錄
    modules: Array<{       // 找到的模組陣列
        name: string;      // 模組名稱
        location: string;  // 模組實際位置
    }>;
}
```

### wsFindPackageHasModules(cwd?, dir?)

尋找工作區中包含模組的套件。

**參數:**
- `cwd` (可選): 工作目錄，若未提供則自動尋找工作區根目錄
- `dir` (可選): 自訂的 node_modules 目錄路徑

**回傳值:**
```typescript
Array<{
    name: string;          // 套件名稱
    location: string;      // 套件位置
    modules: Array<{       // 模組陣列
        name: string;      // 模組名稱
        location: string;  // 模組位置
    }>;
    // ... 其他套件資訊
}>
```

## 相容性

- Node.js >= 12
- Yarn >= 1.0
- 支援 TypeScript

## 貢獻

歡迎提交 Issue 和 Pull Request！

## 授權

ISC License

