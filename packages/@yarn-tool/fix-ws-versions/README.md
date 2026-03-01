# @yarn-tool/fix-ws-versions

自動同步和修復 monorepo workspace 中的套件版本依賴 (Auto sync and fix package version dependencies in monorepo workspaces)

## 安裝 (Installation)

```bash
# 使用 yarn / Using yarn
yarn add @yarn-tool/fix-ws-versions

# 使用 yarn-tool / Using yarn-tool
yarn-tool add @yarn-tool/fix-ws-versions
# yt 是 yarn-tool 的別名 / yt is an alias for yarn-tool
yt add @yarn-tool/fix-ws-versions

# 使用 pnpm / Using pnpm
pnpm add @yarn-tool/fix-ws-versions

# 使用 npm / Using npm
npm install @yarn-tool/fix-ws-versions
```

## 功能 (Features)

- `fixWsVersions()` - 自動偵測並修復 workspace 中所有套件的版本依賴
- `fixWsVersionsCore()` - 核心函數，支援自定義套件列表
- `fixPkgDepsVersionsCore()` - 修復單一套件的依賴版本
- 自動處理 `*"` 萬用字元版本（保留不變）
- 支援所有依賴欄位（dependencies, devDependencies, peerDependencies 等）

## 使用方式 (Usage)

```typescript
import { fixWsVersions } from '@yarn-tool/fix-ws-versions';

// 修復當前目錄 workspace 的版本
const result = fixWsVersions();

console.log(`已變更: ${result.changed.length} 個套件`);
console.log(`未變更: ${result.others.length} 個套件`);

// 查看版本映射
console.log(result.data);
```

## 工作原理 (How it works)

1. 掃描 workspace 中的所有套件
2. 檢查每個套件的依賴欄位
3. 將內部 workspace 套件的依賴版本更新為當前實際版本
4. 跳過 `"*"` 萬用字元版本
5. 返回變更與未變更的套件列表
