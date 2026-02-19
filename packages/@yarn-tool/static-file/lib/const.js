"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultCopyStaticFilesWsRootOnly = exports.defaultCopyStaticFilesRootOnly = exports.defaultCopyStaticFiles = void 0;
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
const _defaultCopyStaticFiles = [
    // Ignore files / 忽略檔案
    ['.npmignore', 'file/npmignore'],
    ['.gitignore', 'file/gitignore'],
    ['.eslintignore', 'file/eslintignore'],
    // TypeScript configuration / TypeScript 配置
    ['tsconfig.json.tpl', 'file/tsconfig.json.tpl', 'tsconfig.json'],
    ['test/tsconfig.json.tpl', 'file/test/tsconfig.json.tpl', 'test/tsconfig.json'],
    ['tsconfig.esm.json.tpl', 'file/tsconfig.esm.json.tpl', 'tsconfig.esm.json'],
    ['tsconfig.tsdx.json.tpl', 'file/tsconfig.tsdx.json.tpl', 'tsconfig.tsdx.json'],
    // ESLint configuration / ESLint 配置
    ['.eslintrc.json.tpl', 'file/eslintrc.json.tpl', '.eslintrc.json'],
    // Documentation / 文檔
    ['README.md', 'file/README.md'],
    // Test configuration / 測試配置
    ['.mocharc.yml.tpl', 'file/mocharc.yml'],
    //['jest.config.js', 'file/jest.config.js'],
    ['jest.config.js', 'file/jest.config.auto.js'],
    // Now/Zeit deployment / Now/Zeit 部署配置
    ['.nowignore', 'file/nowignore'],
    ['now.json.tpl', 'file/now.json.tpl', 'now.json'],
    // TSDX configuration / TSDX 配置
    ['tsdx.config.js.tpl', 'file/tsdx.config.js', 'tsdx.config.js'],
    // Test fixtures / 測試固定檔案
    ['test/__root.ts', 'file/test/__root.ts'],
    ['test/fixtures/.gitkeep', 'file/test/fixtures/.gitkeep'],
    // Temporary test files / 臨時測試檔案
    ...([
        'temp.ts',
    ].map(file => [
        `test/${file}`,
        `file/test/${file}`
    ])),
    //['changelog-option.js.tpl', 'file/changelog-option.js', 'changelog-option.js'],
];
/**
 * Default static files for root-level only copying / 僅根目錄層級複製的預設靜態檔案
 *
 * Contains configuration files that should only be copied to the workspace root.
 * 包含僅應複製到工作區根目錄的配置檔案。
 *
 * These files are typically shared across all packages in a monorepo.
 * 這些檔案通常在 monorepo 中的所有套件之間共享。
 */
