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

## API Documentation / API 文件

### `sortPackageJson<T>(pkg: T): T`

排序單一 package.json 物件並回傳同一個（已排序的）物件。

Sorts a single package.json object and returns the same (sorted) object.

| 參數 / Parameter | 型別 / Type | 說明 / Description |
| --- | --- | --- |
| `pkg` | `T extends Record<string, any>`（預設為 `IPackageJson`） | 要排序的 package.json 物件 / The package.json object to sort |

- 回傳值 / Returns：與輸入相同型別的已排序物件（排序會直接套用在輸入物件上並回傳）。
  The sorted object of the same type as the input (sorting is applied to the input object, which is then returned).

處理順序 / Processing order：

1. 以 `sort-package-json` 核心搭配 `sortOrder` 排序頂層鍵（Top-level keys）。
   Sort top-level keys with the `sort-package-json` core using `sortOrder`.
2. 若 `scripts` 為純物件（Plain object），則按 npm 生命週期順序排序。
   If `scripts` is a plain object, sort it following the npm lifecycle order.
3. 若 `betterScripts` 為純物件，同樣按生命週期順序排序。
   If `betterScripts` is a plain object, sort it by lifecycle order as well.
4. 若 `exports` 為純物件，則以一致的鍵值順序排序。
   If `exports` is a plain object, sort it with consistent key ordering.

> 非純物件的欄位會被略過而不排序，避免破壞使用者自訂的資料結構。
> Non-plain-object fields are skipped instead of being sorted, so custom data structures are not corrupted.

預設匯出（Default export）同樣是 `sortPackageJson`，可依喜好使用 `import sortPackageJson from 'sort-package-json3'`。
The default export is also `sortPackageJson`, so you may use `import sortPackageJson from 'sort-package-json3'` if preferred.

## Configuration / 設定

本套件不提供執行期設定選項；排序行為由相依套件決定：

This package has no runtime configuration options; sorting behaviour is determined by its dependencies:

- [@yarn-tool/sort-package-json-order](https://www.npmjs.com/package/@yarn-tool/sort-package-json-order) — 頂層鍵的 `sortOrder` 順序定義。
  Defines the `sortOrder` used for top-level keys.
- [sort-package-json-scripts](https://www.npmjs.com/package/sort-package-json-scripts) — scripts / betterScripts 的生命週期排序規則。
  Lifecycle sorting rules for scripts / betterScripts.
- [@yarn-tool/sort-package-json-exports](https://www.npmjs.com/package/@yarn-tool/sort-package-json-exports) — exports 欄位的鍵值順序。
  Key ordering for the exports field.

如需調整排序結果，請調整上述相依套件的設定，或直接傳入已符合期望順序的欄位。
To customise the result, adjust the configuration of the dependencies above, or pass in fields that already match your desired order.

`sort-package-json` 同時列於 `dependencies` 與 `peerDependencies`（版本範圍 `<2 >=1.57.0`），確保與宿主專案使用同一份核心。
`sort-package-json` is listed in both `dependencies` and `peerDependencies` (range `<2 >=1.57.0`), so the host project shares a single core instance.

## Related Packages / 相關套件

- [sort-package-json](https://www.npmjs.com/package/sort-package-json) - Base sort-package-json
- [sort-package-json-scripts](https://www.npmjs.com/package/sort-package-json-scripts) - Scripts sorting
- [@yarn-tool/sort-package-json-exports](https://www.npmjs.com/package/@yarn-tool/sort-package-json-exports) - Exports sorting
- [@yarn-tool/sort-package-json-order](https://www.npmjs.com/package/@yarn-tool/sort-package-json-order) - Sort order definition

相關文件 / Related documentation：[docs/sort-package-json-utils.md](../../docs/sort-package-json-utils.md)

## License / 授權

ISC © bluelovers

