/**
 * Yargs CLI 設定模組
 * Yargs CLI Configuration Module
 *
 * 設定 changelog 命令列工具的參數選項
 * Configures CLI argument options for changelog tool
 *
 * Created by user on 2020/6/15.
 */
import { Argv } from 'yargs';
import { IYargsSync } from '@yarn-tool/types';
/**
 * 設定 yargs 參數選項
 * Setup yargs argument options
 *
 * @param {Argv<T>} yargs - Yargs 實例 / Yargs instance
 * @returns {IYargsSync<typeof _return>} 設定後的 Yargs 實例 / Configured yargs instance
 */
export declare function setupToYargs<T>(yargs: Argv<T>): IYargsSync<Argv<T & {
    preset: string;
} & {
    "lerna-package": boolean;
} & {
    type: string;
} & {
    "tag-prefix": string;
} & {
    cwd: string;
}>>;
/**
 * 預設匯出設定函數
 * Default export setup function
 */
export default setupToYargs;
