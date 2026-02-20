# @yarn-tool/fnm-detect

fnm (Fast Node Manager) 環境偵測模組，用於偵測當前 Node.js 程序是否在 fnm 管理的環境中執行。
A module for detecting whether the current Node.js process is running within an fnm-managed environment.

## 安裝 (Installation)

```bash
# 使用 yarn / Using yarn
yarn add @yarn-tool/fnm-detect

# 使用 yarn-tool / Using yarn-tool
yarn-tool add @yarn-tool/fnm-detect
# yt 是 yarn-tool 的別名 / yt is an alias for yarn-tool
yt add @yarn-tool/fnm-detect

# 使用 pnpm / Using pnpm
pnpm add @yarn-tool/fnm-detect

# 使用 npm / Using npm
npm install @yarn-tool/fnm-detect
```

## 使用範例 (Usage Example)

```typescript
import {
  detectFnmByExecPath,
  detectFnmByEnv,
  detectFnmByAll,
  isFNM
} from '@yarn-tool/fnm-detect';

// 簡單檢查是否在 fnm 環境中 / Simple check for fnm environment
if (isFNM()) {
  console.log('Running under fnm');
}

// 透過 execPath 偵測 / Detect via execPath
const result = detectFnmByExecPath();
console.log(result);
// {
//   isFnm: true,
//   detectedBy: 'execpath',
//   fnmPathType: 'fnm_multishells',
//   fnmPath: 'C:/Users/User/AppData/Local/fnm_multishells/20128_1771488837711',
//   fnmPathReal: 'C:/Users/User/AppData/Roaming/fnm/node-versions/v24.13.1/installation',
//   fnmDir: 'C:/Users/User/AppData/Roaming/fnm',
//   multishellKey: '20128_1771488837711',
//   version: 'v24.13.1',
//   ...
// }

// 透過環境變數偵測 / Detect via environment variables
const envResult = detectFnmByEnv(process.env);

// 結合兩種偵測方式 / Combine both detection methods
const allResult = detectFnmByAll();
console.log(allResult.detectedBy); // ['execpath', 'env'] 或 ['execpath'] 或 ['env'] 或 []
```

## API

### `detectFnmByExecPath(execPath?, nodeVersion?)`

透過 Node.js 執行檔路徑偵測 fnm 環境。

### `detectFnmByEnv(env?, nodeVersion?)`

透過環境變數 (FNM_DIR, FNM_MULTISHELL_PATH) 偵測 fnm 環境。

### `detectFnmByAll(pc?)`

同時使用 execPath 與環境變數兩種方式偵測。

### `isFNM()`

簡單檢查當前程序是否在 fnm 下執行，返回布林值。

### `detectFnmPathType(fnmPath, inDeep?)`

分析 fnm 路徑類型 (fnm_multishells, aliases, node-versions)。

## 回傳結果類型 (Result Types)

### IDetectFnmByResult

| 屬性 | 說明 / Description |
|------|-------------------|
| `isFnm` | 是否偵測到 fnm 環境 / Whether fnm is detected |
| `detectedBy` | 偵測來源 (execpath/env) / Detection source |
| `fnmPathType` | 路徑類型 / Path type |
| `fnmPath` | fnm 路徑 / fnm path |
| `fnmPathReal` | 真實路徑（解析符號連結後）/ Real path after resolving symlinks |
| `fnmDir` | fnm 主目錄 / fnm main directory |
| `multishellPath` | Multishell 路徑 / Multishell path |
| `multishellKey` | Multishell 鍵值 / Multishell key |
| `version` | Node.js 版本 / Node.js version |
| `installationPath` | 安裝路徑 / Installation path |
| `aliasDefaultPath` | 預設別名路徑 / Default alias path |

## License

ISC