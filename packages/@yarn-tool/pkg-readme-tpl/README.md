# @yarn-tool/pkg-readme-tpl

> A utility for processing README templates using lodash template engine
>
> 使用 lodash 模板引擎處理 README 模板的工具

[![NPM version](https://img.shields.io/npm/v/@yarn-tool/pkg-readme-tpl.svg)](https://www.npmjs.com/package/@yarn-tool/pkg-readme-tpl)
[![License](https://img.shields.io/npm/l/@yarn-tool/pkg-readme-tpl.svg)](https://github.com/bluelovers/ws-yarn-workspaces/blob/master/packages/@yarn-tool/pkg-readme-tpl/LICENSE)

## 簡介 (Introduction)

此模組提供使用 lodash 模板引擎處理 README 文件的功能。它可以讀取包含 lodash 模板語法的文件，使用提供的變數進行編譯，並在內容有變化時寫入檔案。

This module provides functionality to process README files using lodash template engine. It can read files containing lodash template syntax, compile them with provided variables, and write to the file only when content has changed.

## 安裝 (Installation)

```bash
# 使用 yarn / Using yarn
yarn add @yarn-tool/pkg-readme-tpl

# 使用 yarn-tool / Using yarn-tool
yarn-tool add @yarn-tool/pkg-readme-tpl
# yt 是 yarn-tool 的別名 / yt is an alias for yarn-tool
yt add @yarn-tool/pkg-readme-tpl

# 使用 npm / Using npm
npm install @yarn-tool/pkg-readme-tpl
```

## 使用方法 (Usage)

### 基本範例 (Basic Example)

```typescript
import { writeReadme, IOptionsWriteReadme } from '@yarn-tool/pkg-readme-tpl';

// 定義模板變數介面 / Define template variables interface
interface MyTemplateVars {
  name: string;
  version: string;
  description: string;
}

// 使用 writeReadme 函數處理 README 模板
// Use writeReadme function to process README template
writeReadme<MyTemplateVars>({
  file: './README.md',
  variable: {
    name: 'my-package',
    version: '1.0.0',
    description: 'An awesome package'
  }
});
```

### 模板語法 (Template Syntax)

此模組使用 lodash 的 `template` 函數，支援以下語法：

This module uses lodash's `template` function, supporting the following syntax:

- `<%= variable %>` - 輸出變數值 / Output variable value
- `<%- variable %>` - 輸出 HTML 轉義後的變數值 / Output HTML-escaped variable value
- `<% code %>` - 執行 JavaScript 程式碼 / Execute JavaScript code

#### 模板範例 (Template Example)

假設有一個 README 模板文件 `README.md.tpl`：

Assuming there's a README template file `README.md.tpl`:

```markdown
# <%= name %>

> <%= description %>

Version: <%= version %>
```

執行後會生成：

After execution, it will generate:

```markdown
# my-package

> An awesome package

Version: 1.0.0
```

## API 文檔 (API Documentation)

### `writeReadme<T>(options: IOptionsWriteReadme<T>): void`

寫入 README 檔案的主要函數。

Main function to write README file.

#### 參數 (Parameters)

| 參數 | 型別 | 描述 |
|------|------|------|
| `options.file` | `string` | README 模板檔案路徑 / Path to the README template file |
| `options.variable` | `T` | 模板變數物件 / Template variable object |

#### 特性 (Features)

- 只有在內容有變化時才會寫入檔案，避免不必要的磁碟操作
- Only writes to file when content has changed, avoiding unnecessary disk operations

### `IOptionsWriteReadme<T>`

writeReadme 函數的選項介面。

Options interface for writeReadme function.

```typescript
interface IOptionsWriteReadme<T extends Record<any, any> = Record<any, any>> {
  file: string;
  variable: T;
}
```

### `_readReadmeTplCore(md1: string | Buffer): Function`

讀取並編譯 README 模板的核心函數。

Core function to read and compile README template.

#### 參數 (Parameters)

| 參數 | 型別 | 描述 |
|------|------|------|
| `md1` | `string \| Buffer` | README 模板內容 / README template content |

#### 返回值 (Returns)

編譯後的模板函數，可傳入變數物件來生成最終內容。

Compiled template function that accepts a variable object to generate final content.

## 相關套件 (Related Packages)

- [lodash](https://lodash.com/) - 現代 JavaScript 工具庫 / Modern JavaScript utility library
- [fs-extra](https://github.com/jprichardson/node-fs-extra) - Node.js 檔案系統擴展 / Node.js file system extensions

## 授權 (License)

ISC © [bluelovers](https://github.com/bluelovers)

## 連結 (Links)

- [GitHub Repository](https://github.com/bluelovers/ws-yarn-workspaces/tree/master/packages/@yarn-tool/pkg-readme-tpl)
- [NPM Package](https://www.npmjs.com/package/@yarn-tool/pkg-readme-tpl)
- [Issue Tracker](https://github.com/bluelovers/ws-yarn-workspaces/issues)
