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

## API Reference / API 參考

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

## Related Packages / 相關套件

- [@yarn-tool/ncu](../ncu) - npm-check-updates wrapper using this package
- [package-json](https://github.com/sindresorhus/package-json) - Underlying npm registry client
- [lru-cache-fs2](https://github.com/bluelovers/lru-cache-fs2) - File-system backed LRU cache

## License / 授權

ISC