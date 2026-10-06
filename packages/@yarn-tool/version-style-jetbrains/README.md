# @yarn-tool/version-style-jetbrains

基於日期的 JetBrains 風格版本號生成套件，支援多種版本格式

## 概述

此套件實現了類似 JetBrains IDE 的版本號生成邏輯，支援多種日期格式的版本號生成，包括 JetBrains 風格的短格式和標準的完整格式。

## 功能特色 (Features)

- **四種版本樣式 (Version Styles)**：JetBrains 短年份、短年份月日合併、標準完整年份、標準完整年份月日合併
- **雙向轉換**：日期可產生版本號 (`dateToVersion`)，版本號也可反向解析回日期資訊 (`parseVersion`)
- **遞增與推進**：支援當日遞增 (`incrementVersion`) 與跨日推進 (`getNextDayVersion`)，含跨月、跨年進位
- **時區安全 (Timezone-safe)**：透過 `dayjs-tz-helper` 安全解析時區，避免本地時間與 UTC 偏移造成日期偏移
- **彈性容錯**：解析失敗時可依 `throwOnError` 決定拋錯或回退到當日版本
- **型別完整**：附帶 TypeScript 型別定義與 `EnumVersionStyle` 列舉

## 安裝 (Installation)

```bash
# 使用 yarn / Using yarn
yarn add @yarn-tool/version-style-jetbrains

# 使用 yarn-tool / Using yarn-tool
yarn-tool add @yarn-tool/version-style-jetbrains
# yt 是 yarn-tool 的別名 / yt is an alias for yarn-tool
yt add @yarn-tool/version-style-jetbrains

# 使用 pnpm / Using pnpm
pnpm add @yarn-tool/version-style-jetbrains

# 使用 npm / Using npm
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
const allVersions = generateAllStyleVersions(); // 包含4種格式
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
}
```

## 使用場景 (Use Cases)

- **IDE 版本管理**：類似 JetBrains IDE 的版本號生成
- **軟體發布**：基於日期的版本號管理
- **日誌追蹤**：透過版本號快速識別發布日期
- **CI/CD 集成**：自動化版本號生成

## 相關連結 (Related Links)

- [GitHub 倉庫](https://github.com/bluelovers/ws-yarn-workspaces/tree/master/packages/@yarn-tool/version-style-jetbrains)
- [API 文檔](https://github.com/bluelovers/ws-yarn-workspaces/tree/master/packages/@yarn-tool/version-style-jetbrains)
- [JetBrains 版本號風格](https://www.jetbrains.com/)

## 授權 (License)

ISC

## 貢獻 (Contributing)

歡迎提交 issue 和 pull request。

## 版本 (Version)

當前版本：1.0.7