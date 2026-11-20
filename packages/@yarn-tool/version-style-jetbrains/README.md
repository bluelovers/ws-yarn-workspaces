# @yarn-tool/version-style-jetbrains

基於日期的 JetBrains 風格版本號生成套件，支援多種版本格式

## 概述

此套件實現了類似 JetBrains IDE 的版本號生成邏輯，支援多種日期格式的版本號生成，包括 JetBrains 風格的短格式和標準的完整格式。

## 功能特色 (Features)

- **版本樣式 (Version Styles)**：JetBrains 短年份、短年份月日合併、標準完整年份、標準完整年份月日合併、y2k 日期時間、JetBrains 日期時間
- **雙向轉換**：日期可產生版本號 (`dateToVersion`)，版本號也可反向解析回日期資訊 (`parseVersion`)
- **遞增與推進**：支援當日遞增 (`incrementVersion`) 與跨日推進 (`getNextDayVersion`)，含跨月、跨年進位
- **時區安全 (Timezone-safe)**：透過 `dayjs-tz-helper` 安全解析時區，避免本地時間與 UTC 偏移造成日期偏移
- **彈性容錯**：解析失敗時可依 `throwOnError` 決定拋錯或回退到當日版本
- **型別完整**：附帶 TypeScript 型別定義與 `EnumVersionStyle` 列舉

## 安裝 (Installation)

```bash
# Using yarn
yarn add @yarn-tool/version-style-jetbrains

# Using yarn-tool
yarn-tool add @yarn-tool/version-style-jetbrains
# yt is an alias for yarn-tool
yt add @yarn-tool/version-style-jetbrains

# Using pnpm
pnpm add @yarn-tool/version-style-jetbrains

# Using npm
npm install @yarn-tool/version-style-jetbrains
```

## 使用方式 (Usage)

### 快速開始 (Quick Start)

```typescript
import { dateToVersion, parseVersion, generateAllStyleVersions } from '@yarn-tool/version-style-jetbrains';

// 生成今天的版本號
const todayVersion = dateToVersion(); // 例如: 261.1.1-1

// 解析版本號
const versionInfo = parseVersion('261.1.1-1');

// 生成所有格式的版本號
const allVersions = generateAllStyleVersions();
```

## 版本格式 (Version Formats)

### JetBrains 風格 (JetBrains Style)

1. **JetbrainsShort**: `261.1.1-1`
   - 格式：年=26+季度, 月, 日-遞增
   - 示例：2026年第一季度，1月1日，第一版
   - 計算方式：年份後兩位 + 季度（1-4），月，日，遞增號

2. **JetbrainsShortMD**: `261.101.1`
   - 格式：年=26+季度, 月日合併, 遞增
   - 示例：2026年第一季度，1月1日，第一版
   - 計算方式：年份後兩位 + 季度（1-4），月和日合併（例如101代表1月1日），遞增號

### 標準格式 (Standard Style)

3. **StandardFull**: `2026.1.1-1`
   - 格式：完整年份, 月, 日-遞增
   - 示例：2026年1月1日，第一版
   - 計算方式：完整年份，月，日，遞增號

4. **StandardFullMD**: `2026.101.1`
   - 格式：完整年份, 月日合併, 遞增
   - 示例：2026年1月1日，第一版
   - 計算方式：完整年份，月和日合併（例如101代表1月1日），遞增號

### 時間格式 (Date-Time Style)

5. **Y2KDateTime**: `226.1120.1744-1`（停用後綴時為 `226.1120.1744`）
   - 格式：年=2026 的第一個 2 + 年份後兩位, 月日合併, 時分 [-遞增]
   - 示例：2026年11月20日 17:44，第一版
   - 計算方式：首段取年份（2026）的第一個 2 與年份後兩位（226），月和日合併（1120 代表 11 月 20 日），時分為 HHmm（1744 代表 17:44），遞增號為可省略的 `-x` 後綴
   - 限制：年份後兩位僅兩碼，2100 起不支援此格式

