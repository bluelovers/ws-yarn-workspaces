# sort-package-json3

> Enhanced sort-package-json with scripts and exports sorting
> 增強版 sort-package-json，支援 scripts 和 exports 排序

[![NPM version](https://img.shields.io/npm/v/sort-package-json3.svg)](https://www.npmjs.com/package/sort-package-json3)
[![License](https://img.shields.io/npm/l/sort-package-json3.svg)](https://github.com/bluelovers/ws-yarn-workspaces/blob/master/packages/sort-package-json3/LICENSE)

## Description / 描述

This module provides an enhanced sort-package-json function that:
- Sorts package.json keys in a predefined order
- Sorts scripts following npm lifecycle order
- Sorts exports field with consistent key ordering

此模組提供增強的 sort-package-json 函式：
- 按預定義順序排序 package.json 鍵
- 按 npm 生命週期順序排序 scripts
- 按一致的鍵值順序排序 exports 欄位

## Installation / 安裝

```bash
# Using yarn
yarn add sort-package-json3

# Using yarn-tool
yarn-tool add sort-package-json3

# Using yt (yarn-tool alias)
yt add sort-package-json3

# Using npm
npm install sort-package-json3
```

## Usage / 使用方式

```typescript
import sortPackageJson from 'sort-package-json3';

const pkg = {
  version: '1.0.0',
  name: 'my-package',
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
  dependencies: {
    lodash: '^4.17.21',
  },
};

const sorted = sortPackageJson(pkg);
// Returns:
// {
//   name: 'my-package',
//   version: '1.0.0',
//   exports: { '.': { types: '...', require: '...', import: '...' } },
//   scripts: { pretest: '...', test: '...', posttest: '...' },
//   dependencies: { lodash: '^4.17.21' }
// }
```

## Features / 功能

- **Top-level Key Sorting**: Sorts package.json keys in a logical order
- **Scripts Sorting**: Sorts scripts following npm lifecycle order (pre, main, post)
- **betterScripts Sorting**: Also sorts betterScripts field
- **Exports Sorting**: Sorts exports field with consistent key ordering

- **頂層鍵排序**：按邏輯順序排序 package.json 鍵
- **Scripts 排序**：按 npm 生命週期順序排序 scripts（pre、main、post）
- **betterScripts 排序**：也排序 betterScripts 欄位
- **Exports 排序**：按一致的鍵值順序排序 exports 欄位

## Related Packages / 相關套件

- [sort-package-json](https://www.npmjs.com/package/sort-package-json) - Base sort-package-json
- [sort-package-json-scripts](https://www.npmjs.com/package/sort-package-json-scripts) - Scripts sorting
- [@yarn-tool/sort-package-json-exports](https://www.npmjs.com/package/@yarn-tool/sort-package-json-exports) - Exports sorting
- [@yarn-tool/sort-package-json-order](https://www.npmjs.com/package/@yarn-tool/sort-package-json-order) - Sort order definition

## License / 授權

ISC © bluelovers

