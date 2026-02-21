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
export default setupNcuToYargs;
