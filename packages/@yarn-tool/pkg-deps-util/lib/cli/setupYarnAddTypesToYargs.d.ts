/**
 * 註冊 `@types/*` 自動安裝相關的 yargs 選項 (Register options for auto-installing `@types/*`)
 *
 * 在一般 `yarn add` 選項之上追加批量處理的開關，
 * 讓 CLI 可依 `--auto` / `--all` 決定要掃描哪些依賴。
 *
 * Extends the regular `yarn add` options with bulk-processing switches so the
 * CLI can decide which dependencies to scan via `--auto` / `--all`.
 */
import { Argv } from 'yargs';
/**
 * 註冊 types 相關選項 (Register the types-related options)
 *
 * Register the `@types/*` install options on the given yargs instance.
 *
 * @param yargs yargs 實例 (The yargs instance)
 *
 * @returns 同一個 yargs 實例，已包含 `yarn add` 選項與 types 選項
 *
 * The same yargs instance, already containing both the `yarn add` and the
 * types options.
 */
export declare function setupYarnAddTypesToYargs<T extends any>(yargs: Argv<T>): Argv<T & {
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
} & {
    auto: boolean;
} & {
    all: boolean;
} & {
    AA: boolean;
}>;
