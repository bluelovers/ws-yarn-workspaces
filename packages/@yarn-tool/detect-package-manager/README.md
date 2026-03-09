# @yarn-tool/detect-package-manager

使用 `which` 命令偵測系統中可用的套件管理器（yarn、npm、pnpm）

Detect available package manager (yarn, npm, pnpm) in system using `which` command

## 功能 (Features)

- 支援偵測 yarn、npm、pnpm 三種套件管理器
- 提供同步與非同步兩種偵測方式
- 支援自訂套件管理器優先順序
- 可取得第一個可用的套件管理器或所有可用的套件管理器
- 支援回傳命令路徑資訊

## 類型 (Types)

### IPackageManager

套件管理器類型 (Package manager type)

```typescript
type IPackageManager = 'yarn' | 'npm' | 'pnpm';
```

### IResultDetectPackageManagerRaw

偵測結果類型，包含套件管理器名稱和命令路徑

```typescript
type IResultDetectPackageManagerRaw = readonly [IPackageManager, string?];
```

### IOptionsWhichPackageManager

選項配置類型 (Options configuration type)

```typescript
interface IOptionsWhichPackageManager {
  /** 當找不到時是否返回預設值 / Whether to return default when not found */
  returnDefault?: boolean;
  /**
   * 只使用使用者指定的套件管理器
   * 不合併使用者指定的優先順序與預設順序
   */
  noUseDefaultClients?: boolean;
}
```

### IRuntimeOptionInput

_runtime 選項輸入類型 - 可接受布林值或 IOptionsWhichPackageManager 物件

```typescript
type IRuntimeOptionInput = boolean | IOptionsWhichPackageManager;
```

## API (API)

### whichPackageManagerSync(npmClients?: IPackageManager[], returnDefaultOrOptions?: IRuntimeOptionInput): IPackageManager | undefined

同步偵測第一個可用的套件管理器

**參數 (Parameters):**
- `npmClients?`: 自訂套件管理器列表（可選）/ Custom package manager list (optional)
- `returnDefaultOrOptions?`: 選項輸入 (布林值或 IOptionsWhichPackageManager 物件)（可選）/ Options input (boolean or IOptionsWhichPackageManager object) (optional)

**回傳 (Returns):** 第一個可用的套件管理器名稱或 `undefined`

### whichPackageManagerSyncAll(npmClients?: IPackageManager[], returnDefaultOrOptions?: IRuntimeOptionInput): IPackageManager[]

同步偵測所有可用的套件管理器

**參數 (Parameters):**
- `npmClients?`: 自訂套件管理器列表（可選）/ Custom package manager list (optional)
- `returnDefaultOrOptions?`: 選項輸入 (布林值或 IOptionsWhichPackageManager 物件)（可選）/ Options input (boolean or IOptionsWhichPackageManager object) (optional)

**回傳 (Returns):** 所有可用的套件管理器陣列

### whichPackageManagerAsync(npmClients?: IPackageManager[], returnDefaultOrOptions?: IRuntimeOptionInput): Promise<IPackageManager>

非同步偵測第一個可用的套件管理器

**參數 (Parameters):**
- `npmClients?`: 自訂套件管理器列表（可選）/ Custom package manager list (optional)
- `returnDefaultOrOptions?`: 選項輸入 (布林值或 IOptionsWhichPackageManager 物件)（可選）/ Options input (boolean or IOptionsWhichPackageManager object) (optional)

**回傳 (Returns):** Promise resolves to 第一個可用的套件管理器名稱或 `undefined`

### whichPackageManagerAsyncAll(npmClients?: IPackageManager[], returnDefaultOrOptions?: IRuntimeOptionInput): Promise<IPackageManager[]>

非同步偵測所有可用的套件管理器

**參數 (Parameters):**
- `npmClients?`: 自訂套件管理器列表（可選）/ Custom package manager list (optional)
- `returnDefaultOrOptions?`: 選項輸入 (布林值或 IOptionsWhichPackageManager 物件)（可選）/ Options input (boolean or IOptionsWhichPackageManager object) (optional)

