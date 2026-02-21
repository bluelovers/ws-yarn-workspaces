# @yarn-tool/ncu

A wrapper tool for npm-check-updates that checks and updates package dependencies with semver support and yarn.lock integration.

封裝 npm-check-updates 的依賴版本檢查與更新工具，支援 semver 版本範圍處理與 yarn.lock 整合。

## Features / 功能特色

- 🔍 **Dependency Version Checking** - Check for available updates in package.json
- 📦 **Semver Range Support** - Handle semver version ranges (^, ~, etc.)
- 🔗 **Yarn.lock Integration** - Update resolutions in yarn.lock files
- 🚀 **Version Caching** - Cache remote version queries for better performance
- 📊 **Table Output** - Display update results in a formatted table

## Installation / 安裝

```bash
yarn add @yarn-tool/ncu
yarn-tool add @yarn-tool/ncu
yt add @yarn-tool/ncu
```

## Usage / 使用方式

### Programmatic API / 程式化使用

```typescript
import { npmCheckUpdates, checkResolutionsUpdate } from '@yarn-tool/ncu';

// Check and update package.json dependencies
const result = await npmCheckUpdates(cache, {
  json_old: packageJson,
  upgrade: true,
});

console.log(result.list_updated); // { "package-name": "new-version" }
console.log(result.json_changed); // true if any updates

// Check and update resolutions in yarn.lock
const resolutionResult = await checkResolutionsUpdate(
  resolutions,
  yarnlockContent,
  options
);
```

### CLI Options / 命令列選項

The package provides yargs integration for CLI tools:

```typescript
import { setupNcuToYargs } from '@yarn-tool/ncu';
import yargs from 'yargs';

const parser = setupNcuToYargs(yargs);
```

#### Available Options / 可用選項

| Option | Alias | Description |
|--------|-------|-------------|
| `--dep` | | Check only specific dependency sections (prod\|dev\|peer\|optional\|bundle) |
| `--minimal` | `-m` | Don't upgrade versions already satisfied by semver range |
| `--newest` | `-n` | Find newest versions instead of latest stable |
| `--greatest` | `-g` | Find highest versions available |
| `--upgrade` | `-u` | Overwrite package file |
| `--registry` | `-r` | Specify third-party npm registry |
| `--silent` | `-s` | Don't output anything |
| `--semverLevel` | | Find highest version within "major" or "minor" |
| `--removeRange` | | Remove version ranges from final package version |
| `--dedupe` | | Remove upgrade module from resolutions |
| `--filter` | | Include only packages matching the given pattern |

## API Reference / API 參考

### `npmCheckUpdates(cache, options)`

Check and update package dependencies.

**Parameters:**
- `cache` - Cache object for version data
- `options` - Configuration options
  - `json_old` - Current package.json content
  - `upgrade` - Whether to apply updates
  - `cwd` - Working directory

**Returns:** Promise with update results

### `checkResolutionsUpdate(resolutions, yarnlock, options)`

Check and update resolutions in yarn.lock.

**Parameters:**
- `resolutions` - Package map of resolutions
- `yarnlock` - Yarn.lock content (string, Buffer, or parsed object)
- `options` - Configuration options

**Returns:** Promise with resolution update results

## Related Packages / 相關套件

- [@yarn-tool/ncu-ws](../ncu-ws) - Workspace support for ncu
- [npm-check-updates](https://github.com/raineorshine/npm-check-updates) - The underlying tool

## License / 授權

ISC