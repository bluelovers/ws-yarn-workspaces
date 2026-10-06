# @yarn-tool/update-notifier

CLI 工具更新通知器，在適當時機提醒使用者有新版本可用  
CLI tool update notifier that reminds users of new versions at appropriate times

## Features / 功能特色

- 🛡️ **Smart Skip / 智能跳過** - Automatically skips checks in CI, test or npx environments
  - 自動於 CI、測試與 npx 環境中跳過更新檢查
- ⏱️ **Interval Control / 間隔控制** - Configurable update check interval, default once every 7 days
  - 可自訂更新檢查間隔 (Update Check Interval)，預設每 7 天一次
- 🔧 **Force Check / 強制檢查** - Bypass environment restrictions when you need an immediate check
  - 需要立即檢查時可忽略環境限制強制執行
- 🧩 **Flexible Input / 靈活輸入** - Accepts a directory path or an array of path segments
  - 支援傳入目錄路徑或路徑片段陣列 (Path Segments Array)
- 🔕 **npm script Aware / npm script 感知** - Suppresses notifications inside npm scripts by default
  - 預設不在 npm script 中顯示通知

## 安裝 / Install

```bash
npm install @yarn-tool/update-notifier
```

或 / or

```bash
yarn add @yarn-tool/update-notifier
```

或 / or

```bash
pnpm add @yarn-tool/update-notifier
```

## 使用方式 / Usage

### 基本用法 / Basic Usage

```typescript
import { updateNotifier } from '@yarn-tool/update-notifier';

// 在 CLI 工具入口處呼叫 / Call at CLI tool entry point
updateNotifier(__dirname);
```

### 進階用法 / Advanced Usage

```typescript
import { updateNotifier } from '@yarn-tool/update-notifier';

// 強制檢查（忽略環境限制）/ Force check (ignore environment restrictions)
updateNotifier(__dirname, true);

// 使用路徑片段陣列 / Use path segments array
updateNotifier([__dirname, '..', '..']);

// 自訂通知選項 / Custom notification options
updateNotifier(__dirname, false, {
  updateCheckInterval: 1000 * 60 * 60 * 24, // 每天檢查一次 / Check once per day
  shouldNotifyInNpmScript: true, // 在 npm script 中也顯示通知 / Show notification in npm script
});
```

## API Documentation / API 文件

### `updateNotifier(__dirname, force?, inputNoticeOptions?)`

建立更新通知器，檢查套件是否有新版本並在適當時機通知使用者。  
Create an update notifier that checks if the package has a new version and notifies users at appropriate times.

**參數 / Parameters:**

| 參數 / Parameter | 型別 / Type | 必填 / Required | 說明 / Description |
|-----------------|------------|----------------|-------------------|
| `__dirname` | `string \| string[]` | 是 / Yes | 套件目錄路徑或路徑片段陣列 / Package directory path or path segments array |
| `force` | `boolean` | 否 / No | 是否強制檢查（忽略環境限制）/ Whether to force check (ignore environment restrictions) |
| `inputNoticeOptions` | `Settings & NotifyOptions` | 否 / No | 通知選項 / Notification options |

**回傳值 / Returns:** `IUpdateNotifierObject \| null` - Update Notifier 物件或 null / Update Notifier object or null

### `shouldCheckMaybe(__dirname)`

判斷是否應該檢查更新。  
Determine if should check for updates.

**參數 / Parameters:**

| 參數 / Parameter | 型別 / Type | 必填 / Required | 說明 / Description |
|-----------------|------------|----------------|-------------------|
| `__dirname` | `string` | 是 / Yes | 套件目錄路徑 / Package directory path |

**回傳值 / Returns:** `boolean` - 是否應該檢查更新 / Whether should check for updates

### `handleOptions(__dirname, force?, inputNoticeOptions?)`

正規化輸入並判斷是否該執行檢查 (Whether to run a check)。

**回傳值 / Returns:** `{ __dirname, force, inputNoticeOptions, doCheck }`
其中 `doCheck` 為 `force || !force && shouldCheckMaybe(__dirname)`，代表 `force` 為 true 時會略過所有環境限制。
Where `doCheck` is `force || !force && shouldCheckMaybe(__dirname)`, i.e. `force: true` bypasses every environment restriction.

### `notNpxMaybe`

`shouldCheckMaybe` 的別名 (Alias)，已標記 `@deprecated`，請改用 `shouldCheckMaybe`。
Marked `@deprecated`; use `shouldCheckMaybe` instead.

## Configuration / 設定方式

本套件的設定由三層組成：環境判斷 (Environment Detection)、預設通知選項 (Default Notification Options)，以及傳入 `update-notifier` 的其餘選項。
Configuration consists of three layers: environment detection, the default notification options, and the remaining options forwarded to `update-notifier`.

### Environment Detection / 環境偵測

此模組會在以下情況下**跳過**更新檢查：

This module **skips** update checks in the following conditions:

1. **CI 環境 / CI Environment** - 透過 `ci-info` 檢測 / Detected via `ci-info`
2. **環境變數 / Environment Variable** - `NO_UPDATE_NOTIFIER` 已設定 / `NO_UPDATE_NOTIFIER` is set
3. **測試環境 / Test Environment** - `NODE_ENV` 為 `test` / `NODE_ENV` is `test`
4. **NPX/YPX 環境 / NPX/YPX Environment** - 透過 `@yarn-tool/is-npx` 檢測 / Detected via `@yarn-tool/is-npx`

### Default Options / 預設選項

未指定時套用以下預設值（`inputNoticeOptions` 的欄位會覆寫它們）：
These defaults are applied unless overridden field-by-field by `inputNoticeOptions`:

```typescript
{
  shouldNotifyInNpmScript: false,  // 不在 npm script 中顯示 / Don't show in npm script
  updateCheckInterval: 1000 * 60 * 60 * 24 * 7,  // 每 7 天檢查一次 / Check every 7 days
}
```

### Pass-through Options / 透傳選項

`inputNoticeOptions` 的型別為 `Settings & NotifyOptions`，除上述兩個欄位外，
其餘欄位（例如通知框樣式、延遲顯示、自訂 registry 等）會原樣傳給底層的 `update-notifier`，
詳細清單請參考 [update-notifier 文件](https://github.com/sindresorhus/update-notifier#readme)。
`inputNoticeOptions` is typed as `Settings & NotifyOptions`; besides the two fields above,
every other field (notification box styling, deferred display, custom registry, etc.)
is forwarded verbatim to the underlying `update-notifier` — see the
[update-notifier documentation](https://github.com/sindresorhus/update-notifier#readme)
for the full list.

## 相關套件 / Related Packages

- [`@yarn-tool/is-npx`](https://www.npmjs.com/package/@yarn-tool/is-npx) - 檢測是否在 NPX/YPX 環境中 / Detect if running in NPX/YPX environment
- [`update-notifier`](https://www.npmjs.com/package/update-notifier) - 底層更新通知功能 / Underlying update notification functionality

## 授權 / License

ISC
