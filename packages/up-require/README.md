# up-require

    Require package module from highest or list of module.

從最高的父模組 (Top Parent Module) 或指定模組清單 (Module List) 中 require 套件模組。

## 功能特色 (Features)

- 從模組層級鏈 (Module Parent Chain) 的最上層 require 指定模組，取得 monorepo 根目錄安裝的版本
- 支援自訂起始模組 (Start Module) 與自訂模組清單，方便拆分與重複使用
- 錯誤物件符合 `NodeJS.ErrnoException`，失敗時帶有 `code='MODULE_NOT_FOUND'`
- 提供 `require.cache` 的查詢輔助：依 exports、依檔案路徑、依 package id 找回模組
- 亦可只取得模組而不自動 require

## base on

for more desc see here

- `requireFromParentUp(id: string, startModule?: NodeModule)`{:.language-ts} => [parent-require](https://github.com/jaredhanson/node-parent-require)
- `requireFromTopParent(id: string, startModule?: NodeModule)`{.ts} => [top-require](https://github.com/sielay/node-top-require)
- `getModuleByExports(exports)` => [which-module](https://www.npmjs.com/package/which-module)

### diff

- support NodeJS.ErrnoException, Error object will has `code='MODULE_NOT_FOUND'` .  
  so we can know when error happen is can't found module or it has other error
- split function, so u can custom it
- other [api see here](index.d.ts)

## 安裝 (Installation)

```bash
# 使用 yarn
yarn add up-require

# 使用 yarn-tool
yarn-tool add up-require

# 使用 npm
npm install up-require
```

## 使用方法 (Usage)

### structure

* `root`
  * index
  * node_modules/
    * `chai@3`
  * packages/
    * `sub1_pkg/`
      * node_modules/
        * `chai@1`
      * index
    * `sub2_pkg/`
      * node_modules/
        * `chai@2`
      * index
      * `sub3_of_sub2_pkg/`
          * node_modules/
            * `chai@1`
          * index

---

### base use

- `requireFromTopParent<T = any>(id: string, startModule?: NodeModule)` => [top-require](https://github.com/sielay/node-top-require)
- `requireFromParentUp<T = any>(id: string, startModule?: NodeModule)` => [parent-require](https://github.com/jaredhanson/node-parent-require)
- `getModuleByExports` => [which-module](https://www.npmjs.com/package/which-module)

alias name

`upRequire` = `requireUp` = `requireFromTopParent`

```ts
import requireFromTopParent, { getModuleByID, requireFromParentUp } from 'up-require';
import { requireFromTopParent, getModuleByID, requireFromParentUp } from 'up-require';
const requireFromTopParent = require('up-require').requireFromTopParent;
```

#### when use in `sub1_pkg/index`

```ts
require('chai') => chai@1
requireFromParentUp('chai', module) => chai@3
requireFromTopParent('chai', module) => chai@3
requireFromTopParent('chai') => chai@3
```

#### when use in `sub3_of_sub2_pkg/index`

```ts
require('chai') => chai@1
requireFromParentUp('chai', module) => chai@2
requireFromTopParent('chai', module) => chai@3
requireFromTopParent('chai') => chai@3
```

### `getModuleByID(id: string, requireIfNotExists?: boolean, req = require)`

```ts
console.log(`only return when chai is required`, getModuleByID('chai'));
console.log(`when chai is not required , will require it`, getModuleByID('chai', true));
```

## API 文件 (API Documentation)

完整的型別宣告可參閱 [index.d.ts](index.d.ts)。

### `requireFromTopParent<T>(id, startModule?)`

從模組層級鏈的最上層 require 指定模組；別名 (Alias)：`upRequire`、`requireUp`。`startModule` 省略時使用目前模組的 parent。

### `requireFromParentUp<T>(id, startModule?)`

從 `startModule` 的 parent 開始依序向上 require，直到找到模組為止。

### `requireParent<T>(id, startModule)`

只用 `startModule.parent.require(id)` require 一次，不做向上搜尋。

### `getAllModule(startModule?)`

回傳由 `startModule` 一路上溯到最上層的模組陣列 (Module Array)；`startModule` 省略時使用 `module.parent`，無效時拋出 `TypeError`。

### `requireFromModuleList<T>(id, ls, startModule)`

依清單由尾至頭逐一 `require`，全部失敗時拋出帶 `code='MODULE_NOT_FOUND'` 的錯誤。

### `getModuleByExports<T>(exportModule, req?)`

在 `require.cache` 中以 `exports` 物件比對，回傳對應的模組；找不到回傳 `null`。

### `getModuleByFile<T>(file, requireIfNotExists?, req?)`

以完整檔案路徑在 `require.cache` 中搜尋；`requireIfNotExists` 為 `true` 時會先 `require` 再查一次，失敗則回傳 `null`。

### `getModuleByID<T>(id, requireIfNotExists?, req?)`

以 package id（同 `require(id)` 的寫法）解析；`id` 為 `'.'` 時改走 `getMainModule()`。

### `getMainModule<T>(id = '.')`

沿著 parent 鏈尋找 `id` 符合的模組，找不到回傳 `null`。

### `getRequireCache(req?)`

回傳 `require.cache`，並以 `INodeRequireCache` 型別補足 TypeScript 未提供的定義。

### `_createError(err, data)`

整理除錯用的錯誤資料：沒有來源錯誤時建立新的 `MODULE_NOT_FOUND` 錯誤，並附加 `startModule`、`module`、`list` 欄位。

## 設定 (Configuration)

本套件無設定檔，所有函式皆以參數控制行為：

| 參數 (Parameter) | 適用函式 (Used by) | 預設值 (Default) | 說明 (Description) |
|------------------|--------------------|------------------|--------------------|
| `startModule` | `requireFromTopParent`、`requireFromParentUp`、`getAllModule`、`requireParent` | `module.parent` | 搜尋的起始模組 (Start Module) |
| `requireIfNotExists` | `getModuleByID`、`getModuleByFile` | `false` | 尚未載入時是否自動 require |
| `req` | `getModuleByID`、`getModuleByFile`、`getModuleByExports`、`getRequireCache` | `require` | 使用的 require 函式，可注入自訂實例 |

錯誤判斷 (Error Handling)：失敗時錯誤物件的 `code` 為 `'MODULE_NOT_FOUND'`，可用 `MODULE_NOT_FOUND` 常數比對：

```ts
import requireFromTopParent, { MODULE_NOT_FOUND } from 'up-require';

try
{
	requireFromTopParent('not-exists-pkg');
}
catch (e)
{
	if (e.code === MODULE_NOT_FOUND)
	{
		// 模組找不到 (module not found)
	}
}
```

## Credits

  - Creator of original Parent Require [Jared Hanson](http://github.com/jaredhanson)
  - [Lukasz Sielski](http://github.com/sielay)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2014 Lukasz Sielski <[http://lukaszsielski.pl/](http://lukaszsielski.pl/)>
Copyright (c) 2013 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
