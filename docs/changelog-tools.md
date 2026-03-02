# Changelog 工具指南
# Changelog Tools Guide

本文件說明 Monorepo 工作區中與 Changelog 相關的三個核心工具。

This document describes three core tools related to Changelog in Monorepo workspaces.

## 套件概述

| 套件 | 用途 | 類型 |
|------|------|------|
| `@yarn-tool/changelog` | 生成/更新套件的 CHANGELOG.md | CLI + API |
| `@yarn-tool/ws-changed` | 檢測變更的套件 | API |
| `ws-root-changelog` | 生成根目錄 Changelog 總覽 | CLI + API |

## @yarn-tool/changelog

基於 [conventional commits](https://www.conventionalcommits.org/) 規範，自動分析 Git 提交記錄並生成 Changelog。

### 核心功能

- **Conventional Commits 解析**: 自動識別 `feat:`, `fix:`, `BREAKING CHANGE:` 等提交類型
- **版本推薦**: 根據提交類型自動推薦下一個語意化版本號
- **雙模式支援**: 
  - `independent` - 每個套件獨立版本
  - `root` - 所有套件共用版本

### CLI 使用

```bash
# 基本使用
changelog

# 指定預設規範
changelog --preset conventional-changelog-angular

# 指定標籤前綴
changelog --tag-prefix v
```

### API 使用

```typescript
import { updateChangelogByCwd, recommendVersion } from '@yarn-tool/changelog';

// 更新 Changelog
const result = await updateChangelogByCwd(process.cwd(), {
  changelogPreset: '@bluelovers/conventional-changelog-bluelovers',
  tagPrefix: 'v',
  type: 'independent',
});

console.log(`Updated: ${result.logPath}`);
console.log(`Version: ${result.version}`);
```

### 預設規範支援

| 預設名稱 | 說明 |
|----------|------|
| `@bluelovers/conventional-changelog-bluelovers` | 預設，支援多種提交類型 |
| `conventional-changelog-angular` | Angular 風格 |
| `conventional-changelog-atom` | Atom 編輯器風格 |

---

## @yarn-tool/ws-changed

整合 **Lerna** 和 **Git** 兩種方式來檢測工作區中變更的套件。

### 檢測機制

```
┌─────────────────────────────────────────────────────────────┐
│                    wsChanged()                              │
├──────────────────────────┬──────────────────────────────────┤
│      Lerna Changed       │         Git Staged               │
├──────────────────────────┼──────────────────────────────────┤
│ 執行 lerna changed       │ 執行 git diff --staged           │
│ 檢測自上次發布後的變更   │ 檢測暫存區變更                   │
│ 基於版本標籤歷史         │ 基於檔案變更                     │
└──────────────────────────┴──────────────────────────────────┘
```

### API 使用

```typescript
import wsChanged from '@yarn-tool/ws-changed';

const result = wsChanged(process.cwd());

// Lerna 檢測的變更（基於版本歷史）
console.log(result.changed);

// Git 暫存區變更
console.log(result.staged);
```

### 返回結構

```typescript
interface IChangedResult {
  cwd: string;                    // 工作區根目錄
  changed: IListableRowExtra[];   // Lerna 變更套件
  staged: IListableRowExtra[];    // Git 暫存套件
}

interface IListableRowExtra {
  name: string;      // 套件名稱
  version: string;   // 目前版本
  private: boolean;  // 是否私有
  location: string;  // 絕對路徑
  prefix: string;    // 相對路徑
}
```

### 應用場景

1. **CI/CD 選擇性建置**: 只建置變更的套件及其依賴
2. **發布前檢查**: 確認哪些套件需要發布
3. **測試範圍縮減**: 只測試受影響的套件

---

## ws-root-changelog

為 Monorepo 工作區根目錄生成一個包含所有套件 Changelog 連結的總覽文件。

### 生成內容範例

```markdown
# Change Log

Please see the individual package changelogs for what's new:

* 🔒 [`@scope/private`](./packages/private/CHANGELOG.md "packages/private") *packages/private*
* 🌏 [`public-pkg`](./packages/public/CHANGELOG.md "packages/public") *packages/public*
```

### 圖示說明

| 圖示 | 含義 |
|------|------|
| 🔒 | 私有套件 (`private: true`) |
| 🌏 | 公開套件 |

### CLI 使用

```bash
# 生成根目錄 CHANGELOG.md
ws-root-changelog

# 指定工作區路徑
ws-root-changelog /path/to/workspace
```

### API 使用

```typescript
import { 
  createWorkspacesRootChangelog, 
  outputWorkspacesRootChangelog 
} from 'ws-root-changelog';

// 生成 Markdown 內容
const markdown = createWorkspacesRootChangelog(process.cwd());

// 寫入檔案
const result = outputWorkspacesRootChangelog(process.cwd());
console.log(`Created: ${result.file}`);
```

---

## 工具整合流程

完整的發布流程可以結合三個工具：

```typescript
import wsChanged from '@yarn-tool/ws-changed';
import { updateChangelogByCwd } from '@yarn-tool/changelog';
import { outputWorkspacesRootChangelog } from 'ws-root-changelog';

async function release() {
  // 1. 檢測變更套件
  const { changed } = wsChanged();
  
  // 2. 為每個變更套件更新 Changelog
  for (const pkg of changed) {
    await updateChangelogByCwd(pkg.location);
  }
  
  // 3. 更新根目錄總覽
  outputWorkspacesRootChangelog();
}
```

## 相關連結

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Lerna](https://lerna.js.org/)
