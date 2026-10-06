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

## Features / 功能

- **Root-level Key Sorting / 根層級鍵排序**：依 Node.js 解析偏好排序根層級鍵（`types`、`require`、`import`、`node`、`node-addons`）。
  Sorts root-level keys following Node.js resolution preferences.
- **Entry-level Key Sorting / 項層級鍵排序**：巢狀入口條件一併排序，並以 `default`、`.`、`./`、`./package.json` 收尾。
  Sorts nested entry conditions as well, ending with `default`, `.`, `./`, `./package.json`.
- **Custom Ordering / 自定義順序**：可透過 `rootOrder`、`entryOrder` 將自訂鍵前置（Prepend）到預設順序。
  Custom keys can be prepended to the default order via `rootOrder` / `entryOrder`.
- **Type-safe Guards / 型別安全守衛**：非純物件（Plain object）的 exports 值一律略過，不改寫字串或陣列簡寫。
  Non-plain-object exports values are skipped, so string/array shorthands are never rewritten.
- **In-place Sorting / 原地排序**：以 `useSource: true` 回寫傳入的物件，方便呼叫端直接沿用。
  Sorting writes back into the passed object via `useSource: true`, convenient for callers.

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

## API Documentation / API 文件

| Function | Description |
|----------|-------------|
| `sortPackageJsonExports(exports, options?)` | Sort the exports field in package.json |
| `isPackageJsonExportsEntryObject(exports)` | Check if exports is an entry object |

### IOptions

| Property | Type | Description |
|----------|------|-------------|
| `rootOrder` | `readonly string[]` | Custom order for root-level exports keys |
| `entryOrder` | `readonly string[]` | Custom order for nested exports entry keys |

## Configuration / 設定

排序順序由 `IOptions` 兩個欄位控制，兩者皆為**前置（Prepend）**語意：

Sorting is controlled by the two `IOptions` fields, both of which **prepend**:

```typescript
import sortPackageJsonExports from '@yarn-tool/sort-package-json-exports';

const sorted = sortPackageJsonExports(exports, {
  rootOrder: ['browser', 'module'],  // 放到預設根層級順序之前 / placed before the default root order
  entryOrder: ['worker'],            // 放到預設項層級順序之前 / placed before the default entry order
});
```

設定要點 / Configuration notes：

- 自訂鍵會插到預設順序最前方；預設順序中的其餘鍵維持相對次序。
  Custom keys are inserted at the front of the default order; the remaining default keys keep their relative order.
- **邊界情況（Edge case）**：`rootOrder` 不會自動帶入 `entryOrder`（預設 `entryOrder` 在前置自訂鍵之前就已建立），
  若要同時調整兩個層級，必須分別指定。
  `rootOrder` does not propagate into `entryOrder` (the default `entryOrder` is built before your custom keys are
  prepended); specify both if you need to change two levels.
- 傳入空陣列等同未指定，不會改變順序。
  Passing an empty array is equivalent to omitting the option and changes nothing.
- 順序表未列出的鍵會排在已知鍵之後，原有鍵值不會遺失。
  Keys absent from the order list are placed after the known ones; no existing key is dropped.

## Related / 相關套件

- [sort-object-keys2](https://www.npmjs.com/package/sort-object-keys2) - Sort object keys
- [@yarn-tool/sort-package-json-order](https://github.com/bluelovers/ws-yarn-workspaces/tree/master/packages/@yarn-tool/sort-package-json-order) - Sort package.json

相關文件 / Related documentation：[docs/sort-package-json-utils.md](../../../docs/sort-package-json-utils.md)

## License / 授權

ISC © bluelovers

