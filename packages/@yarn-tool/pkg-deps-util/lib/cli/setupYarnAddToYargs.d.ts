/**
 * 註冊 `yarn add` 相關的 yargs 選項 (Register `yarn add` options in yargs)
 *
 * 把 `yarn add` 支援的參數集中註冊，讓各 CLI 指令不必重複宣告同一組選項，
 * 也能確保 `flagsYarnAdd` 與實際解析到的參數名稱一致。
 *
 * Centralises the `yarn add` arguments so each CLI command does not redeclare
 * them, and so `flagsYarnAdd` always matches the names actually parsed.
 */
import { Argv } from 'yargs';
/**
 * 註冊 `yarn add` 選項 (Register `yarn add` options)
 *
 * Register the `yarn add` options on the given yargs instance.
 *
 * @param yargs yargs 實例 (The yargs instance)
 * @param opts 額外行為開關，目前支援 `allowEmptyName`
 *             Extra behaviour switches, currently `allowEmptyName`
 *
 * @returns 同一個 yargs 實例，可繼續鏈式註冊其他選項
 *
 * The same yargs instance, so further options can be chained on.
 */
export declare function setupYarnAddToYargs<T extends any>(yargs: Argv<T>, opts?: {
    allowEmptyName?: boolean;
}): Argv<T & {
    dev: boolean;
} & {
    peer: boolean;
} & {
    optional: boolean;
} & {
    exact: boolean;
} & {
    tilde: boolean;
} & {
    audit: boolean;
} & {
    dedupe: boolean;
} & {
    "ignore-workspace-root-check": boolean;
} & {
    types: boolean;
}>;
