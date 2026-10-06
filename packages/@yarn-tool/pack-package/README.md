# @yarn-tool/pack-package

打包套件並印出打包後 tarball (Packed Tar) 的資訊 (pack package, and print information about packed tar)。以 `npm-packlist` 決定收錄檔案，再由 `tar` 產出可重現 (Reproducible) 的壓縮檔。

## Features

- 依 npm 打包規則計算收錄清單（`npm-packlist` + `@npmcli/arborist`）
- 產出的 tarball 固定 `package/` 前綴、gzip 壓縮，並使用固定 mtime 以利重現建置 (Reproducible Build)
- 打包完成後可取得 tarball 詳細資訊（大小、shasum、integrity、檔案清單）
- 提供一鍵印出格式化打包報表的 `log()`，以及細部 API：`packTargetPackage`、`getPackedTarballInfo`、`printPackedTarballInfo`
- 支援 scoped 套件名稱轉為 tarball 檔名（`@scope/pkg` → `scope/pkg` → `scope-pkg-1.0.0.tgz`）

## Installation

```bash
yarn add @yarn-tool/pack-package
yarn-tool add @yarn-tool/pack-package
yt add @yarn-tool/pack-package
```

## Usage

```ts
import packPackage from '@yarn-tool/pack-package';

const result = await packPackage({
	packageDir: './packages/foo',
});

// 懶載入 tarball 資訊（首次呼叫才讀取 tar 檔）
const tarball = await result.tarball();
console.log(tarball.size, tarball.shasum, tarball.entryCount);

// 印出打包報表
await result.log();
```

手動指定 tarball 輸出路徑與版本前綴：

```ts
const result = await packPackage({
	packageDir: './packages/foo',
	packageTarball: './dist/foo.tgz',
	versionPrefix: 'v',
});
```

## API Documentation

### `packPackage(options): Promise<IPackPackageResult>`

主要入口（亦為預設匯出）。呼叫 `packTargetPackage` 完成打包後，回傳含延遲 (Lazy) 方法的凍結物件：

| 參數 | 型別 | 說明 |
|------|------|------|
| `packageDir` | `string` | **必填**，要打包的套件目錄 |
| `pkg` | `IPackageJson` | 可選；未提供時自動讀取目錄內的 `package.json` |
| `packageTarball` | `string` | 可選，tarball 輸出路徑（預設為 `<name>-<version>.tgz`） |
| `versionPrefix` | `string` | 可選，加入檔名的版本前綴（如 `v` → `foo-v1.0.0.tgz`） |

回傳物件的方法：

- `tarball(): Promise<IPackedTarballInfo>` — 讀取 tarball 詳細資訊，結果會被快取 (Cache)
- `log(): Promise<void>` — 印出格式化打包報表

### `packTargetPackage(options): Promise<...>`

實際執行打包（`lib/pack.ts`）。回傳展開後的 `options` 加上 `pkg`、`packageDir`、`packageTarball`、`files`（收錄的相對路徑清單）。

### `packlist({ path }): Promise<string[]>`

僅計算欲收錄的檔案清單，不產生 tarball。

### `getPackedTarballInfo({ pkg, packageTarball }): Promise<IPackedTarballInfo>`

讀取既有 tarball 的資訊，欄位包含 `id`、`name`、`version`、`size`、`unpackedSize`、`shasum`、`integrity`、`filename`、`files`、`entryCount`、`tarFilePath` 等（見 `IPackedTarballInfo`）。

### `printPackedTarballInfo(tarball): void`

以 `@lerna/log-packed` 印出打包報表。

### `getTarballName(pkg, versionPrefix?): string`

依套件名稱與版本產生預設 tarball 檔名；scoped 名稱中的 `/` 會以 `-` 取代。

## Configuration

本套件無須額外設定檔；所有行為皆由 `packPackage(options)` 參數控制（見上方 API 表格）。打包收錄規則遵循各套件 `package.json` 的 `files` 欄位與 `.npmignore`（由 `npm-packlist` 解析）。
