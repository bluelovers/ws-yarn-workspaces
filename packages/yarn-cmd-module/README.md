# yarn-cmd-module

> create a yargs command module object with TypeScript typings - don't install this if you don't use TypeScript

用 TypeScript 建立 yargs 指令模組 (Command Module) 物件的工具；如果不使用 TypeScript，請勿安裝此套件。

## 功能特色 (Features)

- 以 class `YargsCommandModule` 建立符合 yargs `CommandModule` 介面的物件
- 完整的 TypeScript 泛型型別 (Generics)，`builder` 與 `handler` 的參數型別會互相推導
- 以 getter/setter 代理 `command`、`describe`、`aliases`、`builder`、`handler`，可於建立後再行修改
- 內建 `setHandler()` / `newHandler()`，handler 可取得目前的 `yargs` 實例與模組本身
- 透過 `toValue()`（即 `Symbol.toPrimitive`）轉換為可直接交給 yargs 的純物件

## 安裝 (Installation)

```bash
# 使用 yarn
yarn add yarn-cmd-module

# 使用 yarn-tool
yarn-tool add yarn-cmd-module

# 使用 npm
npm install yarn-cmd-module
```

## 使用方法 (Usage)

### 基本用法 (Basic Usage)

```typescript
import YargsCommandModule from 'yarn-cmd-module';

export = YargsCommandModule.create({
	command: 'aaa',
	builder(yargs)
	{
		return yargs
			.option('kkk', {
				string: true,
			})
	},
}).setHandler(function (argv, yargs, self)
{
	// argv 為解析後的參數 (parsed arguments)
}).toValue();
```

### 取得 yargs 實例 (Getting the yargs instance)

`builder` 以函式形式定義時，yargs 實例會被記錄下來，可於 handler 內透過 `yargs` getter 取得：

```typescript
const mod = YargsCommandModule.create({
	command: 'build',
	builder(yargs)
	{
		return yargs.option('outDir', { string: true });
	},
	handler(args)
	{
		// ...
	},
});

// builder 執行後才有值；未執行前為 undefined
const yargs = mod.yargs;
```

## API 文件 (API Documentation)

### `YargsCommandModule.create<T, U>(config)`

靜態方法 (Static Method)，建立並回傳 `YargsCommandModule` 實例，等同於 `new YargsCommandModule(config)`。

### `new YargsCommandModule<T, U>(config)`

建構子 (Constructor)，將 `config` 存入內部符號屬性 `SYM_CONFIG`。

### `command` / `describe` / `aliases`

對應 yargs `CommandModule` 的同名欄位的 getter/setter，讀寫皆轉存至 `SYM_CONFIG`。

### `builder`

回傳 yargs 的 `builder`。當 `config.builder` 為函式時會包一層 wrapper，於呼叫時記錄來源與回傳的 yargs 實例（`SYM_YARGS.from` / `SYM_YARGS.to`）；為物件時則直接回傳。

### `handler`

回傳經 `newHandler()` 包裝後的函式，呼叫時會一併傳入目前的 yargs 實例與模組本身。

### `setHandler(cb)`

取代 `config.handler` 並回傳 `this`，可串連 (Chain) 使用。

### `newHandler(cb)`

回傳一個包裝函式 (Wrapper Function)：`(args) => cb(args, this.yargs, this)`。

### `toValue()` / `[Symbol.toPrimitive]()`

回傳可直接作為 yargs `command()` 輸入的純物件，包含 `command`、`aliases`、`describe`、`builder`、`handler`。陣列型的 `command` / `aliases` 會先複製 (Slice)，避免外部修改到原始配置。

## 設定 (Configuration)

本套件沒有設定檔，所有行為皆由傳入 `create()` 的 `config` 物件決定：

| 欄位 (Field) | 型別 (Type) | 說明 (Description) |
|--------------|-------------|-------------------|
| `command` | `string \| ReadonlyArray<string>` | 指令名稱，第一個字串可包含位置參數 (Positional Args) |
| `describe` | `string \| false` | help 文字中的說明；傳 `false` 可隱藏該指令 |
| `aliases` | `string \| ReadonlyArray<string>` | 指令的別名 (Aliases) |
| `builder` | `Record<string, Options> \| (yargs) => yargs` | 宣告指令接受的選項 (Options) |
| `handler` | `(args, yargs?, self?) => any` | 解析 argv 後執行的處理函式 |

## 相關套件 (Related Packages)

- [`@yarn-tool/script-lifecycle`](../@yarn-tool/script-lifecycle/README.md) - npm/yarn 腳本生命週期工具
