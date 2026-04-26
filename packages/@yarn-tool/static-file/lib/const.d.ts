/**
 * Static file mapping constants / 靜態檔案映射常量
 *
 * This module defines the default static file mappings for different project scenarios.
 * 此模組定義了不同專案情境的預設靜態檔案映射。
 *
 * @module const
 */
import { _Key, IStaticFilesMapArray } from './types';
/**
 * Default static files for package-level copying / 套件層級複製的預設靜態檔案
 *
 * Contains common configuration files that should be copied to each package.
 * 包含應複製到每個套件的常用配置檔案。
 *
 * Each entry follows the format: [targetFile, staticFile, detectFile?]
 * 每個條目遵循格式：[目標檔案, 靜態檔案, 檢測檔案?]
 *
 * - targetFile: The destination file path / 目標檔案路徑
 * - staticFile: The source static file path (relative to static root) / 來源靜態檔案路徑（相對於靜態根目錄）
 * - detectFile: Optional file to check for existence before copying / 可選的檢測檔案，複製前檢查是否存在
 */
declare const _defaultCopyStaticFiles: [[".npmignore", "file/npmignore"], [".gitignore", "file/gitignore"], [".eslintignore", "file/eslintignore"], ["tsconfig.json.tpl", "file/tsconfig.json.tpl", "tsconfig.json"], ["test/tsconfig.json.tpl", "file/test/tsconfig.json.tpl", "test/tsconfig.json"], ["test/tsconfig.json", "file/test/tsconfig.json.tpl"], ["tsconfig.esm.json.tpl", "file/tsconfig.esm.json.tpl", "tsconfig.esm.json"], ["tsconfig.tsdx.json.tpl", "file/tsconfig.tsdx.json.tpl", "tsconfig.tsdx.json"], ["tsconfig.json", "file/tsconfig.json.tpl"], [".eslintrc.json.tpl", "file/eslintrc.json.tpl", ".eslintrc.json"], ["README.md", "file/README.md"], [".mocharc.yml.tpl", "file/mocharc.yml"], ["jest.config.js", "file/jest.config.auto.js"], [".nowignore", "file/nowignore"], ["now.json.tpl", "file/now.json.tpl", "now.json"], ["tsdx.config.js.tpl", "file/tsdx.config.js", "tsdx.config.js"], ["test/__root.ts", "file/test/__root.ts"], ["test/fixtures/.gitkeep", "file/test/fixtures/.gitkeep"], ...["test/temp.ts" | "test/__root-core.cjs" | "test/__root-core.mjs" | "test/__root-core.d.cts" | "test/__root-core.d.mts" | "test/__root-core.d.ts", "file/test/temp.ts" | "file/test/__root-core.cjs" | "file/test/__root-core.mjs" | "file/test/__root-core.d.cts" | "file/test/__root-core.d.mts" | "file/test/__root-core.d.ts"][]];
/**
 * Default static files for root-level only copying / 僅根目錄層級複製的預設靜態檔案
 *
 * Contains configuration files that should only be copied to the workspace root.
 * 包含僅應複製到工作區根目錄的配置檔案。
 *
 * These files are typically shared across all packages in a monorepo.
 * 這些檔案通常在 monorepo 中的所有套件之間共享。
 */
declare const _defaultCopyStaticFilesRootOnly: [["lerna.json.tpl", "file/lerna.json.tpl", "lerna.json"], ["pnpm-workspace.yaml.tpl", "file/pnpm-workspace.yaml", "pnpm-workspace.yaml"], [".github/workflows/coverage.yml", "file/github/workflows/coverage.yml"], [".github/workflows/action-yarnlock-dedupe.yml", "file/github/workflows/action-yarnlock-dedupe.yml"], [".github/workflows/build.yml", "file/github/workflows/build.yml"], [".github/workflows/yarn-lock-changes.yml", "file/github/workflows/yarn-lock-changes.yml"], [".github/commit-convention.md", "file/github/commit-convention.md"], ...[".github/dependabot.yml" | ".github/workflows/codeql-analysis.yml" | ".github/workflows/cmd-rebase.yml", "file/github/dependabot.yml" | "file/github/workflows/codeql-analysis.yml" | "file/github/workflows/cmd-rebase.yml"][], [".node-version", "file/nvmrc"], [".nvmrc", "file/nvmrc"], [".eslintrc.json", "file/eslintrc.json.tpl", ".eslintrc.json"], [".yarnrc.yml.tpl", "file/root/yarnrc.yml", ".yarnrc.yml"], [".npmrc.tpl", "file/npmrc", ".npmrc"], ["jest.config.js", "file/jest.config.js"], ["jest.config.js.tpl", "file/jest.config.js"], ["jest.config.auto.js.tpl", "file/jest.config.auto.js"], [".editorconfig.tpl", "file/tpl.editorconfig"], [".editorconfig", "file/tpl.editorconfig"], ["global.tsdx.d.ts", "file/root/global.tsdx.d.ts"], [".browserslistrc", "file/ws-root/browserslistrc"], ["tsc-multi.json.tpl", "file/tsc-multi.json.tpl", "tsc-multi.json"], [".nycrc.tpl", "file/nycrc"]];
/**
 * Default static files for workspace root only / 僅工作區根目錄的預設靜態檔案
 *
 * Contains files specific to workspace root management.
 * 包含特定於工作區根目錄管理的檔案。
 */
declare const _defaultCopyStaticFilesWsRootOnly: [["lerna.json.tpl", "file/lerna.json.tpl"], ["pnpm-workspace.yaml", "file/pnpm-workspace.yaml"], ["tsc-multi.json.tpl", "file/tsc-multi.json.tpl", "tsc-multi.json"], ["__root_ws.ts", "file/ws-root/__root_ws.ts"], ["jest.config.js", "file/ws-root/jest.config.js"], ["jest-preset.js", "file/ws-root/jest-preset.js"], [".run/lerna_publish_yes.run.xml", "file/ws-root/.run/lerna_publish_yes.run.xml"]];
/**
 * Frozen default static files for package-level / 凍結的套件層級預設靜態檔案
 *
 * Use this for copying static files to individual packages.
 * 用於將靜態檔案複製到各個套件。
 */
export declare const defaultCopyStaticFiles: IStaticFilesMapArray<_Key<typeof _defaultCopyStaticFiles>>;
/**
 * Frozen default static files for root-level only / 凍結的僅根目錄層級預設靜態檔案
 *
 * Use this for copying static files to the workspace root only.
 * 用於將靜態檔案僅複製到工作區根目錄。
 */
export declare const defaultCopyStaticFilesRootOnly: IStaticFilesMapArray<_Key<typeof _defaultCopyStaticFilesRootOnly>>;
/**
 * Frozen default static files for workspace root / 凍結的工作區根目錄預設靜態檔案
 *
 * Use this for workspace root specific file management.
 * 用於工作區根目錄特定的檔案管理。
 */
export declare const defaultCopyStaticFilesWsRootOnly: IStaticFilesMapArray<_Key<typeof _defaultCopyStaticFilesWsRootOnly>>;
export {};
