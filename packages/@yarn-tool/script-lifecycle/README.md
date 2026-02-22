# @yarn-tool/script-lifecycle

> npm/yarn script lifecycle utility for handling pre/post script execution order
> 處理 npm/yarn 腳本生命週期 pre/post 執行順序的工具

[![NPM version](https://img.shields.io/npm/v/@yarn-tool/script-lifecycle.svg)](https://www.npmjs.com/package/@yarn-tool/script-lifecycle)
[![License](https://img.shields.io/npm/l/@yarn-tool/script-lifecycle.svg)](https://github.com/bluelovers/ws-yarn-workspaces/blob/master/packages/@yarn-tool/script-lifecycle/LICENSE)

## Description / 描述

This module provides utilities for handling npm/yarn script lifecycle hooks.
It helps determine the correct execution order of pre/post scripts for known lifecycle events.

此模組提供處理 npm/yarn 腳本生命週期鉤子的工具函式。
幫助確定已知生命週期事件的 pre/post 腳本正確執行順序。

## Supported Lifecycle Events / 支援的生命週期事件

| Event | Description |
|-------|-------------|
| `install` | npm install lifecycle scripts |
| `pack` | npm pack lifecycle scripts |
| `publish` | npm publish lifecycle scripts |

## Installation / 安裝

```bash
# Using yarn
yarn add @yarn-tool/script-lifecycle

# Using yarn-tool
yarn-tool add @yarn-tool/script-lifecycle

# Using yt (yarn-tool alias)
yt add @yarn-tool/script-lifecycle

# Using npm
npm install @yarn-tool/script-lifecycle
```

## Usage / 使用方式

### getLifecycleList(scriptName, includeSelf?, currentScriptOnly?)

Get the ordered list of lifecycle scripts for a given script name.

獲取指定腳本名稱的生命週期腳本有序列表。

```typescript
import { getLifecycleList } from '@yarn-tool/script-lifecycle';

// Get all scripts for install lifecycle
const installScripts = getLifecycleList('install');
// Returns: ['preinstall', 'install', 'postinstall', 'prepublish', 'prepare', 'preshrinkwrap', 'shrinkwrap', 'postshrinkwrap']

// Get all scripts for pack lifecycle (pack itself is excluded)
const packScripts = getLifecycleList('pack');
// Returns: ['prepublish', 'prepare', 'prepack', 'postpack']

// Get all scripts for publish lifecycle
const publishScripts = getLifecycleList('publish');
// Returns: ['prepublish', 'prepare', 'prepublishOnly', 'prepack', 'postpack', 'publish', 'postpublish']

// For unknown scripts, generates default pre/post hooks
const buildScripts = getLifecycleList('build');
// Returns: ['prebuild', 'build', 'postbuild']
```

### getLifecycle(scriptName, currentScriptOnly?)

Get the lifecycle configuration for any script name.

獲取任意腳本名稱的生命週期配置。

```typescript
import { getLifecycle } from '@yarn-tool/script-lifecycle';

const installConfig = getLifecycle('install');
// Returns: { name: 'install', ignoreSelf: false, before: ['preinstall'], after: ['postinstall', ...] }

const buildConfig = getLifecycle('build');
// Returns: { name: 'build', ignoreSelf: false, before: ['prebuild'], after: ['postbuild'] }
```

### isKnownLifecycleKey(scriptName)

Check if a script name is a known lifecycle key.

檢查腳本名稱是否為已知的生命週期鍵。

```typescript
import { isKnownLifecycleKey } from '@yarn-tool/script-lifecycle';

isKnownLifecycleKey('install');  // true
isKnownLifecycleKey('publish');  // true
isKnownLifecycleKey('build');    // false
```

### entryToList(entry, includeSelf?)

Convert a lifecycle entry to an ordered list of script names.

將生命週期配置項轉換為腳本名稱的有序列表。

```typescript
import { entryToList } from '@yarn-tool/script-lifecycle';

const entry = {
  name: 'custom',
  ignoreSelf: false,
  before: ['precustom'],
  after: ['postcustom']
};

const list = entryToList(entry);
// Returns: ['precustom', 'custom', 'postcustom']
```

## API Reference / API 參考

### Functions

| Function | Description |
|----------|-------------|
| `getLifecycleCore<K>(scriptName)` | Get the core lifecycle configuration for a known lifecycle script |
| `getLifecycle<K>(scriptName, currentScriptOnly?)` | Get the lifecycle configuration for any script name |
| `getLifecycleList<K>(scriptName, includeSelf?, currentScriptOnly?)` | Get the ordered list of lifecycle scripts |
| `entryToList<K>(entry, includeSelf?)` | Convert a lifecycle entry to an ordered list |
| `isKnownLifecycleKey<K>(scriptName)` | Check if a script name is a known lifecycle key |

### Types

| Type | Description |
|------|-------------|
| `ILifecycleEntry<K>` | Lifecycle entry configuration interface |
| `ILifecycleMapKeys` | Keys of known lifecycle events ('install', 'pack', 'publish') |
| `ILifecycleMapEntry<K>` | Lifecycle map entry type |
| `ILifecycleMap<K>` | Lifecycle map type |
| `ILifecycleList<K>` | Lifecycle script list type |

## Related / 相關套件

- [@yarn-tool/run-script-lifecycle](https://github.com/bluelovers/ws-yarn-workspaces/tree/master/packages/@yarn-tool/run-script-lifecycle) - Run lifecycle scripts

## License / 授權

ISC © bluelovers

