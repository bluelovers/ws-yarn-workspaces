# Sort Package JSON Utils / Package JSON 排序工具集

> A collection of utilities for sorting package.json and related configuration files.
> 一系列用於排序 package.json 及相關配置檔案的工具。

## Overview / 概述

This monorepo contains several packages for sorting package.json files and related configurations. Each package focuses on a specific aspect of sorting to provide modular and reusable functionality.

此 monorepo 包含多個用於排序 package.json 檔案及相關配置的套件。每個套件專注於排序的特定方面，提供模組化且可重用的功能。

## Packages / 套件

### Core Packages / 核心套件

#### [sort-package-json3](../packages/sort-package-json3)

Enhanced sort-package-json with scripts and exports sorting.

增強版 sort-package-json，支援 scripts 和 exports 排序。

**Features / 功能：**
- Sorts package.json keys in a predefined order / 按預定義順序排序 package.json 鍵
- Sorts scripts following npm lifecycle order / 按 npm 生命週期順序排序 scripts
- Sorts exports field with consistent key ordering / 按一致的鍵值順序排序 exports 欄位

```typescript
import sortPackageJson from 'sort-package-json3';

const sorted = sortPackageJson(pkg);
```

### Utility Packages / 工具套件

#### [@yarn-tool/sort-package-json-order](../packages/@yarn-tool/sort-package-json-order)

Predefined sort order for package.json keys.

package.json 鍵值的預定義排序順序。

**Sort Order Groups / 排序順序分組：**
1. Metadata - `$schema`, `name`, `version`, `private`, `description`, etc.
2. Links - `homepage`, `bugs`, `repository`, `funding`
3. License & Authors - `license`, `author`, `maintainers`, `contributors`
4. Entry Points - `main`, `module`, `exports`, `types`, etc.
5. Scripts - `scripts`, `betterScripts`
6. Dependencies - `dependencies`, `devDependencies`, `peerDependencies`, etc.
7. Environment - `engines`, `os`, `cpu`, etc.
8. Publish - `publishConfig`, etc.

```typescript
import { sortOrder } from '@yarn-tool/sort-package-json-order';
```

#### [@yarn-tool/sort-package-json-exports](../packages/@yarn-tool/sort-package-json-exports)

Sort package.json exports field with consistent key ordering.

排序 package.json exports 欄位，確保鍵值順序一致。

**Key Order / 鍵值順序：**
- `types` - TypeScript type definitions
- `require` - CommonJS entry point
- `import` - ES Module entry point
- `node` - Node.js specific entry
- `node-addons` - Node.js addons entry
- `default` - Default fallback

```typescript
import sortPackageJsonExports from '@yarn-tool/sort-package-json-exports';

const sorted = sortPackageJsonExports(exports);
```

#### [sort-package-json-scripts](../packages/sort-package-json-scripts)

Sort package.json scripts field following npm lifecycle scripts order.

排序 package.json scripts 欄位，遵循 npm 生命週期腳本順序。

**Features / 功能：**
- Groups related scripts (pre, main, post) together / 將相關腳本（pre、main、post）分組在一起
- Follows npm lifecycle order / 遵循 npm 生命週期順序
- Supports custom sort order / 支援自定義排序順序

```typescript
import sortPackageJsonScripts from 'sort-package-json-scripts';

const sorted = sortPackageJsonScripts(scripts);
```

### Related Packages / 相關套件

#### [@yarn-tool/sort-lerna-json](../packages/@yarn-tool/sort-lerna-json)

Sort lerna.json configuration file with consistent key ordering.

排序 lerna.json 配置檔案，確保鍵值順序一致。

**Key Order / 鍵值順序：**
- `workspaces`, `packages` - Workspace configuration
- `command` - Command configuration
- `npmClient`, `useWorkspaces` - Client settings
- `version` - Version configuration

```typescript
import sortLernaJson from '@yarn-tool/sort-lerna-json';

const sorted = sortLernaJson(lernaConfig);
```

