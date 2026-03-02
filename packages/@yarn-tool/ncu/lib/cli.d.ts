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
import { Argv } from 'yargs';
/**
 * Setup npm-check-updates options to yargs parser.
 * 將 npm-check-updates 的選項設定到 yargs 解析器。
 *
 * @param yargs - The yargs instance to configure / 要配置的 yargs 實例
 * @returns Configured yargs instance with ncu options / 配置了 ncu 選項的 yargs 實例
 *
 * @see https://github.com/raineorshine/npm-check-updates/blob/main/src/cli-options.ts
 */
export declare function setupNcuToYargs<T extends any>(yargs: Argv<T>): Argv<T & {
    dep: string;
} & {
    minimal: boolean;
} & {
    newest: boolean;
} & {
    packageManager: string;
} & {
    registry: string;
} & {
    silent: boolean;
} & {
    greatest: boolean;
} & {
    upgrade: boolean;
} & {
    semverLevel: string;
} & {
    removeRange: boolean;
} & {
    dedupe: boolean;
} & {
    filter: (string | number)[];
}>;
/**
 * 預設導出：設定 ncu 選項到 yargs 的函數
 * Default export: function to setup ncu options to yargs
 */
export default setupNcuToYargs;