**回傳 (Returns):** Promise resolves to 所有可用的套件管理器陣列

### _whichPackageManagerSyncGenerator(npmClients?: IPackageManager[], returnDefaultOrOptions?: IRuntimeOptionInput): Generator<IResultDetectPackageManagerRaw>

同步生成器版本，回傳包含路徑的結果

**參數 (Parameters):**
- `npmClients?`: 自訂套件管理器列表（可選）/ Custom package manager list (optional)
- `returnDefaultOrOptions?`: 選項輸入 (布林值或 IOptionsWhichPackageManager 物件)（可選）/ Options input (boolean or IOptionsWhichPackageManager object) (optional)

**回傳 (Returns):** Generator yields `[packageManager, commandPath]` tuples

### _whichPackageManagerAsyncGenerator(npmClients?: IPackageManager[], returnDefaultOrOptions?: IRuntimeOptionInput): AsyncGenerator<IResultDetectPackageManagerRaw>

非同步生成器版本，回傳包含路徑的結果

**參數 (Parameters):**
- `npmClients?`: 自訂套件管理器列表（可選）/ Custom package manager list (optional)
- `returnDefaultOrOptions?`: 選項輸入 (布林值或 IOptionsWhichPackageManager 物件)（可選）/ Options input (boolean or IOptionsWhichPackageManager object) (optional)

**回傳 (Returns):** AsyncGenerator yields `[packageManager, commandPath]` tuples

## 安裝 (Installation)

```bash
# 使用 yarn / Using yarn
yarn add @yarn-tool/detect-package-manager

# 使用 yarn-tool / Using yarn-tool
yarn-tool add @yarn-tool/detect-package-manager
# yt 是 yarn-tool 的別名 / yt is an alias for yarn-tool
yt add @yarn-tool/detect-package-manager

# 使用 pnpm / Using pnpm
pnpm add @yarn-tool/detect-package-manager

# 使用 npm / Using npm
npm install @yarn-tool/detect-package-manager
```

## 範例 (Examples)

```typescript
import {
  whichPackageManagerSync,
  whichPackageManagerSyncAll,
  whichPackageManagerAsync,
  whichPackageManagerAsyncAll,
  _whichPackageManagerSyncGenerator,
  _whichPackageManagerAsyncGenerator,
} from '@yarn-tool/detect-package-manager';

// 同步偵測第一個可用的套件管理器
const pm = whichPackageManagerSync();
console.log(pm); // 'pnpm' | 'yarn' | 'npm' | undefined

// 同步偵測所有可用的套件管理器
const pmAll = whichPackageManagerSyncAll();
console.log(pmAll); // ['pnpm', 'yarn', 'npm']

// 非同步偵測
const pmAsync = await whichPackageManagerAsync();
console.log(pmAsync); // 'pnpm' | 'yarn' | 'npm' | undefined

// 自訂優先順序
const pmCustom = whichPackageManagerSync(['yarn', 'pnpm', 'npm']);
console.log(pmCustom); // 會按照自訂順序偵測

// 使用生成器取得路徑資訊
for (const [pm, path] of _whichPackageManagerSyncGenerator()) {
  console.log(`Found ${pm} at ${path}`);
}

// 非同步生成器
for await (const [pm, path] of _whichPackageManagerAsyncGenerator()) {
  console.log(`Found ${pm} at ${path}`);
}

// 使用布林值參數 - 當找不到時返回預設值
const pmWithDefault = whichPackageManagerSync(['yarn'], true);
console.log(pmWithDefault); // 如果 yarn 找不到，會返回 'pnpm' (預設順序的第一個)

// 使用選項物件參數
const pmWithOptions = whichPackageManagerSync(['yarn'], {
  returnDefault: true,
  noUseDefaultClients: false,
});
console.log(pmWithOptions);
```
