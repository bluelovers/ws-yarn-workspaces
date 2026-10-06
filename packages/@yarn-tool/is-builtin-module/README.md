# @yarn-tool/is-builtin-module

檢查名稱是否為 Node.js 內建模組 (Builtin Module)。
Check whether a module name is a Node.js builtin module.

## 功能 (Features)

- 以 `builtins` 套件取得指定 Node.js 版本的內建模組清單 (Builtin module list) / Obtain the builtin module list for a target Node.js version via the `builtins` package
- 提供 `isBuiltinModule(moduleName)` 快速判斷名稱是否為內建模組 / Quick check with `isBuiltinModule(moduleName)`
- 同時匯出 (Export) 預建的清單 `builtins`、檢查函式 `isBuiltinModule` 與函式工廠 (Factory) `createNewIsBuiltinModule`
- 可透過 `targetNodeJSVersion` 指定要比對的 Node.js 版本 / Specify the target Node.js version via `targetNodeJSVersion`

## 安裝 (Installation)

```bash
# 使用 yarn / Using yarn
yarn add @yarn-tool/is-builtin-module

# 使用 yarn-tool / Using yarn-tool
yarn-tool add @yarn-tool/is-builtin-module
# yt 是 yarn-tool 的別名 / yt is an alias for yarn-tool
yt add @yarn-tool/is-builtin-module

# 使用 pnpm / Using pnpm
pnpm add @yarn-tool/is-builtin-module

# 使用 npm / Using npm
npm install @yarn-tool/is-builtin-module
```

## 用法 (Usage)

```typescript
import isBuiltinModule, {
  builtins,
  createNewIsBuiltinModule,
} from '@yarn-tool/is-builtin-module';

// 判斷是否為內建模組 / Check whether a module is builtin
isBuiltinModule('fs'); // true
isBuiltinModule('lodash'); // false

// 內建模組清單 / Builtin module list
console.log(builtins.includes('path')); // true

// 以自訂選項建立獨立的檢查器 / Create a standalone checker with custom options
const { isBuiltinModule: check, builtins: list } = createNewIsBuiltinModule({
  targetNodeJSVersion: '18',
});
console.log(list.length > 0); // true
```

- 傳入非字串時會拋出 `TypeError: Expected a string` / Passing a non-string throws `TypeError: Expected a string`

## API 文件 (API Documentation)

### `isBuiltinModule(moduleName: string): boolean`

預設匯出 (Default export)，檢查 `moduleName` 是否在內建模組清單中。
Default export; checks whether `moduleName` is included in the builtin module list.

**參數 (Parameters):**

| 參數 (Parameter) | 型別 (Type) | 說明 (Description) |
| --- | --- | --- |
| `moduleName` | `string` | 要檢查的模組名稱；非字串會拋出 `TypeError` / Module name to check; non-string throws `TypeError` |

**回傳 (Returns):** `boolean` — 是否為內建模組 / Whether it is a builtin module

### `builtins: string[]`

預建執行個體 (Pre-built instance) 的內建模組清單，等同 `createNewIsBuiltinModule().builtins`。
Builtin module list of the pre-built instance, equivalent to `createNewIsBuiltinModule().builtins`.

### `createNewIsBuiltinModule(options?): { builtins, isBuiltinModule }`

函式工廠 (Factory)，依選項建立獨立的清單與檢查函式。
Factory that creates an independent list and checker from the given options.

**參數 (Parameters):**

| 參數 (Parameter) | 型別 (Type) | 必填 (Required) | 說明 (Description) |
| --- | --- | --- | --- |
| `options.targetNodeJSVersion` | `string` | 否 / No | 比對清單所對應的 Node.js 版本，會傳給 `builtins` 套件 / Target Node.js version of the list, forwarded to the `builtins` package |

**回傳 (Returns):** `{ builtins: string[], isBuiltinModule(moduleName: string): boolean }`

## 組態設定 (Configuration)

| 選項 (Option) | 型別 (Type) | 預設值 (Default) | 說明 (Description) |
| --- | --- | --- | --- |
| `targetNodeJSVersion` | `string` | `undefined` | 傳給 `builtins` 套件的目標版本；未指定時由 `builtins` 採用執行中的 Node.js 版本 / Target version passed to the `builtins` package; when omitted, `builtins` uses the running Node.js version |

- `builtins@5.x` 的簽名為 `({ version, experimental })`，因此傳入純字串版本（如 `'18'`）時屬性不會被解構取得，實際仍以執行中的 Node.js 版本為準 / `builtins@5.x` uses the signature `({ version, experimental })`, so passing a plain version string (e.g. `'18'`) is not destructured and the running Node.js version is used instead
- 模組載入時即以預設選項建立 `builtins` 與 `isBuiltinModule`，可直接匯出使用 / `builtins` and `isBuiltinModule` are created once with default options at module load time and are ready to import
