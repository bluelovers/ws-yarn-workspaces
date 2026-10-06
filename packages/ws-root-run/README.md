# ws-root-spawn

在工作區 (Workspace) 根目錄執行 `run` / `exec` 指令的工具，可透過命令列或 API 呼叫，並自動找出 yarn workspace 的根目錄作為工作目錄 (Working Directory)。

當前版本：`1.0.56`

## Features

- **自動尋找根目錄**：依賴 [find-yarn-workspace-root2](../find-yarn-workspace-root2) 自動向上尋找 workspace 根目錄
- **四種呼叫方式**：`run` / `exec` 各提供同步 (Sync) 與非同步 (Async) 版本
- **多 npm 用戶端**：可指定 `yarn`（預設）、`npm`、`lerna` 或任意指令名稱
- **可透傳選項**：`spawnOptions` 可覆寫 `stdio`、`env` 等 child process (子行程) 設定
- **CLI 指令**：安裝後即可使用 `ws-root-spawn run <script>` 與 `ws-root-spawn exec <cmd>`

## Installation

```bash
yarn add ws-root-spawn
yarn-tool add ws-root-spawn
yt add ws-root-spawn
```

## Usage

### 命令列 (CLI)

```bash
# 在工作區根目錄執行 package.json 的 scripts
ws-root-spawn run build

# 在工作區根目錄執行任意指令
ws-root-spawn exec some-command --with-flags
```

- 第一個參數必須是 `run` 或 `exec`
- 其餘參數會原樣傳給對應的 npm 用戶端
- 第一個參數不是 `run` / `exec` 時會拋出 `Error`

### API

```typescript
import spawnWsRootRun, {
	spawnWsRootExec,
	spawnWsRootRunSync,
	spawnWsRootExecSync,
} from 'ws-root-spawn';

// 非同步：在工作區根目錄執行 yarn run build
await spawnWsRootRun(['build']);

// 非同步：指定 cwd 與 npm 用戶端
await spawnWsRootExec(['tsc', '-v'], {
	cwd: process.cwd(),
	npmClient: 'npm',
});

// 同步版本
spawnWsRootRunSync(['build'], {
	spawnOptions: { stdio: 'inherit' },
});
```

## API Documentation

### spawnWsRootRun(argv, opts?)

在工作區根目錄以非同步方式執行 `<npmClient> run ...argv`，回傳 `SpawnASyncReturnsPromise<Buffer>`（本身為 Promise）。

### spawnWsRootExec(argv, opts?)

在工作區根目錄以非同步方式執行 `<npmClient> exec ...argv`，回傳 `SpawnASyncReturnsPromise<Buffer>`（本身為 Promise）。

### spawnWsRootRunSync(argv, opts?)

`spawnWsRootRun` 的同步版本，回傳 `SpawnSyncReturns<Buffer>`。

### spawnWsRootExecSync(argv, opts?)

`spawnWsRootExec` 的同步版本，回傳 `SpawnSyncReturns<Buffer>`。

### 參數 (Parameters)

| 參數 | 型別 | 說明 |
|------|------|------|
| `argv` | `string[]` | 傳給 `run` / `exec` 的參數陣列（不含子指令本身） |
| `opts.cwd` | `string?` | 起始目錄，會先轉為 workspace 根目錄再執行 |
| `opts.npmClient` | [`INpmClient`](#type) | npm 用戶端，預設 `'yarn'` |
| `opts.spawnOptions` | `SpawnOptions` / `SpawnSyncOptions` | 其餘 child process 選項 |

#### Type

```typescript
export type INpmClient = string | 'npm' | 'yarn' | 'lerna';
```

### Default Export

`spawnWsRootRun` 作為預設匯出，因此 `require('ws-root-spawn')` 可直接取得 `run` 版本。

## Configuration

本套件不需設定檔，所有行為皆由參數控制：

| 來源 | 說明 |
|------|------|
| `opts.cwd` | 起始目錄；未提供時使用 `process.cwd()`，再由 `find-yarn-workspace-root2` 向上解析為 workspace 根目錄 |
| `opts.npmClient` | 決定執行的指令名稱，預設 `yarn`；未安裝對應用戶端時會由 spawn 回報錯誤 |
| `opts.spawnOptions` | 展開於預設值之後，因此可覆寫 `stdio: 'inherit'`、`env`、`shell` 等設定；`cwd` 則固定以解析出的根目錄為準 |
| CLI 第一個參數 | 必須為 `run` 或 `exec`，決定呼叫同步的哪一個函式 |

> 找不到 workspace 根目錄時，`find-yarn-workspace-root2` 會回傳 `null`，此時 `spawn` 的 `cwd` 為 `null`，子行程將回退至程序的工作目錄。

## Related

- [find-yarn-workspace-root2](../find-yarn-workspace-root2) - 尋找 workspace 根目錄的演算法
- [docs/find-path-tools.md](../docs/find-path-tools.md) - 各種尋找根目錄工具的比較
