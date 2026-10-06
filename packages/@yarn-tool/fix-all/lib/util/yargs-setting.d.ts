/**
 * @yarn-tool/fix-all/lib/util/yargs-setting
 *
 * yargs 選項設定模組
 * yargs options setup module
 *
 * 將 npmAutoFixAll 的選項註冊到 yargs，
 * 讓 CLI 與程式化 API 共用同一組選項名稱與別名
 * Registers npmAutoFixAll options into yargs so that the CLI and the
 * programmatic API share the same option names and aliases
 */
import { Argv } from 'yargs';
import { IYargsSync } from '@yarn-tool/types';
/**
 * 註冊自動修復相關的 yargs 選項
 * Register yargs options related to auto-fix
 *
 * 選項定義與 INpmAutoFixAll 介面一一對應；別名（-O / -S）是為了讓 CLI
 * 操作更簡短，同時保留完整名稱以利閱讀指令歷程
 * Option definitions map one-to-one with the INpmAutoFixAll interface;
 * aliases (-O / -S) keep the CLI short while full names remain for
 * readable command history
 *
 * @param yargs - 要擴充的 yargs 實例 / The yargs instance to extend
 * @returns 帶有選項定義的 yargs 實例（以 IYargsSync 型別回傳）/ The yargs instance with options defined (typed as IYargsSync)
 */
export declare function setupToYargs<T>(yargs: Argv<T>): IYargsSync<Argv<T & {
    overwriteHostedGitInfo: boolean;
} & {
    branch: string;
} & {
    resetStaticFiles: boolean;
} & {
    addStaticFiles: boolean;
} & {
    noStaticFiles: boolean;
}>>;
