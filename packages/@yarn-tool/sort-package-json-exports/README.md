# @yarn-tool/sort-package-json-exports

> Sort package.json exports field with consistent key ordering
> 排序 package.json exports 欄位，確保鍵值順序一致

[![NPM version](https://img.shields.io/npm/v/@yarn-tool/sort-package-json-exports.svg)](https://www.npmjs.com/package/@yarn-tool/sort-package-json-exports)
[![License](https://img.shields.io/npm/l/@yarn-tool/sort-package-json-exports.svg)](https://github.com/bluelovers/ws-yarn-workspaces/blob/master/packages/@yarn-tool/sort-package-json-exports/LICENSE)

## Description / 描述

This module provides utilities for sorting the exports field in package.json.
It ensures consistent key ordering for better readability and version control.

此模組提供排序 package.json 中 exports 欄位的工具函式。
確保鍵值順序一致，提高可讀性和版本控制友好性。

## Installation / 安裝

```bash
# Using yarn
yarn add @yarn-tool/sort-package-json-exports

# Using yarn-tool
yarn-tool add @yarn-tool/sort-package-json-exports

# Using yt (yarn-tool alias)
yt add @yarn-tool/sort-package-json-exports

# Using npm
npm install @yarn-tool/sort-package-json-exports
```

## Usage / 使用方式

### sortPackageJsonExports(exports, options?)

Sort the exports field in package.json.

排序 package.json 中的 exports 欄位。

```typescript
import sortPackageJsonExports from '@yarn-tool/sort-package-json-exports';

const exports = {
  '.': {
    import: './dist/index.esm.mjs',
    require: './dist/index.cjs',
    types: './dist/index.d.ts',
  },
  './sub': {
    default: './dist/sub.js',
    types: './dist/sub.d.ts',
  },
};

const sorted = sortPackageJsonExports(exports);
// Returns:
// {
//   '.': { types: './dist/index.d.ts', require: './dist/index.cjs', import: './dist/index.esm.mjs' },
//   './sub': { types: './dist/sub.d.ts', default: './dist/sub.js' }
// }
```

### Custom Ordering / 自定義順序

```typescript
import sortPackageJsonExports from '@yarn-tool/sort-package-json-exports';

const sorted = sortPackageJsonExports(exports, {
  rootOrder: ['browser', 'module'],  // Prepend to default order
  entryOrder: ['worker'],             // Prepend to default order
});
```

### isPackageJsonExportsEntryObject(exports)

Check if the exports value is an entry object (not a string).

檢查 exports 值是否為項物件（非字串）。

```typescript
import { isPackageJsonExportsEntryObject } from '@yarn-tool/sort-package-json-exports';

isPackageJsonExportsEntryObject({ import: './dist/index.js' });  // true
isPackageJsonExportsEntryObject('./dist/index.js');              // false
```

## Key Ordering / 鍵值順序

### Root-level keys / 根層級鍵

1. `types`
2. `require`
3. `import`
4. `node`
5. `node-addons`

### Entry-level keys / 項層級鍵

1. `types`
2. `require`
3. `import`
4. `node`
5. `node-addons`
6. `default`
7. `.`
8. `./`
9. `./package.json`

## API Reference / API 參考

| Function | Description |
|----------|-------------|
| `sortPackageJsonExports(exports, options?)` | Sort the exports field in package.json |
| `isPackageJsonExportsEntryObject(exports)` | Check if exports is an entry object |

### IOptions

| Property | Type | Description |
|----------|------|-------------|
| `rootOrder` | `readonly string[]` | Custom order for root-level exports keys |
| `entryOrder` | `readonly string[]` | Custom order for nested exports entry keys |

## Related / 相關套件

- [sort-object-keys2](https://www.npmjs.com/package/sort-object-keys2) - Sort object keys
- [@yarn-tool/sort-package-json-order](https://github.com/bluelovers/ws-yarn-workspaces/tree/master/packages/@yarn-tool/sort-package-json-order) - Sort package.json

## License / 授權

ISC © bluelovers