6. **JetbrainsDateTime**: `264.1120.1744-1`（停用後綴時為 `264.1120.1744`）
   - 格式：年=26+季度, 月日合併, 時分 [-遞增]
   - 示例：2026年第四季度，11月20日 17:44，第一版
   - 計算方式：首段為年份後兩位 + 季度（264 代表 2026年Q4），月和日合併（1120 代表 11 月 20 日），時分為 HHmm（1744 代表 17:44），遞增號為可省略的 `-x` 後綴

時間格式解析優先序：`parseVersion` 會先嘗試時間格式（需第二段為合法月日、第三段為合法時分 0000-2359），其中 **JetbrainsDateTime (YYQ) 與 Y2KDateTime (2YY) 同時符合時以 JetbrainsDateTime 優先**（例如 `264.1120.1744` 解析為 2026年Q4 而非 2064 年）；兩者皆不符才依序嘗試標準格式與 JetBrains 短年份格式。

## API 參考 (API Reference)

### `dateToVersion(options?: IVersionStyleOptions): string`

將當前日期轉換為版本號字串。

**參數：**
- `options`: 可選的配置選項
  - `style`: 版本格式類型 (`EnumVersionStyle`)
  - `date`: 指定日期 (預設為當前日期)
  - `increment`: 遞增號 (預設為1)

**返回：** 版本號字串

### `parseVersion(version: string): IParseVersionResult`

解析版本號字串，返回包含的日期資訊。

**參數：**
- `version`: 版本號字串

**返回：** 解析結果物件

### `analyzeVersionStyles(version: string): IVersionStyleAnalysis`

分析版本號符合的風格，回傳所有符合的風格與同時符合時採用的優先風格；`parseVersion` 即以優先風格的解析結果為準。

**參數：**
- `version`: 版本號字串

**返回：** `IVersionStyleAnalysis`

```typescript
const { matchedStyles, matchedResults, priorityStyle, priorityResult } = analyzeVersionStyles('264.1120.1744-1');
// matchedStyles: ['jetbrains-date-time', 'y2k-date-time', 'jetbrains-short-md']（依優先序）
// matchedResults['y2k-date-time'].year: 2064（同一位址在不同風格下的解讀）
// priorityStyle: 'jetbrains-date-time'
// priorityResult: { year: 2026, month: 11, day: 20, dailyVersion: 1, hour: 17, minute: 44, ... }
```

### `generateAllStyleVersions(options?: IVersionStyleOptions): Record<EnumVersionStyle, string>`

生成所有支援的版本格式。

**參數：**
- `options`: 可選的配置選項

**返回：** 包含所有格式版本號的物件

### `getNextDayVersion(currentVersion: string): string`

基於當前版本號，獲取下一天的版本號。

**參數：**
- `currentVersion`: 當前版本號

**返回：** 下一天的版本號

### `incrementVersion(version: string): string`

遞增版本號的遞增計數器。

**參數：**
- `version`: 版本號

**返回：** 遞增後的版本號

## 配置選項 (Configuration Options)

```typescript
interface IVersionStyleOptions {
  style?: EnumVersionStyle; // 版本格式類型
  date?: Date; // 指定日期
  increment?: number; // 遞增號
  yearCode?: boolean; // 是否使用年份代碼（JetbrainsShort 格式）
}
```

### `EnumVersionStyle`

```typescript
enum EnumVersionStyle {
  JetbrainsShort,      // JetBrains 短格式
  JetbrainsShortMD,    // JetBrains 短格式（月日合併）
  StandardFull,        // 標準完整格式
  StandardFullMD,      // 標準完整格式（月日合併）
  Y2KDateTime,       // y2k 日期時間格式（226.1120.1744）
  JetbrainsDateTime, // JetBrains 日期時間格式（264.1120.1744）
}
```

## 使用場景 (Use Cases)

- **IDE 版本管理**：類似 JetBrains IDE 的版本號生成
- **軟體發布**：基於日期的版本號管理
- **日誌追蹤**：透過版本號快速識別發布日期
- **CI/CD 集成**：自動化版本號生成
