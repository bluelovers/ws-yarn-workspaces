# @yarn-tool/detect-yarnlock-version

偵測 (detect) yarn.lock 版本的工具：判斷鎖定檔 (lockfile) 屬於 yarn v1、Berry v2 或 v3 格式。

## 簡介 (Introduction)

`@yarn-tool/detect-yarnlock-version` 用來判斷一份 yarn.lock 的格式版本，回傳 `EnumDetectYarnLock` 列舉值（`v1` / `v2` / `v3` / `unknown`，定義於 `@yarn-tool/yarnlock-types`）。

偵測採兩段策略：先讀取檔案開頭的標頭文字 (header) 做快速比對（`# yarn lockfile v1` 或 `__metadata` 的 `version` 欄位），失敗時再實際解析內容重試；也可直接傳入已解析的物件或解析結果。這樣的分層設計讓一般情況只需讀取前 160 bytes 即可完成判斷。

## 特色 (Features)

- 支援多種輸入：原始內容 (`Buffer` / `string`)、檔案路徑、目錄路徑、已解析物件 (parsed object) 與解析結果。
- 快速標頭比對只讀取前 160 bytes，避免整份 lockfile 的解析成本。
- 標頭比對失敗時自動退回解析比對 (parse fallback)，涵蓋沒有標準標頭的情況。
- 可回傳偵測方式（`simple` / `parse_raw` / `unknown`）的進階版本，便於除錯。

## 安裝 (Installation)

```bash
yarn add @yarn-tool/detect-yarnlock-version
yarn-tool add @yarn-tool/detect-yarnlock-version
yt add @yarn-tool/detect-yarnlock-version
```

## 用法 (Usage)

```ts
import detectYarnLockVersion, { detectYarnLockVersionByFile, detectYarnLockVersionByDir } from '@yarn-tool/detect-yarnlock-version';
import { EnumDetectYarnLock } from '@yarn-tool/yarnlock-types';

// 直接以內容偵測
const verType = detectYarnLockVersion(readFileSync('yarn.lock'));

if (verType === EnumDetectYarnLock.v1)
{
	// yarn v1
}

// 以檔案路徑或目錄路徑偵測
detectYarnLockVersionByFile('yarn.lock');
detectYarnLockVersionByDir('packages/example');
```

## API 文件 (API Documentation)

### `detectYarnLockVersion(buf: Buffer | string): EnumDetectYarnLock`

預設匯出 (default export)。判斷 lockfile 內容的格式版本，失敗時回傳 `EnumDetectYarnLock.unknown`。

同檔案另匯出進階變體：

- `_detectYarnLockVersionCore(input)` — 回傳 `{ verType, detectType, input }`，其中 `detectType` 指出是標頭快速比對 (`simple`)、解析比對 (`parse_raw`) 還是無法判定 (`unknown`)。
- `_detectYarnLockVersionSimple(buf)` — 僅以開頭標頭判斷，不解析內容。
- `_tryParse(buf)` / `_tryParseObject(obj)` — 嘗試解析並只接受 v2/v3 結果。

### `detectYarnLockVersionByFile(file: string): EnumDetectYarnLock`

開啟指定檔案並只讀取前 160 bytes 進行偵測，因此不需載入整份 lockfile。

### `detectYarnLockVersionByDir(dir: string): EnumDetectYarnLock`

以 `dir/yarn.lock` 呼叫 `detectYarnLockVersionByFile`。

### `detectYarnLockVersionByObject(yarnLockObject): EnumDetectYarnLock`

由已解析的物件判斷：先看 `__metadata.version`，再依欄位特徵 (v1 的 `resolved` / v2、v3 的 `resolution`、`linkType`) 交叉驗證。

### `detectYarnLockVersionByParsed(parsedObject): EnumDetectYarnLock | undefined`

從 `@yarn-tool/yarnlock-parse-raw` 類別的解析結果讀取 `verType`；輸入不是標準結構時回傳 `undefined`。

### `detectYarnLockVersionWithMetadata(yarnLockObject)`

位於 `lib/detectYarnLockVersionWithMetadata` 子模組（未由套件根目錄重新匯出）。只根據 `__metadata.version` 判斷：`4` / `5` → `v2`、`6` 及更新版本 → `v3`；版本欄位存在但無法歸類時回傳 `unknown`。

## 設定 (Configuration)

本套件沒有設定選項；所有函式皆直接由輸入內容判斷格式。判斷結果的列舉值 `EnumDetectYarnLock` 與 `EnumDetectYarnLockInputType` 定義於相依套件 `@yarn-tool/yarnlock-types`。
