# sort-package-json-scripts

> Sort package.json scripts field following npm lifecycle scripts order
> 排序 package.json scripts 欄位，遵循 npm 生命週期腳本順序

[![NPM version](https://img.shields.io/npm/v/sort-package-json-scripts.svg)](https://www.npmjs.com/package/sort-package-json-scripts)
[![License](https://img.shields.io/npm/l/sort-package-json-scripts.svg)](https://github.com/bluelovers/ws-yarn-workspaces/blob/master/packages/sort-package-json-scripts/LICENSE)

## Description / 描述

A better sort package.json scripts utility. By default, it follows npm lifecycle scripts order for better readability. Related scripts (pre, post) are grouped together.

更好的 package.json scripts 排序工具。預設遵循 npm 生命週期腳本順序，提高可讀性。相關腳本（pre、post）會分組在一起。

## Installation / 安裝

```bash
# Using yarn
yarn add sort-package-json-scripts

# Using yarn-tool
yarn-tool add sort-package-json-scripts

# Using npm
npm install sort-package-json-scripts
```

## Usage / 使用方式

```typescript
import sortPackageJsonScripts from 'sort-package-json-scripts';

const scripts = {
  "lint": "npx eslint *.ts",
  "npm:publish": "npm publish",
  "prepublish:lockfile": "npx sync-lockfile .",
  "tsc:esm": "tsc -p tsconfig.esm.json",
  "ncu": "npx yarn-tool ncu -u",
  "sort-package-json": "npx yarn-tool sort",
  "test": "jest --coverage",
  "coverage": "npx nyc yarn run test",
  "test:mocha": "npx mocha --require ts-node/register \"!(node_modules)/*.{test,spec}.{ts,tsx}\"",
  "tsc:default": "tsc -p tsconfig.json",
  "prepublishOnly": "yarn run ncu && yarn run sort-package-json && yarn run test",
  "postpublish_": "git commit -m \"chore(release): publish\" .",
};

const sorted = sortPackageJsonScripts(scripts);

console.log(sorted);
/*
{
  coverage: 'npx nyc yarn run test',
  lint: 'npx eslint *.ts',
  test: 'jest --coverage',
  'test:mocha': 'npx mocha --require ts-node/register "!(node_modules)/*.{test,spec}.{ts,tsx}"',
  'npm:publish': 'npm publish',
  'prepublish:lockfile': 'npx sync-lockfile .',
  prepublishOnly: 'yarn run ncu && yarn run sort-package-json && yarn run test',
  postpublish_: 'git commit -m "chore(release): publish" .',
  ncu: 'npx yarn-tool ncu -u',
  'sort-package-json': 'npx yarn-tool sort',
  'tsc:default': 'tsc -p tsconfig.json',
  'tsc:esm': 'tsc -p tsconfig.esm.json'
}
*/
```

## Options / 選項

```typescript
import sortPackageJsonScripts, { ISortPackageJsonScriptsOptions } from 'sort-package-json-scripts';

const options: ISortPackageJsonScriptsOptions = {
  // Additional script names to treat as "other" scripts
  // 額外的腳本名稱，視為「其他」腳本
  otherScriptNames: ['prettier', 'eslint'],

  // Custom script order for grouping/sorting
  // 自定義腳本順序用於分組/排序
  defaultNpmScriptsOrder: ['build', 'test', 'lint'],

  // Custom function to extract the base key from a script name
  // 自定義函式從腳本名稱中提取基礎鍵
  omitKeyFn: (key: string) => ({ key, omitted: false }),

  // Custom sort function for comparing script keys
  // 自定義排序函式用於比較腳本鍵
  sortKeyFn: (a: string, b: string) => a.localeCompare(b),
};

const sorted = sortPackageJsonScripts(scripts, options);
```

## Features / 功能

- **NPM Lifecycle Order**: Follows npm lifecycle scripts order by default
- **Script Grouping**: Groups related scripts (pre, post) together
- **Customizable**: Supports custom sort order and key extraction
- **TypeScript Support**: Full TypeScript type definitions

- **NPM 生命週期順序**：預設遵循 npm 生命週期腳本順序
- **腳本分組**：將相關腳本（pre、post）分組在一起
- **可自定義**：支援自定義排序順序和鍵值提取
- **TypeScript 支援**：完整的 TypeScript 類型定義

## API Reference / API 參考

### `sortPackageJsonScripts(scripts, options?)`

Sorts the scripts object and returns a new sorted object.

排序 scripts 物件並返回新的排序物件。

| Parameter | Type | Description |
|-----------|------|-------------|
| `scripts` | `Record<string, any>` | The scripts object to sort |
| `options` | `ISortPackageJsonScriptsOptions` | Optional sorting options |

## Related / 相關套件

- [sort-package-json](https://www.npmjs.com/package/sort-package-json) - Sort package.json
- [sort-object-keys2](https://www.npmjs.com/package/sort-object-keys2) - Sort object keys

## License / 授權

ISC © bluelovers
