# @yarn-tool/semver-diff

> Colorize semver version differences with semantic colors for CLI output

## 簡介 / Introduction

此套件比較兩個語義化版本 (Semantic Versioning) 字串，並以語意顏色 (Semantic Colors) 標示差異發生的段落：major 差異為紅色 (Red)、minor 差異為青色 (Cyan)、patch 差異為綠色 (Green)。適合用於 CLI 的版本更新提示，讓使用者一眼看出變更是破壞性 (Breaking)、功能新增 (Feature) 或修補 (Patch)。

This package compares two semantic version strings and colorizes the segment where the difference occurs: major → red, minor → cyan, patch → green. It is handy for version update notices in CLIs, letting users tell a breaking change, a feature, or a patch at a glance.

原程式碼分割自 [npm-check-updates](https://github.com/raineorshine/npm-check-updates)。

Split from [npm-check-updates](https://github.com/raineorshine/npm-check-updates).

## 功能特色 / Features

- 🎨 **語意顏色 (Semantic Colors)** - 依 major/minor/patch 差異套用不同顏色 / Apply a different color per major/minor/patch difference
- 🔀 **萬用字元前綴保留** - `^` / `~` 前綴會被保留並顯示在輸出最前方 / `^` / `~` prefixes are preserved at the front of the output
- 🎛️ **顏色可自訂** - 可替換三段差異的顏色配置 / Customize the color triplet used for the three segments
- 📭 **可關閉 ANSI** - `stripAnsi` 可輸出純文字 / `stripAnsi` produces plain text
- 🔌 **可注入 chalk / console** - 傳入自己的 chalk 實例或 debug-color2 的 console / Pass your own chalk instance or a debug-color2 console

## 安裝 / Installation

```bash
# 使用 yarn / Using yarn
yarn add @yarn-tool/semver-diff

# 使用 yarn-tool / Using yarn-tool
yarn-tool add @yarn-tool/semver-diff
# yt 是 yarn-tool 的別名 / yt is an alias for yarn-tool
yt add @yarn-tool/semver-diff

# 使用 npm / Using npm
npm install @yarn-tool/semver-diff
```

## 使用方式 / Usage

```typescript
import { colorizeDiff, parseVersionsDiffCore } from '@yarn-tool/semver-diff';

// minor 有差異 → 變更段落以青色 (Cyan) 標示 / Minor differs → the changed segment is colorized cyan
colorizeDiff('1.2.3', '1.3.0');
// 回傳 '1.3.0'，其中 '3.0' 套用青色 / returns '1.3.0' with '3.0' in cyan

// ^ 前綴會被保留 / The `^` prefix is preserved
colorizeDiff('^1.0.0', '^1.2.3');
// 回傳 '^1.2.3'，其中 '2.3' 套用青色 / returns '^1.2.3' with '2.3' in cyan

// 需要純文字時關閉 ANSI (American National Standards Institute) 轉義 / Disable ANSI escapes for plain text
colorizeDiff('1.2.3', '2.0.0', { stripAnsi: true });
// '2.0.0'
```

## API 文件 / API Documentation

### `colorizeDiff(from, to, options?)`

比較兩個版本字串並回傳帶顏色的差異顯示字串。

Compare two version strings and return the colorized difference string.

```typescript
import { colorizeDiff } from '@yarn-tool/semver-diff';

colorizeDiff('1.2.3', '1.3.0'); // '1.3.0'（'3.0' 為青色 / cyan）
colorizeDiff('1.2.3', '1.2.3'); // 無差異時不套用顏色 / No color when the versions are equal
```

**參數 / Parameters:**

- `from` - 舊版本字串 / Old version string
- `to` - 新版本字串 / New version string
- `options` - 顯示選項 / Display options，詳見 [組態設定 / Configuration](#組態設定--configuration)

**回傳值 / Returns:** `string` - 差異顯示字串 / The colorized difference string

### `parseVersionsDiffCore(from, to, options?)`

回傳完整的差異分析物件（不套用顏色），適合需要自行處理版面的場合。

Returns the full difference-analysis object (without applying color), useful when you need custom formatting.

```typescript
import { parseVersionsDiffCore } from '@yarn-tool/semver-diff';

parseVersionsDiffCore('1.2.3', '1.3.0');
// {
//   versionOld: '1.2.3',
//   versionNew: '1.3.0',
//   partsOld: ['1', '2', '3'],
//   partsNew: ['1', '3', '0'],
//   index: 1,            // 差異發生在 minor / difference is in minor
//   comp: -1,            // 舊 < 新 / old < new
//   color: 'cyan',       // 對應 index 的顏色 / color for this index
//   _colors: ['red', 'cyan', 'green'],
//   leadingWildcard: '',
//   result: '1',         // 差異之前的前綴 / prefix before the difference
//   middot: '.',
//   resultAppend: '3.0'  // 從差異段落開始的其餘部分 / remainder from the changed segment
// }
```

### `colorizeDiffCore(from, to, options)`

低階版的著色函式，需要自行提供 `chalk` 或設定 `stripAnsi`（型別上要求 `chalk` 與 `stripAnsi` 至少擇一）。

Lower-level colorizer; you must provide `chalk` or set `stripAnsi` (the type requires at least one of the two).

```typescript
import { colorizeDiffCore } from '@yarn-tool/semver-diff';

colorizeDiffCore('1.2.3', '1.3.0', { stripAnsi: true }); // '1.3.0'
```

### `IParseVersionsDiffCore`

`parseVersionsDiffCore()` 的回傳型別。

The return type of `parseVersionsDiffCore()`.

| 欄位 / Field | 型別 / Type | 說明 / Description |
| --- | --- | --- |
| `index` | `number` | 差異發生的段落索引（0 = major、1 = minor、2 = patch）/ Segment index of the difference (0 = major, 1 = minor, 2 = patch) |
| `comp` | `1 \| 0 \| -1` | 舊版本相對新版本的比較結果 / Comparison of the old version against the new one |
| `color` | `IStylesColorNames` | 依 `index` 從 `_colors` 取出的顏色 / Color picked from `_colors` by `index` |
| `_colors` | `[三色元組]` | major/minor/patch 三段的顏色配置 / Color triplet for major/minor/patch |
| `leadingWildcard` | `string` | 被保留的 `^` / `~` 前綴 / Preserved `^` / `~` prefix |
| `result` | `string` | 差異之前的版本前綴 / Version prefix before the difference |
| `middot` | `string` | 連接用的 `.`，無差異段落時為空 / Connecting `.`, empty when there is no such segment |
| `resultAppend` | `string` | 從差異段落起的其餘部分 / Remainder starting at the changed segment |
| `versionOld` / `versionNew` | `string` | 輸入的兩個版本字串 / The two input version strings |
| `partsOld` / `partsNew` | `string[]` | 兩個版本的段落陣列 / Segment arrays of both versions |

## 組態設定 / Configuration

此套件沒有設定檔 (Config File)，所有選項皆透過函數的 `options` 參數傳遞：

This package has no config file; all options are passed through each function's `options` parameter:

| 選項 / Option | 型別 / Type | 預設 / Default | 說明 / Description |
| --- | --- | --- | --- |
| `_colors` | `[color, color, color]` | `['red', 'cyan', 'green']` | major / minor / patch 三段各自的顏色 / Colors for the major / minor / patch segments |
| `stripAnsi` | `boolean` | `false` | 輸出不含 ANSI 轉義的純文字 / Emit plain text without ANSI escapes |
| `chalk` | `chalk` 實例 | — | 自行注入的 chalk，注入後不再從 console 取得 / Injected chalk instance; when provided, no chalk is derived from the console |
| `console` | `Console2` | 內建 console / built-in console | 用來推導 chalk 的 debug-color2 console / The debug-color2 console used to derive chalk |

```typescript
import { colorizeDiff } from '@yarn-tool/semver-diff';

// 自訂三段顏色 / Customize the color triplet
colorizeDiff('1.2.3', '2.0.0', { _colors: ['red', 'yellow', 'green'] });

// 純文字輸出（不套用顏色）/ Plain text output (no color applied)
colorizeDiff('1.2.3', '1.3.0', { stripAnsi: true });
```

## 相關套件 / Related Packages

- [`@lazy-node/semver-part`](../../@lazy-node/semver-part) - 版本部分比較工具，本套件的比較核心 / Version part comparison utilities, the comparison core used here
- [`semver`](https://www.npmjs.com/package/semver) - 語義化版本處理 / Semantic versioning

### 延伸閱讀 / Further Reading

- [docs/semver-packages.md](../../../docs/semver-packages.md) - `@lazy-node/semver-*` 系列套件總覽 / Overview of the `@lazy-node/semver-*` package series
