# @yarn-tool/update-notifier

CLI 工具更新通知器，在適當時機提醒使用者有新版本可用  
CLI tool update notifier that reminds users of new versions at appropriate times

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

## API

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

## 檢查機制 / Check Mechanism

此模組會在以下情況下**跳過**更新檢查：

This module **skips** update checks in the following conditions:

1. **CI 環境 / CI Environment** - 透過 `ci-info` 檢測 / Detected via `ci-info`
2. **環境變數 / Environment Variable** - `NO_UPDATE_NOTIFIER` 已設定 / `NO_UPDATE_NOTIFIER` is set
3. **測試環境 / Test Environment** - `NODE_ENV` 為 `test` / `NODE_ENV` is `test`
4. **NPX/YPX 環境 / NPX/YPX Environment** - 透過 `@yarn-tool/is-npx` 檢測 / Detected via `@yarn-tool/is-npx`

## 預設選項 / Default Options

```typescript
{
  shouldNotifyInNpmScript: false,  // 不在 npm script 中顯示 / Don't show in npm script
  updateCheckInterval: 1000 * 60 * 60 * 24 * 7,  // 每 7 天檢查一次 / Check every 7 days
}
```

## 相關套件 / Related Packages

- [`@yarn-tool/is-npx`](https://www.npmjs.com/package/@yarn-tool/is-npx) - 檢測是否在 NPX/YPX 環境中 / Detect if running in NPX/YPX environment
- [`update-notifier`](https://www.npmjs.com/package/update-notifier) - 底層更新通知功能 / Underlying update notification functionality

## 授權 / License

ISC
