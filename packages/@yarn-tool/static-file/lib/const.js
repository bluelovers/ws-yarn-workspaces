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
    /**
     * 忽略檔案
     * Ignore files
     */
    ['.npmignore', 'file/npmignore'],
    ['.gitignore', 'file/gitignore'],
    ['.eslintignore', 'file/eslintignore'],
    /**
     * TypeScript 配置
     * TypeScript configuration
     */
    ['tsconfig.json', 'file/tsconfig.json.tpl'],
    ['tsconfig.json.tpl', 'file/tsconfig.json.tpl'],
    ['test/tsconfig.json.tpl', 'file/test/tsconfig.json.tpl', 'test/tsconfig.json'],
    ['tsconfig.esm.json.tpl', 'file/tsconfig.esm.json.tpl', 'tsconfig.esm.json'],
    ['tsconfig.tsdx.json.tpl', 'file/tsconfig.tsdx.json.tpl', 'tsconfig.tsdx.json'],
    /**
     * ESLint 配置
     * ESLint configuration
     */
    ['.eslintrc.json.tpl', 'file/eslintrc.json.tpl', '.eslintrc.json'],
    /**
     * 文件
     * Documentation
     */
    ['README.md', 'file/README.md'],
    /**
     * 測試配置
     * Test configuration
     */
    ['.mocharc.yml.tpl', 'file/mocharc.yml'],
    ['jest.config.js', 'file/jest.config.auto.js'],
    /**
     * Now/Zeit 部署配置
     * Now/Zeit deployment
     */
    ['.nowignore', 'file/nowignore'],
    ['now.json.tpl', 'file/now.json.tpl', 'now.json'],
    /**
     * TSDX 配置
     * TSDX configuration
     */
    ['tsdx.config.js.tpl', 'file/tsdx.config.js', 'tsdx.config.js'],
    /**
     * 測試
     * test
     *
     * 以展開運算式一次產生 test/ 底下的固定樣板條目
     * Expands into template entries under test/ in one go
     */
    ...([
        'temp.ts',
        '__root.ts',
        '__root-core.cjs',
        '__root-core.mjs',
        '__root-core.d.cts',
        '__root-core.d.mts',
        '__root-core.d.ts',
        /**
         * 測試固定檔案
         * Test fixtures
         */
        'fixtures/.gitkeep',
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
    /**
     * Monorepo 配置
     * Monorepo configuration
     */
    ['lerna.json.tpl', 'file/lerna.json.tpl', 'lerna.json'],
    ['pnpm-workspace.yaml.tpl', 'file/pnpm-workspace.yaml'],
    /**
     * GitHub Actions 工作流程
     * GitHub Actions workflows
     */
    ['.github/workflows/build-pnpm.yml', 'file/github/workflows/build-pnpm.yml'],
    ['.github/workflows/build-yarn.yml', 'file/github/workflows/build-yarn.yml'],
    /**
     * 額外的 GitHub 配置
     * Additional GitHub configuration
     */
    ...([
        'dependabot.yml',
        'commit-convention.md',
        // ---
        // 'workflows/codeql-analysis.yml',
        // 'workflows/cmd-rebase.yml',
        // 'workflows/coverage.yml',
        // 'workflows/action-yarnlock-dedupe.yml',
        // 'workflows/yarn-lock-changes.yml',
        // ---
    ].map(file => [`.github/${file}`, `file/github/${file}`])),
    /**
     * Node 版本檔案
     * Node version files
     */
    ['.node-version.tpl', 'file/nvmrc'],
    ['.nvmrc.tpl', 'file/nvmrc'],
    /**
     * 根目錄 TypeScript 配置
     * Root TypeScript configuration
     *
     * 注意：此處目標為 .eslintrc.json，屬於根目錄專用的 ESLint 設定
     * Note: the target here is .eslintrc.json, the ESLint config used only at the root
     */
    ['.eslintrc.json', 'file/eslintrc.json.tpl', '.eslintrc.json'],
    //['changelog-option.js', 'file/changelog-option.js', 'changelog-option.js.tpl'],
    /**
     * 套件管理器配置
     * Package manager configuration
     */
    ['.yarnrc.yml.tpl', 'file/root/yarnrc.yml', '.yarnrc.yml'],
    ['.npmrc.tpl', 'file/npmrc', '.npmrc'],
    ['.env.tpl', 'file/env'],
    /**
     * Jest 配置
     * Jest configuration
     *
     * 僅放置 .tpl 樣板，正式設定檔交由工作區層級建立
     * Only the .tpl template is shipped here; the real config is created by the workspace layer
     */
    // ['jest.config.js', 'file/jest.config.js'],
    // ['jest.config.js.tpl', 'file/jest.config.js'],
    ['jest.config.auto.js.tpl', 'file/jest.config.auto.js'],
    /**
     * 編輯器配置
     * Editor configuration
     */
    ['.editorconfig.tpl', 'file/tpl.editorconfig'],
    ['.editorconfig', 'file/tpl.editorconfig'],
    /**
     * 全域型別宣告
     * Global type declarations
     */
    ['global.tsdx.d.ts', 'file/root/global.tsdx.d.ts'],
    /**
     * Browserslist 配置
     * Browserslist configuration
     */
    ['.browserslistrc', 'file/ws-root/browserslistrc'],
    /**
     * TSC 多配置
     * TSC multi configuration
     */
    // ['tsc-multi.json.tpl', 'file/tsc-multi.json.tpl', 'tsc-multi.json'],
    /**
     * NYC 覆蓋率配置
     * NYC coverage configuration
     */
    // ['.nycrc.tpl', 'file/nycrc', '.nycrc'],
];
/**
 * Default static files for workspace root only / 僅工作區根目錄的預設靜態檔案
 *
 * Contains files specific to workspace root management.
 * 包含特定於工作區根目錄管理的檔案。
 */
const _defaultCopyStaticFilesWsRootOnly = [
    /**
     * Lerna 配置
     * Lerna configuration
     */
    ['lerna.json.tpl', 'file/lerna.json.tpl'],
    /**
     * pnpm 工作區配置
     * pnpm workspace configuration
     */
    ['pnpm-workspace.yaml', 'file/pnpm-workspace.yaml'],
    /**
     * TSC 多配置
     * TSC multi configuration
     */
    // ['tsc-multi.json.tpl', 'file/tsc-multi.json.tpl', 'tsc-multi.json'],
    /**
     * 工作區根目錄檔案
     * Workspace root file
     */
    ['__root_ws.ts', 'file/ws-root/__root_ws.ts'],
    /**
     * Jest 配置
     * Jest configuration
     *
     * 工作區根目錄同時提供正式設定與樣板兩種形式
     * The workspace root ships both the real config and the template form
     */
    ['jest.config.js', 'file/ws-root/jest.config.js'],
    ['jest-preset.js', 'file/ws-root/jest-preset.js'],
    ['jest.config.js.tpl', 'file/ws-root/jest.config.js'],
    /**
     * 執行配置
     * Run configurations
     */
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