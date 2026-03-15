# sort-package-json-scripts

> Sort package.json scripts field following npm lifecycle scripts order with script grouping (pre/post) support
> 排序 package.json scripts 欄位，遵循 npm 生命週期腳本順序，支援腳本分組 (pre/post)

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

### Basic Usage / 基本使用方式

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

### Script Grouping / 腳本分組

Related scripts (pre, post) are automatically grouped together in the correct order.

相關腳本（pre、post）會自動按照正確順序分組在一起。

```typescript
const scripts = {
  "test": "jest",
  "pretest": "npm run lint",
  "posttest": "echo 'Done testing'",
  "build": "tsc",
  "prebuild": "rm -rf dist",
  "postbuild": "echo 'Build complete'",
};

const sorted = sortPackageJsonScripts(scripts);

/*
Result:
{
  pretest: 'npm run lint',
  test: 'jest',
  posttest: 'echo Done testing',
  prebuild: 'rm -rf dist',
  build: 'tsc',
  postbuild: 'echo Build complete'
}
*/
```

### Common Script Patterns / 常見腳本模式

```typescript
// Development workflow scripts
const devScripts = {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint . --ext .ts,.tsx",
  "type-check": "tsc --noEmit",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "precommit": "lint-staged",
};

// Sorting keeps related scripts together while maintaining lifecycle order
const sorted = sortPackageJsonScripts(devScripts);
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

### Options Detail / 選項詳解

| Option | Type | Description |
|--------|------|-------------|
| `otherScriptNames` | `Set<string>` | Additional script names to treat as "other" scripts, avoiding incorrect parsing |
| `defaultNpmScriptsOrder` | `Set<string>` | Custom script order for grouping/sorting |
| `omitKeyFn` | `Function` | Custom function to extract the base key from a script name |
| `sortKeyFn` | `Function` | Custom sort function for comparing script keys |

## Use Cases / 應用情境

### CI/CD Pipeline / CI/CD 流程

Use in CI/CD pipelines to ensure consistent script ordering across team members.

```typescript
import sortPackageJsonScripts from 'sort-package-json-scripts';
import * as fs from 'fs';

// Read package.json
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

// Sort scripts
pkg.scripts = sortPackageJsonScripts(pkg.scripts);

// Write back
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
```

### Pre-commit Hook / 預提交鉤子

Automatically sort scripts before commits to maintain consistency.

```typescript
// .git/hooks/pre-commit
import sortPackageJsonScripts from 'sort-package-json-scripts';
import { execSync } from 'child_process';

const pkg = JSON.parse(execSync('npm pkg get scripts').toString());
const sorted = sortPackageJsonScripts(pkg.scripts);
execSync(`npm pkg set scripts=${JSON.stringify(sorted)}`);
```

### Monorepo Package Management / Monorepo 套件管理

Sort scripts across multiple packages in a monorepo.

```typescript
import sortPackageJsonScripts from 'sort-package-json-scripts';

const packages = ['packages/core', 'packages/ui', 'packages/utils'];

packages.forEach(pkgPath => {
  const pkg = require(`./${pkgPath}/package.json`);
  pkg.scripts = sortPackageJsonScripts(pkg.scripts);
  // Write back to package.json
});
```

## Features / 功能

- **NPM Lifecycle Order**: Follows npm lifecycle scripts order by default (serve, start, dev, test, build, publish, etc.)
- **Script Grouping**: Groups related scripts (pre, post) together in correct order
- **Customizable**: Supports custom sort order, key extraction, and sorting functions
- **TypeScript Support**: Full TypeScript type definitions included
- **Zero Dependencies**: Minimal runtime dependencies

- **NPM 生命週期順序**：預設遵循 npm 生命週期腳本順序（serve, start, dev, test, build, publish 等）
- **腳本分組**：將相關腳本（pre、post）按照正確順序分組在一起
- **可自定義**：支援自定義排序順序、鍵值提取和排序函式
- **TypeScript 支援**：包含完整的 TypeScript 類型定義
- **零依賴**：最小的執行期依賴

## NPM Lifecycle Scripts Order / NPM 生命週期腳本順序

The library follows this default order:

1. **Development**: serve, start, dev, restart, stop
2. **Quality Assurance**: review, coverage, lint, test
3. **Installation**: preinstallOnly, install, postinstallOnly, preuninstallOnly, uninstall, postuninstallOnly
4. **Build**: build, storybook, analyze, link
5. **Version Management**: ci, npm, yarn, pnpm, lerna, ws, version, major, minor, patch, prerelease
6. **Publishing**: prepareOnly, prepublish, prepare, prepublishOnly, prepack, pack, postpack, publish, postpublish, postpublishOnly, shrinkwrap, dependencies

## API Reference / API 參考

### `sortPackageJsonScripts(scripts, options?)`

Sorts the scripts object and returns a new sorted object.

排序 scripts 物件並返回新的排序物件。

| Parameter | Type | Description |
|-----------|------|-------------|
| `scripts` | `Record<string, any>` | The scripts object to sort |
| `options` | `ISortPackageJsonScriptsOptions` | Optional sorting options |

### Return Value / 返回值

Returns a new sorted scripts object (does not modify original).

返回新的排序後 scripts 物件（不會修改原始物件）。

## Related / 相關套件

- [sort-package-json](https://www.npmjs.com/package/sort-package-json) - Sort package.json
- [sort-object-keys2](https://www.npmjs.com/package/sort-object-keys2) - Sort object keys

## License / 授權

ISC © bluelovers
