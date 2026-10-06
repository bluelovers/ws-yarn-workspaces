/**
 * ncu-ws 專用的 yargs 選項設定 (yargs options for ncu-ws)
 * 說明：在 `@yarn-tool/ncu` 的通用選項之上，追加 workspace 場景才會用到的旗標，
 * 因此 `IArgvRuntime` 會同時帶有兩組選項。
 * Why: it appends workspace-only flags on top of the generic `@yarn-tool/ncu`
 * options, which is why `IArgvRuntime` carries both sets.
 *
 * @module argv
 */
import { Argv } from 'yargs';
/**
 * 設定 ncu-ws 的命令列選項 (Configure ncu-ws CLI options)
 * 相較於 `setupNcuToYargs` 多出：
 * - `resolutions` / `-R`：只處理 resolutions，不更新依賴
 * - `no-safe`：允許跳離目前版本範圍
 * - `AA`：一次啟用「workspace 模式 + 包含根套件」
 * 另附三個常見用法的 `.example()`，方便 `--help` 顯示。
 * Compared to `setupNcuToYargs` it adds:
 * - `resolutions` / `-R`: handle resolutions only, without touching dependencies
 * - `noSafe`: allow leaving the current version range
 * - `AA`: enable both workspace mode and root inclusion in one flag
 * Three common usages are also registered via `.example()` for `--help`.
 *
 * @param yargs - 需帶有 `cwd` 的 yargs 實例 / A yargs instance that carries `cwd`
 */
export declare function setupNcuToYargs2<T extends any>(yargs: Argv<T & {
    cwd: string;
}>): Argv<T & {
    cwd: string;
} & {
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
} & {
    resolutions: boolean;
} & {
    "no-safe": boolean;
} & {
    AA: boolean;
}>;
