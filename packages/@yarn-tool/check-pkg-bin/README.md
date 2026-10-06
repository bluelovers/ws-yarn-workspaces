# @yarn-tool/check-pkg-bin

檢查套件的 `bin` 檔案是否帶有 shebang（check pkg bin has shebang）。可用於單一套件，也可一次檢查整個 Yarn workspace（Workspace）中的所有套件。

## Features

- 檢查 `package.json` 中 `bin` 所指向的檔案是否含 shebang（`#!/usr/bin/env node`）
- 支援以 CLI 表格輸出檢查結果，並以 exit code 回報失敗
- 提供 `--workspaces` 模式，批次檢查 workspace 內所有套件
- 提供程式化 API：`checkPkgDir`、`checkPkgJson`、`checkWorkspaces`、`hasShebang`、`checkFile`

## Installation

```bash
yarn add @yarn-tool/check-pkg-bin
yarn-tool add @yarn-tool/check-pkg-bin
yt add @yarn-tool/check-pkg-bin
```

## Usage

### CLI

```bash
# 檢查當前套件
npx check-pkg-bin

# 檢查整個 workspace
npx check-pkg-bin --workspaces

# 指定工作目錄
npx check-pkg-bin --cwd ./packages/foo
```

輸出為表格，`validate` 欄位為 `true` / `false` / `none`（`none` 表示該套件沒有 `bin` 欄位）；若有任何套件檢查失敗，程序將以狀態碼 `1` 結束。

### 程式化使用

```ts
import checkPkgDir from '@yarn-tool/check-pkg-bin';
// 或
import { checkWorkspaces, checkPkgJson, hasShebang } from '@yarn-tool/check-pkg-bin';

const data = checkPkgDir(process.cwd());

console.log(data.valid); // 所有 bin 檔案是否皆含 shebang
```

## API Documentation

### `checkPkgDir(pkgDir?: string): CheckPkgDirResult`

預設以 `process.cwd()` 為根目錄，讀取該目錄的 `package.json` 並檢查所有 `bin` 檔案。回傳：

- `name`：套件名稱
- `pkg`：解析後的 `package.json` 內容
- `pkgDir`：套件根目錄
- `result`：每個 bin 的檢查明細（`file`、`filename`、`hasShebang`）
- `valid`：所有 bin 是否皆通過檢查

### `checkPkgJson(pkg: IPackageJson, cwd: string): Array<{ file, filename, hasShebang }>`

對傳入的 `package.json` 物件執行 bin 檢查，不自行讀檔。

### `checkWorkspaces(cwd?: string): CheckPkgDirResult[]`

列出 workspace 內所有套件並逐一執行 `checkPkgDir`。

### `hasShebang(buf: Buffer | string): boolean`

判斷任意內容字串／緩衝區是否含 shebang。

### `checkFile(file: string): boolean | undefined`

檢查單一檔案是否存在且含 shebang；檔案不存在時回傳 `undefined`。

## Configuration

本套件無須額外設定，所有欄位皆來自各套件的 `package.json`：

- `bin`：欲檢查的可執行檔路徑（相對於套件根目錄）
- 工作目錄可透過 CLI 的 `--cwd` 或 API 的 `pkgDir` / `cwd` 參數指定
