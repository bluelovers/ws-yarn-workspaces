# @yarn-tool/ws-scope

> A utility for managing workspace scope settings across package.json, lerna.json, and pnpm-workspace.yaml
> 
> 管理工作區範圍設定的工具，支援跨多種設定檔案格式

[![npm version](https://badge.fury.io/js/%40yarn-tool%2Fws-scope.svg)](https://www.npmjs.com/package/@yarn-tool/ws-scope)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## Features | 功能特色

- **Multi-format Support | 多格式支援**: Manages workspace scopes across `package.json`, `lerna.json`, and `pnpm-workspace.yaml`
- **Add/Remove Scopes | 新增/移除範圍**: Easily add or remove workspace paths from all configuration files
- **Sync Values | 同步數值**: Synchronize workspace paths across all configuration files
- **Safe Path Validation | 安全路徑驗證**: Validates that all paths are within the workspace root
- **Format Preservation | 格式保留**: Preserves YAML formatting and comments when modifying `pnpm-workspace.yaml`

## Installation | 安裝

```bash
# Using yarn
yarn add @yarn-tool/ws-scope

# Using yarn-tool
yarn-tool add @yarn-tool/ws-scope

# Using yt (short for yarn-tool)
yt add @yarn-tool/ws-scope
```

## Usage | 使用方式

### Basic Usage | 基本用法

```typescript
import { WorkspacesScope } from '@yarn-tool/ws-scope';

// Create instance - automatically finds workspace root
// 建立實例 - 自動尋找工作區根目錄
const ws = new WorkspacesScope();

// Add a workspace scope
// 新增工作區範圍
ws.add('packages/new-package/*');
// Or simply use the package name (auto-converts to 'packages/new-package/*')
// 或直接使用套件名稱（自動轉換為 'packages/new-package/*'）
ws.add('new-package');

// Remove a workspace scope
// 移除工作區範圍
ws.remove('packages/old-package/*');

// Check if any changes were made
// 檢查是否有變更
if (ws.changed) {
  // Save changes to all configuration files
  // 將變更儲存至所有設定檔
  ws.save();
}
```

### Sync Workspace Values | 同步工作區數值

```typescript
import { WorkspacesScope } from '@yarn-tool/ws-scope';

const ws = new WorkspacesScope();

// Synchronize workspace paths across all config files
// 跨所有設定檔同步工作區路徑
const allScopes = ws.syncValue();

// Save the synchronized configuration
// 儲存同步後的設定
ws.save();
```

### Get All Workspace Scopes | 取得所有工作區範圍

```typescript
import { WorkspacesScope } from '@yarn-tool/ws-scope';

const ws = new WorkspacesScope();

// Get all unique workspace scopes from all configuration files
// 從所有設定檔取得所有唯一的工作區範圍
const scopes = ws.value;
console.log(scopes);
// Output: ['packages/*', 'packages/@scope/*', ...]
```

## API Reference | API 參考

### `WorkspacesScope`

Main class for managing workspace scope configurations.

管理工作區範圍設定的主要類別。

#### Constructor | 建構函式

```typescript
constructor(cwd?: string)
```

- `cwd` (optional): Current working directory to start searching for workspace root
- `cwd`（可選）：當前工作目錄，用於開始搜尋工作區根目錄

#### Properties | 屬性

| Property | Type | Description |
|----------|------|-------------|
| `rootData` | `IFindRootReturnType` | Workspace root path information / 工作區根目錄路徑資訊 |
| `changed` | `boolean` | Whether any configuration has been modified / 是否有任何設定已被修改 |
| `value` | `string[]` | All unique workspace scopes from all config files / 所有設定檔中的唯一工作區範圍 |

#### Methods | 方法

| Method | Return Type | Description |
|--------|-------------|-------------|
| `add(scope: string)` | `string` | Add a workspace scope to all config files / 將工作區範圍新增至所有設定檔 |
| `remove(scope: string)` | `string` | Remove a workspace scope from all config files / 從所有設定檔移除工作區範圍 |
| `save()` | `void` | Save all modified configuration files / 儲存所有已修改的設定檔 |
| `syncValue()` | `string[]` | Sync workspace paths across all config files / 跨所有設定檔同步工作區路徑 |
| `sync()` | `string[]` | **Deprecated**: Use `syncValue()` instead / **已棄用**：請改用 `syncValue()` |
| `resolvePath(...paths)` | `string` | Resolve path relative to workspace root / 解析相對於工作區根目錄的路徑 |

## Supported Configuration Files | 支援的設定檔

| File | Field | Description |
|------|-------|-------------|
| `package.json` | `workspaces` | Yarn/npm workspaces configuration |
| `lerna.json` | `packages` | Lerna monorepo packages configuration |
| `pnpm-workspace.yaml` | `packages` | pnpm workspace configuration |

## Related Packages | 相關套件

- [@yarn-tool/find-root](https://github.com/bluelovers/ws-yarn-workspaces/tree/master/packages/@yarn-tool/find-root) - Find workspace root directory
- [@yarn-tool/sort-lerna-json](https://github.com/bluelovers/ws-yarn-workspaces/tree/master/packages/@yarn-tool/sort-lerna-json) - Sort lerna.json configuration
- [@yarn-tool/write-package-json](https://github.com/bluelovers/ws-yarn-workspaces/tree/master/packages/@yarn-tool/write-package-json) - Write package.json with formatting

## License | 授權

ISC © [bluelovers](https://github.com/bluelovers)
