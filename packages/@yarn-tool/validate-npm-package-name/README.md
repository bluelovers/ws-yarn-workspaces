# validate-npm-package-name

> Give me a string and I'll tell you if it's a valid `npm` package name.

傳入一個字串，判斷它是否為合法的 npm 套件名稱 (Package Name)。
回傳物件包含 `validForNewPackages` 與 `validForOldPackages` 兩個布林 (Boolean) 屬性。

## 特色 (Features)

- 同步 (Sync) 函式、無任何相依副作用，可直接在腳本或 CLI 中使用。
- 區分「錯誤 (Errors)」與「警告 (Warnings)」：舊版曾合法的名稱只警告、不禁止。
- 支援 scoped 套件（`@scope/name`），回傳值附帶 `user` / `subname` 切分結果。
- 可自訂黑名單 (Blacklist)，並可指定目標 Node.js 版本判斷核心模組名稱。
- 提供 `throwErr` 選項，將錯誤轉為 `RangeError` 例外 (Exception)。

## 安裝 (Installation)

```bash
yarn add @yarn-tool/validate-npm-package-name
yarn-tool add @yarn-tool/validate-npm-package-name
yt add @yarn-tool/validate-npm-package-name
```

## 使用方式 (Usage)

### 合法名稱

```js
var validate = require("@yarn-tool/validate-npm-package-name")

validate("some-package")
validate("example.com")
validate("under_score")
validate("123numeric")
validate("@npm/thingy")
validate("@jane/foo.js")
```

以上名稱皆合法，回傳：

```js
{
  validForNewPackages: true,
  validForOldPackages: true
}
```

### 非法名稱

```js
validate("excited!")
validate(" leading-space:and:weirdchars")
```

這類名稱從未合法過，因此回傳：

```js
{
  validForNewPackages: false,
  validForOldPackages: false,
  errors: [
    'name cannot contain leading or trailing spaces',
    'name can only contain URL-friendly characters'
  ]
}
```

### 舊版名稱 (Legacy Names)

早期 npm 的套件名稱可含大寫字母、可超過長度上限、也可與 Node.js 核心模組同名。
這類「過去合法」的名稱會讓 `validForNewPackages` 變成 `false`，並附上 `warnings`：

```js
validate("eLaBorAtE-paCkAgE-with-mixed-case-and-more-than-214-characters-----------------------------------------------------------------------------------------------------------------------------------------------------------")
```

回傳：

```js
{
  validForNewPackages: false,
  validForOldPackages: true,
  warnings: [
    "name can no longer contain capital letters",
    "name can no longer contain more than 214 characters"
  ]
}
```

## API 文件 (API Documentation)

### `validateNpmPackageName(name, options?)`

定義於 [lib/validateNpmPackageName.ts](lib/validateNpmPackageName.ts)。

| 參數 | 型別 | 說明 |
|------|------|------|
| `name` | `string` | 待驗證的套件名稱 |
| `options` | `boolean \| IOptions` | 布林值等同 `{ throwErr }`，或完整選項物件 |

回傳 `IValidateNpmPackageNameReturnType`：

| 欄位 | 型別 | 說明 |
|------|------|------|
| `validForNewPackages` | `boolean` | 無錯誤且無警告時為 `true` |
| `validForOldPackages` | `boolean` | 沒有錯誤時為 `true` |
| `warnings` | `string[]` | 舊版名稱警告；無警告時欄位不存在 |
| `errors` | `string[]` | 非法名稱錯誤；無錯誤時欄位不存在 |
| `name` | `string` | 原始輸入名稱 |
| `scopedPackagePattern` | `boolean` | 是否符合 `@scope/name` 格式 |
| `user` / `subname` | `string` | scoped 套件的 scope 與子名稱 |

### 名稱規則 (Naming Rules)

- 名稱長度必須大於 0，且不得超過 214
- 所有字元必須為小寫（不允許大寫或混合大小寫）
- 可包含連字號 (Hyphen)
- 不得包含非 URL 安全字元（名稱最終會成為 URL 的一部分）
- 不得以 `.` 或 `_` 開頭
- 不得有前後空白
- 不得包含 `~)('!*` 等特殊字元
- 不得與 Node.js 核心模組同名，也不得在黑名單內，例如：`http`、`stream`、`node_modules`、`favicon.ico`

### 其他匯出

| 匯出 | 說明 |
|------|------|
| `validate(name, options?)` | 未加總的 [核心驗證](lib/validateNpmPackageNameCore.ts)，不處理 scoped 切分與 `throwErr` |
| `handleResult(warnings, errors)` | [產生最終結果物件](lib/handleResult.ts)，空陣列欄位會被移除 |
| `IResult` / `IOptions` / `IValidateNpmPackageNameReturnType` | [共用型別](lib/types.ts) |
| `scopedPackagePattern` | [scoped 套件正規表示式](lib/types.ts) |

## 設定 (Configuration)

本套件沒有設定檔，行為由 `IOptions`（[lib/types.ts](lib/types.ts)）決定：

| 選項 | 型別 | 說明 |
|------|------|------|
| `targetNodeJSVersion` | `string` | 判斷核心模組名稱時所用的目標 Node.js 版本 |
| `blacklist` | `(string \| RegExp)[]` | 自訂黑名單，未指定時使用內建的 `node_modules`、`favicon.ico` |
| `throwErr` | `boolean` | 驗證發生錯誤時拋出 `RangeError`（訊息為錯誤與警告的合併字串） |

## License

ISC
