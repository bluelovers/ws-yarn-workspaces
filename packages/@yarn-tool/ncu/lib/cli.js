"use strict";
/**
 * CLI options setup for npm-check-updates integration with yargs.
 * 將 npm-check-updates 的命令列選項整合到 yargs 命令列解析器。
 *
 * 此模組提供完整的 yargs 選項配置，包含：
 * - 版本升級策略選項（latest, newest, greatest, semverLevel）
 * - 依賴區段過濾（dep）
 * - 版本範圍處理（minimal, removeRange）
 * - Workspace 相關選項（dedupe, filter）
 *
 * This module provides complete yargs option configuration including:
 * - Version upgrade strategy options (latest, newest, greatest, semverLevel)
 * - Dependency section filtering (dep)
 * - Version range handling (minimal, removeRange)
 * - Workspace related options (dedupe, filter)
 *
 * @packageDocumentation
 *
 * @example
 * ```ts
 * import { setupNcuToYargs } from '@yarn-tool/ncu/lib/cli';
 * import yargs from 'yargs';
 *
 * const parser = setupNcuToYargs(yargs);
 * const argv = parser.argv;
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupNcuToYargs = setupNcuToYargs;
/**
 * Setup npm-check-updates options to yargs parser.
 * 將 npm-check-updates 的選項設定到 yargs 解析器。
 *
 * @param yargs - The yargs instance to configure / 要配置的 yargs 實例
 * @returns Configured yargs instance with ncu options / 配置了 ncu 選項的 yargs 實例
 *
 * @see https://github.com/raineorshine/npm-check-updates/blob/main/src/cli-options.ts
 */
function setupNcuToYargs(yargs) {
    return yargs
        /**
         * 依賴區段選項：指定要檢查的依賴類型
         * Dependency section option: specify which dependency types to check
         */
        .option('dep', {
        desc: `check only a specific section(s) of dependencies: prod|dev|peer|optional|bundle (comma-delimited)`,
        string: true,
    })
        /**
         * 最小升級選項：不升級已符合 semver 範圍的版本
         * Minimal upgrade option: don't upgrade versions already satisfied by semver range
         */
        .option('minimal', {
        alias: ['m'],
        desc: `do not upgrade newer versions that are already satisfied by the version range according to semver`,
        boolean: true,
    })
        /**
         * 最新版本選項：尋找最新版本而非最新穩定版
         * Newest version option: find newest versions instead of latest stable
         */
        .option('newest', {
        alias: ['n'],
        desc: `find the newest versions available instead of the latest stable versions`,
        boolean: true,
    })
        /**
         * 套件管理器選項：指定 npm 或 bower
         * Package manager option: specify npm or bower
         */
        .option('packageManager', {
        alias: ['p'],
        desc: `npm (default) or bower`,
        default: 'npm',
        string: true,
    })
        /**
         * Registry 選項：指定第三方 npm registry
         * Registry option: specify third-party npm registry
         */
        .option('registry', {
        alias: ['r'],
        desc: `specify third-party npm registry`,
        string: true,
    })
        /**
         * 靜默選項：不輸出任何內容
         * Silent option: don't output anything
         */
        .option('silent', {
        alias: ['s'],
        desc: `don't output anything (--loglevel silent)`,
        boolean: true,
    })
        /**
         * 最高版本選項：尋找可用的最高版本
         * Greatest version option: find highest versions available
         */
        .option('greatest', {
        alias: ['g'],
        desc: `find the highest versions available instead of the latest stable versions`,
        boolean: true,
    })
        /**
         * 升級選項：覆寫 package.json 檔案
         * Upgrade option: overwrite package.json file
         */
        .option('upgrade', {
        alias: ['u'],
        desc: `overwrite package file`,
        boolean: true,
    })
        /**
         * Semver 等級選項：在 major 或 minor 範圍內尋找最高版本
         * Semver level option: find highest version within major or minor
         */
        .option('semverLevel', {
        desc: `find the highest version within "major" or "minor"`,
        string: true,
    })
        /**
         * 移除範圍選項：從最終版本移除版本範圍前綴
         * Remove range option: remove version range prefix from final version
         */
        .option('removeRange', {
        desc: `remove version ranges from the final package version`,
        boolean: true,
    })
        /**
         * 去重選項：從 resolutions 移除已升級的模組
         * Dedupe option: remove upgraded modules from resolutions
         */
        .option('dedupe', {
        desc: `remove upgrade module from resolutions`,
        boolean: true,
        default: true,
    })
        /**
         * 過濾選項：只處理符合模式的套件名稱
         * Filter option: only process package names matching the pattern
         */
        .option('filter', {
        desc: `Include only package names matching the given string, wildcard, glob, comma-or-space-delimited list, /regex/, or predicate function.`,
        array: true,
    });
}
/**
 * 預設導出：設定 ncu 選項到 yargs 的函數
 * Default export: function to setup ncu options to yargs
 */
exports.default = setupNcuToYargs;
//# sourceMappingURL=cli.js.map