#### [@yarn-tool/script-lifecycle](../packages/@yarn-tool/script-lifecycle)

npm/yarn script lifecycle utility for handling pre/post script execution order.

npm/yarn 腳本生命週期工具，處理 pre/post 腳本執行順序。

**Supported Lifecycle Events / 支援的生命週期事件：**
- `install` - npm install lifecycle scripts
- `pack` - npm pack lifecycle scripts
- `publish` - npm publish lifecycle scripts

```typescript
import { getLifecycleList, isKnownLifecycleKey } from '@yarn-tool/script-lifecycle';

const scripts = getLifecycleList('install');
// Returns: ['preinstall', 'install', 'postinstall', ...]
```

## Installation / 安裝

```bash
# Install core package
yarn add sort-package-json3

# Or install individual packages
yarn add @yarn-tool/sort-package-json-order
yarn add @yarn-tool/sort-package-json-exports
yarn add sort-package-json-scripts
```

## Usage Examples / 使用範例

### Complete Package.json Sorting / 完整 Package.json 排序

```typescript
import sortPackageJson from 'sort-package-json3';

const pkg = {
  dependencies: { lodash: '^4.17.21' },
  name: 'my-package',
  version: '1.0.0',
  scripts: {
    test: 'jest',
    pretest: 'npm run lint',
    posttest: 'echo done',
  },
  exports: {
    '.': {
      import: './dist/index.esm.mjs',
      require: './dist/index.cjs',
      types: './dist/index.d.ts',
    },
  },
};

const sorted = sortPackageJson(pkg);
// All keys, scripts, and exports are now sorted
```

### Sort Only Scripts / 僅排序 Scripts

```typescript
import sortPackageJsonScripts from 'sort-package-json-scripts';

const scripts = {
  'postbuild': 'echo done',
  'build': 'tsc',
  'prebuild': 'npm run clean',
};

const sorted = sortPackageJsonScripts(scripts);
// Returns: { prebuild: '...', build: '...', postbuild: '...' }
```

### Sort Only Exports / 僅排序 Exports

```typescript
import sortPackageJsonExports from '@yarn-tool/sort-package-json-exports';

const exports = {
  '.': {
    import: './dist/index.esm.mjs',
    require: './dist/index.cjs',
    types: './dist/index.d.ts',
  },
};

const sorted = sortPackageJsonExports(exports);
// Returns: { '.': { types: '...', require: '...', import: '...' } }
```

### Get Lifecycle Scripts / 獲取生命週期腳本

```typescript
import { getLifecycleList } from '@yarn-tool/script-lifecycle';

// Get all scripts for publish lifecycle
const publishScripts = getLifecycleList('publish');
// Returns: ['prepublish', 'prepare', 'prepublishOnly', 'prepack', 'postpack', 'publish', 'postpublish']

// Get lifecycle for unknown script (generates default pre/post)
const buildScripts = getLifecycleList('build');
// Returns: ['prebuild', 'build', 'postbuild']
```

## Package Dependencies / 套件依賴關係

```
sort-package-json3
├── sort-package-json (base)
├── sort-package-json-scripts
├── @yarn-tool/sort-package-json-exports
└── @yarn-tool/sort-package-json-order

sort-package-json-scripts
└── sort-object-keys2

@yarn-tool/sort-package-json-exports
└── sort-object-keys2

@yarn-tool/sort-lerna-json
├── sort-object-keys2
└── @yarn-tool/write-package-json

@yarn-tool/script-lifecycle
└── ts-type
```

## Related / 相關資源

- [npm lifecycle scripts](https://docs.npmjs.com/cli/v10/using-npm/scripts#life-cycle-scripts)
- [sort-package-json](https://www.npmjs.com/package/sort-package-json)
- [sort-object-keys2](https://www.npmjs.com/package/sort-object-keys2)

## License / 授權

ISC © bluelovers
