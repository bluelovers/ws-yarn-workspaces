"use strict";
/**
 * CLI options setup for npm-check-updates integration with yargs.
 * 將 npm-check-updates 的命令列選項整合到 yargs 命令列解析器。
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
        .option('dep', {
        desc: `check only a specific section(s) of dependencies: prod|dev|peer|optional|bundle (comma-delimited)`,
        string: true,
    })
        .option('minimal', {
        alias: ['m'],
        desc: `do not upgrade newer versions that are already satisfied by the version range according to semver`,
        boolean: true,
    })
        .option('newest', {
        alias: ['n'],
        desc: `find the newest versions available instead of the latest stable versions`,
        boolean: true,
    })
        .option('packageManager', {
        alias: ['p'],
        desc: `npm (default) or bower`,
        default: 'npm',
        string: true,
    })
        .option('registry', {
        alias: ['r'],
        desc: `specify third-party npm registry`,
        string: true,
    })
        .option('silent', {
        alias: ['s'],
        desc: `don't output anything (--loglevel silent)`,
        boolean: true,
    })
        .option('greatest', {
        alias: ['g'],
        desc: `find the highest versions available instead of the latest stable versions`,
        boolean: true,
    })
        .option('upgrade', {
        alias: ['u'],
        desc: `overwrite package file`,
        boolean: true,
    })
        .option('semverLevel', {
        desc: `find the highest version within "major" or "minor"`,
        string: true,
    })
        .option('removeRange', {
        desc: `remove version ranges from the final package version`,
        boolean: true,
    })
        .option('dedupe', {
        desc: `remove upgrade module from resolutions`,
        boolean: true,
        default: true,
    })
        .option('filter', {
        desc: `Include only package names matching the given string, wildcard, glob, comma-or-space-delimited list, /regex/, or predicate function.`,
        array: true,
    });
}
exports.default = setupNcuToYargs;
//# sourceMappingURL=cli.js.map