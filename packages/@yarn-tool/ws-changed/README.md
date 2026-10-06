# @yarn-tool/ws-changed

Detect changed packages in monorepo workspaces using both Lerna and Git.

同時使用 Lerna 與 Git 檢測 monorepo 工作區 (Workspaces) 中已變更的套件。

## Features | 功能特色

- **Dual Detection**: Combines Lerna and Git to detect changed packages
- **Lerna Integration**: Uses `lerna changed` to detect packages changed since last release
- **Git Staged**: Detects packages with staged changes in Git
- **Workspace Aware**: Automatically detects workspace root and configuration
- **Dependency Tracking**: Helps identify affected packages for selective builds

## Installation | 安裝

```bash
# Using yarn
yarn add @yarn-tool/ws-changed

# Using yarn-tool
yarn-tool add @yarn-tool/ws-changed

# Using yt (alias)
yt add @yarn-tool/ws-changed
```

## Usage | 使用方式

### Get Changed Packages

```typescript
import wsChanged from '@yarn-tool/ws-changed';

const result = wsChanged(process.cwd());

console.log(result.cwd);       // Workspace root path
console.log(result.changed);   // Packages changed according to Lerna
console.log(result.staged);    // Packages with Git staged changes
```

### Lerna Only

```typescript
import { lernaChanged } from '@yarn-tool/ws-changed';

const result = lernaChanged(process.cwd());
console.log(result.list);  // Array of changed package info
```

### Git Staged Only

```typescript
import { wsGitChanged } from '@yarn-tool/ws-changed';

const result = wsGitChanged(process.cwd());
console.log(result.list);  // Array of staged package info
```

## API Documentation | API 文件

### Return Type | 回傳型別

```typescript
interface IChangedResult {
  cwd: string;           // Workspace root directory
  changed: IListableRowExtra[];  // Lerna detected changes
  staged: IListableRowExtra[];   // Git staged changes
}

interface IListableRowExtra {
  name: string;          // Package name
  version: string;       // Current version
  private: boolean;      // Is private package
  location: string;      // Absolute path
  prefix: string;        // Relative path from workspace root
}
```

## Example Output | 範例輸出

```typescript
{
  cwd: '/path/to/workspace',
  changed: [
    {
      name: 'package-a',
      version: '1.0.0',
      private: false,
      location: '/path/to/workspace/packages/package-a',
      prefix: 'packages/package-a'
    }
  ],
  staged: [
    {
      name: 'package-b',
      version: '2.0.0',
      private: false,
      location: '/path/to/workspace/packages/package-b',
      prefix: 'packages/package-b'
    }
  ]
}
```

## Advanced Usage

### Build Only Changed Packages

```typescript
import wsChanged from '@yarn-tool/ws-changed';
import { findUpDepsAllDeep } from '@yarn-tool/find-deps';

const result = wsChanged();
const allChanged = result.changed.concat(result.staged);
const packageNames = allChanged.map(row => row.name);

console.log('Packages to build:', packageNames);
```

### Run Scripts on Changed Packages

```typescript
import wsChanged from '@yarn-tool/ws-changed';
import crossSpawn from 'cross-spawn-extra';

const result = wsChanged();
const packages = result.changed.map(row => row.name);

if (packages.length > 0) {
  await crossSpawn.async('lerna', [
    'run',
    '--scope', packages[0],
    'build'
  ], { stdio: 'inherit' });
}
```

## Configuration | 設定

| Option | Type | Description |
|--------|------|-------------|
| `cwd` | `string` | Working directory (default: `process.cwd()`) / 工作目錄（預設：`process.cwd()`） |
| `gitBin` | `string` | Path to Git binary / Git 執行檔路徑 |
| `lernaBin` | `string` | Path to Lerna binary / Lerna 執行檔路徑 |

## How It Works | 運作原理

1. **Lerna Changed**: Executes `lerna changed --json` to get packages changed since last release
2. **Git Staged**: Analyzes `git diff --staged` to find packages with staged changes
3. **Workspace Mapping**: Matches changed paths to workspace packages using `workspaces` config
4. **Deduplication**: Removes duplicate packages from the combined list

## Related

- [@yarn-tool/changelog](../changelog) - Generate changelogs for changed packages
- [Lerna](https://lerna.js.org/) - Monorepo management tool

## License

ISC
