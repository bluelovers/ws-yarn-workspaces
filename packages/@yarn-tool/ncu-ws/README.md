# @yarn-tool/ncu-ws

Workspace-aware npm-check-updates tool for Yarn workspaces. Supports monorepo dependency version checking and updating across all workspace packages.

專為 Yarn workspaces 設計的依賴版本檢查與更新工具，支援 monorepo 中所有工作區套件的版本檢查與更新。

## Features / 功能特色

- 🏢 **Workspace Support** - Check and update dependencies across all workspace packages
- 🔄 **Batch Processing** - Process all packages in a monorepo efficiently
- 🔗 **Yarn.lock Integration** - Update yarn.lock after dependency changes
- 📦 **Resolutions Support** - Handle package resolutions in workspaces
- 🎯 **Dedupe Support** - Remove duplicate dependencies from resolutions
- ⏱️ **Progress Tracking** - Display execution time and progress info

## Installation / 安裝

```bash
yarn add @yarn-tool/ncu-ws
yarn-tool add @yarn-tool/ncu-ws
yt add @yarn-tool/ncu-ws

pnpm add @yarn-tool/ncu-ws

npm install @yarn-tool/ncu-ws
```

## Usage / 使用方式

### Programmatic API / 程式化使用

```typescript
import _handleNcuArgvAuto from '@yarn-tool/ncu-ws';
import { console } from 'debug-color2';

const runtimeInput = {
  console,
  consoleDebug: console,
  printRootData: (rootData, argv) => {
    console.info(`Processing: ${rootData.root}`);
  },
};

// Run ncu across all workspaces
await _handleNcuArgvAuto(
  argv,           // yargs parsed arguments
  runtimeInput,   // runtime configuration
  true,           // isWorkspace: enable workspace mode
  true            // includeRoot: include root package.json
);
```

### CLI Integration / 命令列整合

This package is designed to be used as part of yarn-tool CLI:

```bash
# Check for updates in all workspace packages
yarn-tool ncu

# Check and update all workspace packages
yarn-tool ncu -u

# Check with specific options
yarn-tool ncu --filter "typescript" --dep dev
```

## How It Works / 運作方式

1. **Find Workspace Root** - Locates the workspace root directory
2. **List Workspace Packages** - Enumerates all packages in the workspace
3. **Process Each Package** - Runs npm-check-updates on each package.json
4. **Update yarn.lock** - Synchronizes yarn.lock with package changes
5. **Handle Resolutions** - Updates root resolutions if needed

## API Reference / API 參考

### `_handleNcuArgvAuto(argv, runtimeInput, isWorkspace?, includeRoot?)`

Main function to process ncu across workspaces.

**Parameters:**
- `argv` - Parsed yargs arguments with ncu options
- `runtimeInput` - Runtime configuration object
  - `console` - Console instance for output
  - `consoleDebug` - Console instance for debug output
  - `printRootData` - Callback to print root data
- `isWorkspace` - Enable workspace mode (default: false)
- `includeRoot` - Include root package.json (default: false)

**Returns:** Promise<void>

### `IArgvRuntime`

Type for parsed command line arguments. Extends the base ncu options with workspace-specific flags:

| Option | Description |
|--------|-------------|
| `AA` | Auto-enable workspace mode with root inclusion |
| `resolutions` | Process resolutions instead of dependencies |
| `dedupe` | Remove duplicate dependencies from resolutions |

## Related Packages / 相關套件

- [@yarn-tool/ncu](../ncu) - Core ncu wrapper functionality
- [@yarn-tool/find-root](../find-root) - Find workspace root
- [ws-pkg-list](../ws-pkg-list) - List workspace packages

## License / 授權

ISC