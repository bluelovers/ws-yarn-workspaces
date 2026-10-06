# @yarn-tool/sort-package-json-order

> Predefined sort order for package.json keys
> package.json 鍵值的預定義排序順序

[![NPM version](https://img.shields.io/npm/v/@yarn-tool/sort-package-json-order.svg)](https://www.npmjs.com/package/@yarn-tool/sort-package-json-order)
[![License](https://img.shields.io/npm/l/@yarn-tool/sort-package-json-order.svg)](https://github.com/bluelovers/ws-yarn-workspaces/blob/master/packages/@yarn-tool/sort-package-json-order/LICENSE)

## Description / 描述

This module exports a predefined sort order for package.json keys.
The order follows common conventions and best practices for package.json organization.

此模組匯出 package.json 鍵值的預定義排序順序。
順序遵循 package.json 組織的常見慣例和最佳實踐。

## Features / 功能

- **Predefined Groups / 預定義分組**：將常見的 package.json 鍵整理成 16 個邏輯群組（中繼資料、連結、授權、進入點、依賴、發布等）。
  Groups common package.json keys into 16 logical sections (metadata, links, license, entry points, dependencies, publish, etc.).
- **Single Source of Truth / 單一事實來源（SSoT）**：以單一陣列表示順序，供 sort-package-json3、sort-object-keys2 等共用，避免各套件順序分歧。
  A single array shared by sort-package-json3, sort-object-keys2 and friends, so ordering never diverges between packages.
- **Unknown Keys Safe / 未知鍵安全**：未列於清單的鍵不會排進任何群組，新增自訂欄位不會打亂既有順序。
  Keys absent from the list join no group, so custom fields never disturb the existing order.
- **Tree-shakeable / 支援 Tree-shaking**：`sideEffects: false`，純資料模組，未使用時可被移除。
  `sideEffects: false`; a pure data module that can be dropped when unused.

## Installation / 安裝

```bash
# Using yarn
yarn add @yarn-tool/sort-package-json-order

# Using yarn-tool
yarn-tool add @yarn-tool/sort-package-json-order

# Using yt (yarn-tool alias)
yt add @yarn-tool/sort-package-json-order

# Using npm
npm install @yarn-tool/sort-package-json-order
```

## Usage / 使用方式

```typescript
import sortOrder from '@yarn-tool/sort-package-json-order';

// Use with sort-object-keys2
import { sortObjectKeys } from 'sort-object-keys2';

const packageJson = {
  dependencies: { ... },
  name: 'my-package',
  version: '1.0.0',
};

const sorted = sortObjectKeys(packageJson, { keys: sortOrder, useSource: true });
// Returns: { name: 'my-package', version: '1.0.0', dependencies: { ... } }
```

## Sort Order / 排序順序

The keys are organized in logical groups:

1. **Metadata** - `$schema`, `name`, `displayName`, `version`, `stableVersion`, `private`, `description`, `categories`, `keywords`
2. **Links** - `homepage`, `bugs`, `repository`, `funding`
3. **License & Authors** - `license`, `licenses`, `qna`, `author`, `maintainers`, `contributors`, `publisher`
4. **Entry Points** - `sideEffects`, `type`, `imports`, `exports`, `main`, `svelte`, `umd:main`, `jsdelivr`, `unpkg`, `module`, `source`, `jsnext:main`, `browser`, `react-native`
5. **Types** - `types`, `typesVersions`, `typings`
6. **Resources** - `style`, `example`, `examplestyle`, `assets`
7. **Binaries** - `bin`, `man`, `directories`, `files`
8. **Workspaces** - `workspaces`, `binary`
9. **Scripts** - `scripts`, `betterScripts`, `wireit`
10. **Extension Config** - `l10n`, `contributes`, `activationEvents`
11. **Git Hooks** - `husky`, `simple-git-hooks`, `pre-commit`, `commitlint`, `lint-staged`, `nano-staged`
12. **Tool Config** - `config`, `nodemonConfig`, `browserify`, `babel`, `browserslist`, `xo`, `prettier`, `eslintConfig`, `eslintIgnore`, etc.
13. **Testing** - `ava`, `jest`, `jest-junit`, `jest-stare`, `mocha`, `nyc`, `c8`, `tap`, `tsd`, `oclif`
14. **Dependencies** - `resolutions`, `overrides`, `dependencies`, `devDependencies`, `dependenciesMeta`, `peerDependencies`, `peerDependenciesMeta`, `optionalDependencies`, `bundledDependencies`, `bundleDependencies`
15. **Environment** - `extensionPack`, `extensionDependencies`, `flat`, `packageManager`, `engines`, `engineStrict`, `devEngines`, `volta`, `languageName`, `os`, `cpu`, `preferGlobal`
16. **Publish** - `publishConfig`, `icon`, `badges`, `galleryBanner`, `preview`, `markdown`, `pnpm`

## API Documentation / API 文件

### `sortOrder`

以 `as const` 宣告的唯讀鍵順序清單（Readonly tuple），同時是本套件的具名匯出與預設匯出。

A readonly key order list declared with `as const`, exported both as a named and as the default export.

| 匯出 / Export | 型別 / Type | 說明 / Description |
| --- | --- | --- |
| `sortOrder`（具名 / named） | `readonly [...]` | 明確指定來源的寫法 / explicit-source form |
| `default`（預設 / default） | `readonly [...]` | 與具名匯出為同一個陣列實例 / the same array instance as the named export |

```typescript
import sortOrder from '@yarn-tool/sort-package-json-order';
// 或 / or
import { sortOrder } from '@yarn-tool/sort-package-json-order';
```

相關原始碼 / Source：[src/sort-order.ts](src/sort-order.ts)

## Configuration / 設定

本套件沒有執行期設定選項；順序即資料，調整方式是衍生自己的陣列：

This package has no runtime options; the order *is* the data, so you customise it by deriving your own array:

```typescript
import sortOrder from '@yarn-tool/sort-package-json-order';

// 自訂鍵放在最前方 / put custom keys first
const customOrder = ['workspace', 'workspace:*', ...sortOrder];

const sorted = sortObjectKeys(packageJson, { keys: customOrder, useSource: true });
```

設定要點 / Configuration notes：

- 陣列先後即優先度，越前面越先出現；調整順序只需對調項目。
  Array position equals priority (earlier appears first); reordering is just swapping entries.
- **邊界情況（Edge case）**：未列於清單的鍵不會排進任何群組，其相對次序由排序工具決定。
  Keys absent from the list join no group; their relative order is decided by the sorting utility.
- 修改順序時，請同步更新 README 的 Sort Order 章節與 `src/sort-order.ts` 的群組註解。
  When changing the order, keep the README "Sort Order" section and the group comments in `src/sort-order.ts` in sync.
- 若只需自訂 `exports` 內部鍵序，請改用 [@yarn-tool/sort-package-json-exports](https://www.npmjs.com/package/@yarn-tool/sort-package-json-exports) 的 `rootOrder` / `entryOrder`。
  To customise only the keys inside `exports`, use `rootOrder` / `entryOrder` of [@yarn-tool/sort-package-json-exports](https://www.npmjs.com/package/@yarn-tool/sort-package-json-exports) instead.

## Related / 相關套件

- [sort-object-keys2](https://www.npmjs.com/package/sort-object-keys2) - Sort object keys
- [sort-package-json](https://www.npmjs.com/package/sort-package-json) - Sort package.json
- [@yarn-tool/sort-package-json-exports](https://github.com/bluelovers/ws-yarn-workspaces/tree/master/packages/@yarn-tool/sort-package-json-exports) - Sort package.json exports field

相關文件 / Related documentation：[docs/sort-package-json-utils.md](../../../docs/sort-package-json-utils.md)

## License / 授權

ISC © bluelovers

