# @yarn-tool/sort-lerna-json

> Sort lerna.json configuration file with consistent key ordering
> 排序 lerna.json 配置檔案，確保鍵值順序一致

[![NPM version](https://img.shields.io/npm/v/@yarn-tool/sort-lerna-json.svg)](https://www.npmjs.com/package/@yarn-tool/sort-lerna-json)
[![License](https://img.shields.io/npm/l/@yarn-tool/sort-lerna-json.svg)](https://github.com/bluelovers/ws-yarn-workspaces/blob/master/packages/@yarn-tool/sort-lerna-json/LICENSE)

## Description / 描述

This module provides utilities for sorting lerna.json configuration files.
It ensures consistent key ordering for better readability and version control.

此模組提供排序 lerna.json 配置檔案的工具函式。
確保鍵值順序一致，提高可讀性和版本控制友好性。

## Installation / 安裝

```bash
# Using yarn
yarn add @yarn-tool/sort-lerna-json

# Using yarn-tool
yarn-tool add @yarn-tool/sort-lerna-json

# Using yt (yarn-tool alias)
yt add @yarn-tool/sort-lerna-json

# Using npm
npm install @yarn-tool/sort-lerna-json
```

## Usage / 使用方式

### sortLernaJson(json)

Sort a lerna.json configuration object.

排序 lerna.json 配置物件。

```typescript
import sortLernaJson from '@yarn-tool/sort-lerna-json';

const lernaConfig = {
  version: '1.0.0',
  packages: ['packages/*'],
  npmClient: 'yarn',
  command: {
    version: { bump: 'minor' },
    publish: { concurrency: 4 },
  },
};

const sorted = sortLernaJson(lernaConfig);
// Returns object with keys in order: workspaces, packages, command, npmClient, useWorkspaces, version
```

### sortLernaJsonFile(file)

Sort a lerna.json file and write it back.

排序 lerna.json 檔案並寫回。

```typescript
import { sortLernaJsonFile } from '@yarn-tool/sort-lerna-json';

// Sort lerna.json in the current directory
sortLernaJsonFile('./lerna.json');
```

### sortLernaJsonCommand(value)

Sort the command section of lerna.json.

排序 lerna.json 的 command 區段。

```typescript
import { sortLernaJsonCommand } from '@yarn-tool/sort-lerna-json';

const command = {
  version: { bump: 'minor' },
  publish: { concurrency: 4 },
};

const sorted = sortLernaJsonCommand(command);
// Returns object with keys in order: publish, version, run, exec
```

### sortLernaJsonCommandEntry(value)

Sort a lerna command entry object.

排序 lerna 命令項物件。

```typescript
import { sortLernaJsonCommandEntry } from '@yarn-tool/sort-lerna-json';

const entry = {
  bump: 'minor',
  concurrency: 4,
  stream: true,
};

const sorted = sortLernaJsonCommandEntry(entry);
// Returns object with keys in order: concurrency, stream, loglevel, ignoreChanges, message, bump, ...
```

## Key Ordering / 鍵值順序

### Top-level keys / 頂層鍵

1. `workspaces`
2. `packages`
3. `command`
4. `npmClient`
5. `useWorkspaces`
6. `version`

### Command keys / 命令鍵

1. `publish`
2. `version`
3. `run`
4. `exec`

### Command entry keys / 命令項鍵

1. `concurrency`
2. `stream`
3. `loglevel`
4. `ignoreChanges`
5. `message`
6. `bump`
7. `noPrivate`
8. `conventionalCommits`
9. `conventionalGraduate`
10. `changelogPreset`

## API Reference / API 參考

| Function | Description |
|----------|-------------|
| `sortLernaJson(json)` | Sort a lerna.json configuration object |
| `sortLernaJsonFile(file)` | Sort a lerna.json file and write it back |
| `sortLernaJsonCommand(value)` | Sort the command section of lerna.json |
| `sortLernaJsonCommandEntry(value)` | Sort a lerna command entry object |

## Related / 相關套件

- [sort-object-keys2](https://www.npmjs.com/package/sort-object-keys2) - Sort object keys
- [@yarn-tool/write-package-json](https://github.com/bluelovers/ws-yarn-workspaces/tree/master/packages/@yarn-tool/write-package-json) - Write package.json files

## License / 授權

ISC © bluelovers

