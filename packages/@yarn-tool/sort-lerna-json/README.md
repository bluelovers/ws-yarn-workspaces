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

## Features / 功能

- **Three-level Sorting / 三層排序**：命令項（Command entry）、command 區段、頂層鍵依序由內而外排序。
  Sorts command entries, the `command` section and top-level keys inside-out.
- **In-place Sorting / 原地排序**：以 `useSource: true` 回傳同一個物件，呼叫端可直接沿用。
  Returns the same object via `useSource: true`, convenient for callers.
- **File Helper / 檔案工具**：`sortLernaJsonFile()` 讀取、排序並寫回 lerna.json。
  `sortLernaJsonFile()` reads, sorts and writes lerna.json back.
- **Consistent Diff / 一致的 Diff**：鍵順序固定，避免版本控制中出現無關的行交換。
  A fixed key order avoids meaningless line swaps in version control diffs.

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

## API Documentation / API 文件

| Function | Description |
|----------|-------------|
| `sortLernaJson(json)` | Sort a lerna.json configuration object |
| `sortLernaJsonFile(file)` | Sort a lerna.json file and write it back |
| `sortLernaJsonCommand(value)` | Sort the command section of lerna.json |
| `sortLernaJsonCommandEntry(value)` | Sort a lerna command entry object |

- 所有函式皆為泛型（Generic）回傳與輸入同型別的物件，且採原地（In-place）排序。
  All functions are generic and return the same type as their input; sorting is in place.
- 預設匯出為 `sortLernaJson`，亦可以具名方式匯入。
  The default export is `sortLernaJson`, which is also importable as a named export.

相關原始碼 / Source：[index.ts](index.ts)

## Configuration / 設定

本套件沒有執行期設定選項；順序表以常數形式寫在 [index.ts](index.ts) 內：

This package has no runtime options; the order lists are hard-coded in [index.ts](index.ts):

| 層級 / Level | 順序 / Order |
| --- | --- |
| 頂層鍵 / Top-level keys | `workspaces` → `packages` → `command` → `npmClient` → `useWorkspaces` → `version` |
| Command 區段 / section | `publish` → `version` → `run` → `exec` |
| 命令項鍵 / Command entry keys | `concurrency` → `stream` → `loglevel` → `ignoreChanges` → `message` → `bump` → `noPrivate` → `conventionalCommits` → `conventionalGraduate` → `changelogPreset` |

設定要點 / Configuration notes：

- 需要不同順序時，請自行以 [sort-object-keys2](https://www.npmjs.com/package/sort-object-keys2) 傳入客製 `keys`，本套件不接受順序選項。
  For a different order, pass your own `keys` to [sort-object-keys2](https://www.npmjs.com/package/sort-object-keys2); this package accepts no order options.
- **邊界情況（Edge case）**：`command` 在 lerna.json 中是可選欄位；直接呼叫 `sortLernaJson()` 或 `sortLernaJsonCommand(undefined)` 會因 `Object.values(undefined)` 拋出 TypeError，請先確認 `command` 已存在。
  `command` is optional in lerna.json; calling `sortLernaJson()` or `sortLernaJsonCommand(undefined)` throws a TypeError because of `Object.values(undefined)`, so make sure `command` exists first.
- **邊界情況（Edge case）**：`sortLernaJsonFile()` 會直接覆寫原檔，且檔案不存在時會拋出例外。
  `sortLernaJsonFile()` overwrites the file in place and throws when the file does not exist.

## Related / 相關套件

- [sort-object-keys2](https://www.npmjs.com/package/sort-object-keys2) - Sort object keys
- [@yarn-tool/write-package-json](https://github.com/bluelovers/ws-yarn-workspaces/tree/master/packages/@yarn-tool/write-package-json) - Write package.json files

相關文件 / Related documentation：[docs/sort-package-json-utils.md](../../../docs/sort-package-json-utils.md)

## License / 授權

ISC © bluelovers

