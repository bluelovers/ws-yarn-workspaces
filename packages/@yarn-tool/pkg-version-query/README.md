# @yarn-tool/pkg-version-query

Query package versions from npm registry with LRU cache support. Supports version ranges, npm: protocol, and semver syntax handling.

從 npm registry 查詢套件版本，支援 LRU 快取、版本範圍語法與 npm: 協議處理。

## Features / 功能特色

- 🔍 **Version Query** - Query package versions from npm registry
- 💾 **LRU Cache** - Cache query results to reduce API calls
- 📦 **Semver Support** - Handle semver version ranges (^, ~, etc.)
- 🔗 **npm: Protocol** - Support npm: alias protocol syntax
- ⚡ **Performance** - File-system backed cache for persistence

## Installation / 安裝

```bash
yarn add @yarn-tool/pkg-version-query
yarn-tool add @yarn-tool/pkg-version-query
yt add @yarn-tool/pkg-version-query
```

## Usage / 使用方式

### Basic Usage / 基本使用

```typescript
import queryVersionWithCache from '@yarn-tool/pkg-version-query';

// Query latest version
const version = await queryVersionWithCache('lodash');
console.log(version); // => '4.17.21'

// Query specific version range
const version = await queryVersionWithCache('typescript', '^4.0.0');
console.log(version); // => '4.9.5'

// Query with dist-tag
const version = await queryVersionWithCache('react', 'next');
```

### With Custom Cache Options / 自訂快取選項

```typescript
import { queryVersionWithCache, getCache } from '@yarn-tool/pkg-version-query';

// Get cache instance for advanced operations
const cache = getCache();

// Clear cache
cache.clear();

// Dump cache to filesystem
await cache.fsDump();

// Query with custom cache
const version = await queryVersionWithCache('lodash', 'latest', {
  cacheAgentOptions: {
    max: 1000, // Max items in cache
  }
});
```

### Query by npm package argument / 使用 npm 套件參數查詢

```typescript
import { queryVersionByNpmPackageArgWithCache } from '@yarn-tool/pkg-version-query';

// Query using npm package argument syntax
const version = await queryVersionByNpmPackageArgWithCache('lodash@^4.0.0');
```

## API Documentation / API 文件

### `queryVersionWithCache(name, targetVersion?, options?)`

Query package version with LRU cache.

**Parameters:**
- `name` (string) - Package name
- `targetVersion` (string, optional) - Target version or range, default: `'latest'`
- `options` (IOptionsQueryVersion, optional) - Query options
  - `notThrowError` (boolean) - Return undefined instead of throwing on error
  - `cacheAgent` (Cache) - Custom cache instance
  - `cacheAgentOptions` (IOptionsLRUCacheFS) - Cache configuration

**Returns:** `Bluebird<string>` - Promise resolving to version string

### `queryVersionByNpmPackageArgWithCache(input, options?)`

Query version using npm package argument syntax.

**Parameters:**
- `input` (string) - Package argument (e.g., `'lodash@^4.0.0'`)
- `options` (IOptionsQueryVersion, optional) - Query options

**Returns:** `Bluebird<string>` - Promise resolving to version string

### `getCache(options?)`

Get or create the global cache instance.

**Parameters:**
- `options` (IOptionsLRUCacheFS, optional) - Cache configuration

**Returns:** `Cache<string, ICachedVersionResult>`

### Types / 類型

```typescript
interface ICachedVersionResult {
  key: string;      // Cache key
  name: string;     // Package name
  version: string;  // Requested version/range
  result?: string;  // Resolved version (on success)
  error?: Error;    // Error object (on failure)
}

interface IOptionsQueryVersion {
  notThrowError?: boolean;
  cacheAgent?: Cache<string, ICachedVersionResult>;
  cacheAgentOptions?: IOptionsLRUCacheFS<string, ICachedVersionResult>;
}
```

## Configuration / 設定

本套件沒有設定檔 (Config File)，行為完全由查詢函式傳入的 `options`（`IOptionsQueryVersion`）決定：

| 選項 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `notThrowError` | `boolean` | `false` | 查詢失敗時回傳 `undefined` 而非丟出例外 (Return `undefined` instead of throwing) |
| `cacheAgent` | `Cache<string, ICachedVersionResult>` | 內建單例 (Built-in Singleton) | 自訂快取實例 (Cache Instance)，傳入後即不使用內建快取 |
| `cacheAgentOptions` | `IOptionsLRUCacheFS<string, ICachedVersionResult>` | 見下方預設值 | 傳給 `lru-cache-fs2` 的快取設定 |

其餘欄位會原樣轉交給底層的 `package-json`（例如自訂 npm registry 的相關選項）。

快取 (Cache) 的行為由 `initCache()` 決定：

- 快取目錄由 `cache-path` 依序嘗試 `findYarnCachePath` → `findNpmCachePath` → `findOSTempPath` → `findPkgModulePath`，並以套件名稱 `@yarn-tool/pkg-version-query` 作為快取名稱 (Cache Name)。
- `max` 未設定或 `<= 100` 時會被提升為 `1000`，避免快取過小導致頻繁的 registry 查詢。
- `maxAge` 未設定或 `<= 1 分鐘` 時會被提升為 `10 分鐘`，避免版本資料過期過快。
- `getCache()` 回傳模組層級的單例 (Module-level Singleton)，首次建立後重複使用；若需完全隔離的快取，請自行傳入 `cacheAgent`。

```typescript
import { queryVersionWithCache } from '@yarn-tool/pkg-version-query';

const version = await queryVersionWithCache('lodash', 'latest', {
  notThrowError: true,
  cacheAgentOptions: {
    max: 1000,
    maxAge: 10 * 60 * 1000,
  },
});
```

This module has no config file; everything is driven by the `options` passed to the query functions. The cache directory is resolved in order: yarn cache → npm cache → OS temp dir → node_modules path. `max` is raised to `1000` and `maxAge` to `10 minutes` when unset or below the built-in floors, and `getCache()` returns a module-level singleton unless you supply your own `cacheAgent`.

## Related Packages / 相關套件

- [@yarn-tool/ncu](../ncu) - npm-check-updates wrapper using this package
- [package-json](https://github.com/sindresorhus/package-json) - Underlying npm registry client
- [lru-cache-fs2](https://github.com/bluelovers/lru-cache-fs2) - File-system backed LRU cache

## License / 授權

ISC