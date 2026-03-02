# @yarn-tool/ncu

A wrapper tool for npm-check-updates that checks and updates package dependencies with semver support and yarn.lock integration.

封裝 npm-check-updates 的依賴版本檢查與更新工具，支援 semver 版本範圍處理與 yarn.lock 整合。

## Features / 功能特色

- 🔍 **Dependency Version Checking** - Check for available updates in package.json
  - 檢查 package.json 中可用的依賴更新
- 📦 **Semver Range Support** - Handle semver version ranges (^, ~, etc.)
  - 處理 semver 版本範圍（^、~ 等）
- 🔗 **Yarn.lock Integration** - Update resolutions in yarn.lock files
  - 更新 yarn.lock 檔案中的 resolutions
- 🚀 **Version Caching** - Cache remote version queries for better performance
  - 快取遠端版本查詢以提升效能
- 📊 **Table Output** - Display update results in a formatted table
  - 以格式化的表格顯示更新結果

## Installation / 安裝

Using yarn:

```bash
yarn add @yarn-tool/ncu
```

Using yarn-tool:

```bash
yarn-tool add @yarn-tool/ncu
yt add @yarn-tool/ncu
```

Using pnpm:

```bash
pnpm add @yarn-tool/ncu
```

Using npm:

```bash
npm install @yarn-tool/ncu
```

## Usage / 使用方式

### Programmatic API / 程式化使用

```typescript
import { npmCheckUpdates, checkResolutionsUpdate } from '@yarn-tool/ncu';

/**
 * 檢查並更新 package.json 中的依賴版本
 * Check and update dependencies in package.json
 */
const result = await npmCheckUpdates(cache, {
  json_old: packageJson,
  upgrade: true,
});

console.log(result.list_updated); // { "package-name": "new-version" }
console.log(result.json_changed); // true if any updates / 如果有任何更新則為 true

/**
 * 檢查並更新 yarn.lock 中的 resolutions
 * Check and update resolutions in yarn.lock
 */
const resolutionResult = await checkResolutionsUpdate(
  resolutions,
  yarnlockContent,
  options
);
```

### CLI Options / 命令列選項

The package provides yargs integration for CLI tools:
此套件提供 yargs 整合供 CLI 工具使用：

```typescript
import { setupNcuToYargs } from '@yarn-tool/ncu';
import yargs from 'yargs';

const parser = setupNcuToYargs(yargs);
```

#### Available Options / 可用選項

| Option | Alias | Description |
|--------|-------|-------------|
| `--dep` | | Check only specific dependency sections (prod\|dev\|peer\|optional\|bundle) / 只檢查特定依賴區段 |
| `--minimal` | `-m` | Don't upgrade versions already satisfied by semver range / 不升級已符合 semver 範圍的版本 |
| `--newest` | `-n` | Find newest versions instead of latest stable / 尋找最新版本而非最新穩定版 |
| `--greatest` | `-g` | Find highest versions available / 尋找可用的最高版本 |
| `--upgrade` | `-u` | Overwrite package file / 覆寫套件檔案 |
| `--registry` | `-r` | Specify third-party npm registry / 指定第三方 npm registry |
| `--silent` | `-s` | Don't output anything / 不輸出任何內容 |
| `--semverLevel` | | Find highest version within "major" or "minor" / 在 "major" 或 "minor" 範圍內尋找最高版本 |
| `--removeRange` | | Remove version ranges from final package version / 從最終套件版本移除版本範圍 |
| `--dedupe` | | Remove upgrade module from resolutions / 從 resolutions 移除升級模組 |
| `--filter` | | Include only packages matching the given pattern / 只包含符合給定模式的套件 |

## API Reference / API 參考

### `npmCheckUpdates(cache, options)`

Check and update package dependencies.
檢查並更新套件依賴。

**Parameters / 參數：**

| Parameter | Type | Description |
|-----------|------|-------------|
| `cache` | `Partial<IWrapDedupeCache>` | Cache object for version data / 版本資料的快取物件 |
| `options` | `IOptionsNpmCheckUpdates` | Configuration options / 配置選項 |
| `options.json_old` | `IPackageJson` | Current package.json content / 當前 package.json 內容 |
| `options.upgrade` | `boolean` | Whether to apply updates / 是否套用更新 |
| `options.cwd` | `string` | Working directory / 工作目錄 |

**Returns / 回傳：** `Promise<IOptionsNpmCheckUpdates>`

**Result Properties / 結果屬性：**

| Property | Type | Description |
|----------|------|-------------|
| `json_changed` | `boolean` | Whether any updates were made / 是否有進行任何更新 |
| `list_updated` | `Record<string, string>` | Map of updated packages / 更新套件的對應表 |
| `current` | `IDependency` | Current versions before update / 更新前的當前版本 |

### `checkResolutionsUpdate(resolutions, yarnlock, options)`

Check and update resolutions in yarn.lock.
檢查並更新 yarn.lock 中的 resolutions。

**Parameters / 參數：**

| Parameter | Type | Description |
|-----------|------|-------------|
| `resolutions` | `IDependency` | Package map of resolutions / resolutions 的套件對應表 |
| `yarnlock` | `string \| Buffer \| object` | Yarn.lock content / Yarn.lock 內容 |
| `options` | `IOptionsNpmCheckUpdates` | Configuration options / 配置選項 |

**Returns / 回傳：** `Promise<ICheckResolutionsUpdateReturn>`

**Result Properties / 結果屬性：**

| Property | Type | Description |
|----------|------|-------------|
| `yarnlock_changed` | `boolean` | Whether yarn.lock was modified / yarn.lock 是否被修改 |
| `yarnlock_new` | `string` | Updated yarn.lock content / 更新後的 yarn.lock 內容 |
| `deps` | `object` | Dependency update information / 依賴更新資訊 |

## Exported Modules / 匯出模組

| Module | Path | Description |
|--------|------|-------------|
| `types` | `./lib/types` | Type definitions / 類型定義 |
| `store` | `./lib/store` | Version cache store / 版本快取儲存 |
| `cli` | `./lib/cli` | CLI options setup / CLI 選項設定 |
| `remote` | `./lib/remote` | Remote package queries / 遠端套件查詢 |
| `util` | `./lib/util` | Utility functions / 工具函數 |
| `options` | `./lib/options` | Options processing / 選項處理 |
| `update` | `./lib/update` | Update functions / 更新函數 |

## Related Packages / 相關套件

- [@yarn-tool/ncu-ws](../ncu-ws) - Workspace support for ncu / ncu 的 workspace 支援
- [npm-check-updates](https://github.com/raineorshine/npm-check-updates) - The underlying tool / 底層工具

## License / 授權

ISC