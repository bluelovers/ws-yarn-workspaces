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
9. **Scripts** - `scripts`, `betterScripts`
10. **Extension Config** - `l10n`, `contributes`, `activationEvents`
11. **Git Hooks** - `husky`, `simple-git-hooks`, `pre-commit`, `commitlint`, `lint-staged`, `nano-staged`
12. **Tool Config** - `config`, `nodemonConfig`, `browserify`, `babel`, `browserslist`, `xo`, `prettier`, `eslintConfig`, `eslintIgnore`, etc.
13. **Testing** - `ava`, `jest`, `jest-junit`, `jest-stare`, `mocha`, `nyc`, `c8`, `tap`, `tsd`, `oclif`
14. **Dependencies** - `resolutions`, `overrides`, `dependencies`, `devDependencies`, `dependenciesMeta`, `peerDependencies`, `peerDependenciesMeta`, `optionalDependencies`, `bundledDependencies`, `bundleDependencies`
15. **Environment** - `extensionPack`, `extensionDependencies`, `flat`, `packageManager`, `engines`, `engineStrict`, `devEngines`, `volta`, `languageName`, `os`, `cpu`, `preferGlobal`
16. **Publish** - `publishConfig`, `icon`, `badges`, `galleryBanner`, `preview`, `markdown`, `pnpm`

## Related / 相關套件

- [sort-object-keys2](https://www.npmjs.com/package/sort-object-keys2) - Sort object keys
- [sort-package-json](https://www.npmjs.com/package/sort-package-json) - Sort package.json
- [@yarn-tool/sort-package-json-exports](https://github.com/bluelovers/ws-yarn-workspaces/tree/master/packages/@yarn-tool/sort-package-json-exports) - Sort package.json exports field

## License / 授權

ISC © bluelovers

