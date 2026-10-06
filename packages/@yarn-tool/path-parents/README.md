# @yarn-tool/path-parents

列出從當前目錄一路向上至工作區根目錄的所有父層路徑。  
List all parent paths from the current directory up to the workspace root.

## 功能特色 / Features

- 🧭 **工作區感知 (Workspace Aware)** - 使用 `@yarn-tool/find-root` 偵測 Yarn/NPM/Pnpm 工作區根目錄，並在抵達該目錄時停止
- 🔄 **產生器支援 (Generator Support)** - 提供 `pathUpToWorkspacesGenerator` 逐一遍歷，避免一次性建立整個陣列
- 📄 **含當前目錄 (Include Current Directory)** - 預設結果包含 `cwd` 本身，可透過選項排除
- 🧩 **選項繼承 (Options Inheritance)** - `IOptions` 繼承自 `path-parents`，保留其原有選項

## 安裝 / Install

```bash
yarn add @yarn-tool/path-parents
yarn-tool add @yarn-tool/path-parents
yt add @yarn-tool/path-parents
```

## 使用方法 / Usage

```ts
import pathUpToWorkspaces, { pathUpToWorkspacesGenerator } from '@yarn-tool/path-parents';

// 取得路徑陣列（包含當前目錄） / Get path list (including current directory)
const list = pathUpToWorkspaces(process.cwd());
// => ["/repo/packages/a", "/repo/packages", "/repo", ...]

// 使用產生器逐一遍歷 / Iterate one by one using generator
for (const p of pathUpToWorkspacesGenerator(process.cwd())) {
  console.log(p);
}
```

## API 文件 / API Documentation

- `pathUpToWorkspaces(cwd?: string, options?: IOptions): string[]`
  - 回傳從 `cwd` 開始往上直到偵測到的工作區根目錄之所有路徑（含或不含 `cwd` 取決於選項）。
  - Returns all parent paths from `cwd` up to the detected workspace root (including or excluding `cwd` based on options).

- `pathUpToWorkspacesGenerator(cwd?: string, options?: IOptions): Generator<string>`
  - 以產生器逐一回傳路徑，直到抵達工作區根目錄為止。
  - Yields paths one by one until the workspace root is reached.

## 設定 / Configuration

### IOptions

- `ignoreCurrentDirectory?: boolean`
  - 預設為 `false`。若為 `true`，結果將不包含 `cwd` 本身。
  - Defaults to `false`. If `true`, the result will exclude the `cwd` itself.

`IOptions` 同時繼承 [`path-parents`](https://www.npmjs.com/package/path-parents) 的選項，可一併傳入。  
`IOptions` also extends the options of [`path-parents`](https://www.npmjs.com/package/path-parents), which can be passed through as well.

## 備註 / Notes

- 使用 `@yarn-tool/find-root` 偵測是否位於 Yarn/NPM/Pnpm 工作區，並在達到該根目錄時停止。
- Uses `@yarn-tool/find-root` to detect the Yarn/NPM/Pnpm workspace root and stops at that directory.

