# @yarn-tool/types

Shared TypeScript types for use across yarn-tool packages

收集 yarn-tool 系列套件共用的 TypeScript 型別 (Type Definitions)，目前主要提供 `yargs` 的 `Argv` / `Arguments` 同步化與解包 (Unpack) 相關的工具型別。本套件為純型別 (Type-only) 套件，不含任何執行期 (Runtime) 程式碼。

## 功能特色 / Features

- **yargs 型別工具 (yargs Type Helpers)**：提供從 `Argv<T>` 解包出選項型別、還原同步 `argv` 等常用轉換
- **零執行期依賴 (No Runtime Code)**：所有匯出皆為 `type`，編譯後不會產生可執行邏輯
- **共享型別 (Shared Types)**：讓 yarn-tool 各套件以單一事實來源 (Single Source of Truth) 引用相同型別，避免重複宣告

## 安裝 / Install

```bash
yarn add @yarn-tool/types
yarn-tool add @yarn-tool/types
yt add @yarn-tool/types
```

> 本套件的型別皆衍生自 [`yargs`](https://github.com/yargs/yargs) 的 `Argv` 與 `Arguments`，使用端專案需已安裝 `yargs` 方能正確解析型別。

## 使用方法 / Usage

```typescript
import type {
  IYargsUnPackArgv,
  IYargsArgumentsRecord,
  IYargsArgvSync,
  IYargsSync,
} from '@yarn-tool/types';

// 從 Argv 實例型別解包出「選項 (Options)」型別
type MyOptions = IYargsUnPackArgv<typeof yargs>;
//=> 例如 { name: string; verbose: boolean }

// 將 Arguments<T> 的每個鍵重述為對應型別的記錄 (Record)
type MyArgsRecord = IYargsArgumentsRecord<MyOptions>;

// 取得「同步」的 Argv 型別：argv 不再是 Promise
type SyncArgv = IYargsArgvSync<MyOptions>;

// 一步到位：從 Argv 實例型別直接取得同步版本
type MySyncArgv = IYargsSync<typeof yargs>;
```

## API Documentation

### `IYargsUnPackArgv<T extends Argv<any>>`

以條件型別 (Conditional Type) 從 `Argv<T>` 推斷 (infer) 凍結的選項型別 `O`；推斷失敗時回傳 `never`。

- `T`：某個 `Argv` 實例的型別（通常為 `typeof yargs`）。
- 回傳：該 `Argv` 所攜帶的選項型別。

### `IYargsArgumentsRecord<T>`

將 `Arguments<T>` 的所有鍵以映射型別 (Mapped Type) 重新建構為鍵值對 (Record)，本質上是把 yargs 的 `Arguments<T>` 轉成較易延伸的物件型別形狀。

### `IYargsArgvSync<T>`

以 `Omit<Argv<T>, 'argv'>` 取得去同步 `argv` 的 `Argv`，再以交集 (Intersection) 補回同步版本的 `argv`：

- `argv` 型別為 `Exclude<Argv<T>['argv'], Promise<any>>`，即排除 `Promise` 包裹後的值。
- 適用於已完成同步取值 (Synchronous Parse) 的情境。

### `IYargsSync<T extends Argv<any>>`

組合上述兩者：先以 `IYargsUnPackArgv<T>` 解包出選項型別，再交由 `IYargsArgvSync` 產出同步的 `Argv` 型別。

## 設定 / Configuration

本套件沒有設定檔 (Config File)，也不讀取任何環境設定：

- 所有匯出皆為型別，不產生執行期行為，因此無需初始化或選項。
- 是否啟用嚴格型別檢查等行為，完全取決於使用端專案的 `tsconfig.json`（例如 `strict` 設定）。
