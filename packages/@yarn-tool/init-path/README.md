# @yarn-tool/init-path

計算 Yarn Workspaces 環境中套件初始化的目標路徑  
Calculate target path for package initialization in Yarn Workspaces environment

## 功能概述 / Overview

此套件用於在 Yarn Workspaces 環境中，根據套件名稱解析出正確的目標目錄路徑。它支援：

- 一般套件名稱解析
- 作用域套件名稱解析（如 `@scope/name`）
- 自動搜尋工作區前綴
- 驗證 npm 套件名稱

This package resolves the correct target directory path based on package name in Yarn Workspaces environment. It supports:

- Regular package name resolution
- Scoped package name resolution (e.g., `@scope/name`)
- Automatic workspace prefix search
- NPM package name validation

## 安裝 / Install

```bash
yarn add @yarn-tool/init-path
yarn-tool add @yarn-tool/init-path
yt add @yarn-tool/init-path
```

## 使用方法 / Usage

```typescript
import { getTargetDir } from '@yarn-tool/init-path';

// 在工作區環境中使用 / Use in workspace environment
const result = getTargetDir({
  inputName: 'my-package',
  cwd: '/path/to/current/dir',
  hasWorkspace: '/path/to/workspace/root',
  workspacesConfig: {
    prefix: ['packages']
  }
});

console.log(result.targetDir);  // /path/to/workspace/root/packages/my-package
console.log(result.targetName); // my-package
console.log(result.scopedPackagePattern); // false
```

### 作用域套件範例 / Scoped Package Example

```typescript
import { getTargetDir } from '@yarn-tool/init-path';

const result = getTargetDir({
  inputName: '@myscope/mypackage',
  cwd: '/path/to/current/dir',
  hasWorkspace: '/path/to/workspace/root',
  workspacesConfig: {
    prefix: ['packages']
  }
});

console.log(result.targetDir);  // /path/to/workspace/root/packages/myscope_mypackage
console.log(result.scopedPackagePattern); // true
```

## API

### `getTargetDir(options)`

計算目標目錄路徑

#### 參數 / Parameters

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `inputName` | `string` | 是 | 輸入的套件名稱 / Input package name |
| `cwd` | `string` | 是 | 當前工作目錄 / Current working directory |
| `targetName` | `string` | 否 | 目標套件名稱 / Target package name |
| `hasWorkspace` | `string` | 否 | 工作區根目錄路徑 / Workspace root directory path |
| `workspacePrefix` | `string` | 否 | 工作區前綴 / Workspace prefix |
| `workspacesConfig` | `IParseStaticPackagesPathsReturnType` | 否 | 工作區配置 / Workspace configuration |

#### 回傳值 / Returns

| 屬性 | 類型 | 說明 |
|------|------|------|
| `targetDir` | `string` | 目標目錄路徑 / Target directory path |
| `targetName` | `string` | 目標套件名稱 / Target package name |
| `cwd` | `string` | 當前工作目錄 / Current working directory |
| `scopedPackagePattern` | `boolean` | 是否為作用域套件 / Whether it's a scoped package |

## 相關套件 / Related Packages

- `@yarn-tool/search-workspace-prefix-by-name` - 搜尋工作區前綴
- `@yarn-tool/validate-npm-package-name` - 驗證 npm 套件名稱
- `workspaces-config` - 工作區配置解析

## License

ISC