const _defaultCopyStaticFilesRootOnly = [
    // Monorepo configuration / Monorepo 配置
    ['lerna.json.tpl', 'file/lerna.json.tpl', 'lerna.json'],
    ['pnpm-workspace.yaml.tpl', 'file/pnpm-workspace.yaml', 'pnpm-workspace.yaml'],
    // GitHub Actions workflows / GitHub Actions 工作流程
    ['.github/workflows/coverage.yml', 'file/github/workflows/coverage.yml'],
    ['.github/workflows/action-yarnlock-dedupe.yml', 'file/github/workflows/action-yarnlock-dedupe.yml'],
    ['.github/workflows/build.yml', 'file/github/workflows/build.yml'],
    ['.github/workflows/yarn-lock-changes.yml', 'file/github/workflows/yarn-lock-changes.yml'],
    ['.github/commit-convention.md', 'file/github/commit-convention.md'],
    // Additional GitHub configuration / 額外的 GitHub 配置
    ...([
        'dependabot.yml',
        'workflows/codeql-analysis.yml',
        'workflows/cmd-rebase.yml',
    ].map(file => [`.github/${file}`, `file/github/${file}`])),
    // Node version files / Node 版本檔案
    ['.node-version', 'file/nvmrc'],
    ['.nvmrc', 'file/nvmrc'],
    // Root TypeScript configuration / 根目錄 TypeScript 配置
    ['tsconfig.json', 'file/tsconfig.json.tpl', 'tsconfig.json'],
    ['.eslintrc.json', 'file/eslintrc.json.tpl', '.eslintrc.json'],
    //['changelog-option.js', 'file/changelog-option.js', 'changelog-option.js.tpl'],
    // Package manager configuration / 套件管理器配置
    ['.yarnrc.yml.tpl', 'file/root/yarnrc.yml', '.yarnrc.yml'],
    ['.npmrc.tpl', 'file/npmrc', '.npmrc'],
    // Jest configuration / Jest 配置
    ['jest.config.js', 'file/jest.config.js'],
    ['jest.config.js.tpl', 'file/jest.config.js'],
    ['jest.config.auto.js.tpl', 'file/jest.config.auto.js'],
    // Editor configuration / 編輯器配置
    ['.editorconfig.tpl', 'file/tpl.editorconfig'],
    ['.editorconfig', 'file/tpl.editorconfig'],
    // Global type declarations / 全局類型聲明
    ['global.tsdx.d.ts', 'file/root/global.tsdx.d.ts'],
    // Browserslist configuration / Browserslist 配置
    ['.browserslistrc', 'file/ws-root/browserslistrc'],
    // TSC multi configuration / TSC 多配置
    ['tsc-multi.json.tpl', 'file/tsc-multi.json.tpl', 'tsc-multi.json'],
    // NYC coverage configuration / NYC 覆蓋率配置
    ['.nycrc.tpl', 'file/nycrc'],
];
/**
 * Default static files for workspace root only / 僅工作區根目錄的預設靜態檔案
 *
 * Contains files specific to workspace root management.
 * 包含特定於工作區根目錄管理的檔案。
 */
const _defaultCopyStaticFilesWsRootOnly = [
    // Lerna configuration / Lerna 配置
    ['lerna.json.tpl', 'file/lerna.json.tpl'],
    // pnpm workspace configuration / pnpm 工作區配置
    ['pnpm-workspace.yaml', 'file/pnpm-workspace.yaml'],
    // TypeScript configuration / TypeScript 配置
    ['tsconfig.json', 'file/tsconfig.json.tpl'],
    // TSC multi configuration / TSC 多配置
    ['tsc-multi.json.tpl', 'file/tsc-multi.json.tpl', 'tsc-multi.json'],
    // Workspace root file / 工作區根目錄檔案
    ['__root_ws.ts', 'file/ws-root/__root_ws.ts'],
    // Jest configuration / Jest 配置
    ['jest.config.js', 'file/ws-root/jest.config.js'],
    ['jest-preset.js', 'file/ws-root/jest-preset.js'],
    // Run configurations / 執行配置
    ['.run/lerna_publish_yes.run.xml', 'file/ws-root/.run/lerna_publish_yes.run.xml'],
];
/**
 * Frozen default static files for package-level / 凍結的套件層級預設靜態檔案
 *
 * Use this for copying static files to individual packages.
 * 用於將靜態檔案複製到各個套件。
 */
exports.defaultCopyStaticFiles = Object.freeze(_defaultCopyStaticFiles);
/**
 * Frozen default static files for root-level only / 凍結的僅根目錄層級預設靜態檔案
 *
 * Use this for copying static files to the workspace root only.
 * 用於將靜態檔案僅複製到工作區根目錄。
 */
exports.defaultCopyStaticFilesRootOnly = Object.freeze(_defaultCopyStaticFilesRootOnly);
/**
 * Frozen default static files for workspace root / 凍結的工作區根目錄預設靜態檔案
 *
 * Use this for workspace root specific file management.
 * 用於工作區根目錄特定的檔案管理。
 */
exports.defaultCopyStaticFilesWsRootOnly = Object.freeze(_defaultCopyStaticFilesWsRootOnly);
//# sourceMappingURL=const.js.map