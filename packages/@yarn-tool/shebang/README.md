# @yarn-tool/shebang

萃取並解析 shebang（Shebang，`#!` 開頭行）的命令權杖 (Extract normalized shebang command token)。可判斷腳本的直譯器 (Interpreter)、取出執行檔路徑，或移除 shebang 行。

## Features

- 以正規表示式 (Regular Expression) 解析 `#!/usr/bin/env node`、`#!/usr/bin/ruby` 等常見 shebang 格式
- `env` 形式會自動取出實際的直譯器名稱（如 `node`），並保留其後的參數
- 提供判斷、萃取、移除三種操作：`matchShebang`、`shebang`、`removeShebang`
- 零相依（僅依賴 tslib），可單獨用於任何需要檢查 CLI 腳本的場合

## Installation

```bash
yarn add @yarn-tool/shebang
# 或 / or
npm install @yarn-tool/shebang
```

## Usage

```js
var shebang = require('@yarn-tool/shebang');

console.log(shebang("#!/usr/bin/ruby")) // "ruby"
console.log(shebang("#!/usr/bin/env node")) // "node"
```

```ts
import { matchShebang, removeShebang } from '@yarn-tool/shebang';

const matched = matchShebang('#!/usr/bin/env node --harmony');
// {
//   shebang: '#!/usr/bin/env node --harmony',
//   bin: '/usr/bin/env',
//   name: 'env',
//   script: 'node',
//   argv: '--harmony',
//   isExtra: true,
// }

const withoutShebang = removeShebang('#!/usr/bin/env node\nconsole.log(1)');
// 'console.log(1)'
```

### 測試 (Tests)

```bash
npm test
```

## API Documentation

### `shebang(line: string): IScriptName`

回傳正規化後的 shebang 命令權杖；若無 shebang 則回傳 `undefined`。等同 `matchShebang(line)?.script`。

- `shebang('#!/usr/bin/ruby')` → `'ruby'`
- `shebang('#!/usr/bin/env node')` → `'node'`

### `matchShebang(line: string): IMatchShebangReturnType`

完整解析 shebang 行，回傳：

| 欄位 | 型別 | 說明 |
|------|------|------|
| `shebang` | `string` | 完整的 shebang 行 |
| `bin` | `string` | 執行檔路徑（如 `/usr/bin/env`） |
| `name` | `IScriptName` | 執行檔名稱（如 `env`、`node`） |
| `script` | `IScriptName` | 實際直譯器名稱；`env` 形式時為其後的命令 |
| `argv` | `string \| ''` | 直譯器後的其餘參數 |
| `isExtra` | `boolean` | 是否為 `env` 形式（直譯器由 `name` 轉為 `script`） |

無法匹配時回傳 `undefined`。

### `removeShebang(line: string): string`

移除開頭的 shebang 行，其餘內容原樣保留。

### `reShebang: RegExp`

供上述函式共用的正規表示式，亦可直接用於自訂比對。

### 型別 (Types)

- `IScriptName`：`string | 'env' | 'node' | 'sh'`
- `IMatchShebangReturnType`：`matchShebang` 的回傳結構

## Configuration

本套件無須設定；所有函式皆以參數直接傳入要解析的字串。

## License

MIT.
